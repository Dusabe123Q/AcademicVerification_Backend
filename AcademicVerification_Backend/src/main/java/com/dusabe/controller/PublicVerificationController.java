package com.dusabe.controller;

import com.dusabe.entity.Credential;
import com.dusabe.service.CredentialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicVerificationController {

    private final CredentialService credentialService;

    public PublicVerificationController(CredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @GetMapping("/verify/{serialNumber}")
    public ResponseEntity<Map<String, Object>> verifyBySerial(@PathVariable String serialNumber) {
        Credential credential = credentialService.getCredentialBySerialNumber(serialNumber);

        Map<String, Object> response = new HashMap<>();
        if (credential == null) {
            response.put("valid", false);
            response.put("message", "Credential not found. This certificate may be invalid or does not exist.");
            return ResponseEntity.ok(response);
        }

        response.put("valid", true);
        response.put("serialNumber", credential.getSerial_number());
        response.put("credentialType", credential.getCredential_type());
        response.put("issueDate", credential.getIssue_date());
        response.put("studentName", credential.getStudent() != null ? credential.getStudent().getName() : "N/A");
        response.put("program", credential.getStudent() != null ? credential.getStudent().getProgram() : "N/A");
        response.put("message", "This credential is VALID and was issued by the institution.");
        return ResponseEntity.ok(response);
    }
}
