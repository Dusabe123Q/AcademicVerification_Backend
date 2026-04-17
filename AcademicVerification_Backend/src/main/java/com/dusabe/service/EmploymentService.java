package com.dusabe.service;

import com.dusabe.entity.Alumni;
import com.dusabe.entity.Employment;
import com.dusabe.repository.EmploymentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmploymentService {

    private final EmploymentRepository repository;

    public EmploymentService(EmploymentRepository repository) {
        this.repository = repository;
    }

    public List<Employment> getEmploymentHistory(Alumni alumni) {
        return repository.findByAlumni(alumni);
    }

    public Employment saveEmployment(Employment employment) {
        return repository.save(employment);
    }

    public void deleteEmployment(Long id) {
        repository.deleteById(id);
    }

    public Employment getEmploymentById(Long id) {
        return repository.findById(id).orElse(null);
    }
}
