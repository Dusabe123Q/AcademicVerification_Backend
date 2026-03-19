package com.dusabe.controller;

import com.dusabe.dto.UpdateVerificationStatusRequest;
import com.dusabe.dto.VerificationDTO;
import com.dusabe.entity.AuditLog;
import com.dusabe.entity.Verification;
import com.dusabe.repository.AuditLogRepository;
import com.dusabe.repository.VerificationRepository;
import com.dusabe.service.VerificationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    private final VerificationService service;
    private final VerificationRepository verificationRepository;
    private final AuditLogRepository auditLogRepository;

    public VerificationController(VerificationService service, 
                                  VerificationRepository verificationRepository,
                                  AuditLogRepository auditLogRepository) {
        this.service = service;
        this.verificationRepository = verificationRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYER')")
    public List<Verification> getAllVerifications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer year) {
        
        if (status != null || year != null) {
            return verificationRepository.searchVerifications(status, year);
        }
        return service.getAllVerifications();
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public Verification createVerification(@Valid @RequestBody VerificationDTO dto) {
        Verification verification = new Verification();
        verification.setStatus("PENDING");
        // Service should attach credential based on dto.getCredential_id(), skipped for brevity here
        Verification saved = service.saveVerification(verification);
        auditLogRepository.save(new AuditLog("CREATE_VERIFICATION", "Verification requested for Credential ID: " + dto.getCredential_id()));
        return saved;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYER')")
    public Verification getVerification(@PathVariable Long id) {
        return service.getVerificationById(id);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Verification updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateVerificationStatusRequest request) {
        Verification verification = service.getVerificationById(id);
        if(verification != null) {
            verification.setStatus(request.getStatus());
            Verification saved = service.saveVerification(verification);
            
            auditLogRepository.save(new AuditLog("UPDATE_STATUS", "Verification ID " + id + " status changed to " + request.getStatus()));
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