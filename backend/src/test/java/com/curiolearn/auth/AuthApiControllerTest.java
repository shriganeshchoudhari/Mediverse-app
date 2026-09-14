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
import org.springframework.core.MethodParameter;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import java.util.List;
import java.util.Map;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
    private RefreshTokenRepository refreshTokenRepository;

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
                refreshTokenRepository,
                passwordEncoder,
                jwtService,
                emailService
        );
        HandlerMethodArgumentResolver authPrincipalResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.hasParameterAnnotation(AuthenticationPrincipal.class)
                        || UserDetails.class.isAssignableFrom(parameter.getParameterType());
            }

            @Override
            public Object resolveArgument(MethodParameter parameter,
                    ModelAndViewContainer mavContainer,
                    NativeWebRequest webRequest,
                    WebDataBinderFactory binderFactory) {
                Principal principal = webRequest.getUserPrincipal();
                if (principal == null) {
                    return null;
                }
                return new org.springframework.security.core.userdetails.User(
                        principal.getName(),
                        "password",
                        Collections.emptyList());
            }
        };

        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setCustomArgumentResolvers(authPrincipalResolver)
                .build();
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

    @Test
    @DisplayName("TC-API-AUTH-007: POST /api/v1/auth/refresh rotates refresh token and issues new access token")
    void testRefreshToken_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .id(userId)
                .email("student@mediverse.edu")
                .passwordHash("hashed_pwd")
                .role("STUDENT")
                .build();

        RefreshToken existing = RefreshToken.builder()
                .id(UUID.randomUUID())
                .token("valid-old-refresh-token")
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(10))
                .build();

        when(refreshTokenRepository.findByToken("valid-old-refresh-token")).thenReturn(Optional.of(existing));
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("new_rotated_access_jwt");

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("refreshToken", "valid-old-refresh-token"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", is("new_rotated_access_jwt")))
                .andExpect(jsonPath("$.refreshToken", notNullValue()));

        verify(refreshTokenRepository, times(1)).delete(existing);
        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("TC-API-AUTH-008: POST /api/v1/auth/refresh with missing token returns 400 Bad Request")
    void testRefreshToken_Missing_Returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("refreshToken", ""))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-API-AUTH-009: POST /api/v1/auth/refresh with expired token returns 401 Unauthorized")
    void testRefreshToken_Expired_Returns401() throws Exception {
        User user = User.builder().id(UUID.randomUUID()).email("student@mediverse.edu").build();
        RefreshToken expired = RefreshToken.builder()
                .token("expired-token")
                .user(user)
                .expiresAt(LocalDateTime.now().minusDays(1))
                .build();

        when(refreshTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(expired));

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("refreshToken", "expired-token"))))
                .andExpect(status().isUnauthorized());

        verify(refreshTokenRepository, times(1)).delete(expired);
    }

    @Test
    @DisplayName("TC-API-AUTH-010: GET /api/v1/auth/me returns current authenticated user profile")
    void testGetCurrentUser_Success() throws Exception {
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("student@mediverse.edu")
                .firstName("Arjun")
                .lastName("Sharma")
                .role("STUDENT")
                .currentXp(150)
                .dailyStreak(5)
                .build();

        when(userRepository.findByEmail("student@mediverse.edu")).thenReturn(Optional.of(user));

        org.springframework.security.core.userdetails.User springUser =
                new org.springframework.security.core.userdetails.User(
                        "student@mediverse.edu", "pass", List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(springUser, null, springUser.getAuthorities());

        mockMvc.perform(get("/api/v1/auth/me").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("student@mediverse.edu")))
                .andExpect(jsonPath("$.currentXp", is(150)))
                .andExpect(jsonPath("$.dailyStreak", is(5)));
    }
}
