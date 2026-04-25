![Academic Verification Banner](file:///C:/Users/USER/.gemini/antigravity/brain/0bbe01c5-3a1e-4329-964a-79a6c43b8bad/academic_verification_banner_1777125130592.png)

# 🎓 Academic Credential Verification & Alumni Tracking System

An end-to-end institutional platform designed for secure academic identity management, automated credential issuance, and lifecycle alumni tracking. Built with high-integrity protocols and a modern user experience.

---

## 🔑 Test Credentials

Use the following accounts to access different sections of the system. All passwords follow a standard demo format.

| Role | Username | Password | Email | Key Features |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | `admin` | `admin123` | `admin@rp.ac.rw` | Full Control, Student Registry, Audit Logs |
| **Alumni** | `alumni_demo` | `password123` | `demo.alumni@gmail.com` | Profile Management, Work History, Notifications |
| **Employer** | `employer_demo` | `password123` | `demo.employer@gmail.com` | Verification History, Report Generation |

---

## 🚀 System Access Flow (User Manual)

Follow these steps to experience the full lifecycle of the system:

### Phase 1: Public Verification (Anonymous)
1. Navigate to the **Home Page**.
2. Locate the **"Public Verification"** section.
3. Enter a test Serial Number: `SN-DUS-2023-A1`.
4. **Result**: The system fetches the student's identity and graduation status from the database instantly.

### Phase 2: Administrative Control (Admin)
1. **Login** as `admin`.
2. **Dashboard**: View system-wide statistics (Total Students, Alumni, Verifications).
3. **Student Registry**: Navigate to "Students" to Add, Edit, or Delete student records.
4. **System Ledger**: Access "Audit Logs" to see the immutable history of all system actions.

### Phase 3: Alumni Professional Identity (Alumni)
1. **Login** as `alumni_demo`.
2. **Profile**: Update professional information (current employer, position).
3. **Work Experience**: Add new career milestones to the institutional database.
4. **Notifications**: Check for updates regarding credential requests or institutional news.

### Phase 4: Employment Verification (Employer)
1. **Login** as `employer_demo`.
2. **Verify New**: Submit a formal request to verify a candidate's credentials.
3. **History**: View all previously verified credentials.
4. **PDF Generation**: Download official verification reports for internal records.

---

## 🌟 Key Features

### 🏛️ Student Registry & Lifecycle
- **Unified Identity Management**: Register and manage student records with multi-departmental support.
- **Automated Migration**: High-integrity graduation protocol that migrates active student identities into the Alumni Ledger.

### 🛡️ Secure Credentialing
- **Blockchain-Inspired Ledger**: Every credential issued is recorded in an immutable audit trail.
- **Verification Engine**: Dedicated internal and public nodes for validating academic credentials via unique serial identifiers.

### 📊 Administrative Oversight
- **Real-Time Audit Logs**: Complete transparency with categorized logs (CREATE, UPDATE, DELETE, LOGIN) for all system events.
- **Notification Synergy**: Instant visual synchronization for all administrative actions and security rotations.

### 🤝 Alumni Engagement
- **Profile Management**: Self-service portals for alumni to manage professional profiles and employment history.
- **Career Tracking**: Institutional oversight of alumni outcomes and employment trends.

---

## 🛠️ Technology Stack

- **Backend**: Java 17+, Spring Boot 3.x, Spring Security (JWT), Spring Data JPA.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **Database**: MySQL 5.5.5+ (Development), H2/PostgreSQL (Optional).
- **Security**: JWT-based authentication, password hashing, and role-based access control (RBAC).

---

## ⚙️ Setup & Installation

### Backend
1. Ensure **Java 17+** and **MySQL** are installed.
2. Create a database named `academic_verification`.
3. Update `src/main/resources/application.properties` with your credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/academic_verification
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend
1. Navigate to the frontend directory: `cd AcademicVerification_Frontend` (or project root).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛠️ Technical Notes
*   **Security**: Uses JWT (JSON Web Tokens) for session management. Sessions expire after 24 hours.
*   **Database**: Demo data is automatically synchronized on startup via the `DataInitializer`.
*   **Audit**: Every login and verification event is cryptographically logged in the System Ledger.

---

**Developed by**: Dusabe Marie Rose 🔒  
**Status**: Demo-Ready v1.0