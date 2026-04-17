package com.dusabe.controller;

import com.dusabe.entity.Alumni;
import com.dusabe.entity.User;
import com.dusabe.repository.AlumniRepository;
import com.dusabe.repository.UserRepository;
import com.dusabe.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/alumni/profile")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AlumniProfileController {

    private final AlumniRepository alumniRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public AlumniProfileController(AlumniRepository alumniRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.alumniRepository = alumniRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Alumni getCurrentAlumni() {
        User user = getCurrentUser();
        return alumniRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));
    }

    @GetMapping
    public ResponseEntity<?> getProfile() {
        try {
            return ResponseEntity.ok(getCurrentAlumni());
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Profile not found: " + e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<Alumni> updateProfile(@RequestBody Alumni alumniDetails) {
        Alumni alumni = getCurrentAlumni();
        alumni.setName(alumniDetails.getName());
        alumni.setEmail(alumniDetails.getEmail());
        alumni.setPhone(alumniDetails.getPhone());
        alumni.setGrad_year(alumniDetails.getGrad_year());
        alumni.setCareer_info(alumniDetails.getCareer_info());
        alumni.setCurrent_employer(alumniDetails.getCurrent_employer());
        alumni.setPosition(alumniDetails.getPosition());
        
        return ResponseEntity.ok(alumniRepository.save(alumni));
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Alumni alumni = getCurrentAlumni();
            String path = fileStorageService.save(file, "profile_images");
            alumni.setProfileImageUrl(path);
            alumniRepository.save(alumni);
            return ResponseEntity.ok(path);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Image upload failed: " + e.getMessage());
        }
    }

    @PostMapping("/certificate")
    public ResponseEntity<?> uploadCertificate(@RequestParam("file") MultipartFile file) {
        try {
            Alumni alumni = getCurrentAlumni();
            String path = fileStorageService.save(file, "certificates");
            alumni.setCertificateUrl(path);
            alumniRepository.save(alumni);
            return ResponseEntity.ok(path);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Certificate upload failed: " + e.getMessage());
        }
    }
}
