package com.petcare.backend.config;

import com.petcare.backend.model.Role;
import com.petcare.backend.model.User;
import com.petcare.backend.model.UserProfile;
import com.petcare.backend.repository.UserProfileRepository;
import com.petcare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL = "hareeshraj15@gmail.com";
    private static final String ADMIN_PASSWORD = "Haresh@2";

    @Override
    public void run(ApplicationArguments args) {
        // ── Seed admin account ────────────────────────────────────────────────
        if (!userRepository.existsByEmail(ADMIN_EMAIL)) {
            User admin = new User();
            admin.setEmail(ADMIN_EMAIL);
            admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            admin.setRole(Role.ADMIN);
            admin.setIsEmailVerified(true); // Admin bypass verification
            User saved = userRepository.save(admin);

            UserProfile profile = new UserProfile();
            profile.setUser(saved);
            profile.setFullName("Hareesh Admin");
            userProfileRepository.save(profile);

            System.out.println("✅ Admin account seeded: " + ADMIN_EMAIL);
        } else {
            // Ensure admin role and verification are set even if user existed
            userRepository.findByEmail(ADMIN_EMAIL).ifPresent(admin -> {
                boolean changed = false;
                if (admin.getRole() != Role.ADMIN) {
                    admin.setRole(Role.ADMIN);
                    changed = true;
                }
                if (Boolean.FALSE.equals(admin.getIsEmailVerified())) {
                    admin.setIsEmailVerified(true);
                    changed = true;
                }
                if (changed) {
                    userRepository.save(admin);
                    System.out.println("✅ Admin account updated: " + ADMIN_EMAIL);
                } else {
                    System.out.println("✅ Admin account already exists: " + ADMIN_EMAIL);
                }
            });
        }
    }
}
