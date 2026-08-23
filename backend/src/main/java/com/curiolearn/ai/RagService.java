package com.curiolearn.ai;

import com.curiolearn.curriculum.Lesson;
import com.curiolearn.curriculum.ContentBlock;
import com.curiolearn.curriculum.LessonRepository;

import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Stream;

@Service
public class RagService {

    private final TextbookChunkRepository textbookChunkRepository;
    private final ElasticsearchOperations elasticsearchOperations;
    private final LessonRepository lessonRepository;
    private final CurriculumVectorEmbeddingRepository vectorEmbeddingRepository;

    private static final int RRF_K = 60;

    public RagService(@org.springframework.beans.factory.annotation.Autowired(required = false) TextbookChunkRepository textbookChunkRepository, 
                      @org.springframework.beans.factory.annotation.Autowired(required = false) ElasticsearchOperations elasticsearchOperations,
                      LessonRepository lessonRepository,
                      @org.springframework.beans.factory.annotation.Autowired(required = false) CurriculumVectorEmbeddingRepository vectorEmbeddingRepository) {
        this.textbookChunkRepository = textbookChunkRepository;
        this.elasticsearchOperations = elasticsearchOperations;
        this.lessonRepository = lessonRepository;
        this.vectorEmbeddingRepository = vectorEmbeddingRepository;
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

    /**
     * Performs hybrid retrieval using Reciprocal Rank Fusion (RRF) between
     * Elasticsearch BM25 sparse index and PostgreSQL full-text ranker.
     */
    public String searchRelevantContext(String userPrompt) {
        if (userPrompt == null || userPrompt.trim().isEmpty()) {
            return "";
        }

        Map<String, RankedDocument> docMap = new HashMap<>();

        // 1. Retrieve from Elasticsearch (BM25 sparse ranking)
        if (elasticsearchOperations != null) {
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
                if (searchHits != null && !searchHits.isEmpty()) {
                    int rank = 1;
                    for (SearchHit<TextbookChunk> hit : searchHits) {
                        TextbookChunk chunk = hit.getContent();
                        String id = chunk.getId() != null ? chunk.getId() : chunk.getContent().substring(0, Math.min(30, chunk.getContent().length()));
                        RankedDocument doc = docMap.computeIfAbsent(id, k -> new RankedDocument(id, chunk.getHeading(), chunk.getContent()));
                        doc.rrfScore += 1.0 / (RRF_K + rank);
                        rank++;
                    }
                }
            } catch (Exception ignored) {}
        }

        // 2. Retrieve from PostgreSQL (Full-text ts_rank search)
        if (vectorEmbeddingRepository != null) {
            try {
                List<CurriculumVectorEmbedding> pgHits = vectorEmbeddingRepository.searchPostgresFullTextRanked(userPrompt, 5);
                if (pgHits.isEmpty()) {
                    pgHits = vectorEmbeddingRepository.searchKeywordFallback(userPrompt, 5);
                }

                int rank = 1;
                for (CurriculumVectorEmbedding emb : pgHits) {
                    String id = emb.getId() != null ? emb.getId().toString() : emb.getChunkText().substring(0, Math.min(30, emb.getChunkText().length()));
                    RankedDocument doc = docMap.computeIfAbsent(id, k -> new RankedDocument(id, emb.getHeading(), emb.getChunkText()));
                    doc.rrfScore += 1.0 / (RRF_K + rank);
                    rank++;
                }
            } catch (Exception ignored) {}
        }

        if (docMap.isEmpty()) {
            return "";
        }

        // 3. Sort by aggregated RRF score (highest relevance first)
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
                                    vectorBatch.add(CurriculumVectorEmbedding.builder()
                                            .lessonId(lesson.getId())
                                            .blockId(block.getId())
                                            .heading(conceptTitle)
                                            .chunkText(text.trim())
                                            .domain("ALLOPATHIC")
                                            .build());
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
                                vectorBatch.add(CurriculumVectorEmbedding.builder()
                                        .lessonId(lesson.getId())
                                        .blockId(block.getId())
                                        .heading("Clinical Case: " + conceptTitle)
                                        .chunkText(caseText.toString())
                                        .domain("ALLOPATHIC")
                                        .build());
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
