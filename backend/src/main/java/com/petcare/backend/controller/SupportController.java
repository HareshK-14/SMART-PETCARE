package com.petcare.backend.controller;

import com.petcare.backend.model.HelpSupport;
import com.petcare.backend.model.User;
import com.petcare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/support")
public class SupportController {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> createTicket(@RequestBody HelpSupport request) {
        User user = getCurrentUser();
        if(user == null) return ResponseEntity.badRequest().body("Unauthorized");

        request.setUser(user);
        request.setStatus("OPEN");
        
        entityManager.persist(request);
        return ResponseEntity.ok(request);
    }
}
