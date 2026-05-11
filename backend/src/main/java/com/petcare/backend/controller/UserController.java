package com.petcare.backend.controller;

import com.petcare.backend.model.User;
import com.petcare.backend.model.UserProfile;
import com.petcare.backend.repository.UserProfileRepository;
import com.petcare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    // GET /api/users/profile — returns the logged-in user's profile
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("email", user.getEmail());
        map.put("role", user.getRole().name());

        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(user.getId());
        if (profileOpt.isPresent()) {
            UserProfile p = profileOpt.get();
            map.put("fullName", p.getFullName() != null ? p.getFullName() : "");
            map.put("phone", p.getPhone() != null ? p.getPhone() : "");
            map.put("city", p.getCity() != null ? p.getCity() : "");
            map.put("address", p.getAddress() != null ? p.getAddress() : "");
        } else {
            map.put("fullName", "");
            map.put("phone", "");
            map.put("city", "");
            map.put("address", "");
        }

        return ResponseEntity.ok(map);
    }

    // PUT /api/users/profile — updates the logged-in user's profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateMyProfile(@RequestBody Map<String, String> form) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(user.getId());
        UserProfile profile = profileOpt.orElse(new UserProfile());
        profile.setUser(user);
        profile.setFullName(form.getOrDefault("fullName", ""));
        profile.setPhone(form.getOrDefault("phone", ""));
        profile.setCity(form.getOrDefault("city", ""));
        profile.setAddress(form.getOrDefault("address", ""));
        userProfileRepository.save(profile);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }
}
