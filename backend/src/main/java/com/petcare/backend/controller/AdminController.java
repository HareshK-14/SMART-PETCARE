package com.petcare.backend.controller;

import com.petcare.backend.model.User;
import com.petcare.backend.model.UserProfile;
import com.petcare.backend.model.VetProfile;
import com.petcare.backend.repository.UserProfileRepository;
import com.petcare.backend.repository.UserRepository;
import com.petcare.backend.repository.VetProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private VetProfileRepository vetProfileRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> response = users.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("role", u.getRole().name());
            
            Optional<UserProfile> profile = userProfileRepository.findByUserId(u.getId());
            if (profile.isPresent()) {
                map.put("name", profile.get().getFullName());
                map.put("phone", profile.get().getPhone());
                map.put("city", profile.get().getCity());
                map.put("address", profile.get().getAddress());
            } else {
                map.put("name", "");
                map.put("phone", "");
                map.put("city", "");
                map.put("address", "");
            }
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vets")
    public ResponseEntity<?> getAllVetApplications() {
        // Fetch ALL users with role VET (not just those with a VetProfile)
        List<User> vetUsers = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && u.getRole().name().equals("VET"))
                .collect(Collectors.toList());

        List<Map<String, Object>> response = vetUsers.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();

            // Basic user data
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("role", u.getRole().name());
            map.put("createdAt", u.getCreatedAt());

            // Name and contact from user_profiles
            Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(u.getId());
            if (profileOpt.isPresent()) {
                UserProfile p = profileOpt.get();
                map.put("name", p.getFullName() != null ? p.getFullName() : u.getEmail());
                map.put("phone", p.getPhone() != null ? p.getPhone() : "");
                map.put("city",  p.getCity()  != null ? p.getCity()  : "");
            } else {
                map.put("name", u.getEmail());
                map.put("phone", "");
                map.put("city", "");
            }

            // VetProfile data (specialization, clinic, documents, approval status)
            Optional<VetProfile> vetProfileOpt = vetProfileRepository.findByUserId(u.getId());
            if (vetProfileOpt.isPresent()) {
                VetProfile vp = vetProfileOpt.get();
                map.put("vetProfileId",    vp.getId());
                map.put("specialization",  vp.getSpecialization() != null ? vp.getSpecialization() : "");
                map.put("clinic",          vp.getClinicName()     != null ? vp.getClinicName()     : "");
                map.put("clinicAddress",   vp.getClinicAddress()  != null ? vp.getClinicAddress()  : "");
                map.put("experience",      vp.getExperienceYears()!= null ? vp.getExperienceYears(): 0);
                map.put("fee",             vp.getConsultationFee()!= null ? vp.getConsultationFee(): 0);
                map.put("license",         "LIC-" + String.format("%03d", vp.getId()));
                map.put("status",          Boolean.TRUE.equals(vp.getIsVerifiedByAdmin()) ? "approved" : "pending");
                map.put("documentProofUrl",vp.getDocumentProofUrl() != null ? vp.getDocumentProofUrl() : "");
                map.put("hasProfile",      true);
                map.put("submittedAt",     u.getCreatedAt());
            } else {
                // VET user but hasn't submitted profile yet
                map.put("vetProfileId",    null);
                map.put("specialization",  "");
                map.put("clinic",          "");
                map.put("clinicAddress",   "");
                map.put("experience",      0);
                map.put("fee",             0);
                map.put("license",         "");
                map.put("status",          "no-profile");
                map.put("documentProofUrl","");
                map.put("hasProfile",      false);
                map.put("submittedAt",     u.getCreatedAt());
            }

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/vets/{id}/approve")
    public ResponseEntity<?> approveVet(@PathVariable Long id) {
        Optional<VetProfile> profile = vetProfileRepository.findById(id);
        if (profile.isEmpty()) return ResponseEntity.notFound().build();
        
        VetProfile vp = profile.get();
        vp.setIsVerifiedByAdmin(true);
        vetProfileRepository.save(vp);
        return ResponseEntity.ok("Vet approved");
    }

    @PostMapping("/vets/{id}/reject")
    public ResponseEntity<?> rejectVet(@PathVariable Long id) {
        Optional<VetProfile> profile = vetProfileRepository.findById(id);
        if (profile.isEmpty()) return ResponseEntity.notFound().build();
        
        VetProfile vp = profile.get();
        vp.setIsVerifiedByAdmin(false);
        vetProfileRepository.save(vp);
        return ResponseEntity.ok("Vet rejected/revoked");
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> form) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        User user = userOpt.get();
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(id);
        UserProfile profile = profileOpt.orElse(new UserProfile());
        profile.setUser(user);
        profile.setFullName(form.getOrDefault("name", ""));
        profile.setPhone(form.getOrDefault("phone", ""));
        profile.setCity(form.getOrDefault("city", ""));
        profile.setAddress(form.getOrDefault("address", ""));
        userProfileRepository.save(profile);
        
        return ResponseEntity.ok("User updated");
    }
}
