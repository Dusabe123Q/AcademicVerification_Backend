package com.dusabe.service;

import com.dusabe.entity.Alumni;
import com.dusabe.repository.AlumniRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlumniService {

    private final AlumniRepository repository;

    public AlumniService(AlumniRepository repository) {
        this.repository = repository;
    }

    public List<Alumni> getAllAlumni() {
        return repository.findAll();
    }

    public Alumni saveAlumni(Alumni alumni) {
        return repository.save(alumni);
    }

    public Alumni getAlumniById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteAlumni(Long id) {
        repository.deleteById(id);
    }
}