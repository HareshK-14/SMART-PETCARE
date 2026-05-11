package com.petcare.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "vet_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VetProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vet_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 150)
    private String specialization;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "clinic_name", length = 150)
    private String clinicName;

    @Column(name = "clinic_address", columnDefinition = "TEXT")
    private String clinicAddress;

    @Column(name = "consultation_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Column(name = "document_proof_url", columnDefinition = "TEXT")
    private String documentProofUrl;

    @Column(name = "is_verified_by_admin")
    private Boolean isVerifiedByAdmin = false;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;
}
