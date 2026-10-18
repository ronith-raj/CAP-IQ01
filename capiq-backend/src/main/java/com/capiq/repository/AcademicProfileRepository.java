
package com.capiq.repository;

import com.capiq.entity.AcademicProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AcademicProfileRepository
        extends JpaRepository<AcademicProfile, Long> {

    Optional<AcademicProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
