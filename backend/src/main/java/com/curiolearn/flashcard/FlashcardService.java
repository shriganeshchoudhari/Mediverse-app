package com.curiolearn.flashcard;

import com.curiolearn.flashcard.FlashcardReviewDto;
import com.curiolearn.flashcard.FlashcardResponseDto;
import com.curiolearn.flashcard.FlashcardSyncDto;
import com.curiolearn.flashcard.Flashcard;
import com.curiolearn.user.User;
import com.curiolearn.flashcard.FlashcardRepository;
import com.curiolearn.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final UserRepository userRepository;

    public FlashcardService(FlashcardRepository flashcardRepository, UserRepository userRepository) {
        this.flashcardRepository = flashcardRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<FlashcardResponseDto> getDueCards(UUID userId, String domain, String programCode) {
        User user = findUserById(userId);
        List<Flashcard> dueCards = flashcardRepository.findDueCards(user, LocalDateTime.now());
        if (domain != null && !domain.isBlank()) {
            dueCards = dueCards.stream().filter(c -> domain.equalsIgnoreCase(c.getDomain())).collect(Collectors.toList());
        }
        if (programCode != null && !programCode.isBlank()) {
            dueCards = dueCards.stream().filter(c -> programCode.equalsIgnoreCase(c.getProgramCode())).collect(Collectors.toList());
        }
        return dueCards.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FlashcardResponseDto> getCardsByLesson(UUID userId, String lessonId) {
        User user = findUserById(userId);
        List<Flashcard> cards = flashcardRepository.findByUserAndLessonId(user, lessonId);
        return cards.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public FlashcardResponseDto reviewCard(UUID userId, UUID cardId, FlashcardReviewDto request) {
        User user = findUserById(userId);
        Flashcard card = flashcardRepository.findById(cardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flashcard not found"));

        if (!card.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to target card");
        }

        // Apply SuperMemo-2 Spaced Repetition Scheduling Algorithm
        int rating = request.getRating();
        int interval = card.getIntervalDays();
        double easeFactor = card.getEaseFactor();

        if (rating == 1) {
            // "Again" - user forgot the card, reset intervals
            interval = 1;
        } else {
            // Correct answer - calculate next interval
            if (interval == 0) {
                interval = 1;
            } else if (interval == 1) {
                interval = 6;
            } else {
                interval = (int) Math.round(interval * easeFactor);
            }

            // Adjust ease factor: EF' = EF + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
            // Map our 1-4 rating to standard SM-2 (0-5) index if needed, or compute directly:
            // Standard rating range mapping (1 -> 2, 2 -> 3, 3 -> 4, 4 -> 5)
            int smRating = rating + 1;
            easeFactor = easeFactor + (0.1 - (5 - smRating) * (0.08 + (5 - smRating) * 0.02));
            if (easeFactor < 1.3) {
                easeFactor = 1.3; // SM-2 standard lower bound
            }
        }

        card.setIntervalDays(interval);
        card.setEaseFactor(easeFactor);
        card.setNextReviewAt(LocalDateTime.now().plusDays(interval));

        flashcardRepository.save(card);

        // Award small gamification XP per review
        user.setCurrentXp(user.getCurrentXp() + 5);
        userRepository.save(user);

        return mapToDto(card);
    }

    @Transactional
    public List<FlashcardResponseDto> syncFlashcards(UUID userId, String lessonId, List<FlashcardSyncDto> requestCards) {
        User user = findUserById(userId);
        List<Flashcard> existingCards = flashcardRepository.findByUserAndLessonId(user, lessonId);

        for (FlashcardSyncDto req : requestCards) {
            boolean exists = existingCards.stream()
                    .anyMatch(c -> c.getFrontText().trim().equalsIgnoreCase(req.getFrontText().trim()));
            if (!exists) {
                Flashcard newCard = Flashcard.builder()
                        .user(user)
                        .lessonId(lessonId)
                        .frontText(req.getFrontText())
                        .backText(req.getBackText())
                        .easeFactor(2.5)
                        .intervalDays(0)
                        .nextReviewAt(LocalDateTime.now())
                        .build();
                flashcardRepository.save(newCard);
            }
        }
        List<Flashcard> updatedCards = flashcardRepository.findByUserAndLessonId(user, lessonId);
        return updatedCards.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public void deleteFlashcard(UUID userId, UUID cardId) {
        User user = findUserById(userId);
        Flashcard card = flashcardRepository.findById(cardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flashcard not found"));
        if (!card.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to target card");
        }
        flashcardRepository.delete(card);
    }

    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private FlashcardResponseDto mapToDto(Flashcard card) {
        return FlashcardResponseDto.builder()
                .id(card.getId())
                .lessonId(card.getLessonId())
                .frontText(card.getFrontText())
                .backText(card.getBackText())
                .intervalDays(card.getIntervalDays())
                .easeFactor(card.getEaseFactor())
                .nextReviewAt(card.getNextReviewAt())
                .build();
    }
}

