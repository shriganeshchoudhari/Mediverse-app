package com.curiolearn.ai;

import com.curiolearn.ai.TextbookChunk;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TextbookChunkRepository extends ElasticsearchRepository<TextbookChunk, String> {

}

