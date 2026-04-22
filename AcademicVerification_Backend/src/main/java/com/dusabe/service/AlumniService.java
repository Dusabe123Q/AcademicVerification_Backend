package com.dusabe.service;

import com.dusabe.entity.Alumni;
import com.dusabe.entity.User;
import com.dusabe.repository.AlumniRepository;
import com.dusabe.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AlumniService {

    private final AlumniRepository repository;
    private final UserRepository userRepository;
    private final com.dusabe.repository.AuditLogRepository auditLogRepository;

    public AlumniService(AlumniRepository repository, UserRepository userRepository, com.dusabe.repository.AuditLogRepository auditLogRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<Alumni> getAllAlumni() {
        return repository.findAll();
    }

    public Alumni saveAlumni(Alumni alumni) {
        Alumni saved = repository.save(alumni);
        String action = alumni.getAlumni_id() == null ? "ALUMNI_CREATE" : "ALUMNI_UPDATE";
        auditLogRepository.save(new com.dusabe.entity.AuditLog(action, "Alumni record modified for: " + alumni.getName()));
        return saved;
    }

    public Alumni getAlumniById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Alumni getAlumniByUsername(String username) {
        return repository.findByUserUsername(username).orElseGet(() -> {
            // Lazy create if it's an existing ALUMNI user but missing profile record
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null && "ALUMNI".equals(user.getRole().name())) {
                Alumni alumni = new Alumni();
                alumni.setUser(user);
                alumni.setName(user.getUsername());
                alumni.setEmail(user.getEmail());
                return repository.save(alumni);
            }
            return null;
        });
    }

    public void deleteAlumni(Long id) {
        Alumni a = repository.findById(id).orElse(null);
        String name = (a != null) ? a.getName() : "ID: " + id;
        repository.deleteById(id);
        auditLogRepository.save(new com.dusabe.entity.AuditLog("ALUMNI_DELETE", "Alumni record deleted: " + name));
    }
}