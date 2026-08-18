package com.curiolearn.progress;

import com.curiolearn.progress.UserAchievement;
import com.curiolearn.user.User;
import com.curiolearn.progress.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, UUID> {
    List<UserAchievement> findByUser(User user);
    boolean existsByUserAndAchievement(User user, Achievement achievement);
}
