package com.dusabe.controller;

import com.dusabe.dto.UpdateVerificationStatusRequest;
import com.dusabe.dto.VerificationDTO;
import com.dusabe.entity.AuditLog;
import com.dusabe.entity.Verification;
import com.dusabe.repository.AuditLogRepository;
import com.dusabe.repository.VerificationRepository;
import com.dusabe.service.EmailService;
import com.dusabe.service.NotificationService;
import com.dusabe.service.VerificationService;
import com.dusabe.repository.CredentialRepository;
import com.dusabe.entity.User;
import com.dusabe.entity.Credential;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VerificationController {

    private final VerificationService service;
    private final VerificationRepository verificationRepository;
    private final CredentialRepository credentialRepository;
    private final AuditLogRepository auditLogRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    public VerificationController(VerificationService service,
                                  VerificationRepository verificationRepository,
                                  CredentialRepository credentialRepository,
                                  AuditLogRepository auditLogRepository,
                                  EmailService emailService,
                                  NotificationService notificationService) {
        this.service = service;
        this.verificationRepository = verificationRepository;
        this.credentialRepository = credentialRepository;
        this.auditLogRepository = auditLogRepository;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYER') or hasRole('ALUMNI')")
    public List<Verification> getAllVerifications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer year) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        boolean isAlumni = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ALUMNI"));

        if (isAlumni) {
            return verificationRepository.findByCredentialStudentAlumniUserUsername(username);
        }

        if (status != null || year != null) {
            return verificationRepository.searchVerifications(status, year);
        }
        return service.getAllVerifications();
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ALUMNI') or hasRole('ADMIN')")
    public Verification createVerification(@Valid @RequestBody VerificationDTO dto) {
        Credential credential = credentialRepository.findById(dto.getCredential_id())
                .orElseThrow(() -> new RuntimeException("Credential not found with ID: " + dto.getCredential_id()));

        Verification verification = new Verification();
        verification.setCredential(credential);
        verification.setStatus("PENDING");
        verification.setRequest_date(java.time.LocalDateTime.now());
        
        Verification saved = service.saveVerification(verification);
        auditLogRepository.save(new AuditLog("CREATE_VERIFICATION", 
            "Verification requested for Serial: " + credential.getSerial_number() + " (ID: " + dto.getCredential_id() + ")"));
        return saved;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYER') or hasRole('ALUMNI')")
    public Verification getVerification(@PathVariable Long id) {
        return service.getVerificationById(id);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Verification updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateVerificationStatusRequest request) {
        Verification verification = service.getVerificationById(id);
        if (verification != null) {
            verification.setStatus(request.getStatus());
            Verification saved = service.saveVerification(verification);

            auditLogRepository.save(new AuditLog("UPDATE_STATUS", "Verification ID " + id + " status changed to " + request.getStatus()));

            // Send email notification if status is APPROVED or REJECTED
            try {
                if ("APPROVED".equals(request.getStatus()) || "REJECTED".equals(request.getStatus())) {
                    String serialNumber = (saved.getCredential() != null) ? saved.getCredential().getSerial_number() : "N/A";
                    // Attempt to get email from credential -> student -> alumni chain
                    String recipientEmail = null;
                    if (saved.getCredential() != null && saved.getCredential().getStudent() != null) {
                        var student = saved.getCredential().getStudent();
                        if (student.getAlumni() != null && student.getAlumni().getEmail() != null) {
                            recipientEmail = student.getAlumni().getEmail();
                        }
                    }
                    if (recipientEmail != null) {
                        emailService.sendVerificationStatusEmail(recipientEmail, request.getStatus(), serialNumber);
                    }

                    // ── In-App Notification ──
                    if (saved.getCredential() != null && saved.getCredential().getStudent() != null) {
                        var student = saved.getCredential().getStudent();
                        if (student.getAlumni() != null && student.getAlumni().getUser() != null) {
                            User alumniUser = student.getAlumni().getUser();
                            String message = "Your credential [" + serialNumber + "] status has been updated to: " + request.getStatus();
                            notificationService.createNotification(alumniUser, message);
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to send status update notification: " + e.getMessage());
            }

            return saved;
        }
        return null;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteVerification(@PathVariable Long id) {
        service.deleteVerification(id);
        auditLogRepository.save(new AuditLog("DELETE_VERIFICATION", "Verification ID " + id + " deleted"));
    }
}