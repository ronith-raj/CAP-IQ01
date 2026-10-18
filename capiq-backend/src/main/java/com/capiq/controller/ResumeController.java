
package com.capiq.controller;

import com.capiq.dto.ResumeRequest;
import com.capiq.entity.Resume;
import com.capiq.entity.User;
import com.capiq.repository.ResumeRepository;
import com.capiq.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeController(
            ResumeRepository resumeRepository,
            UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getResume(Authentication authentication) {
        Optional<User> userOptional =
                userRepository.findByEmail(authentication.getName());

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Resume> resume =
                resumeRepository.findByUserId(userOptional.get().getId());

        if (resume.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(toResponse(resume.get()));
    }

    @PostMapping
    public ResponseEntity<?> saveResume(
            @RequestBody ResumeRequest request,
            Authentication authentication) {

        Optional<User> userOptional =
                userRepository.findByEmail(authentication.getName());

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();

        Resume resume = resumeRepository.findByUserId(user.getId())
                .orElseGet(Resume::new);

        resume.setUser(user);
        resume.setName(request.getName());
        resume.setHeadline(request.getHeadline());
        resume.setEmail(request.getEmail());
        resume.setPhone(request.getPhone());
        resume.setLocation(request.getLocation());
        resume.setLinkedin(request.getLinkedin());
        resume.setGithub(request.getGithub());
        resume.setSummary(request.getSummary());
        resume.setEducation(request.getEducation());
        resume.setCollege(request.getCollege());
        resume.setGraduation(request.getGraduation());
        resume.setExperience(request.getExperience());
        resume.setProjects(request.getProjects());
        resume.setSkills(request.getSkills());
        resume.setAchievements(request.getAchievements());

        Resume saved = resumeRepository.save(resume);

        return ResponseEntity.ok(toResponse(saved));
    }

    private ResumeRequest toResponse(Resume resume) {
        ResumeRequest response = new ResumeRequest();

        response.setName(resume.getName());
        response.setHeadline(resume.getHeadline());
        response.setEmail(resume.getEmail());
        response.setPhone(resume.getPhone());
        response.setLocation(resume.getLocation());
        response.setLinkedin(resume.getLinkedin());
        response.setGithub(resume.getGithub());
        response.setSummary(resume.getSummary());
        response.setEducation(resume.getEducation());
        response.setCollege(resume.getCollege());
        response.setGraduation(resume.getGraduation());
        response.setExperience(resume.getExperience());
        response.setProjects(resume.getProjects());
        response.setSkills(resume.getSkills());
        response.setAchievements(resume.getAchievements());

        return response;
    }
}
