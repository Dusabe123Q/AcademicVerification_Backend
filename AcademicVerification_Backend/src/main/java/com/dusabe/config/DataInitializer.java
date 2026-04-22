package com.dusabe.config;

import com.dusabe.entity.*;
import com.dusabe.repository.*;
import com.dusabe.enums.Role;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

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
            
            // ─── PART 1: Cleanup & Synchronize Admin by Email ────────────────
            List<User> emailUsers = userRepository.findAllByEmail(adminEmail);
            User primaryAdmin = null;
            
            if (!emailUsers.isEmpty()) {
                primaryAdmin = emailUsers.get(0);
                // Delete any duplicate users with the same email
                if (emailUsers.size() > 1) {
                    for (int i = 1; i < emailUsers.size(); i++) {
                        userRepository.delete(emailUsers.get(i));
                    }
                    System.out.println("Cleaned up " + (emailUsers.size() - 1) + " duplicate Admin records by email.");
                }
                primaryAdmin.setPassword(passwordEncoder.encode("admin123"));
                primaryAdmin.setRole(Role.ADMIN);
                primaryAdmin = userRepository.save(primaryAdmin);
                System.out.println("Primary Admin (Email) synchronized: " + adminEmail);
            } else {
                primaryAdmin = new User(adminEmail, passwordEncoder.encode("admin123"), Role.ADMIN);
                primaryAdmin.setEmail(adminEmail);
                primaryAdmin = userRepository.save(primaryAdmin);
                System.out.println("New Admin created (Email): " + adminEmail);
            }

            // ─── PART 2: Cleanup & Synchronize Admin by Username 'admin' ──────
            List<User> usernameUsers = userRepository.findAllByUsername("admin");
            if (!usernameUsers.isEmpty()) {
                // If the user 'admin' is different from primaryAdmin, clean up
                for (User u : usernameUsers) {
                    if (!u.getId().equals(primaryAdmin.getId())) {
                        userRepository.delete(u);
                    }
                }
                System.out.println("Cleaned up duplicate 'admin' username records.");
            }
            
            // Ensure the main admin ALSO has the username 'admin' if it doesn't conflict
            primaryAdmin.setUsername("admin");
            primaryAdmin = userRepository.save(primaryAdmin);
            System.out.println("Main Admin username set to 'admin'");

            // ─── PART 3: Ensure Admin has an Alumni profile ──────────────────
            if (alumniRepository.findByUser(primaryAdmin).isEmpty()) {
                Alumni alumni = new Alumni();
                alumni.setUser(primaryAdmin);
                alumni.setName("Dusabe Marie rose (Admin)");
                alumni.setEmail(adminEmail);
                alumni.setGrad_year(2023);
                alumni.setCareer_info("Academic Administrator");
                alumniRepository.save(alumni);
                System.out.println("Admin-linked Alumni profile confirmed.");
            }

            if (userRepository.findByUsername("alumni@gmail.com").isEmpty()) {
                User user = new User(
                        "alumni@gmail.com",
                        passwordEncoder.encode("alumni123"),
                        Role.ALUMNI
                );
                userRepository.save(user);

                Alumni alumni = new Alumni();
                alumni.setUser(user);
                alumni.setGrad_year(2022);
                alumni.setCareer_info("Software Developer");
                alumni.setPosition("Junior dev");
                alumni.setPosition("Junior dev");
                alumni.setCurrent_employer("Initial Corp");
                
                alumniRepository.save(alumni);
                System.out.println("Default alumni user created: alumni@gmail.com / alumni123");
            }

            // ─── PART 4: Robust Demo Seed Data (Dusabe, Rehema, Eric) ──────────
            System.out.println("Synchronizing Master Demo Ledger...");
            
            // 1. Ensure Demo Students Exist
            if (studentRepository.findByRegistrationNumber("24RP001").isEmpty()) {
                Student s1 = createStudent(studentRepository, "Dusabe", "dusabe@university.edu", "24RP001", "ICT", "Computer Science");
                createCredential(credentialRepository, s1, "SN-DUS-2024", "Bachelor of Science in CS");
            }
            if (studentRepository.findByRegistrationNumber("24RP002").isEmpty()) {
                Student s2 = createStudent(studentRepository, "Rehema Mugisha", "rehema@university.edu", "24RP002", "Engineering", "Civil Engineering");
                createCredential(credentialRepository, s2, "SN-REH-2024", "Bachelor of Engineering");
            }
            if (studentRepository.findByRegistrationNumber("24RP003").isEmpty()) {
                Student s3 = createStudent(studentRepository, "Eric", "eric@university.edu", "24RP003", "Science", "Mathematics");
                createCredential(credentialRepository, s3, "SN-ERI-2024", "Bachelor of Science");
            }

            // 2. Seed System Ledger (Audit Logs) if empty
            if (auditLogRepository.count() == 0) {
                auditLogRepository.save(new AuditLog("CREATE_SYSTEM", "Academic Verification Node - Phase 10 Activated"));
                auditLogRepository.save(new AuditLog("UPDATE_SECURITY", "JWT Secret Keys rotated and validated"));
                auditLogRepository.save(new com.dusabe.entity.AuditLog("CREATE_STUDENT", "New student identity integrated: " + "Dusabe" + " (" + "24RP001" + ")"));
                auditLogRepository.save(new AuditLog("LOGIN_ADMIN", "Admin (marierose) authenticated from IP: 127.0.0.1"));
                auditLogRepository.save(new com.dusabe.entity.AuditLog("CREATE_CREDENTIAL", "Digital credential issued for serial: " + "SN-DUS-2024"));
                System.out.println("System Ledger Seeded.");
            }

            // 3. Seed Notifications for Admin if empty
            if (notificationRepository.count() == 0) {
                notificationRepository.save(new Notification(primaryAdmin, "Welcome to the Academic Oversight Dashboard. Your system is 100% operational."));
            }

            // 4. Seed Verification Engine (History)
            if (verificationRepository.count() == 0) {
                System.out.println("Seeding Verification Audit History...");
                List<Credential> creds = credentialRepository.findAll();
                if (!creds.isEmpty()) {
                    createVerification(verificationRepository, creds.get(0), "APPROVED");
                    if (creds.size() > 1) createVerification(verificationRepository, creds.get(1), "PENDING");
                    if (creds.size() > 2) createVerification(verificationRepository, creds.get(2), "APPROVED");
                }
            }
            
            System.out.println("Master Demo Synchronization Completed.");
        };
    }

    private void createVerification(VerificationRepository repo, Credential credential, String status) {
        Verification v = new Verification();
        v.setCredential(credential);
        v.setStatus(status);
        v.setRequest_date(java.time.LocalDateTime.now().minusDays(new java.util.Random().nextInt(10)));
        repo.save(v);
    }

    private Student createStudent(StudentRepository repo, String name, String email, String reg, String faculty, String program) {
        Student s = new Student();
        s.setName(name);
        s.setEmail(email);
        s.setRegistrationNumber(reg);
        s.setFaculty(faculty);
        s.setProgram(program);
        s.setPhone("0780000000");
        s.setDob(java.time.LocalDate.of(2000, 1, 1));
        s.setStatus(com.dusabe.enums.StudentStatus.STUDENT);
        return repo.save(s);
    }

    private void createCredential(CredentialRepository repo, Student student, String serial, String degree) {
        Credential c = new Credential();
        c.setStudent(student);
        c.setSerial_number(serial);
        c.setCredential_type(degree);
        c.setIssue_date(java.time.LocalDate.now());
        repo.save(c);
    }
}
