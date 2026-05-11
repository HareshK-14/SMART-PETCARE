package com.petcare.backend.repository;

import com.petcare.backend.model.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {
    List<HealthMetric> findByPetIdOrderByRecordedDateAsc(Long petId);
}
