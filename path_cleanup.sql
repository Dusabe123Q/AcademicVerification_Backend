-- =============================================================================
-- ACADEMIC VERIFICATION SYSTEM: DATA INTEGRITY & PATH CLEANUP (V2)
-- This script sanitizes absolute local file paths into relative web paths.
-- It ENSURES a leading slash for consistent frontend URL concatenation.
-- =============================================================================

-- 1. CLEANUP ALUMNI PROFILE IMAGE PATHS
-- Strategy: Locate 'uploads/', keep it and everything after, then prepend '/'
UPDATE alumni 
SET profile_image_url = CONCAT('/', SUBSTRING(profile_image_url, LOCATE('uploads/', REPLACE(profile_image_url, '\\', '/'))))
WHERE (profile_image_url LIKE '%uploads/%' OR profile_image_url LIKE '%uploads\\%')
  AND profile_image_url NOT LIKE '/uploads%';

-- 2. CLEANUP ALUMNI CERTIFICATE PATHS
UPDATE alumni 
SET certificate_url = CONCAT('/', SUBSTRING(certificate_url, LOCATE('uploads/', REPLACE(certificate_url, '\\', '/'))))
WHERE (certificate_url LIKE '%uploads/%' OR certificate_url LIKE '%uploads\\%')
  AND certificate_url NOT LIKE '/uploads%';

-- 3. ENSURE FORWARD SLASHES FOR WEB COMPATIBILITY
UPDATE alumni 
SET profile_image_url = REPLACE(profile_image_url, '\\', '/')
WHERE profile_image_url IS NOT NULL;

UPDATE alumni 
SET certificate_url = REPLACE(certificate_url, '\\', '/')
WHERE certificate_url IS NOT NULL;

-- 4. FINAL LOG INTEGRITY
-- If any path is still local (e.g. starts with C: or D:), it means 'uploads' wasn't found.
-- This query helps identify those edge cases.
-- SELECT alumni_id, name, profile_image_url FROM alumni WHERE profile_image_url LIKE '_:%';

-- =============================================================================
-- END OF CLEANUP SCRIPT
-- =============================================================================
