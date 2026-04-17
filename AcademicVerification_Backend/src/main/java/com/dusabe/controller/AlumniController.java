package com.dusabe.controller;

import com.dusabe.dto.AlumniDTO;
import com.dusabe.entity.Alumni;
import com.dusabe.service.AlumniService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/alumni")
@CrossOrigin(origins = "*", allowedHeaders = "*")
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

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_ALUMNI')")
    public Alumni getMyProfile(Principal principal) {
        return service.getAlumniByUsername(principal.getName());
    }

    @PutMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_ALUMNI')")
    public Alumni updateMyProfile(Principal principal, @Valid @RequestBody AlumniDTO alumniDTO) {
        Alumni existing = service.getAlumniByUsername(principal.getName());
        if (existing == null) {
            throw new RuntimeException("Alumni profile not found");
        }
        existing.setGrad_year(alumniDTO.getGrad_year());
        existing.setCareer_info(alumniDTO.getCareer_info());
        existing.setCurrent_employer(alumniDTO.getCurrent_employer());
        existing.setPosition(alumniDTO.getPosition());
        existing.setName(alumniDTO.getName());
        existing.setEmail(alumniDTO.getEmail());
        existing.setPhone(alumniDTO.getPhone());
        return service.saveAlumni(existing);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Alumni createAlumni(@Valid @RequestBody AlumniDTO alumniDTO) {
        Alumni alumni = new Alumni();
        alumni.setGrad_year(alumniDTO.getGrad_year());
        alumni.setCareer_info(alumniDTO.getCareer_info());
        alumni.setCurrent_employer(alumniDTO.getCurrent_employer());
        alumni.setPosition(alumniDTO.getPosition());
        alumni.setName(alumniDTO.getName());
        alumni.setEmail(alumniDTO.getEmail());
        alumni.setPhone(alumniDTO.getPhone());
        // Service would normally lookup student from DB and attach it if needed, we skip for simplicity
        return service.saveAlumni(alumni);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Alumni updateAlumni(@PathVariable Long id, @Valid @RequestBody AlumniDTO alumniDTO) {
        Alumni existing = service.getAlumniById(id);
        if (existing == null) {
            throw new RuntimeException("Alumni not found");
        }
        existing.setGrad_year(alumniDTO.getGrad_year());
        existing.setCareer_info(alumniDTO.getCareer_info());
        existing.setCurrent_employer(alumniDTO.getCurrent_employer());
        existing.setPosition(alumniDTO.getPosition());
        existing.setName(alumniDTO.getName());
        existing.setEmail(alumniDTO.getEmail());
        existing.setPhone(alumniDTO.getPhone());
        return service.saveAlumni(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAlumni(@PathVariable Long id) {
        service.deleteAlumni(id);
    }
}