package com.curiolearn.social;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Data
@Builder
public class StudyGroupDto {
    private UUID id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private int memberCount;
    private boolean isMember;
}

