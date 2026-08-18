package com.curiolearn.user;

import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.curiolearn.auth.CustomUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoadUserByUsername() {
        User user = new User();
        user.setEmail("test@test.com");
        user.setPasswordHash("hash");
        user.setRole("STUDENT");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        var userDetails = customUserDetailsService.loadUserByUsername("test@test.com");

        assertEquals("test@test.com", userDetails.getUsername());
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT")));
    }
}


