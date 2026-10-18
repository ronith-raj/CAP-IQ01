
package com.capiq.controller;

import com.capiq.entity.Skill;
import com.capiq.service.SkillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    private Map<String, Object> toResponse(Skill skill) {
        return Map.of(
                "id", skill.getId(),
                "name", skill.getName()
        );
    }

    @PostMapping
    public ResponseEntity<?> addSkill(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        Skill skill = skillService.addSkill(
                authentication.getName(),
                request.get("name"));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(skill));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getSkills(
            Authentication authentication) {

        List<Map<String, Object>> skills = skillService
                .getSkills(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(skills);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(
            @PathVariable Long id,
            Authentication authentication) {

        skillService.deleteSkill(authentication.getName(), id);

        return ResponseEntity.noContent().build();
    }
}
