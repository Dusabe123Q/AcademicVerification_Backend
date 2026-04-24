package com.dusabe.config;

import com.dusabe.entity.*;
import com.dusabe.repository.*;
import com.dusabe.enums.Role;
import com.dusabe.enums.StudentStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

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

            // --- 1. SYNC ADMIN (Update or Create) ---
            User admin = userRepository.findByUsername(adminUsername).orElse(new User());
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setRole(Role.ADMIN);
            admin.setPassword(passwordEncoder.encode(defaultPass));
            userRepository.save(admin);
            System.out.println(">>> ADMIN SYNCED: " + adminUsername);

            // --- 2. SYNC DEMO USERS ---
            String[][] demoUsers = {
                    {"alumni", "alumni@gmail.com", "alumni123", "ALUMNI"},
                    {"employer", "employer@demo.com", "employer123", "EMPLOYER"}
            };

            for (String[] userData : demoUsers) {
                User u = userRepository.findByUsername(userData[0]).orElse(new User());
                u.setUsername(userData[0]);
                u.setEmail(userData[1]);
                u.setRole(Role.valueOf(userData[3]));
                u.setPassword(passwordEncoder.encode(userData[2]));
                userRepository.save(u);
                System.out.println(">>> USER SYNCED: " + userData[0]);
            }

            // --- 3. SYNC DEMO STUDENT ---
            Student demoStudent = studentRepository.findByRegistrationNumber("24RP001").orElse(new Student());
            demoStudent.setName("Dusabe Marie ROSE");
            demoStudent.setEmail(adminEmail);
            demoStudent.setRegistrationNumber("24RP001");
            demoStudent.setFaculty("ICT");
            demoStudent.setProgram("Computer Science");
            demoStudent.setPhone("0780000000");
            demoStudent.setDob(LocalDate.of(2000, 1, 1));
            demoStudent.setStatus(StudentStatus.STUDENT);
            studentRepository.save(demoStudent);

            // --- 4. SYNC ALUMNI PROFILE ---
            // Link to the 'admin' user as per your original logic
            Alumni alumni = alumniRepository.findByUser(admin).orElse(new Alumni());
            alumni.setUser(admin);
            alumni.setName("Dusabe Marie ROSE");
            alumni.setEmail(adminEmail);
            alumni.setGrad_year(2023);
            alumni.setCareer_info("Academic Systems Specialist");
            alumni.setCurrent_employer("Global Education Tech");
            alumni.setPosition("Senior System Auditor");
            alumni.setStudent(demoStudent);
            alumniRepository.save(alumni);

            // --- 5. SYNC CREDENTIALS ---
            if (credentialRepository.findByStudent(demoStudent).isEmpty()) {
                Credential c = new Credential();
                c.setStudent(demoStudent);
                c.setSerial_number("SN-DUS-2023-A1");
                c.setCredential_type("Bachelor of Science in Information Technology");
                c.setIssue_date(LocalDate.now());
                credentialRepository.save(c);
            }

            System.out.println(">>> Master Demo Synchronization Completed Successfully.");
        };
    }
}