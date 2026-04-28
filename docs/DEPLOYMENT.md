# Deployment Guide

## Recommended Split

- Frontend: Vercel
- Backend API: Render or Railway
- Database: MongoDB Atlas

This is the cleanest production setup for the current monorepo.

## 1. MongoDB Atlas

Create a MongoDB Atlas cluster and copy the connection string.

Example:

```text
mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
```

Use a database name such as:

```text
digital-healthcare
```

## 2. Deploy Backend

### Render

Create a new `Web Service` from this GitHub repo.

Settings:

- Root directory: `server`
- Environment: `Node`
- Build command:

```bash
npm install
```

- Start command:

```bash
npm run start
```

Environment variables:

- `PORT=5000`
- `CLIENT_ORIGIN=https://<your-vercel-domain>`
- `MONGODB_URI=<your-atlas-uri>`
- `MONGODB_DB_NAME=digital-healthcare`
- `JWT_SECRET=<strong-random-secret>`
- `JWT_EXPIRES_IN=7d`
- `AUDIT_SECRET=<strong-random-secret>`
- `RATE_LIMIT_WINDOW_MS=900000`
- `RATE_LIMIT_MAX=250`
- `SEED_ADMIN_NAME=Platform Admin`
- `SEED_ADMIN_EMAIL=admin@digitalhealthcare.local`
- `SEED_ADMIN_PASSWORD=<change-this>`
- `SEED_DOCTOR_NAME=Duty Doctor`
- `SEED_DOCTOR_EMAIL=doctor@digitalhealthcare.local`
- `SEED_DOCTOR_PASSWORD=<change-this>`

## 3. Deploy Frontend

### Vercel

Import the same GitHub repo.

Settings:

- Root directory: `client`
- Framework preset: `Vite`
- Build command:

```bash
npm run build
```

- Output directory:

```text
dist
```

Environment variable:

- `VITE_API_BASE_URL=https://<your-backend-domain>/api`

## 4. Post-Deploy Checks

After deployment:

1. Open the frontend URL.
2. Log in with the seeded admin account.
3. Confirm `/api/health` works on the backend.
4. Create a patient, add a record, and update a medicine entry.
5. Confirm frontend requests are hitting the deployed API URL.

## Alternative

You can also deploy the full stack with Docker on Railway, Fly.io, or a VPS, but Vercel + Render + Atlas is the easiest path for this project.
