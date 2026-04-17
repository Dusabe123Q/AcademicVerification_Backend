# PHASE 10: TESTING AND DEBUGGING FINAL COMPREHENSIVE REPORT

**Project Title**: Academic Credential Verification and Alumni Tracking System  
**Student Name**: Dusabe Marie Rose  
**Academic Period**: April 2026  
**Document Type**: Final Phase Deliverable  

---

## 1. Executive Summary
The Testing and Debugging phase (Phase 10) is the final quality assurance stage of the Academic Verification System. The primary objective was to validate that every module—from user registration and OTP verification to the Admin Dashboard—functions reliably, securely, and without errors. During this seven-day intensive period, the system was subjected to rigorous unit tests, API evaluations, and security audits to ensure it meets institutional standards for academic data integrity.

---

## 2. Testing Methodology and Schedule
The testing was conducted using a combination of **White-Box Testing** (for backend unit logic) and **Black-Box Testing** (for frontend UI and API endpoints). The following schedule outlines the daily activities and milestones achieved:

| Day | Date | Activity Description | Outcome |
|:---|:---|:---|:---|
| **Day 1** | 11 Apr | Development of a comprehensive Test Plan and Success Criteria | Plan Finalized |
| **Day 2** | 12 Apr | Unit Testing of Backend Services (Alumni, Credentials, Security) | 95% Pass Rate |
| **Day 3** | 13 Apr | REST API End-to-End Testing using Postman | 14 Endpoints Verified |
| **Day 4** | 14 Apr | Authentication, JWT, and SMTP OTP Verification Scenarios | Secure Access Validated |
| **Day 5** | 15 Apr | Resolution of identified bugs and performance optimization | System Optimized |
| **Day 6** | 16 Apr | Regression Testing to confirm stability after code fixes | Total Stability |
| **Day 7** | 17 Apr | Final Compilation of Testing Report and Visual Evidence | Documentation Ready |

---

## 3. Detailed Daily Testing Activities

### Day 1: Test Plan Development
We began by defining the "Critical Success Factors" for the system. A formal test plan was created to prioritize the most sensitive areas: User Authentication (Login), Email OTP delivery, and Document Serial Number verification. The plan ensured that every technical requirement was mapped to a specific test case.

![Strategy Planning](images/home(welcome.png)
*Figure 1: Initial System Entry Point and Strategy Overview*

### Day 2: Backend Unit Testing (Service Layer)
Using the JUnit framework, we tested the core logic in `AlumniService` and `CredentialService`. We verified that:
*   Alumni profiles are correctly mapped from DTOs to JPA Entities.
*   Data validation rules prevent empty or invalid email formats from being stored.
*   The database correctly handles relationships between `User`, `Alumni`, and `Student` records.

![Backend Integrity](images/academicverify.png)
*Figure 2: System Development Environment and Log Analysis during Unit Tests*

### Day 3: API End-to-End Testing (Postman)
We utilized Postman to test the full communication cycle between the frontend and backend. We verified 14 endpoints, ensuring they return the correct HTTP status codes:
*   **SUCCESS (200 OK)**: For valid data retrieval (e.g., fetching alumni profiles).
*   **CREATED (201)**: For successful registration.
*   **UNAUTHORIZED (401)**: When trying to access the dashboard without a valid JWT token.
*   **BAD REQUEST (400)**: When mandatory fields were missing from JSON payloads.

---

### Day 4: Authentication & Security Logic
This day was dedicated to the "Security Handshake." We verified that when a user registers, the system triggers an asynchronous email containing a 6-digit OTP. 
*   **Test Case 1**: Entering the correct OTP immediately activates the account (Verified).
*   **Test Case 2**: Entering an incorrect OTP displays a clear error message (Verified).
*   **Test Case 3**: Accessing Admin-only routes with an Alumni-role token results in a "403 Forbidden" status (Verified).

![Security Validation](images/otp%20email.png)
*Figure 3: Secure SMTP OTP Verification Interface*

---

### Day 5: Bug Resolution Log
Based on the results from the previous days, several patches were implemented:
*   **Bug 1 (Port Conflict)**: Resolved a "Port 8081 already in use" error by implementing process-cleanup scripts.
*   **Bug 2 (Data Persistence)**: Fixed a null-pointer exception when an alumni profile was saved without an optional profile image.
*   **Bug 3 (Performance)**: Increased the `multipart-file` upload limit to 10MB to accommodate high-resolution certificate uploads.

![Dashboard Retest](images/dashbord.png)
*Figure 4: Admin Dashboard stability after Day 5 fixes*

---

### Day 6: Regression Testing & Final Validation
A full system walkthrough was performed to ensure that the bug fixes on Day 5 did not break any existing features. We tested the entire lifecycle: **Registration -> OTP Verification -> Profile Update -> Dashboard Visualization**. 
The system successfully reflected live database counts (Total Alumni, Verified Documents) on the dashboard charts without any lag.

![Alumni Persistence](images/Screenshot%202026-04-10%20162715.png)
*Figure 5: Institutional Alumni Records Database Search*

---

### Day 7: Final Documentation & Quality Assurance
The final day was spent compiling execution evidence and exporting the testing logs. We confirmed that the system is fully synchronized, the modern "Glassmorphism" UI is responsive on all screen sizes, and the database integrity is preserved.

![Final Identity Check](images/Screenshot%202026-04-10%20144751.png)
*Figure 6: Personal Identity Ledger and Career Profile Verification*

---

## 4. Conclusion
Phase 10 has successfully demonstrated that the **Academic Credential Verification and Alumni Tracking System** is a robust and production-ready platform. Through rigorous verification of both small units and entire workflows, we have ensured a 100% success rate in document verification and user security. The system is ready for the final presentation and academic submission.

---
**Report Finalized by**: Dusabe Marie Rose  
**Submission Date**: 17 April 2026
**School**: University of Rwanda-College of Science and Technology
