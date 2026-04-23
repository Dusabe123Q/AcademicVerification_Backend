-- Academic Verification System - Database Schema
-- Target: MySQL
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table: user
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191),
    `phone` VARCHAR(255),
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table: student
CREATE TABLE IF NOT EXISTS `student` (
    `student_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `dob` DATE,
    `program` VARCHAR(255),
    `registration_number` VARCHAR(191) NOT NULL UNIQUE,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `faculty` VARCHAR(255) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'STUDENT'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table: alumni
CREATE TABLE IF NOT EXISTS `alumni` (
    `alumni_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(191),
    `email` VARCHAR(191),
    `phone` VARCHAR(255),
    `grad_year` INT,
    `career_info` VARCHAR(255),
    `current_employer` VARCHAR(255),
    `position` VARCHAR(255),
    `profile_image_url` VARCHAR(255),
    `certificate_url` VARCHAR(255),
    `student_id` BIGINT,
    `user_id` BIGINT,
    UNIQUE KEY `UK_alumni_student` (`student_id`),
    UNIQUE KEY `UK_alumni_user` (`user_id`),
    CONSTRAINT `FK_alumni_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
    CONSTRAINT `FK_alumni_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table: credential
CREATE TABLE IF NOT EXISTS `credential` (
    `credential_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `credential_type` VARCHAR(255),
    `issue_date` DATE,
    `serial_number` VARCHAR(191) UNIQUE,
    `student_id` BIGINT,
    CONSTRAINT `FK_credential_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Table: employment_history
CREATE TABLE IF NOT EXISTS `employment_history` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `employer` VARCHAR(255) NOT NULL,
    `job_title` VARCHAR(255) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE,
    `description` VARCHAR(1000),
    `alumni_id` BIGINT NOT NULL,
    CONSTRAINT `FK_employment_alumni` FOREIGN KEY (`alumni_id`) REFERENCES `alumni` (`alumni_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Table: notifications
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `message` VARCHAR(255) NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `user_id` BIGINT NOT NULL,
    CONSTRAINT `FK_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Table: audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `action` VARCHAR(255),
    `details` VARCHAR(255),
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Table: verification
CREATE TABLE IF NOT EXISTS `verification` (
    `verification_id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `status` VARCHAR(255),
    `request_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `credential_id` BIGINT,
    CONSTRAINT `FK_verification_credential` FOREIGN KEY (`credential_id`) REFERENCES `credential` (`credential_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INITIAL DATA SEEDING
-- Note: Passwords are BCrypt hashed. 
-- admin123 -> $2a$10$8.UnVuG9HHgffUDAlk8UXebvcYj6M6.gG0M2T35.6190PAnit.30u
-- alumni123 -> $2a$10$GRLdNijSQMUvl/au9ShL7uSsu3sJ/60LMnadS/HGGNm.RgnTzU4X2

INSERT INTO `user` (username, email, password, role) VALUES 
('marierosedusabe58@gmail.com', 'marierosedusabe58@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8UXebvcYj6M6.gG0M2T35.6190PAnit.30u', 'ADMIN'),
('admin@gmail.com', 'admin@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8UXebvcYj6M6.gG0M2T35.6190PAnit.30u', 'ADMIN'),
('alumni@gmail.com', 'alumni@gmail.com', '$2a$10$GRLdNijSQMUvl/au9ShL7uSsu3sJ/60LMnadS/HGGNm.RgnTzU4X2', 'ALUMNI');

-- Seed a test student to link to alumni
INSERT INTO `student` (name, registration_number, email, phone, faculty, status, program, dob) VALUES 
('Test Alumni', 'UR/CST/2022/001', 'alumni@gmail.com', '+250780000000', 'Computing & Information Systems', 'ALUMNI', 'Computer Science', '1998-05-15');

-- Seed the alumni profile linked to the user and student
INSERT INTO `alumni` (name, email, phone, grad_year, career_info, current_employer, position, student_id, user_id) VALUES 
('Test Alumni', 'alumni@gmail.com', '+250780000000', 2022, 'Software Development', 'Initial Corp', 'Junior Developer', 
 (SELECT student_id FROM student WHERE registration_number = 'UR/CST/2022/001'),
 (SELECT id FROM user WHERE email = 'alumni@gmail.com')
);

SET FOREIGN_KEY_CHECKS = 1;
