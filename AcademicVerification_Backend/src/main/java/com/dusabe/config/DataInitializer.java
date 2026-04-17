package com.dusabe.config;

import com.dusabe.entity.Alumni;
import com.dusabe.entity.User;
import com.dusabe.enums.Role;
import com.dusabe.repository.AlumniRepository;
import com.dusabe.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, AlumniRepository alumniRepository, PasswordEncoder passwordEncoder) {
        return args -> {
        Optional<User> existingAdmin = userRepository.findByUsername("marierosedusabe58@gmail.com");
        if (existingAdmin.isEmpty()) {
            User admin = new User(
                    "marierosedusabe58@gmail.com",
                    passwordEncoder.encode("admin123"),
                    Role.ADMIN
            );
            admin.setEmail("marierosedusabe58@gmail.com");
            userRepository.save(admin);
            System.out.println("Default admin user created: marierosedusabe58@gmail.com / admin123");
        } else {
            User admin = existingAdmin.get();
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("Default admin user password synchronized: marierosedusabe58@gmail.com / admin123");
            
            // Ensure Admin has an Alumni profile for testing
            if (alumniRepository.findByUser(admin).isEmpty()) {
                Alumni alumni = new Alumni();
                alumni.setUser(admin);
                alumni.setName("Dusabe Marie rose (Admin)");
                alumni.setEmail("marierosedusabe58@gmail.com");
                alumni.setGrad_year(2023);
                alumni.setCareer_info("Academic Administrator");
                alumniRepository.save(alumni);
                System.out.println("Admin-linked Alumni profile created for testing.");
            }
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
        };
    }
}
