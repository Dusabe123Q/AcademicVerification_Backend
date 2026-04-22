package com.dusabe.service;

import com.dusabe.entity.Credential;
import com.dusabe.repository.CredentialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CredentialService {

    private final CredentialRepository repository;
    private final com.dusabe.repository.AuditLogRepository auditLogRepository;

    public CredentialService(CredentialRepository repository, com.dusabe.repository.AuditLogRepository auditLogRepository) {
        this.repository = repository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<Credential> getAllCredentials() {
        return repository.findAll();
    }

    public Credential saveCredential(Credential credential) {
        Credential saved = repository.save(credential);
        String action = credential.getCredential_id() == null ? "CREDENTIAL_ISSUE" : "CREDENTIAL_UPDATE";
        auditLogRepository.save(new com.dusabe.entity.AuditLog(action, "Credential record managed for Serial: " + credential.getSerial_number()));
        return saved;
    }

    public Credential getCredentialById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Credential getCredentialBySerialNumber(String serialNumber) {
        return repository.findBySerialNumber(serialNumber).orElse(null);
    }

    public void deleteCredential(Long id) {
        Credential c = repository.findById(id).orElse(null);
        String sn = (c != null) ? c.getSerial_number() : "ID: " + id;
        repository.deleteById(id);
        auditLogRepository.save(new com.dusabe.entity.AuditLog("CREDENTIAL_DELETE", "Credential revoked/deleted: " + sn));
    }
}