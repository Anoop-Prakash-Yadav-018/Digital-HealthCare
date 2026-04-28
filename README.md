# Digital HealthCare

Digital HealthCare is a role-based full-stack healthcare platform for the Indian healthcare ecosystem. It combines secure identity, patient-centric records, medicine price intelligence, hospital demand forecasting, and administrative controls in a production-style React + Express + MongoDB architecture.

## Highlights

- JWT authentication with `patient`, `doctor`, and `admin` roles
- MongoDB persistence with Mongoose models
- Patient and medical-record management with access control
- Tamper-evident audit chain using SHA-256 + HMAC signatures
- Forecast engine for hospital load analysis
- Admin medicine-catalogue management
- Helmet, rate limiting, and centralized error handling
- Automated backend tests with in-memory MongoDB
- Docker-based local deployment support

## Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Auth: JWT, bcrypt
- Security: Helmet, express-rate-limit
- Testing: Vitest, Supertest, mongodb-memory-server

## Seeded Accounts

- Admin: `admin@digitalhealthcare.local` / `Admin@12345`
- Doctor: `doctor@digitalhealthcare.local` / `Doctor@12345`
- Patient: `patient@digitalhealthcare.local` / `Patient@12345`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```powershell
Copy-Item client\.env.example client\.env
Copy-Item server\.env.example server\.env
```

3. Start MongoDB locally, or use Docker Compose.

4. Run the app:

```bash
npm run dev
```

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://localhost:5000/api/health`

## Scripts

- `npm run dev`
- `npm run dev:client`
- `npm run dev:server`
- `npm run build`
- `npm run check`
- `npm run test`

## Docker

Start MongoDB, API, and client together:

```bash
docker compose up --build
```

## Documentation

- `docs/API.md`
- `docs/DEPLOYMENT.md`
- `docs/TESTING.md`

## GitHub Push

Initialize and push this repo:

```bash
git init
git add .
git commit -m "Initial industry-standard Digital HealthCare platform"
git branch -M main
git remote add origin https://github.com/<your-username>/digital-healthcare.git
git push -u origin main
```

If Git asks for authentication, use GitHub Desktop or a Personal Access Token.

## Notes

- The old JSON demo data flow has been replaced by MongoDB-backed persistence.
- The audit system is now cryptographically stronger than the original demo hash chain, but it is still an application-layer integrity log, not a public blockchain network.
- The forecast engine is now deterministic and data-driven, but it remains a lightweight analytics model rather than a trained ML service.
