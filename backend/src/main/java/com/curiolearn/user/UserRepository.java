package com.curiolearn.user;

import com.curiolearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(u) FROM User u WHERE u.lastStudyDate = CURRENT_DATE")
    long countActiveUsersToday();

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(AVG(u.currentXp), 0) FROM User u")
    double getAverageXp();

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(AVG(u.dailyStreak), 0) FROM User u")
    double getAverageStreak();
}

