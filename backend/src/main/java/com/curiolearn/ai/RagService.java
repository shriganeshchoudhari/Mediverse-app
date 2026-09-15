package com.curiolearn.ai;

import com.curiolearn.curriculum.Lesson;
import com.curiolearn.curriculum.ContentBlock;
import com.curiolearn.curriculum.LessonRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Stream;

@Service
public class RagService {

    private static final Logger log = LoggerFactory.getLogger(RagService.class);
    private final ExecutorService ragExecutor = Executors.newVirtualThreadPerTaskExecutor();

    private final TextbookChunkRepository textbookChunkRepository;
    private final ElasticsearchOperations elasticsearchOperations;
    private final LessonRepository lessonRepository;
    private final CurriculumVectorEmbeddingRepository vectorEmbeddingRepository;
    private final EmbeddingService embeddingService;

    private static final int RRF_K = 60;

    public RagService(@org.springframework.beans.factory.annotation.Autowired(required = false) TextbookChunkRepository textbookChunkRepository, 
                      @org.springframework.beans.factory.annotation.Autowired(required = false) ElasticsearchOperations elasticsearchOperations,
                      LessonRepository lessonRepository,
                      @org.springframework.beans.factory.annotation.Autowired(required = false) CurriculumVectorEmbeddingRepository vectorEmbeddingRepository,
                      EmbeddingService embeddingService) {
        this.textbookChunkRepository = textbookChunkRepository;
        this.elasticsearchOperations = elasticsearchOperations;
        this.lessonRepository = lessonRepository;
        this.vectorEmbeddingRepository = vectorEmbeddingRepository;
        this.embeddingService = embeddingService;
    }

    private static class RankedDocument {
        String identifier;
        String heading;
        String content;
        double rrfScore;

        RankedDocument(String identifier, String heading, String content) {
            this.identifier = identifier;
            this.heading = heading;
            this.content = content;
            this.rrfScore = 0.0;
        }
    }

    private static class HitItem {
        final String id;
        final String heading;
        final String content;

        HitItem(String id, String heading, String content) {
            this.id = id;
            this.heading = heading;
            this.content = content;
        }
    }

