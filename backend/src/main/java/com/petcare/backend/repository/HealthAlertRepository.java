package com.petcare.backend.repository;

import com.petcare.backend.model.HealthAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthAlertRepository extends JpaRepository<HealthAlert, Long> {
    List<HealthAlert> findByPetId(Long petId);
    List<HealthAlert> findByPetIdAndIsReadFalse(Long petId);
}
