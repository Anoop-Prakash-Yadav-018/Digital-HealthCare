import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;
let app;
let connectDatabase;
let seedDatabase;
let Medicine;

describe("Digital HealthCare API", () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();
    process.env.MONGODB_DB_NAME = "digital-healthcare-test";
    process.env.JWT_SECRET = "test-secret";
    process.env.AUDIT_SECRET = "audit-secret";

    ({ default: app } = await import("./app.js"));
    ({ connectDatabase } = await import("./config/db.js"));
    ({ seedDatabase } = await import("./services/seedService.js"));
    ({ default: Medicine } = await import("./models/Medicine.js"));

    await connectDatabase();
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await seedDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it("logs in with seeded admin credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@digitalhealthcare.local",
      password: "Admin@12345",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.role).toBe("admin");
  });

  it("registers a patient account", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Amrita Sharma",
      email: "amrita@example.com",
      password: "Amrita@123",
      patientProfile: {
        name: "Amrita Sharma",
        age: 29,
        gender: "Female",
        city: "Delhi",
      },
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.role).toBe("patient");
  });

  it("protects admin medicine creation from patient accounts", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "patient@digitalhealthcare.local",
      password: "Patient@12345",
    });

    const response = await request(app)
      .post("/api/medicines")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        name: "New Medicine",
        privatePrice: 100,
        governmentPrice: 30,
        category: "General",
        availability: "Available",
      });

    expect(response.status).toBe(403);
  });

  it("allows admins to create medicines", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "admin@digitalhealthcare.local",
      password: "Admin@12345",
    });

    const response = await request(app)
      .post("/api/medicines")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({
        name: "Insulin 100IU",
        privatePrice: 240,
        governmentPrice: 90,
        category: "Diabetes",
        availability: "Available",
      });

    expect(response.status).toBe(201);
    expect(response.body.medicine.name).toBe("Insulin 100IU");
    expect(await Medicine.countDocuments()).toBeGreaterThan(0);
  });
});
