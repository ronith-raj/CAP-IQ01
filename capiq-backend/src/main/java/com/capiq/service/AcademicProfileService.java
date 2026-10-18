
package com.capiq.service;

import com.capiq.entity.AcademicProfile;
import com.capiq.entity.User;
import com.capiq.repository.AcademicProfileRepository;
import com.capiq.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AcademicProfileService {

    private final AcademicProfileRepository academicProfileRepository;
    private final UserRepository userRepository;

    public AcademicProfileService(
            AcademicProfileRepository academicProfileRepository,
            UserRepository userRepository) {
        this.academicProfileRepository = academicProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AcademicProfile saveProfile(
            String email, AcademicProfile request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        AcademicProfile profile = academicProfileRepository
                .findByUserId(user.getId())
                .orElseGet(AcademicProfile::new);

        profile.setUser(user);

        if (request.getCollegeName() != null) {
            profile.setCollegeName(request.getCollegeName());
        }

        if (request.getDegree() != null) {
            profile.setDegree(request.getDegree());
        }

        if (request.getBranch() != null) {
            profile.setBranch(request.getBranch());
        }

        if (request.getSemester() != null) {
            profile.setSemester(request.getSemester());
        }

        if (request.getCgpa() != null) {
            profile.setCgpa(request.getCgpa());
        }

        if (request.getGraduationYear() != null) {
            profile.setGraduationYear(request.getGraduationYear());
        }

        if (request.getProfileName() != null) {
            profile.setProfileName(request.getProfileName());
        }

        if (request.getEmail() != null) {
            profile.setEmail(request.getEmail());
        }

        if (request.getPhone() != null) {
            profile.setPhone(request.getPhone());
        }

        if (request.getAbout() != null) {
            profile.setAbout(request.getAbout());
        }

        return academicProfileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public Optional<AcademicProfile> getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return academicProfileRepository.findByUserId(user.getId());
    }
}
