package com.petcare.backend.controller;

import com.petcare.backend.model.MedicalRecord;
import com.petcare.backend.model.Pet;
import com.petcare.backend.model.User;
import com.petcare.backend.model.VetProfile;
import com.petcare.backend.repository.PetRepository;
import com.petcare.backend.repository.UserRepository;
import com.petcare.backend.repository.VetProfileRepository;
import com.petcare.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medical")
public class MedicalController {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VetProfileRepository vetProfileRepository;

    @Autowired
    private FileStorageService fileStorageService;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping("/records/{petId}")
    public ResponseEntity<?> getPetRecords(@PathVariable Long petId) {
        // Find records strictly mapped via JPA Query
        List<MedicalRecord> records = entityManager.createQuery(
                "SELECT m FROM MedicalRecord m WHERE m.pet.id = :petId ORDER BY m.dateRecorded DESC", MedicalRecord.class)
                .setParameter("petId", petId)
                .getResultList();
        
        return ResponseEntity.ok(records);
    }

    @PostMapping("/add-record")
    @Transactional
    public ResponseEntity<?> addMedicalRecord(
            @RequestParam("petId") Long petId,
            @RequestParam("title") String title,
            @RequestParam("diagnosis") String diagnosis,
            @RequestParam("treatmentPlan") String treatmentPlan,
            @RequestParam(value = "document", required = false) MultipartFile document) {

        User user = getCurrentUser();
        if(user == null) return ResponseEntity.badRequest().body("Unauthorized");

        Optional<VetProfile> vet = vetProfileRepository.findByUserId(user.getId());
        if(vet.isEmpty()) return ResponseEntity.badRequest().body("Must be a registered veterinarian.");

        Optional<Pet> pet = petRepository.findById(petId);
        if(pet.isEmpty()) return ResponseEntity.badRequest().body("Invalid Pet ID.");

        MedicalRecord record = new MedicalRecord();
        record.setPet(pet.get());
        record.setVetProfile(vet.get());
        record.setTitle(title);
        record.setDiagnosis(diagnosis);
        record.setTreatmentPlan(treatmentPlan);

        if (document != null && !document.isEmpty()) {
            String fileName = fileStorageService.storeFile(document);
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/files/download/")
                    .path(fileName)
                    .toUriString();
            record.setDocumentUrl(fileDownloadUri);
        }

        entityManager.persist(record);
        return ResponseEntity.ok(record);
    }
}
