# Telemedicine and Electronic Health Records Platform

This is the final repository for the Telemedicine EHR application. 

## Cryptographic Algorithms Used
* **Database**: AES-256 for field-level encryption of Protected Health Information (PHI). *(Note: Implemented using Mongoose middleware prior to this sprint).*
* **Authentication**: JWT (JSON Web Tokens) for securing all API endpoints.
* **Telehealth**: WebRTC (SRTP/DTLS) for secure, peer-to-peer end-to-end encrypted video channels.
* **Prescriptions**: SHA-256 hashing to generate a unique digital signature for PDF prescriptions, embedded as a scannable QR Code.

## Local Development & Setup
If you don't want to use Docker, you can run this manually:

1. **Backend**:
   ```bash
   npm install
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Docker Deployment (Easiest Way!)
I finally figured out Docker! Just run this command in the root folder:

```bash
docker-compose up --build
```
This will spin up:
- MongoDB database
- Node.js API (Port 5000)
- React Frontend via Nginx (Port 8080)

## Security Audit
To run a security audit and check for vulnerabilities in the dependencies (as required for Week 4), simply run:
```bash
npm run audit:check
```

---
*Created by the intern.*
