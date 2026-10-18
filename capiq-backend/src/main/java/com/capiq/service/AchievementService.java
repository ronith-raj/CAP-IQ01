
package com.capiq.service;

import com.capiq.entity.Achievement;
import com.capiq.entity.User;
import com.capiq.repository.AchievementRepository;
import com.capiq.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;

    public AchievementService(
            AchievementRepository achievementRepository,
            UserRepository userRepository) {
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Achievement addAchievement(
            String email,
            String title,
            String description,
            String date) {

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException(
                    "Achievement title cannot be empty");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Achievement achievement = new Achievement(
                title.trim(),
                description,
                date,
                user
        );

        return achievementRepository.save(achievement);
    }

    @Transactional(readOnly = true)
    public List<Achievement> getAchievements(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return achievementRepository.findByUserId(user.getId());
    }

    @Transactional
    public void deleteAchievement(String email, Long achievementId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Achievement achievement = achievementRepository
                .findById(achievementId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Achievement not found"));

        if (!achievement.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You cannot delete another user's achievement");
        }

        achievementRepository.delete(achievement);
    }
}
