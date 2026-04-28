import "dotenv/config";

export const env = {
  port: process.env.PORT || 5000,
  clientOrigins: (process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173,http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim()),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017",
  mongoDbName: process.env.MONGODB_DB_NAME || "digital-healthcare",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  auditSecret: process.env.AUDIT_SECRET || "change-me-too",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 250),
  seedAdminName: process.env.SEED_ADMIN_NAME || "Platform Admin",
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || "admin@digitalhealthcare.local",
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || "Admin@12345",
  seedDoctorName: process.env.SEED_DOCTOR_NAME || "Duty Doctor",
  seedDoctorEmail: process.env.SEED_DOCTOR_EMAIL || "doctor@digitalhealthcare.local",
  seedDoctorPassword: process.env.SEED_DOCTOR_PASSWORD || "Doctor@12345",
};
