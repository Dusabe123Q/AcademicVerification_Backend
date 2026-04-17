package com.dusabe.controller;

import com.dusabe.entity.Credential;
import com.dusabe.service.CredentialService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credentials")
public class CredentialController {

    private final CredentialService service;

    public CredentialController(CredentialService service) {
        this.service = service;
    }

    @GetMapping
    public List<Credential> getAllCredentials() {
        return service.getAllCredentials();
    }

    @PostMapping
    public Credential createCredential(@RequestBody Credential credential) {
        return service.saveCredential(credential);
    }

    @GetMapping("/verify")
    public Credential verifyCredential(@RequestParam String serialNumber) {
        return service.getCredentialBySerialNumber(serialNumber);
    }

    @GetMapping("/{id}")
    public Credential getCredential(@PathVariable Long id) {
        return service.getCredentialById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteCredential(@PathVariable Long id) {
        service.deleteCredential(id);
    }
}