package com.curiolearn.progress;

import com.curiolearn.progress.UserNoteDto;
import com.curiolearn.progress.UserNote;
import com.curiolearn.user.User;
import com.curiolearn.progress.UserNoteRepository;
import com.curiolearn.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class UserNoteService {

    private final UserNoteRepository noteRepository;
    private final UserRepository userRepository;

    public UserNoteService(UserNoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserNoteDto getNote(UUID userId, String lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return noteRepository.findByUserAndLessonId(user, lessonId)
                .map(n -> UserNoteDto.builder()
                        .lessonId(n.getLessonId())
                        .content(n.getContent())
                        .build())
                .orElse(UserNoteDto.builder()
                        .lessonId(lessonId)
                        .content("")
                        .build());
    }

    @Transactional
    public UserNoteDto saveNote(UUID userId, String lessonId, UserNoteDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserNote note = noteRepository.findByUserAndLessonId(user, lessonId)
                .orElse(UserNote.builder()
                        .user(user)
                        .lessonId(lessonId)
                        .build());

        note.setContent(request.getContent());
        noteRepository.save(note);

        return UserNoteDto.builder()
                .lessonId(note.getLessonId())
                .content(note.getContent())
                .build();
    }
}

