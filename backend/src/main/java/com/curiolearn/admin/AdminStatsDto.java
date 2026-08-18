package com.curiolearn.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsDto {
    private long totalUsers;
    private long totalQuestions;
    private long totalExamsTaken;
}

