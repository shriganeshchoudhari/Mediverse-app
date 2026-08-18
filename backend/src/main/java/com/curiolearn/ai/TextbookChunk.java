package com.curiolearn.ai;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@Document(indexName = "textbook_chunks")
public class TextbookChunk {

    @Id
    private String id;

    @Field(type = FieldType.Keyword)
    private String chapterId;

    @Field(type = FieldType.Text)
    private String heading;

    @Field(type = FieldType.Text)
    private String content;

}

