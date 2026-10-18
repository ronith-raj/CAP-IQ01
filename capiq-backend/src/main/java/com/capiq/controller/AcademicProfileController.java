package com.capiq.controller;

import com.capiq.entity.AcademicProfile;
import com.capiq.service.AcademicProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/academic-profile")
public class AcademicProfileController {

    private final AcademicProfileService academicProfileService;

    public AcademicProfileController(
            AcademicProfileService academicProfileService) {
        this.academicProfileService = academicProfileService;
    }

    @PostMapping
    public ResponseEntity<?> saveProfile(
            @RequestBody AcademicProfile profile,
            Authentication authentication) {

        return ResponseEntity.ok(
                academicProfileService.saveProfile(
                        authentication.getName(), profile));
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {

        return academicProfileService
                .getProfile(authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}