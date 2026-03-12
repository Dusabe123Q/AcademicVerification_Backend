package com.dusabe.controller;

import com.dusabe.entity.Verification;
import com.dusabe.service.VerificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/verifications")
public class VerificationController {

    private final VerificationService service;

    public VerificationController(VerificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Verification> getAllVerifications() {
        return service.getAllVerifications();
    }

    @PostMapping
    public Verification createVerification(@RequestBody Verification verification) {
        return service.saveVerification(verification);
    }

    @GetMapping("/{id}")
    public Verification getVerification(@PathVariable Long id) {
        return service.getVerificationById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteVerification(@PathVariable Long id) {
        service.deleteVerification(id);
    }

}