package com.curiolearn.progress;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserNoteDto {
    private String lessonId;
    private String content;
}
