-- Schema Update for Academic Verification System
-- Ensures that the 'alumni' table has the necessary columns for file paths

USE academic_verification_db;

-- Add profile_image_url if not exists
SET @dropdown_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'academic_verification_db' AND TABLE_NAME = 'alumni' AND COLUMN_NAME = 'profile_image_url');
SET @s = IF(@dropdown_exists = 0, 'ALTER TABLE alumni ADD COLUMN profile_image_url VARCHAR(255)', 'SELECT "Column profile_image_url already exists"');
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add certificate_url if not exists
SET @dropdown_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'academic_verification_db' AND TABLE_NAME = 'alumni' AND COLUMN_NAME = 'certificate_url');
SET @s = IF(@dropdown_exists = 0, 'ALTER TABLE alumni ADD COLUMN certificate_url VARCHAR(255)', 'SELECT "Column certificate_url already exists"');
PREPARE stmt FROM @s;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verification table check (ensure it matches the entity)
-- If the table 'verification' was named 'verifications' in some environments, we ensure consistency.
-- The entity says @Table(name = "verification").
