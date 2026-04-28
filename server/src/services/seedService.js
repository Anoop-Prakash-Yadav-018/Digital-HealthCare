import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Medicine from "../models/Medicine.js";
import { env } from "../config/env.js";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const defaultMedicines = [
  { name: "Paracetamol 500mg", privatePrice: 28, governmentPrice: 8, category: "Fever and pain" },
  { name: "Amlodipine 5mg", privatePrice: 76, governmentPrice: 18, category: "Blood pressure" },
  { name: "Metformin 500mg", privatePrice: 64, governmentPrice: 14, category: "Diabetes" },
  { name: "Atorvastatin 10mg", privatePrice: 118, governmentPrice: 29, category: "Cholesterol" },
  { name: "Cetirizine 10mg", privatePrice: 36, governmentPrice: 7, category: "Allergy" },
  { name: "Pantoprazole 40mg", privatePrice: 92, governmentPrice: 21, category: "Acidity" },
];

export async function seedDatabase() {
  const [userCount, medicineCount] = await Promise.all([User.countDocuments(), Medicine.countDocuments()]);

  if (!medicineCount) {
    await Medicine.insertMany(defaultMedicines);
  }

  if (userCount) {
    return;
  }

  const adminPasswordHash = await User.hashPassword(env.seedAdminPassword);
  const doctorPasswordHash = await User.hashPassword(env.seedDoctorPassword);
  const patientPasswordHash = await User.hashPassword("Patient@12345");

  const admin = await User.create({
    name: env.seedAdminName,
    email: env.seedAdminEmail,
    passwordHash: adminPasswordHash,
    role: "admin",
  });

  await User.create({
    name: env.seedDoctorName,
    email: env.seedDoctorEmail,
    passwordHash: doctorPasswordHash,
    role: "doctor",
  });

  const patientProfile = await Patient.create({
    name: "Aarav Yadav",
    initials: getInitials("Aarav Yadav"),
    age: 24,
    gender: "Male",
    city: "Lucknow",
    createdBy: admin._id,
  });

  const patientUser = await User.create({
    name: "Aarav Yadav",
    email: "patient@digitalhealthcare.local",
    passwordHash: patientPasswordHash,
    role: "patient",
    linkedPatient: patientProfile._id,
  });

  patientProfile.ownerUser = patientUser._id;
  await patientProfile.save();
}
