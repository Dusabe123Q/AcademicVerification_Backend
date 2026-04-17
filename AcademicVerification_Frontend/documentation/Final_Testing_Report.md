# PHASE 10: TESTING & DEBUGGING FINAL REPORT

**Project Title**: Academic Credential Verification and Alumni Tracking System  
**Student**: Dusabe Marie Rose  
**Duration**: 11 Apr – 17 Apr 2026  

---

## 1. Overview
The final phase of the project focused on system testing and debugging to ensure that all modules work correctly before final submission. This phase involved verifying core functionalities, identifying and fixing bugs, and ensuring system security through both manual and automated tests.

---

## 2. Testing Schedule
The testing phase was organized into a 7-day schedule to systematically cover all aspects of the application.

| Day | Date | Activity Description | Status |
|:---|:---|:---|:---|
| **Day 1** | 11 Apr | Create test plan and testing strategy | Completed |
| **Day 2** | 12 Apr | Perform unit testing on backend services | Completed |
| **Day 3** | 13 Apr | Perform API testing using Postman | Completed |
| **Day 4** | 14 Apr | Test authentication and authorization scenarios | Completed |
| **Day 5** | 15 Apr | Fix bugs and performance issues | Completed |
| **Day 6** | 16 Apr | Retest system after fixes | Completed |
| **Day 7** | 17 Apr | Compile testing report and evidence | Completed |

---

## 3. Initial System State and Planning
Testing began by verifying that the initial entry point of the system is stable and that the development environment is correctly configured. This ensures that the system is ready for deeper logic evaluation.

![Welcome Screen Verification](images/home(welcome.png)
*Figure 1: Initial System Entry Point*

---

## 4. Backend Service and API Validation
The backend services were tested to ensure data integrity. API endpoints for registration, login, and academic records were evaluated using Postman to confirm that the frontend and backend communicate effectively.

![Backend Environment](images/academicverify.png)
*Figure 2: System Development Environment and Log Monitoring*

---

## 5. Security and Authentication Testing
Authentication is a critical part of the system. We tested the login flow, JWT token generation, and the asynchronous OTP email verification process to prevent unauthorized access.

![Security Protocol Validation](images/otp%20email.png)
*Figure 3: Secure SMTP OTP Handshake for User Activation*

---

## 6. Functional Module Retesting
After fixing initial bugs, we retested the primary modules, including the Admin Dashboard and the Alumni Management system. We verified that live charts and records are synchronized with the database.

![Dashboard Integrity](images/dashbord.png)
*Figure 4: Strategic Oversight Dashboard Verification*

---

## 7. Alumni and Profile Data Persistence
We verified that registered alumni can successfully manage their profiles, including uploading career information and identity details. All data is correctly persisted in the MySQL database.

![Alumni Records Search](images/Screenshot%202026-04-10%20162715.png)
*Figure 5: Institutional Alumni Records Persistence*

---

## 8. Final System Evidence
The final check confirmed that the system is stable across all user roles. The profile page and credential ledger are fully functional.

![Final Identity Record](images/Screenshot%202026-04-10%20144751.png)
*Figure 6: Personal Identity Ledger Verification*

---

## CONCLUSION
The Testing and Debugging phase has confirmed that the Academic Verification System is stable, secure, and ready for use. All identified issues were resolved, and the system matches the technical requirements established at the start of the project. The system is now fully prepared for deployment and final presentation.

---
*Report Finalized by Dusabe Marie Rose*
