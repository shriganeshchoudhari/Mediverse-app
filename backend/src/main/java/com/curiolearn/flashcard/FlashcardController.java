package com.curiolearn.flashcard;

import com.curiolearn.flashcard.FlashcardReviewDto;
import com.curiolearn.flashcard.FlashcardResponseDto;
import com.curiolearn.flashcard.FlashcardSyncDto;
import com.curiolearn.user.User;
import com.curiolearn.user.UserRepository;
import com.curiolearn.flashcard.FlashcardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/flashcards")
public class FlashcardController {

    private final FlashcardService flashcardService;
    private final UserRepository userRepository;

    public FlashcardController(FlashcardService flashcardService, UserRepository userRepository) {
        this.flashcardService = flashcardService;
        this.userRepository = userRepository;
    }

    @GetMapping("/due")
    public ResponseEntity<List<FlashcardResponseDto>> getDueCards(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<FlashcardResponseDto> dueCards = flashcardService.getDueCards(user.getId());
        return ResponseEntity.ok(dueCards);
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<FlashcardResponseDto>> getCardsByLesson(
            @PathVariable String lessonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<FlashcardResponseDto> cards = flashcardService.getCardsByLesson(user.getId(), lessonId);
        return ResponseEntity.ok(cards);
    }

    @PostMapping("/sync/{lessonId}")
    public ResponseEntity<List<FlashcardResponseDto>> syncFlashcards(
            @PathVariable String lessonId,
            @RequestBody @Valid List<FlashcardSyncDto> request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<FlashcardResponseDto> saved = flashcardService.syncFlashcards(user.getId(), lessonId, request);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<FlashcardResponseDto> reviewCard(
            @PathVariable UUID id,
            @Valid @RequestBody FlashcardReviewDto request,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        FlashcardResponseDto card = flashcardService.reviewCard(user.getId(), id, request);
        return ResponseEntity.ok(card);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashcard(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        flashcardService.deleteFlashcard(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}

