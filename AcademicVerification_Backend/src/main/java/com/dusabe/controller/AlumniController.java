package com.dusabe.controller;

import com.dusabe.dto.AlumniDTO;
import com.dusabe.entity.Alumni;
import com.dusabe.service.AlumniService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni")
public class AlumniController {

    private final AlumniService service;

    public AlumniController(AlumniService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ALUMNI')")
    public List<Alumni> getAllAlumni() {
        return service.getAllAlumni();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Alumni createAlumni(@Valid @RequestBody AlumniDTO alumniDTO) {
        Alumni alumni = new Alumni();
        alumni.setGrad_year(alumniDTO.getGrad_year());
        alumni.setCareer_info(alumniDTO.getCareer_info());
        alumni.setCurrent_employer(alumniDTO.getCurrent_employer());
        alumni.setPosition(alumniDTO.getPosition());
        // Service would normally lookup student from DB and attach it if needed, we skip for simplicity
        return service.saveAlumni(alumni);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ALUMNI')")
    public Alumni updateAlumni(@PathVariable Long id, @Valid @RequestBody AlumniDTO alumniDTO) {
        Alumni alumni = new Alumni();
        alumni.setAlumni_id(id);
        alumni.setGrad_year(alumniDTO.getGrad_year());
        alumni.setCareer_info(alumniDTO.getCareer_info());
        alumni.setCurrent_employer(alumniDTO.getCurrent_employer());
        alumni.setPosition(alumniDTO.getPosition());
        return service.saveAlumni(alumni);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAlumni(@PathVariable Long id) {
        service.deleteAlumni(id);
    }
}