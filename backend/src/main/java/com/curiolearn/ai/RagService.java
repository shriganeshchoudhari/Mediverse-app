package com.curiolearn.ai;
import com.curiolearn.curriculum.Chapter;
import com.curiolearn.curriculum.Lesson;
import com.curiolearn.curriculum.ContentBlock;
import com.curiolearn.curriculum.LessonRepository;

import com.curiolearn.ai.TextbookChunk;
import com.curiolearn.ai.TextbookChunkRepository;
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
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class RagService {

    private final TextbookChunkRepository textbookChunkRepository;
    private final ElasticsearchOperations elasticsearchOperations;
    private final LessonRepository lessonRepository;

    public RagService(@org.springframework.beans.factory.annotation.Autowired(required = false) TextbookChunkRepository textbookChunkRepository, 
                      @org.springframework.beans.factory.annotation.Autowired(required = false) ElasticsearchOperations elasticsearchOperations,
                      LessonRepository lessonRepository) {
        this.textbookChunkRepository = textbookChunkRepository;
        this.elasticsearchOperations = elasticsearchOperations;
        this.lessonRepository = lessonRepository;
    }

    /**
     * Searches Elasticsearch for the most relevant textbook chunks based on the user's prompt.
     */
    public String searchRelevantContext(String userPrompt) {
        if (elasticsearchOperations == null) {
            return "";
        }
        try {
            // Build a native Elasticsearch Match Query for BM25 full-text search
            Query query = NativeQuery.builder()
                    .withQuery(q -> q
                            .match(m -> m
                                    .field("content")
                                    .query(userPrompt)
                            )
                    )
                    .withMaxResults(3) // Get top 3 chunks
                    .build();

            SearchHits<TextbookChunk> searchHits = elasticsearchOperations.search(query, TextbookChunk.class);
            
            if (searchHits == null || searchHits.isEmpty()) {
                return "";
            }

            StringBuilder contextBuilder = new StringBuilder();
            contextBuilder.append("Here is relevant reference material from the local curriculum syllabus:\n\n");
            
            for (SearchHit<TextbookChunk> hit : searchHits) {
                TextbookChunk chunk = hit.getContent();
                contextBuilder.append("--- Chapter: ").append(chunk.getChapterId()).append(" ---\n");
                contextBuilder.append(chunk.getContent()).append("\n\n");
            }

            return contextBuilder.toString();
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Reads all markdown files in the curriculum directory, splits them into basic paragraphs,
     * and indexes them into Elasticsearch.
     */
    public void ingestCurriculum(String curriculumDirPath) throws IOException {
        if (textbookChunkRepository == null) {
            return;
        }
        Path dirPath = Paths.get(curriculumDirPath);
        
        if (!Files.exists(dirPath)) {
            throw new IllegalArgumentException("Curriculum directory not found: " + curriculumDirPath);
        }

        // Delete existing index to start fresh
        textbookChunkRepository.deleteAll();

        try (Stream<Path> paths = Files.walk(dirPath)) {
            paths.filter(Files::isRegularFile)
                 .filter(path -> path.toString().endsWith(".md"))
                 .forEach(path -> {
                     try {
                         String chapterId = path.getFileName().toString().replace(".md", "");
                         String content = Files.readString(path);
                         
                         // Simple chunking by Markdown sections (split by H2/H3 or double newline)
                         String[] chunks = content.split("\n## |\\n### ");
                         
                         for (String chunkText : chunks) {
                             if (chunkText.trim().length() > 50) { // Ignore very small fragments
                                 TextbookChunk chunk = new TextbookChunk();
                                 chunk.setId(UUID.randomUUID().toString());
                                 chunk.setChapterId(chapterId);
                                 chunk.setContent(chunkText.trim());
                                 
                                 textbookChunkRepository.save(chunk);
                             }
                         }
                         
                     } catch (IOException e) {
                         System.err.println("Failed to read file: " + path);
                     }
                 });
        }
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public void ingestFromDatabase() {
        if (textbookChunkRepository == null) {
            return;
        }
        textbookChunkRepository.deleteAll();

        java.util.List<Lesson> lessons = lessonRepository.findAll();
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
                if ("EXPLANATION".equals(block.getType()) && block.getMetadata() != null) {
                    Object textObj = block.getMetadata().get("text");
                    if (textObj instanceof String) {
                        String text = (String) textObj;
                        if (text.trim().length() > 50) {
                            TextbookChunk chunk = new TextbookChunk();
                            chunk.setId(UUID.randomUUID().toString());
                            chunk.setChapterId(chapterId);
                            chunk.setHeading(conceptTitle);
                            chunk.setContent(text.trim());
                            textbookChunkRepository.save(chunk);
                        }
                    }
                }
            }
        }
    }
}

