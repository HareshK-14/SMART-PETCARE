package com.petcare.backend.controller;

import com.petcare.backend.model.User;
import com.petcare.backend.model.UserProfile;
import com.petcare.backend.model.VetProfile;
import com.petcare.backend.repository.UserProfileRepository;
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

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/vets")
public class VetController {

    @Autowired
    private VetProfileRepository vetProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private FileStorageService fileStorageService;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping("/verified")
    public ResponseEntity<?> getVerifiedVets() {
        List<VetProfile> vets = vetProfileRepository.findByIsVerifiedByAdminTrue();
        return ResponseEntity.ok(vets);
    }

    @PostMapping("/setup-profile")
    public ResponseEntity<?> setupProfile(
            @RequestParam("specialization") String specialization,
            @RequestParam("experienceYears") Integer experienceYears,
            @RequestParam("clinicName") String clinicName,
            @RequestParam("clinicAddress") String clinicAddress,
            @RequestParam("consultationFee") BigDecimal consultationFee,
            @RequestParam(value = "verificationDoc", required = false) MultipartFile verificationDoc) {

        User user = getCurrentUser();
        if(user == null) return ResponseEntity.badRequest().body("Unauthorized");

        Optional<VetProfile> existing = vetProfileRepository.findByUserId(user.getId());
        VetProfile vetProfile = existing.orElse(new VetProfile());

        vetProfile.setUser(user);
        vetProfile.setSpecialization(specialization);
        vetProfile.setExperienceYears(experienceYears);
        vetProfile.setClinicName(clinicName);
        vetProfile.setClinicAddress(clinicAddress);
        vetProfile.setConsultationFee(consultationFee);
        vetProfile.setIsVerifiedByAdmin(false); // Reset to pending on new submission

        if (verificationDoc != null && !verificationDoc.isEmpty()) {
            String fileName = fileStorageService.storeFile(verificationDoc);
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/files/download/")
                    .path(fileName)
                    .toUriString();
            vetProfile.setDocumentProofUrl(fileDownloadUri);
        }

        vetProfileRepository.save(vetProfile);
        return ResponseEntity.ok(Map.of("message", "Profile submitted for approval"));
    }

    // PUT /api/vets/profile — update existing profile fields, optionally re-submit for approval
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<VetProfile> profileOpt = vetProfileRepository.findByUserId(user.getId());
        VetProfile vp = profileOpt.orElse(new VetProfile());
        vp.setUser(user);

        if (body.containsKey("specialization"))
            vp.setSpecialization((String) body.get("specialization"));
        if (body.containsKey("clinicName"))
            vp.setClinicName((String) body.get("clinicName"));
        if (body.containsKey("clinicAddress"))
            vp.setClinicAddress((String) body.get("clinicAddress"));
        if (body.containsKey("experienceYears")) {
            Object exp = body.get("experienceYears");
            vp.setExperienceYears(exp instanceof Integer ? (Integer) exp : ((Number) exp).intValue());
        }
        if (body.containsKey("consultationFee")) {
            Object fee = body.get("consultationFee");
            vp.setConsultationFee(new BigDecimal(fee.toString()));
        }

        // If resubmit=true, reset approval so admin reviews again
        Boolean resubmit = (Boolean) body.getOrDefault("resubmit", false);
        if (Boolean.TRUE.equals(resubmit)) {
            vp.setIsVerifiedByAdmin(false);
        }

        vetProfileRepository.save(vp);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    // GET /api/vets/my-profile — returns the current vet's full profile with user info
    @GetMapping("/my-profile")
    public ResponseEntity<?> getMyProfile() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<VetProfile> profileOpt = vetProfileRepository.findByUserId(user.getId());
        if (profileOpt.isEmpty()) return ResponseEntity.notFound().build();

        VetProfile vp = profileOpt.get();

        Map<String, Object> result = new HashMap<>();
        result.put("id",              vp.getId());
        result.put("email",           user.getEmail());
        result.put("specialization",  vp.getSpecialization()  != null ? vp.getSpecialization() : "");
        result.put("clinic",          vp.getClinicName()      != null ? vp.getClinicName()      : "");
        result.put("clinicName",      vp.getClinicName()      != null ? vp.getClinicName()      : "");
        result.put("clinicAddress",   vp.getClinicAddress()   != null ? vp.getClinicAddress()   : "");
        result.put("location",        vp.getClinicAddress()   != null ? vp.getClinicAddress()   : "");
        result.put("experienceYears", vp.getExperienceYears() != null ? vp.getExperienceYears() : 0);
        result.put("experience",      vp.getExperienceYears() != null ? vp.getExperienceYears() : 0);
        result.put("consultationFee", vp.getConsultationFee() != null ? vp.getConsultationFee() : 0);
        result.put("fee",             vp.getConsultationFee() != null ? vp.getConsultationFee() : 0);
        result.put("documentProofUrl",vp.getDocumentProofUrl()!= null ? vp.getDocumentProofUrl(): "");
        result.put("status",          Boolean.TRUE.equals(vp.getIsVerifiedByAdmin()) ? "approved" : "pending");
        result.put("license",         "LIC-" + String.format("%03d", vp.getId()));

        // Name from user_profiles
        Optional<UserProfile> upOpt = userProfileRepository.findByUserId(user.getId());
        if (upOpt.isPresent()) {
            UserProfile up = upOpt.get();
            result.put("name",  up.getFullName() != null ? up.getFullName() : user.getEmail());
            result.put("phone", up.getPhone()    != null ? up.getPhone()    : "");
            result.put("city",  up.getCity()     != null ? up.getCity()     : "");
            result.put("bio",   "");
        } else {
            result.put("name",  user.getEmail());
            result.put("phone", "");
            result.put("city",  "");
            result.put("bio",   "");
        }

        return ResponseEntity.ok(result);
    }
}
