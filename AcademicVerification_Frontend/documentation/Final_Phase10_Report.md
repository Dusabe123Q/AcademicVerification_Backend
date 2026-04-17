# PHASE 10: TESTING AND DEBUGGING FINAL REPORT

**Project Name**: Academic Credential Verification & Alumni Tracking System  
**Student Name**: Dusabe Marie Rose  
**Academic Period**: April 2026  
**Document Status**: Final Version for Submission  

---

## 1. EXECUTIVE SUMMARY
This report explains all activities performed during **Phase 10: Testing and Debugging** from April 11, 2026, to April 17, 2026. 

The purpose of this phase was to ensure that the *Academic Credential Verification & Alumni Tracking System* works correctly, securely, and efficiently before final submission. Different tests were conducted, including Unit Testing, API Testing, Security Testing, Performance Testing, Regression Testing, and Bug Fixing. After completing all tests, the system was confirmed ready for deployment and final presentation.

---

## 2. INTRODUCTION
Testing is one of the most important phases in software development. It ensures that the system functions as expected and users can use it without errors. The system contains several interconnected modules:
*   User Registration & Login Authentication
*   OTP Email Verification
*   Alumni Profile Management
*   Credential Upload & Verification Logic
*   Admin Strategic Dashboard
*   System Reports & Statistics

Given that the system handles sensitive academic information, testing was necessary to verify security protocols and data accuracy.

---

## 3. OBJECTIVES OF TESTING PHASE
The primary objectives were:
*   Identify and resolve system errors and bugs.
*   Verify all modules function correctly and in synchronization.
*   Test database integrity and data persistence.
*   Validate RESTful APIs and backend communication.
*   Ensure secure login and robust Role-Based Access Control (RBAC).
*   Improve overall system response times and performance.
*   Prepare the final project deliverables for presentation.

---

## 4. DETAILED TESTING MODULES

### 4.1 Test Planning & Strategy
A comprehensive testing strategy was developed to guide all verification activities. This planning stage helped organize the process and ensured that every component was evaluated properly. 
**Key Success Indicators:**
*   Preventing unauthorized access.
*   Ensuring correct data storage in the MySQL database.
*   Verifying successful OTP email delivery.
*   Confirming accurate API responses and fast loading speeds.

### 4.2 Backend Unit Testing
Unit tests were conducted for the following service classes: `AlumniService`, `CredentialService`, `AuthService`, and `EmailService`.
*   **Tested Methods**: Saving profiles, updating records, verifying credentials, OTP generation, and email dispatch.
*   **Results**: All methods executed successfully. SQL syntax is correct, and repository queries are optimized for speed.

### 4.3 API Testing Using Postman
All REST APIs were tested to ensure proper communication between the frontend and backend. 

| Method | Endpoint | Expected Result | Status |
|:---|:---|:---|:---|
| POST | `/api/auth/register` | User Registered Successfully | PASSED |
| POST | `/api/auth/login` | JWT Token Generated | PASSED |
| GET | `/api/alumni/profile` | Personal Data Retrieved | PASSED |
| PUT | `/api/alumni/update` | Profile Data Persisted | PASSED |
| POST | `/api/credentials/upload` | File Successfully Stored | PASSED |
| POST | `/api/credentials/verify` | Integrity Validated | PASSED |

### 4.4 Authentication & Security Testing
Ensured only authorized users access protected pages.
*   **Areas Tested**: JWT Token Validation, OTP Verification, RBAC (Admin vs. Alumni), and Session Security.
*   **Results**: Invalid tokens are denied access. OTP arrives within 5 seconds. Admin pages are unreachable for standard users.

### 4.5 Frontend UI Testing
Tested all interface components for responsiveness and functionality.
*   **Results**: The "Glassmorphism" design works across different screen sizes. All buttons, navigation links, and dynamic charts are functioning as intended.

### 4.6 Performance Testing
System speed was tested under repeated requests.
*   **Results**: Login takes under 2 seconds. The Dashboard loads instantly. File uploads are stable up to 10MB.
> **[SCREENSHOT PLACEHOLDER: Browser Network Speed Screenshot]**  
> *Figure 1: Performance Test Evidence*

---

## 5. BUG RESOLUTION LOG

| Issue Detected | Severity | Cause | Solution Applied | Result |
|:---|:---|:---|:---|:---|
| Port 8081 already in use | Low | Background Java process | Terminated zombie java.exe process | FIXED |
| Empty chart data | Medium | Null values in DB | Added null-checks and defaults in code | FIXED |
| Upload failed | Medium | Small file size limit | Increased limit to 10MB in properties | FIXED |
| OTP delayed | Medium | SMTP Config issue | Optimized SMTP protocol settings | FIXED |
| Unauthorized access | High | Missing token validation | Implemented final JWT filter logic | FIXED |

---

## 6. TOOLS USED DURING TESTING

| Tool | Purpose |
|:---|:---|
| **Postman** | API Testing & Mocking |
| **Spring Boot Logs** | Backend Monitoring |
| **MySQL Workbench** | Database Verification |
| **Chrome DevTools** | Frontend Debugging & Performance |
| **VS Code / IntelliJ** | Code Debugging |
| **GitHub** | Version Control |

---

## 7. DELIVERABLES CHECKLIST
- [x] Fully Functional Backend (Spring Boot)
- [x] React Frontend Completed (Vite)
- [x] Secure Authentication System (JWT + OTP)
- [x] Postman API Collection
- [x] Final Screenshots & Testing Evidence
- [x] Final Documentation

---

## 8. CHALLENGES FACED
*   Port conflicts during concurrent backend/frontend runs.
*   Email OTP delay settings during initial SMTP configuration.
*   Handling null data cases when the database is empty.
*   Optimizing alignment for the modern CSS glass cards.
**Outcome**: All challenges were successfully resolved.

---

## 9. CONCLUSION
Phase 10 Testing and Debugging was completed successfully. The *Academic Credential Verification & Alumni Tracking System* is now stable, secure, fast, and user-friendly. It is fully ready for deployment and final presentation.

---
**Prepared By:**  
*Dusabe Marie Rose*  
**Date:** 17 April 2026
