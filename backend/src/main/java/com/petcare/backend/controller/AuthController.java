package com.petcare.backend.controller;

import com.petcare.backend.dto.request.LoginRequest;
import com.petcare.backend.dto.request.SignupRequest;
import com.petcare.backend.dto.response.JwtResponse;
import com.petcare.backend.dto.response.MessageResponse;
import com.petcare.backend.model.EmailVerification;
import com.petcare.backend.model.Role;
import com.petcare.backend.model.User;
import com.petcare.backend.model.UserProfile;
import com.petcare.backend.repository.EmailVerificationRepository;
import com.petcare.backend.repository.UserProfileRepository;
import com.petcare.backend.repository.UserRepository;
import com.petcare.backend.security.JwtUtils;
import com.petcare.backend.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    EmailVerificationRepository emailVerificationRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailService emailService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // Note: loadUserByUsername uses Email. Checking if verified happens within AuthenticationProvider logic (isEnabled)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User userDetails = (User) authentication.getPrincipal();     

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getRole().name()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        Role generatedRole = Role.OWNER;
        if(signUpRequest.getRole() != null && signUpRequest.getRole().equalsIgnoreCase("VET")) {
            generatedRole = Role.VET;
        }
        user.setRole(generatedRole);
        user.setIsEmailVerified(false); // Default to false for SMTP verification

        User savedUser = userRepository.save(user);

        // Create associated profile mapping
        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        profile.setFullName(signUpRequest.getFullName());
        profile.setPhone(signUpRequest.getPhone());
        userProfileRepository.save(profile);

        // Generate email verification token
        String token = UUID.randomUUID().toString();
        EmailVerification verificationToken = new EmailVerification();
        verificationToken.setUser(savedUser);
        verificationToken.setToken(token);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        emailVerificationRepository.save(verificationToken);

        // Send Email via Service
        try {
            emailService.sendVerificationEmail(savedUser, token);
        } catch(Exception e) {
            System.err.println("SMTP Error: " + e.getMessage() + ". User saved but email not sent. Check app password.");
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully! Please check your email to verify your account."));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmailPost(@RequestBody java.util.Map<String, String> payload) {
        String token = payload.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: No token provided."));
        }

        EmailVerification verificationToken = emailVerificationRepository.findByToken(token).orElse(null);
        if (verificationToken == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid verification link."));
        }
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            emailVerificationRepository.delete(verificationToken);
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Verification link has expired. Please register again."));
        }

        User user = verificationToken.getUser();
        user.setIsEmailVerified(true);
        userRepository.save(user);
        emailVerificationRepository.delete(verificationToken);

        return ResponseEntity.ok(new MessageResponse("Account successfully verified! You can now log in."));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: No token provided."));
        }

        EmailVerification verificationToken = emailVerificationRepository.findByToken(token).orElse(null);
        if (verificationToken == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid verification link."));
        }
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            emailVerificationRepository.delete(verificationToken);
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Verification link has expired. Please register again."));
        }

        User user = verificationToken.getUser();
        user.setIsEmailVerified(true);
        userRepository.save(user);
        emailVerificationRepository.delete(verificationToken);

        return ResponseEntity.ok(new MessageResponse("Email verified successfully"));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody java.util.Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email is required."));
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("No account found with this email."));
        }
        if (user.getIsEmailVerified() != null && user.getIsEmailVerified()) {
            return ResponseEntity.badRequest().body(new MessageResponse("This email is already verified."));
        }

        // Clean any old tokens
        emailVerificationRepository.findByUser(user).ifPresent(oldToken -> {
            emailVerificationRepository.delete(oldToken);
        });

        // Generate new token
        String token = UUID.randomUUID().toString();
        EmailVerification verificationToken = new EmailVerification();
        verificationToken.setUser(user);
        verificationToken.setToken(token);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        emailVerificationRepository.save(verificationToken);

        try {
            emailService.sendVerificationEmail(user, token);
        } catch(Exception e) {
            return ResponseEntity.internalServerError().body(new MessageResponse("Failed to send verification email. Please try again later."));
        }

        return ResponseEntity.ok(new MessageResponse("A new verification email has been sent to your inbox."));
    }
}
