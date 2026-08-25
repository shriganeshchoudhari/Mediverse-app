package com.curiolearn.auth;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDto {
    private String token;
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private int currentXp;
    private int dailyStreak;
    private String refreshToken;
}

