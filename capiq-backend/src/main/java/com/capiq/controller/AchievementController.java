
package com.capiq.controller;

import com.capiq.entity.Achievement;
import com.capiq.service.AchievementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(
            AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    private Map<String, Object> toResponse(Achievement achievement) {
        return Map.of(
                "id", achievement.getId(),
                "title", achievement.getTitle(),
                "description", achievement.getDescription() == null
                        ? "" : achievement.getDescription(),
                "date", achievement.getDate() == null
                        ? "" : achievement.getDate()
        );
    }

    @PostMapping
    public ResponseEntity<?> addAchievement(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        Achievement achievement = achievementService.addAchievement(
                authentication.getName(),
                request.get("title"),
                request.get("description"),
                request.get("date")
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(achievement));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAchievements(
            Authentication authentication) {

        List<Map<String, Object>> achievements = achievementService
                .getAchievements(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(achievements);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchievement(
            @PathVariable Long id,
            Authentication authentication) {

        achievementService.deleteAchievement(
                authentication.getName(), id);

        return ResponseEntity.noContent().build();
    }
}
