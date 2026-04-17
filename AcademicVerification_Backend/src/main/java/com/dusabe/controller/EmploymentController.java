package com.dusabe.controller;

import com.dusabe.entity.Alumni;
import com.dusabe.entity.Employment;
import com.dusabe.entity.User;
import com.dusabe.repository.AlumniRepository;
import com.dusabe.repository.EmploymentRepository;
import com.dusabe.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni/employment")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EmploymentController {

    private final EmploymentRepository employmentRepository;
    private final AlumniRepository alumniRepository;
    private final UserRepository userRepository;

    public EmploymentController(EmploymentRepository employmentRepository, 
                                AlumniRepository alumniRepository, 
                                UserRepository userRepository) {
        this.employmentRepository = employmentRepository;
        this.alumniRepository = alumniRepository;
        this.userRepository = userRepository;
    }

    private Alumni getCurrentAlumni() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return alumniRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));
    }

    @GetMapping
    public List<Employment> getHistory() {
        return employmentRepository.findByAlumni(getCurrentAlumni());
    }

    @PostMapping
    public Employment create(@RequestBody Employment employment) {
        employment.setAlumni(getCurrentAlumni());
        return employmentRepository.save(employment);
    }

    @PutMapping("/{id}")
    public Employment update(@PathVariable Long id, @RequestBody Employment details) {
        Employment employment = employmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employment not found"));
        
        // Ensure the alumni owns this entry
        if (!employment.getAlumni().getAlumni_id().equals(getCurrentAlumni().getAlumni_id())) {
            throw new RuntimeException("Unauthorized");
        }

        employment.setEmployer(details.getEmployer());
        employment.setJobTitle(details.getJobTitle());
        employment.setStartDate(details.getStartDate());
        employment.setEndDate(details.getEndDate());
        employment.setDescription(details.getDescription());

        return employmentRepository.save(employment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Employment employment = employmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employment not found"));
        
        if (!employment.getAlumni().getAlumni_id().equals(getCurrentAlumni().getAlumni_id())) {
            throw new RuntimeException("Unauthorized");
        }

        employmentRepository.delete(employment);
    }
}
