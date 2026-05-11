package com.petcare.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "vaccinations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccine_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "vaccine_name", nullable = false, length = 150)
    private String vaccineName;

    @Column(name = "date_administered", nullable = false)
    private LocalDate dateAdministered;

    @Column(name = "next_due_date")
    private LocalDate nextDueDate;

    @Column(name = "certificate_url", columnDefinition = "TEXT")
    private String certificateUrl;
}
