import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Audit from "../models/Audit.js";
import Medicine from "../models/Medicine.js";
import Patient from "../models/Patient.js";
import Record from "../models/Record.js";
import { buildDashboard } from "../services/dashboardService.js";
import { generateForecast } from "../services/forecastService.js";
import { asyncHandler, createHttpError } from "../utils/http.js";

const router = Router();

function formatPatient(patient) {
  return {
    id: patient._id,
    name: patient.name,
    initials: patient.initials,
    age: patient.age,
    gender: patient.gender,
    city: patient.city,
    healthId: patient.healthId,
  };
}

function formatRecord(record) {
  return {
    id: record._id,
    patientId: record.patient.toString(),
    diagnosis: record.diagnosis,
    provider: record.provider,
    notes: record.notes,
    date: new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(record.createdAt),
    updatedAt:
      record.updatedAt && record.updatedAt.getTime() !== record.createdAt.getTime()
        ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(record.updatedAt)
        : undefined,
  };
}

async function getVisiblePatients(user) {
  if (user.role === "patient") {
    return user.linkedPatient ? [await Patient.findById(user.linkedPatient)] : [];
  }

  return Patient.find().sort({ createdAt: -1 });
}

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const visiblePatients = (await getVisiblePatients(req.user)).filter(Boolean);
    const requestedPatientId = req.query.patientId;
    const activePatient =
      visiblePatients.find((patient) => patient._id.toString() === requestedPatientId) || visiblePatients[0] || null;

    if (requestedPatientId && !activePatient) {
      throw createHttpError(404, "Requested patient is not available for this account.");
    }

    const [records, audits, medicines, totalRecords] = await Promise.all([
      activePatient ? Record.find({ patient: activePatient._id }).sort({ createdAt: -1 }) : [],
      activePatient ? Audit.find({ patient: activePatient._id }).sort({ createdAt: -1 }) : [],
      Medicine.find().sort({ name: 1 }),
      Record.countDocuments(),
    ]);

    const forecast = generateForecast({
      recordsCount: totalRecords,
      patientCount: visiblePatients.length,
      doctors: 9,
    });

    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      patients: visiblePatients.map(formatPatient),
      selectedPatientId: activePatient?._id?.toString() || "",
      patient: activePatient ? formatPatient(activePatient) : { id: "", name: "", initials: "DH", healthId: "" },
      records: records.map(formatRecord),
      audits: audits.map((audit) => ({
        id: audit._id,
        action: audit.action,
        timestamp: new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(audit.createdAt),
        hash: audit.hash,
      })),
      medicines: medicines.map((medicine) => ({
        id: medicine._id,
        name: medicine.name,
        privatePrice: medicine.privatePrice,
        governmentPrice: medicine.governmentPrice,
        category: medicine.category,
        availability: medicine.availability,
      })),
      forecast,
      dashboard: buildDashboard({
        forecast,
        medicines,
        recordsDigitized: totalRecords,
      }),
    });
  }),
);

export default router;
