package com.curiolearn.social;

import com.curiolearn.social.StudySession;
import com.curiolearn.user.User;
import com.curiolearn.social.StudySessionRepository;
import com.curiolearn.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.Duration;
import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.UUID;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class StudySessionService {

    private final StudySessionRepository sessionRepository;
    private final UserRepository userRepository;

    public StudySessionService(StudySessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public StudySession startSession(UUID userId, String lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        StudySession session = StudySession.builder()
                .user(user)
                .lessonId(lessonId)
                .startedAt(LocalDateTime.now())
                .build();
        return sessionRepository.save(session);
    }

    @Transactional
    public StudySession endSession(UUID userId, UUID sessionId) {
        StudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study session not found"));

        if (!session.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to target session");
        }

        session.setEndedAt(LocalDateTime.now());
        long diff = Duration.between(session.getStartedAt(), session.getEndedAt()).getSeconds();
        session.setDurationSeconds((int) diff);

        User user = session.getUser();
        LocalDate today = LocalDate.now();
        LocalDate lastStudy = user.getLastStudyDate();

        if (lastStudy == null) {
            user.setDailyStreak(1);
            user.setLastStudyDate(today);
        } else if (lastStudy.equals(today.minusDays(1))) {
            user.setDailyStreak(user.getDailyStreak() + 1);
            user.setLastStudyDate(today);
        } else if (lastStudy.isBefore(today.minusDays(1))) {
            user.setDailyStreak(1);
            user.setLastStudyDate(today);
        }

        userRepository.save(user);

        return sessionRepository.save(session);
    }

    public List<Map<String, Object>> getWeeklyActivity(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(6).withHour(0).withMinute(0).withSecond(0);
        List<StudySession> sessions = sessionRepository.findByUserAndStartedAtAfter(user, oneWeekAgo);

        Map<DayOfWeek, Integer> activityMap = new HashMap<>();
        for (StudySession session : sessions) {
            if (session.getDurationSeconds() > 0) {
                DayOfWeek day = session.getStartedAt().getDayOfWeek();
                activityMap.put(day, activityMap.getOrDefault(day, 0) + (session.getDurationSeconds() / 60));
            }
        }

        List<Map<String, Object>> weeklyData = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            DayOfWeek day = date.getDayOfWeek();
            String dayName = day.getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            Map<String, Object> data = new HashMap<>();
            data.put("day", dayName);
            data.put("minutes", activityMap.getOrDefault(day, 0));
            weeklyData.add(data);
        }

        return weeklyData;
    }
}

