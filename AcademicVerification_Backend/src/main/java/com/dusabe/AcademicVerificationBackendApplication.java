package com.dusabe;

import com.dusabe.service.FileStorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class AcademicVerificationBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcademicVerificationBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner init(FileStorageService fileStorageService) {
        return args -> {
            fileStorageService.init();
        };
    }

}
