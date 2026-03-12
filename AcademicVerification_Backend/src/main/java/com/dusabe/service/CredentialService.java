package com.dusabe.service;

import com.dusabe.entity.Credential;
import com.dusabe.repository.CredentialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CredentialService {

    private final CredentialRepository repository;

    public CredentialService(CredentialRepository repository) {
        this.repository = repository;
    }

    public List<Credential> getAllCredentials() {
        return repository.findAll();
    }

    public Credential saveCredential(Credential credential) {
        return repository.save(credential);
    }

    public Credential getCredentialById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteCredential(Long id) {
        repository.deleteById(id);
    }
}