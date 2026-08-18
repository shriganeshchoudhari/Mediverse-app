package com.curiolearn.user;

import com.curiolearn.user.PasswordChangeDto;
import com.curiolearn.user.ProfileUpdateDto;
import com.curiolearn.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateDto dto, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        userService.updateProfile(userId, dto);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeDto dto, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        try {
            userService.changePassword(userId, dto);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}


