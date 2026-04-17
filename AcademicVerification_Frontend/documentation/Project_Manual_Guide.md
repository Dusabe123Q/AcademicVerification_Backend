# Academic Verification System: System Presentation & Design Guide

## 1. Design Philosophy & Aesthetics
The visual identity of **AcademiVerify** is built on the concept of a **"Digital Academic Vault."**

### Color Palette Rationale:
*   **Deep Dark Background (`#0a0a12`):** Chosen to represent high-end security and the "invisible" layer of protection. It creates a focused environment where data stands out clearly.
*   **Emerald & Teal Gradients:** 
    *   **Emerald (#10b981):** Represents Trust, Legitimacy, and Academic Success. It is the color of "Verified" status.
    *   **Teal (#14b8a6):** Represents Growth and Professionalism. 
*   **Glassmorphism (Blurred Overlays):** Uses translucent "glass" cards to symbolize **Transparency**. While the system is secure, the verification process is clear and open for stakeholders.

---

## 2. Solving the Problem (The Landing Page)
The **Public Home Page** is designed to address the core problem: **Lack of instant trust in academic documents.**

*   **The Hook:** "True Academic Verification."
*   **The Solution:** An instant search bar where an employer can enter a serial number and get a verified result in seconds, bypassing weeks of manual paperwork.
*   **Key Features Highlighted:** Instant Trust, Global Reach, and Data Integrity.

---

## 3. Page-by-Page Functionality Guide

### A. Public Home (The Entry Point)
*   **Purpose:** Allows external entities (Employers, Institutions) to verify a document without needing an account.
*   **Action:** Enter Serial Number -> View Verification Status.

### B. Login & OTP Portal
*   **Purpose:** Secure gateway using Two-Factor Authentication (OTP).
*   **Action:** Ensures only verified email owners can access the system.

### C. Strategic Oversight Dashboard
*   **Purpose:** Provides a "Bird's Eye View" of the entire system.
*   **Features:** Live charts showing alumni growth trends and verification success rates.

### D. Alumni Identity Bank (Records)
*   **Purpose:** The central database of all graduates.
*   **Admin Features:** Adding new graduates, searching by "Cohort Cycle" (Year), and managing identities.

### E. Personal Identity Ledger (Profile)
*   **Purpose:** Where the Alumni manages their own data.
*   **Features:** Profile image upload, Career bio management, and viewing their verified Certificate.

---

## 4. Documentation Guide (For Google Docs)
*To move this to Google Docs, copy the sections below. I have indicated exactly where to paste your screenshots.*

### [COPY START]

## PHASE 10: TESTING & DEBUGGING REPORT
**Duration**: 11 Apr – 17 Apr 2026

### Day 1: Strategy
Defined the testing scope for authentication and verification.
> ![Introduction](images/home(welcome.png)
> *Description: This screenshot shows the starting point of the system.*

### Day 2: Unit Testing
Tested individual backend services for data integrity.
> ![Backend Logs](images/academicverify.png)
> *Description: Shows the backend server running successfully on Port 8081.*

### Day 3: API Testing
Verified all endpoints (Alumni, Profile, Verification) using Postman.
> ![API Test](images/otp%20email.png)
> *Description: Shows a successful JSON response from the API (OTP Verification).*

### Day 4: Security Testing
Tested OTP login and role-based access.
> ![Login Portal](images/Screenshot%202026-04-10%20145157.png)
> *Description: Shows the secure entry portal.*

### Day 5: Optimization
Fixed port conflicts and improved loading speeds.
> ![Dashboard](images/dashbord.png)
> *Description: Shows the system intelligence and metrics.*

### Day 6: Retesting
Confirmed full system stability after bug fixes.
> ![Alumni Records](images/Screenshot%202026-04-10%20162715.png)
> *Description: Shows the database synchronized and searchable.*

### Day 7: Final Report
Compilation of evidence and project finalization.
> ![Profile Page](images/Screenshot%202026-04-10%20144751.png)
> *Description: Shows a finalized user identity record.*

### [COPY END]
