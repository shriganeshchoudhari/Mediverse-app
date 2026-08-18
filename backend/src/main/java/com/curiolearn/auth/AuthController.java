package com.curiolearn.auth;

import com.curiolearn.auth.AuthResponseDto;
import com.curiolearn.auth.ForgotPasswordRequest;
import com.curiolearn.auth.LoginRequestDto;
import com.curiolearn.auth.RegisterRequestDto;
import com.curiolearn.auth.ResetPasswordRequest;
import com.curiolearn.auth.PasswordResetToken;
import com.curiolearn.user.User;
import com.curiolearn.auth.PasswordResetTokenRepository;
import com.curiolearn.user.UserRepository;
import com.curiolearn.common.EmailService;
import com.curiolearn.auth.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthController(UserRepository userRepository, 
                          PasswordResetTokenRepository tokenRepository,
                          PasswordEncoder passwordEncoder, 
                          JwtService jwtService,
                          EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already taken");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role("STUDENT")
                .currentXp(0)
                .dailyStreak(0)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        org.springframework.security.core.userdetails.User springUser = 
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPasswordHash(),
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
                );

        String token = jwtService.generateToken(springUser);

        return ResponseEntity.ok(
                AuthResponseDto.builder()
                        .token(token)
                        .userId(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .role(user.getRole())
                        .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        org.springframework.security.core.userdetails.User springUser = 
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPasswordHash(),
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
                );

        String token = jwtService.generateToken(springUser);

        return ResponseEntity.ok(
                AuthResponseDto.builder()
                        .token(token)
                        .userId(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .role(user.getRole())
                        .build()
        );
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<AuthResponseDto> getCurrentUser(
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return ResponseEntity.ok(
                AuthResponseDto.builder()
                        .userId(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .role(user.getRole())
                        .currentXp(user.getCurrentXp())
                        .dailyStreak(user.getDailyStreak())
                        .build()
        );
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Delete any existing token for this user
            tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);
            
            // Generate new token
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiryDate(LocalDateTime.now().plusHours(24))
                    .build();
            
            tokenRepository.save(resetToken);
            
            // Construct reset link and send email
            String resetLink = "http://localhost:3000/auth/reset-password/" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        }
        
        // Always return success to prevent email enumeration
        return ResponseEntity.ok(
            java.util.Map.of("message", "If an account exists with this email, a password reset link has been sent.")
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired reset token"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token has expired");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Delete the token so it cannot be used again
        tokenRepository.delete(resetToken);

        return ResponseEntity.ok(
            java.util.Map.of("message", "Password successfully reset")
        );
    }
}


