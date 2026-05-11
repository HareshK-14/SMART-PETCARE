package com.petcare.backend.repository;

import com.petcare.backend.model.EmailVerification;
import com.petcare.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByToken(String token);
    Optional<EmailVerification> findByUser(User user);
}
