package com.petcare.backend.controller;

import com.petcare.backend.model.HealthAlert;
import com.petcare.backend.model.HealthMetric;
import com.petcare.backend.model.Pet;
import com.petcare.backend.model.User;
import com.petcare.backend.repository.HealthAlertRepository;
import com.petcare.backend.repository.HealthMetricRepository;
import com.petcare.backend.repository.PetRepository;
import com.petcare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private HealthMetricRepository healthMetricRepository;

    @Autowired
    private HealthAlertRepository healthAlertRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping("/metrics/{petId}")
    public ResponseEntity<?> getMetrics(@PathVariable Long petId) {
        User user = getCurrentUser();
        if(user == null) return ResponseEntity.badRequest().body("Unauthorized");

        Optional<Pet> pet = petRepository.findById(petId);
        if(pet.isEmpty() || !pet.get().getOwner().getId().equals(user.getId())) {
             return ResponseEntity.badRequest().body("Invalid Pet ID");
        }

        List<HealthMetric> metrics = healthMetricRepository.findByPetIdOrderByRecordedDateAsc(petId);
        return ResponseEntity.ok(metrics);
    }

    @PostMapping("/metrics")
    public ResponseEntity<?> addMetric(@RequestBody HealthMetric metricReq) {
        User user = getCurrentUser();
        if(user == null) return ResponseEntity.badRequest().body("Unauthorized");
        
        // Safety check pet ownership
        Optional<Pet> pet = petRepository.findById(metricReq.getPet().getId());
        if(pet.isEmpty() || !pet.get().getOwner().getId().equals(user.getId())) {
             return ResponseEntity.badRequest().body("Invalid Pet operations");
        }

        if(metricReq.getRecordedDate() == null) {
            metricReq.setRecordedDate(LocalDate.now());
        }

        healthMetricRepository.save(metricReq);
        return ResponseEntity.ok(metricReq);
    }

    @GetMapping("/alerts/{petId}")
    public ResponseEntity<?> getAlerts(@PathVariable Long petId) {
        // Return unread alerts for a certain pet
        List<HealthAlert> alerts = healthAlertRepository.findByPetIdAndIsReadFalse(petId);
        return ResponseEntity.ok(alerts);
    }
}
