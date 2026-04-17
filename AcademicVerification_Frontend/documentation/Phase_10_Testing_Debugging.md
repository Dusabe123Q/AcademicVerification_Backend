# PHASE 10: TESTING & DEBUGGING REPORT

**Project Title**: Academic Credential Verification and Alumni Tracking System  
**Student**: Dusabe Marie Rose  
**Duration**: 11 Apr – 17 Apr 2026  

---

## 1. Overview
The Testing and Debugging phase is critical to ensuring the reliability, security, and performance of the Academic Verification System. During this phase, the system underwent rigorous evaluation, from individual service units to end-to-end user workflows. This report documents the systematic approach taken to identify and resolve issues, ensuring a production-ready application.

---

## 2. Day 1: Test Plan and Strategy
The first day was dedicated to defining the scope of testing. A comprehensive strategy was developed to cover Unit Testing, Integration Testing, and User Acceptance Testing (UAT).

**Activities:**
- Defining testing objectives and success criteria.
- Identifying critical paths: Authentication, Credential Verification, and Profile Persistence.
- Setting up the testing environment and tools (Postman, JUnit, Chrome DevTools).

> [!TIP]
> **Screenshot Opportunity**: Add a screenshot of your testing plan document or a spreadsheet showing the test cases.
> 
> ![Testing Strategy Overview](images/Testing_Strategy.png)
> *Figure 1: Systematic Testing Framework*

---

## 3. Day 2: Unit Testing (Backend Services)
Focus shifted to the backend core logic. Each service (Alumni, Employment, Credential) was tested in isolation to ensure data processing and validation rules are strictly followed.

**Activities:**
- Verifying DTO mapping and entity relationships.
- Testing service-level logic for OTP generation and validation.
- Validating file storage service path logic.

> [!TIP]
> **Screenshot Opportunity**: Take a screenshot of your IDE showing successful JUnit test execution or your backend log output demonstrating service hits.
> 
> ![Unit Testing Results](images/Unit_Testing.png)
> *Figure 2: Backend Service Validation*

---

## 4. Day 3: API Testing (Postman)
API endpoints were tested using Postman to verify request-response cycles, status codes, and JSON payloads.

**Activities:**
- Running a full Postman collection against all controllers.
- Testing GET, POST, PUT, and DELETE operations.
- Verifying correct JSON error responses for invalid inputs.

> [!TIP]
> **Screenshot Opportunity**: Provide a screenshot of Postman showing a Successful (200 OK) response for a key API like `/api/alumni/profile`.
> 
> ![API Testing in Postman](images/Postman_Testing.png)
> *Figure 3: API Endpoint Verification*

---

## 5. Day 4: Authentication & Authorization Scenarios
Security is paramount. This day focused on ensuring that restricted areas are only accessible to authorized roles (Admin vs. Alumni).

**Activities:**
- Testing JWT token expiration and renewal.
- Verifying role-based access control (RBAC): Admin vs. Alumni permissions.
- Testing "Access Denied" scenarios for unauthorized routes.

> [!TIP]
> **Screenshot Opportunity**: Show a screenshot of a 403 Forbidden error when a user tries to access an Admin route, or the Login/OTP screen.
> 
> ![Security Handshake](images/Auth_Testing.png)
> *Figure 4: Secure Protocol Validation*

---

## 6. Day 5: Bug Fixing & Performance Optimization
Based on the results from the previous days, identified bugs were patched and system performance was fine-tuned.

**Activities:**
- Fixing "Port in Use" errors and optimizing process management.
- Resolving database connection pool issues.
- Minimizing frontend bundle size and improving API response times.

> [!TIP]
> **Screenshot Opportunity**: Show a "Before and After" or a code snippet where a significant bug was resolved.
> 
> ![Optimization Cycle](images/Bug_Fixes.png)
> *Figure 5: System Refinement and Optimization*

---

## 7. Day 6: System Retesting
After the fixes, a full regression test was performed to ensure that no new issues were introduced during the debugging phase.

**Activities:**
- Re-running the full Postman collection.
- End-to-end testing of the registration-to-verification flow.
- Verifying that dashboard charts reflect live database data accurately.

> [!TIP]
> **Screenshot Opportunity**: Provide a screenshot of the Dashboard showing live charts and synchronized data.
> 
> ![Regression Test Success](images/System_Retest.png)
> *Figure 6: Full System Integrity Confirmation*

---

## 8. Day 7: Final Testing Report & Evidence Compilation
Compilation of all test logs, Postman results, and execution evidence into a final deliverable report.

**Activities:**
- Exporting the Postman Collection.
- Summarizing test metrics (Pass/Fail rates).
- Finalizing the Testing & Debugging documentation.

> [!TIP]
> **Screenshot Opportunity**: Add a screenshot of your final project folder structure or the exported Postman JSON file.
> 
> ![Final Deliverables](images/Final_Report.png)
> *Figure 7: Phase 10 Evidence Pack*

---

## CONCLUSION
The Testing & Debugging phase confirmed that the Academic Verification System is stable, secure, and performant. All core modules have been verified through both automated and manual tests. The system is now fully prepared for deployment and final user review.

---
*Report Finalized by Dusabe Marie Rose*
