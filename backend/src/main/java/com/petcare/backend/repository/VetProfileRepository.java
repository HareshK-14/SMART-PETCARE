package com.petcare.backend.repository;

import com.petcare.backend.model.VetProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VetProfileRepository extends JpaRepository<VetProfile, Long> {
    List<VetProfile> findByIsVerifiedByAdminTrue();
    Optional<VetProfile> findByUserId(Long userId);
}
