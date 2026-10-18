
package com.capiq.service;

import com.capiq.entity.Skill;
import com.capiq.entity.User;
import com.capiq.repository.SkillRepository;
import com.capiq.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillService(
            SkillRepository skillRepository,
            UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Skill addSkill(String email, String name) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Skill name cannot be empty");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        String skillName = name.trim();

        if (skillRepository.existsByUserIdAndNameIgnoreCase(
                user.getId(), skillName)) {
            throw new IllegalArgumentException("Skill already exists");
        }

        Skill skill = new Skill(skillName, user);

        return skillRepository.save(skill);
    }

    @Transactional(readOnly = true)
    public List<Skill> getSkills(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return skillRepository.findByUserId(user.getId());
    }

    @Transactional
    public void deleteSkill(String email, Long skillId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Skill not found"));

        if (!skill.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You cannot delete another user's skill");
        }

        skillRepository.delete(skill);
    }
}
