package com.curiolearn.ai;

import com.curiolearn.ai.TextbookChunk;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface TextbookChunkRepository extends ElasticsearchRepository<TextbookChunk, String> {

}

