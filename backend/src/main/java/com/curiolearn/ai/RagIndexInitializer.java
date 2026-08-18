package com.curiolearn.ai;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RagIndexInitializer {

    private static final Logger log = LoggerFactory.getLogger(RagIndexInitializer.class);
    private final RagService ragService;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeIndex() {
        try {
            log.info("Starting automatic Elasticsearch curriculum indexing from database...");
            ragService.ingestFromDatabase();
            log.info("Elasticsearch curriculum indexing completed successfully.");
        } catch (Exception e) {
            log.error("Failed to automatically index curriculum into Elasticsearch: {}", e.getMessage(), e);
        }
    }
}
