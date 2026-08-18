package com.curiolearn.progress;

import com.curiolearn.progress.UserNoteDto;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.curiolearn.progress.UserNoteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notes")
public class UserNoteController {

    private final UserNoteService noteService;
    private final UserRepository userRepository;

    public UserNoteController(UserNoteService noteService, UserRepository userRepository) {
        this.noteService = noteService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<UserNoteDto> getNote(
            @PathVariable String lessonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(noteService.getNote(user.getId(), lessonId));
    }

    @PostMapping("/{lessonId}")
    public ResponseEntity<UserNoteDto> saveNote(
            @PathVariable String lessonId,
            @Valid @RequestBody UserNoteDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(noteService.saveNote(user.getId(), lessonId, request));
    }
}
