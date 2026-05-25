# Telemedicine and Electronic Health Records (EHR) Platform

This project implements a secure, cryptographically compliant backend for a Telemedicine and EHR platform, ensuring robust data security, especially concerning Protected Health Information (PHI).

## Features Implemented in Week 1
* **Secure Database Schema**: MongoDB via Mongoose with structured schemas for Patients, Doctors, Appointments, Medical Records, and Prescriptions.
* **Field-Level Encryption**: Mathematical AES-256-CBC encryption of sensitive PHI prior to database insertion.
* **Audit Logging Middleware**: Immutable trailing of all API access/mutations targeting PHI.
* **Authentication**: Robust JWT-based authentication.

## Getting Started

1. **Clone the repository** (if not already local)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Copy `.env.example` to a new file named `.env` and fill in your actual MongoDB URI, a strong JWT secret, and a 64-character hex ENCRYPTION_KEY (32 bytes).
4. **Run the server**:
   ```bash
   npm run dev
   ```

## Repository Setup and Branch Protection Rules

To enforce code quality and security, you must set up branch protection rules on GitHub:
1. Push this code to a new repository on GitHub.
2. Go to **Settings** > **Branches**.
3. Click **Add branch protection rule**.
4. Set the **Branch name pattern** to `main` (or `master`).
5. Check **Require a pull request before merging**.
6. Check **Require approvals** (set to at least 1).
7. Check **Require status checks to pass before merging** (if you add CI pipelines later).
8. Click **Create** to enforce these rules.
