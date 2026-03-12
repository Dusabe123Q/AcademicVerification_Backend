package com.dusabe.service;

import com.dusabe.entity.Verification;
import com.dusabe.repository.VerificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VerificationService {

    private final VerificationRepository repository;

    public VerificationService(VerificationRepository repository) {
        this.repository = repository;
    }

    public List<Verification> getAllVerifications() {
        return repository.findAll();
    }

    public Verification saveVerification(Verification verification) {
        return repository.save(verification);
    }

    public Verification getVerificationById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteVerification(Long id) {
        repository.deleteById(id);
    }
}