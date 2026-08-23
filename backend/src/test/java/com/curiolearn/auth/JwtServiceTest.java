package com.curiolearn.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String testSecret = "c3VwZXItc2VjcmV0LWtleS1zaG91bGQtYmUtYXQtbGVhc3QtMjU2LWJpdHMtbG9uZy1mb3Itc2VjdXJpdHk=";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", testSecret);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L); // 24 hours
    }

    @Test
    @DisplayName("TC-JWT-001: generateToken creates valid parseable JWT token")
    void testGenerateToken_Valid() {
        UserDetails userDetails = new User("student@mediverse.edu", "password", Collections.emptyList());

        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertEquals("student@mediverse.edu", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    @DisplayName("TC-JWT-002: isTokenValid returns false for mismatched username")
    void testIsTokenValid_MismatchedUser() {
        UserDetails user1 = new User("user1@mediverse.edu", "password", Collections.emptyList());
        UserDetails user2 = new User("user2@mediverse.edu", "password", Collections.emptyList());

        String token = jwtService.generateToken(user1);

        assertFalse(jwtService.isTokenValid(token, user2));
    }
}
