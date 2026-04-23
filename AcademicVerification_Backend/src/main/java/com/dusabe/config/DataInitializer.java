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
                alumni.setName("Dusabe Marie ROSE");
                alumni.setEmail(adminEmail);
                alumni.setGrad_year(2023);
                alumni.setCareer_info("Academic Systems Specialist");
                alumni.setCurrent_employer("Global Education Tech");
                alumni.setPosition("Senior System Auditor");
                
                // Link to a student record for credentials
                Student student = studentRepository.findByRegistrationNumber("24RP001").orElseGet(() -> 
                    createStudent(studentRepository, "Dusabe Marie ROSE", adminEmail, "24RP001", "ICT", "Computer Science")
                );
                alumni.setStudent(student);
                
                alumniRepository.save(alumni);
                System.out.println("Admin-linked Alumni profile confirmed for Dusabe Marie ROSE.");
                
                // Ensure credentials exist for this student
                if (credentialRepository.findByStudent(student).isEmpty()) {
                    createCredential(credentialRepository, student, "SN-DUS-2023-A1", "Bachelor of Science in Information Technology");
                }
            }

            // ─── PART 3.5: Ensure Default Alumni has everything linked ──────
            // We will use both "alumni@gmail.com" AND "alumni" for maximum compatibility
            String[] testUsernames = {"alumni@gmail.com", "alumni"};
            for (String uname : testUsernames) {
                Optional<User> uOpt = userRepository.findByUsername(uname);
                User u;
                if (uOpt.isEmpty()) {
                    u = new User(uname, passwordEncoder.encode("alumni123"), Role.ALUMNI);
                    u = userRepository.save(u);
                } else {
                    u = uOpt.get();
                    u.setPassword(passwordEncoder.encode("alumni123"));
                    userRepository.save(u);
                }

                final User finalUser = u; // Fix: effectively final for lambda
                Alumni alumni = alumniRepository.findByUser(finalUser).orElseGet(() -> {
                    Alumni a = new Alumni();
                    a.setUser(finalUser);
                    return a;
                });

                alumni.setName("Dusabe Marie ROSE");
                alumni.setEmail(uname.contains("@") ? uname : "alumni@gmail.com");
                alumni.setGrad_year(2023);
                alumni.setCareer_info("Senior Software Engineer & Alumni Lead");
                alumni.setPosition("Lead Developer");
                alumni.setCurrent_employer("Global Tech Solutions");
                
                // Link to student record so credentials show up (Only for the first one to avoid UK_alumni_student)
                if (uname.equals("alumni@gmail.com") || uname.equals("alumni")) {
                    Student s = studentRepository.findByRegistrationNumber("24RP001").orElseGet(() -> 
                        createStudent(studentRepository, "Dusabe Marie ROSE", "alumni@gmail.com", "24RP001", "ICT", "Computer Science")
                    );
                    
                    // Check if this student is already linked to ANOTHER alumni to avoid duplicate key
                    Optional<Alumni> existingAlumni = alumniRepository.findByStudent(s);
                    if (existingAlumni.isEmpty() || existingAlumni.get().getUser().getUsername().equals(uname)) {
                        alumni.setStudent(s);
                        if (credentialRepository.findByStudent(s).isEmpty()) {
                            createCredential(credentialRepository, s, "SN-DUS-2023-A1", "Bachelor of Science in Information Technology");
                        }
                    }
                }
                alumniRepository.save(alumni);
                System.out.println(">>> DEMO USER SYNCED: " + uname + " / alumni123");
            }





            // ─── PART 4: Robust Demo Seed Data (Verifications, Logs, Notifications) ──
            System.out.println("Synchronizing Master Demo Ledger...");
            
            // Seed Notifications for ALL users to ensure UI is populated
            List<User> allUsers = userRepository.findAll();
            for (User u : allUsers) {
                if (notificationRepository.findByUserOrderByCreatedAtDesc(u).isEmpty()) {
                    notificationRepository.save(new Notification(u, "Welcome to the Academic Oversight Dashboard. Your system is 100% operational."));
                    notificationRepository.save(new Notification(u, "Your profile was successfully synchronized with the University Central Node."));
                    notificationRepository.save(new Notification(u, "Notification: Your academic credential has been verified by an external auditor."));
                    notificationRepository.save(new Notification(u, "System Sync: Latest security patches applied to your academic node."));
                }
            }

            // Seed Verification Engine (History)
            if (verificationRepository.count() < 5) {

                System.out.println("Seeding Verification Audit History...");
                List<Credential> creds = credentialRepository.findAll();
                if (!creds.isEmpty()) {
                    createVerification(verificationRepository, creds.get(0), "APPROVED");
                    createVerification(verificationRepository, creds.get(0), "PENDING");
                    if (creds.size() > 1) createVerification(verificationRepository, creds.get(1), "APPROVED");
                    if (creds.size() > 2) createVerification(verificationRepository, creds.get(2), "APPROVED");
                }
            }

            // Seed Audit Logs for Professional View
            if (auditLogRepository.count() < 10) {
                auditLogRepository.save(new AuditLog("SYSTEM_BOOT", "Academic Verification Node - Production Sync Active"));
                auditLogRepository.save(new AuditLog("LOGIN_SUCCESS", "User Dusabe Marie ROSE authenticated session"));
                auditLogRepository.save(new AuditLog("CREDENTIAL_QUERY", "External verification request for SN-DUS-2023-A1"));
                auditLogRepository.save(new AuditLog("PROFILE_UPDATE", "Professional career info synchronized for Alumni ID: " + primaryAdmin.getId()));
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