    /**
     * Performs hybrid retrieval using Reciprocal Rank Fusion (RRF) between
     * Elasticsearch BM25 sparse index, PostgreSQL full-text ranker, and dense
     * vector embeddings, executed concurrently via CompletableFuture.
     *
     * <p>Results are cached in the {@code rag_context} Redis cache (10-minute TTL).
     * The cache key is an MD5 hash of the lowercased, trimmed prompt so that
     * identical and near-identical questions skip all DB queries and the Gemini
     * embedding API call.
     */
    @Cacheable(value = "rag_context",
               key = "T(org.springframework.util.DigestUtils).md5DigestAsHex(#userPrompt.toLowerCase().trim().getBytes())",
               condition = "#userPrompt != null && #userPrompt.length() > 0")
    public String searchRelevantContext(String userPrompt) {
        if (userPrompt == null || userPrompt.trim().isEmpty()) {
            return "";
        }

        Map<String, RankedDocument> docMap = new HashMap<>();

        // 1. Elasticsearch sparse BM25 retrieval (async)
        CompletableFuture<List<HitItem>> esFuture = CompletableFuture.supplyAsync(() -> {
            if (elasticsearchOperations == null) {
                return Collections.emptyList();
            }
            try {
                Query query = NativeQuery.builder()
                        .withQuery(q -> q
                                .match(m -> m
                                        .field("content")
                                        .query(userPrompt)
                                )
                        )
                        .withMaxResults(5)
                        .build();

                SearchHits<TextbookChunk> searchHits = elasticsearchOperations.search(query, TextbookChunk.class);
                if (searchHits == null || searchHits.isEmpty()) {
                    return Collections.emptyList();
                }
                List<HitItem> hits = new ArrayList<>();
                for (SearchHit<TextbookChunk> hit : searchHits) {
                    TextbookChunk chunk = hit.getContent();
                    String id = chunk.getId() != null ? chunk.getId() : chunk.getContent().substring(0, Math.min(30, chunk.getContent().length()));
                    hits.add(new HitItem(id, chunk.getHeading(), chunk.getContent()));
                }
                return hits;
            } catch (Exception e) {
                log.debug("Elasticsearch sparse retrieval skipped: {}", e.getMessage());
                return Collections.emptyList();
            }
        }, ragExecutor);

        // 2. PostgreSQL GIN full-text retrieval (async)
        CompletableFuture<List<HitItem>> pgFuture = CompletableFuture.supplyAsync(() -> {
            if (vectorEmbeddingRepository == null) {
                return Collections.emptyList();
            }
            try {
                List<CurriculumVectorEmbedding> pgHits = vectorEmbeddingRepository.searchPostgresFullTextRanked(userPrompt, 5);
                if (pgHits == null || pgHits.isEmpty()) {
                    pgHits = vectorEmbeddingRepository.searchKeywordFallback(userPrompt, 5);
                }
                if (pgHits == null || pgHits.isEmpty()) {
                    return Collections.emptyList();
                }
                List<HitItem> hits = new ArrayList<>();
                for (CurriculumVectorEmbedding emb : pgHits) {
                    String id = emb.getId() != null ? emb.getId().toString() : emb.getChunkText().substring(0, Math.min(30, emb.getChunkText().length()));
                    hits.add(new HitItem(id, emb.getHeading(), emb.getChunkText()));
                }
                return hits;
            } catch (Exception e) {
                log.debug("Postgres full-text retrieval skipped: {}", e.getMessage());
                return Collections.emptyList();
            }
        }, ragExecutor);

        // 3. Dense Vector search via Gemini Embeddings + pgvector cosine similarity (async)
        CompletableFuture<List<HitItem>> vectorFuture = CompletableFuture.supplyAsync(() -> {
            if (vectorEmbeddingRepository == null || embeddingService == null) {
                return Collections.emptyList();
            }
            try {
                List<Double> promptEmbedding = embeddingService.getEmbedding(userPrompt);
                if (promptEmbedding == null || promptEmbedding.isEmpty()) {
                    return Collections.emptyList();
                }
                String vectorString = promptEmbedding.toString(); // e.g. "[0.1, 0.2, ...]"
                List<CurriculumVectorEmbedding> vectorHits = vectorEmbeddingRepository.searchByVectorSimilarity(vectorString, 5);
                if (vectorHits == null || vectorHits.isEmpty()) {
                    return Collections.emptyList();
                }
                List<HitItem> hits = new ArrayList<>();
                for (CurriculumVectorEmbedding emb : vectorHits) {
                    String id = emb.getId() != null ? emb.getId().toString() : emb.getChunkText().substring(0, Math.min(30, emb.getChunkText().length()));
                    hits.add(new HitItem(id, emb.getHeading(), emb.getChunkText()));
                }
                return hits;
            } catch (Exception e) {
                log.debug("Dense vector retrieval skipped: {}", e.getMessage());
                return Collections.emptyList();
            }
        }, ragExecutor);

        // Await all retrieval tasks with a bounded 5-second timeout
        try {
            CompletableFuture.allOf(esFuture, pgFuture, vectorFuture).get(5, TimeUnit.SECONDS);
        } catch (TimeoutException te) {
            log.warn("RAG retrieval exceeded 5s timeout, proceeding with completed sources");
        } catch (Exception e) {
            log.warn("RAG retrieval exception: {}", e.getMessage());
        }

        // Apply Reciprocal Rank Fusion (RRF) across available results
        mergeRrfHits(docMap, esFuture);
        mergeRrfHits(docMap, pgFuture);
        mergeRrfHits(docMap, vectorFuture);

        if (docMap.isEmpty()) {
            return "";
        }

        // Sort by aggregated RRF score (highest relevance first)
        List<RankedDocument> sortedDocs = new ArrayList<>(docMap.values());
        sortedDocs.sort((a, b) -> Double.compare(b.rrfScore, a.rrfScore));

        StringBuilder contextBuilder = new StringBuilder();
        contextBuilder.append("--- Verified Curriculum Reference Material (RRF Hybrid Search) ---\n");
        int count = 0;
        for (RankedDocument doc : sortedDocs) {
            if (count >= 3) break;
            if (doc.heading != null && !doc.heading.isEmpty()) {
                contextBuilder.append("Topic: ").append(doc.heading).append("\n");
            }
            contextBuilder.append(doc.content).append("\n\n");
            count++;
        }

        return contextBuilder.toString();
    }

    private void mergeRrfHits(Map<String, RankedDocument> docMap, CompletableFuture<List<HitItem>> future) {
        if (!future.isDone() || future.isCompletedExceptionally()) {
            return;
        }
        try {
            List<HitItem> hits = future.getNow(Collections.emptyList());
            if (hits == null) return;
            int rank = 1;
            for (HitItem hit : hits) {
                RankedDocument doc = docMap.computeIfAbsent(hit.id, k -> new RankedDocument(hit.id, hit.heading, hit.content));
                doc.rrfScore += 1.0 / (RRF_K + rank);
                rank++;
            }
        } catch (Exception ignored) {}
    }

