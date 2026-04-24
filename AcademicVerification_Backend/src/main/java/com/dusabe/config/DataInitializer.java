package com.dusabe.config;

import com.dusabe.entity.*;
import com.dusabe.repository.*;
import com.dusabe.enums.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository, 
            AlumniRepository alumniRepository, 
            StudentRepository studentRepository,
            CredentialRepository credentialRepository,
            AuditLogRepository auditLogRepository,
            NotificationRepository notificationRepository,
            VerificationRepository verificationRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "marierosedusabe58@gmail.com";
            String adminUsername = "admin";
            String defaultPass = "admin123";
            
            // ─── ENSURE ADMIN EXISTS ─────────────────────────────────────────
            User admin = userRepository.findByUsername(adminUsername).orElseGet(() -> {
                User u = new User();
                u.setUsername(adminUsername);
                u.setEmail(adminEmail);
                u.setRole(Role.ADMIN);
                return u;
            });
            
            admin.setPassword(passwordEncoder.encode(defaultPass));
            admin.setRole(Role.ADMIN);
            admin.setEmail(adminEmail);
            userRepository.save(admin);
            System.out.println(">>> ADMIN SYNCED: " + adminUsername + " / " + defaultPass);

            // ─── ENSURE DEMO USERS ──────────────────────────────────────────
            String[][] demoUsers = {
                {"alumni", "alumni@gmail.com", "alumni123", "ALUMNI"},
                {"employer", "employer@demo.com", "employer123", "EMPLOYER"}
            };

            for (String[] userData : demoUsers) {
                User u = userRepository.findByUsername(userData[0]).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(userData[0]);
                    newUser.setEmail(userData[1]);
                    newUser.setRole(Role.valueOf(userData[3]));
                    return newUser;
                });
                u.setPassword(passwordEncoder.encode(userData[2]));
                userRepository.save(u);
                System.out.println(">>> USER SYNCED: " + userData[0] + " / " + userData[2]);
            }

            // ─── ENSURE DEMO STUDENT & ALUMNI PROFILE ───────────────────────
            Student demoStudent = studentRepository.findByRegistrationNumber("24RP001").orElseGet(() -> {
                Student s = new Student();
                s.setName("Dusabe Marie ROSE");
                s.setEmail(adminEmail);
                s.setRegistrationNumber("24RP001");
                s.setFaculty("ICT");
                s.setProgram("Computer Science");
                s.setPhone("0780000000");
                s.setDob(java.time.LocalDate.of(2000, 1, 1));
                s.setStatus(com.dusabe.enums.StudentStatus.STUDENT);
                return studentRepository.save(s);
            });

            if (alumniRepository.findByUser(admin).isEmpty()) {
                Alumni alumni = new Alumni();
                alumni.setUser(admin);
                alumni.setName("Dusabe Marie ROSE");
                alumni.setEmail(adminEmail);
                alumni.setGrad_year(2023);
                alumni.setCareer_info("Academic Systems Specialist");
                alumni.setCurrent_employer("Global Education Tech");
                alumni.setPosition("Senior System Auditor");
                alumni.setStudent(demoStudent);
                alumniRepository.save(alumni);
            }

            // ─── ENSURE CREDENTIALS ─────────────────────────────────────────
            if (credentialRepository.findByStudent(demoStudent).isEmpty()) {
                Credential c = new Credential();
                c.setStudent(demoStudent);
                c.setSerial_number("SN-DUS-2023-A1");
                c.setCredential_type("Bachelor of Science in Information Technology");
                c.setIssue_date(java.time.LocalDate.now());
                credentialRepository.save(c);
            }

            System.out.println(">>> Master Demo Synchronization Completed.");
        };
    }
}
