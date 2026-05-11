package com.petcare.backend.controller;

import com.petcare.backend.model.Pet;
import com.petcare.backend.model.User;
import com.petcare.backend.repository.PetRepository;
import com.petcare.backend.repository.UserRepository;
import com.petcare.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Helper to get logged in user
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping("/my-pets")
    public ResponseEntity<?> getMyPets() {
        User user = getCurrentUser();
        if(user == null) return ResponseEntity.badRequest().body("Unauthorized");
        
        List<Pet> pets = petRepository.findByOwnerId(user.getId());
        return ResponseEntity.ok(pets);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPet(
            @RequestParam("name") String name,
            @RequestParam("species") String species,
            @RequestParam(value = "breed", required = false) String breed,
            @RequestParam(value = "ageYears", required = false) BigDecimal ageYears,
            @RequestParam(value = "weightKg", required = false) BigDecimal weightKg,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        User user = getCurrentUser();
        if(user == null) return ResponseEntity.badRequest().body("Unauthorized");

        Pet pet = new Pet();
        pet.setOwner(user);
        pet.setName(name);
        pet.setSpecies(species);
        pet.setBreed(breed);
        pet.setAgeYears(ageYears);
        pet.setWeightKg(weightKg);

        if (image != null && !image.isEmpty()) {
            String fileName = fileStorageService.storeFile(image);
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/files/download/")
                    .path(fileName)
                    .toUriString();
            pet.setImageUrl(fileDownloadUri);
        }

        petRepository.save(pet);
        return ResponseEntity.ok(pet);
    }
}
