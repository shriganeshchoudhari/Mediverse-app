package com.curiolearn.auth;

import com.curiolearn.common.EmailService;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthApiControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private EmailService emailService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        AuthController authController = new AuthController(
                userRepository,
                tokenRepository,
                passwordEncoder,
                jwtService,
                emailService
        );
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("TC-API-AUTH-001: Register user successfully returns 200 OK with JWT token and profile")
    void testRegisterUser_Success() throws Exception {
        RegisterRequestDto request = RegisterRequestDto.builder()
                .email("student@mediverse.edu")
                .password("SecurePass123!")
                .firstName("John")
                .lastName("Doe")
                .build();

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("mock_jwt_token_header_payload_signature");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token", is("mock_jwt_token_header_payload_signature")))
                .andExpect(jsonPath("$.email", is("student@mediverse.edu")))
                .andExpect(jsonPath("$.firstName", is("John")))
                .andExpect(jsonPath("$.lastName", is("Doe")))
                .andExpect(jsonPath("$.role", is("STUDENT")));

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("TC-API-AUTH-002: Register user with duplicate email returns 400 Bad Request")
    void testRegisterUser_DuplicateEmail_Returns400() throws Exception {
        RegisterRequestDto request = RegisterRequestDto.builder()
                .email("existing@mediverse.edu")
                .password("SecurePass123!")
                .firstName("Jane")
                .lastName("Doe")
                .build();

        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .email("existing@mediverse.edu")
                .build();

        when(userRepository.findByEmail("existing@mediverse.edu")).thenReturn(Optional.of(existingUser));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("TC-API-AUTH-003: Login with valid credentials returns 200 OK with JWT token")
    void testLogin_Success() throws Exception {
        LoginRequestDto request = LoginRequestDto.builder()
                .email("student@mediverse.edu")
                .password("Password123!")
                .build();

        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .email("student@mediverse.edu")
                .passwordHash("hashed_password_123")
                .firstName("John")
                .lastName("Doe")
                .role("STUDENT")
                .build();

        when(userRepository.findByEmail("student@mediverse.edu")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("Password123!", "hashed_password_123")).thenReturn(true);
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("valid_jwt_access_token");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", is("valid_jwt_access_token")))
                .andExpect(jsonPath("$.email", is("student@mediverse.edu")))
                .andExpect(jsonPath("$.role", is("STUDENT")));
    }

    @Test
    @DisplayName("TC-API-AUTH-004: Login with invalid credentials returns 401 Unauthorized")
    void testLogin_InvalidPassword_Returns401() throws Exception {
        LoginRequestDto request = LoginRequestDto.builder()
                .email("student@mediverse.edu")
                .password("WrongPassword")
                .build();

        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .email("student@mediverse.edu")
                .passwordHash("hashed_password_123")
                .build();

        when(userRepository.findByEmail("student@mediverse.edu")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("WrongPassword", "hashed_password_123")).thenReturn(false);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-API-AUTH-005: Forgot password triggers token generation and returns 200 OK")
    void testForgotPassword_Success() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("student@mediverse.edu");

        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .email("student@mediverse.edu")
                .build();

        when(userRepository.findByEmail("student@mediverse.edu")).thenReturn(Optional.of(existingUser));

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", notNullValue()));

        verify(tokenRepository, times(1)).save(any(PasswordResetToken.class));
        verify(emailService, times(1)).sendPasswordResetEmail(eq("student@mediverse.edu"), anyString());
    }

    @Test
    @DisplayName("TC-API-AUTH-006: Reset password with valid token updates password and returns 200 OK")
    void testResetPassword_Success() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("valid-uuid-reset-token");
        request.setNewPassword("NewSuperSecret123!");

        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .email("student@mediverse.edu")
                .passwordHash("old_hash")
                .build();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token("valid-uuid-reset-token")
                .user(existingUser)
                .expiryDate(LocalDateTime.now().plusHours(12))
                .build();

        when(tokenRepository.findByToken("valid-uuid-reset-token")).thenReturn(Optional.of(resetToken));
        when(passwordEncoder.encode("NewSuperSecret123!")).thenReturn("new_hash_encoded");

        mockMvc.perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Password successfully reset")));

        verify(userRepository, times(1)).save(existingUser);
        verify(tokenRepository, times(1)).delete(resetToken);
    }
}
