package com.dusabe.config;

import com.dusabe.entity.*;
import com.dusabe.enums.Role;
import com.dusabe.enums.StudentStatus;
import com.dusabe.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AlumniRepository alumniRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           AlumniRepository alumniRepository,
                           StudentRepository studentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.alumniRepository = alumniRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        initData();
    }

    private void initData() {

        // ── 1. Admin user ────────────────────────────────────────────────────────
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@rp.ac.rw");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }

        // ── 2. Clean up existing demo data ───────────────────────────────────────
        // Must break the Student ↔ Alumni relationship before deleting Alumni,
        // otherwise Hibernate's auto-flush sees a managed Student still referencing
        // the deleted (transient) Alumni and throws TransientObjectException.
        String demoAlumni   = "alumni_demo";
        String demoEmployer = "employer_demo";

        for (String username : new String[]{demoAlumni, demoEmployer}) {
            userRepository.findByUsername(username).ifPresent(existingUser -> {
                alumniRepository.findByUser(existingUser).ifPresent(existingAlumni -> {

                    // Break the back-reference on Student before deleting Alumni
                    Student linkedStudent = existingAlumni.getStudent();
                    if (linkedStudent != null) {
                        linkedStudent.setAlumni(null);
                        studentRepository.save(linkedStudent);
                    }

                    alumniRepository.delete(existingAlumni);
                });
                userRepository.delete(existingUser);
            });
        }

        // ── 3. Demo users ────────────────────────────────────────────────────────
        User alumniUser = new User();
        alumniUser.setUsername(demoAlumni);
        alumniUser.setPassword(passwordEncoder.encode("password123"));
        alumniUser.setEmail("demo.alumni@gmail.com");
        alumniUser.setRole(Role.ALUMNI);
        User savedAlumniUser = userRepository.save(alumniUser);

        User employerUser = new User();
        employerUser.setUsername(demoEmployer);
        employerUser.setPassword(passwordEncoder.encode("password123"));
        employerUser.setEmail("demo.employer@gmail.com");
        employerUser.setRole(Role.EMPLOYER);
        userRepository.save(employerUser);

        // ── 4. Student record ────────────────────────────────────────────────────
        Student student = new Student();
        student.setName("Demo Student");
        student.setRegistrationNumber("RP/2026/001");
        student.setFaculty("Information Technology");
        student.setProgram("Software Engineering");
        student.setEmail("demo.student@rp.ac.rw");
        student.setPhone("0781234567");
        student.setStatus(StudentStatus.GRADUATED);
        // alumni back-reference starts null — set it after Alumni is saved
        Student savedStudent = studentRepository.save(student);

        // ── 5. Alumni record ─────────────────────────────────────────────────────
        Alumni alumni = new Alumni();
        alumni.setUser(savedAlumniUser);
        alumni.setStudent(savedStudent);
        alumni.setName(savedStudent.getName());
        alumni.setEmail(savedAlumniUser.getEmail());
        alumni.setGradYear("2025");          // parsed to Integer inside the setter
        Alumni savedAlumni = alumniRepository.save(alumni);

        // ── 6. Sync the back-reference on Student ────────────────────────────────
        // Student.alumni is the inverse side of the @OneToOne (mappedBy = "student").
        // Hibernate doesn't persist it automatically, but keeping it in sync ensures
        // any in-session code that reads student.getAlumni() gets the right object
        // without a second DB round-trip.
        savedStudent.setAlumni(savedAlumni);
        studentRepository.save(savedStudent);

        System.out.println(">> Database initialized successfully.");
    }
}