    public void ingestCurriculum(String curriculumDirPath) throws IOException {
        if (textbookChunkRepository == null) return;
        Path dirPath = Paths.get(curriculumDirPath);
        if (!Files.exists(dirPath)) throw new IllegalArgumentException("Curriculum directory not found: " + curriculumDirPath);

        textbookChunkRepository.deleteAll();

        try (Stream<Path> paths = Files.walk(dirPath)) {
            paths.filter(Files::isRegularFile)
                 .filter(path -> path.toString().endsWith(".md"))
                 .forEach(path -> {
                     try {
                         String chapterId = path.getFileName().toString().replace(".md", "");
                         String content = Files.readString(path);
                         String[] chunks = content.split("\n## |\\n### ");
                         
                         for (String chunkText : chunks) {
                             if (chunkText.trim().length() > 50) {
                                 TextbookChunk chunk = new TextbookChunk();
                                 chunk.setId(UUID.randomUUID().toString());
                                 chunk.setChapterId(chapterId);
                                 chunk.setContent(chunkText.trim());
                                 textbookChunkRepository.save(chunk);
                             }
                         }
                     } catch (IOException ignored) {}
                 });
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public void ingestFromDatabase() {
        if (textbookChunkRepository != null) {
            textbookChunkRepository.deleteAll();
        }
        if (vectorEmbeddingRepository != null) {
            vectorEmbeddingRepository.deleteAll();
        }

        List<CurriculumVectorEmbedding> vectorBatch = new ArrayList<>();
        List<Lesson> lessons = lessonRepository.findAll();

        for (Lesson lesson : lessons) {
            String chapterId = "";
            String conceptTitle = lesson.getTitle();

            if (lesson.getConcept() != null) {
                conceptTitle = lesson.getConcept().getTitle();
                if (lesson.getConcept().getTopic() != null && 
                    lesson.getConcept().getTopic().getChapter() != null) {
                    chapterId = lesson.getConcept().getTopic().getChapter().getId().toString();
                }
            }

            for (ContentBlock block : lesson.getContentBlocks()) {
                if (block.getMetadata() != null) {
                    if ("EXPLANATION".equals(block.getType())) {
                        Object textObj = block.getMetadata().get("text");
                        if (textObj instanceof String) {
                            String text = (String) textObj;
                            if (text.trim().length() > 50) {
                                if (textbookChunkRepository != null) {
                                    TextbookChunk chunk = new TextbookChunk();
                                    chunk.setId(UUID.randomUUID().toString());
                                    chunk.setChapterId(chapterId.isEmpty() ? lesson.getId().toString() : chapterId);
                                    chunk.setHeading(conceptTitle);
                                    chunk.setContent(text.trim());
                                    textbookChunkRepository.save(chunk);
                                }

                                if (vectorEmbeddingRepository != null) {
                                    CurriculumVectorEmbedding emb = CurriculumVectorEmbedding.builder()
                                            .lessonId(lesson.getId())
                                            .blockId(block.getId())
                                            .heading(conceptTitle)
                                            .chunkText(text.trim())
                                            .domain(lesson.getConcept() != null ? "CLINICAL" : "BASIC")
                                            .build();
                                    List<Double> vector = embeddingService.getEmbedding(text.trim());
                                    if (!vector.isEmpty()) {
                                        emb.setEmbedding(vector.toString());
                                    }
                                    vectorBatch.add(emb);
                                }
                            }
                        }
                    } else if ("CLINICAL_CASE".equals(block.getType())) {
                        Object scenario = block.getMetadata().get("scenario");
                        Object question = block.getMetadata().get("question");
                        Object explanation = block.getMetadata().get("explanation");
                        
                        StringBuilder caseText = new StringBuilder();
                        if (scenario instanceof String) caseText.append("Clinical Scenario: ").append(scenario).append("\n");
                        if (question instanceof String) caseText.append("Clinical Question: ").append(question).append("\n");
                        if (explanation instanceof String) caseText.append("Clinical Reasoning: ").append(explanation);

                        if (caseText.length() > 50) {
                            if (textbookChunkRepository != null) {
                                TextbookChunk chunk = new TextbookChunk();
                                chunk.setId(UUID.randomUUID().toString());
                                chunk.setChapterId(chapterId.isEmpty() ? lesson.getId().toString() : chapterId);
                                chunk.setHeading("Clinical Case: " + conceptTitle);
                                chunk.setContent(caseText.toString());
                                textbookChunkRepository.save(chunk);
                            }

                            if (vectorEmbeddingRepository != null) {
                                CurriculumVectorEmbedding emb = CurriculumVectorEmbedding.builder()
                                        .lessonId(lesson.getId())
                                        .blockId(block.getId())
                                        .heading("Clinical Case: " + conceptTitle)
                                        .chunkText(caseText.toString())
                                        .domain(lesson.getConcept() != null ? "CLINICAL" : "BASIC")
                                        .build();
                                List<Double> vector = embeddingService.getEmbedding(caseText.toString());
                                if (!vector.isEmpty()) {
                                    emb.setEmbedding(vector.toString());
                                }
                                vectorBatch.add(emb);
                            }
                        }
                    }
                }
            }
        }

        if (vectorEmbeddingRepository != null && !vectorBatch.isEmpty()) {
            vectorEmbeddingRepository.saveAll(vectorBatch);
        }
    }
}
