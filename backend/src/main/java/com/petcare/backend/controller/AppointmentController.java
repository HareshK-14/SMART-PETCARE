package com.petcare.backend.controller;

import com.petcare.backend.model.Appointment;
import com.petcare.backend.model.Pet;
import com.petcare.backend.model.User;
import com.petcare.backend.model.VetProfile;
import com.petcare.backend.repository.AppointmentRepository;
import com.petcare.backend.repository.PetRepository;
import com.petcare.backend.repository.UserRepository;
import com.petcare.backend.repository.VetProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VetProfileRepository vetProfileRepository;

    @Autowired
    private PetRepository petRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @GetMapping("/owner")
    public ResponseEntity<?> getOwnerAppointments() {
        User user = getCurrentUser();
        if(user == null) return ResponseEntity.badRequest().body("Unauthorized");

        List<Appointment> appointments = appointmentRepository.findByOwnerId(user.getId());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/vet")
    public ResponseEntity<?> getVetAppointments() {
        User user = getCurrentUser();
        if(user == null) return ResponseEntity.badRequest().body("Unauthorized");

        Optional<VetProfile> vetProfile = vetProfileRepository.findByUserId(user.getId());
        if(vetProfile.isEmpty()) return ResponseEntity.badRequest().body("Vet profile not found");

        List<Appointment> appointments = appointmentRepository.findByVetProfileId(vetProfile.get().getId());
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest req) {
        User user = getCurrentUser();
        if(user == null) return ResponseEntity.badRequest().body("Unauthorized");

        Optional<Pet> pet = petRepository.findById(req.getPetId());
        Optional<VetProfile> vet = vetProfileRepository.findById(req.getVetId());

        if(pet.isEmpty() || vet.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid Pet or Vet ID");
        }

        Appointment appt = new Appointment();
        appt.setOwner(user);
        appt.setPet(pet.get());
        appt.setVetProfile(vet.get());
        appt.setReasonForVisit(req.getReason());
        appt.setStatus("PENDING");
        // In a real scenario, map VetSlot here as well

        appointmentRepository.save(appt);
        return ResponseEntity.ok(appt);
    }

    // Inner class for simple mapping
    static class AppointmentRequest {
        private Long petId;
        private Long vetId;
        private String reason;
        
        public Long getPetId() { return petId; }
        public void setPetId(Long petId) { this.petId = petId; }
        public Long getVetId() { return vetId; }
        public void setVetId(Long vetId) { this.vetId = vetId; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
