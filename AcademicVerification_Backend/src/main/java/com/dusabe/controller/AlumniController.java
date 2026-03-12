package com.dusabe.controller;

import com.dusabe.entity.Alumni;
import com.dusabe.service.AlumniService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alumni")
public class AlumniController {

    private final AlumniService service;

    public AlumniController(AlumniService service) {
        this.service = service;
    }

    @GetMapping
    public List<Alumni> getAllAlumni() {
        return service.getAllAlumni();
    }

    @PostMapping
    public Alumni createAlumni(@RequestBody Alumni alumni) {
        return service.saveAlumni(alumni);
    }

    @PutMapping("/{id}")
    public Alumni updateAlumni(@PathVariable Long id, @RequestBody Alumni alumni) {
        alumni.setAlumni_id(id);
        return service.saveAlumni(alumni);
    }

    @DeleteMapping("/{id}")
    public void deleteAlumni(@PathVariable Long id) {
        service.deleteAlumni(id);
    }
}