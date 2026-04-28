import crypto from "node:crypto";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";
import Audit from "../models/Audit.js";
import Patient from "../models/Patient.js";
import Record from "../models/Record.js";
import { createAuditEntry } from "../services/auditService.js";
import { asyncHandler, createHttpError } from "../utils/http.js";
import { validatePatientInput } from "../utils/validation.js";

const router = Router();

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

async function getAccessiblePatient(user, patientId) {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw createHttpError(404, "Patient not found.");
  }

  if (user.role === "patient" && patient.ownerUser?.toString() !== user._id.toString()) {
    throw createHttpError(403, "You do not have access to this patient.");
  }

  return patient;
}

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const patients =
      req.user.role === "patient"
        ? await Patient.find({ ownerUser: req.user._id }).sort({ createdAt: -1 })
        : await Patient.find().sort({ createdAt: -1 });

    res.json({
      patients: patients.map((patient) => ({
        id: patient._id,
        name: patient.name,
        initials: patient.initials,
        age: patient.age,
        gender: patient.gender,
        city: patient.city,
        healthId: patient.healthId,
      })),
    });
  }),
);

router.post(
  "/",
  requireAuth,
  requireRole("admin", "doctor"),
  asyncHandler(async (req, res) => {
    const payload = validatePatientInput(req.body);
    const patient = await Patient.create({
      ...payload,
      initials: getInitials(payload.name) || "PT",
      createdBy: req.user._id,
    });

    res.status(201).json({
      patient: {
        id: patient._id,
        name: patient.name,
        initials: patient.initials,
        age: patient.age,
        gender: patient.gender,
        city: patient.city,
        healthId: patient.healthId,
      },
    });
  }),
);

router.put(
  "/:patientId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const payload = validatePatientInput(req.body);
    const patient = await getAccessiblePatient(req.user, req.params.patientId);

    if (req.user.role === "doctor" && patient.ownerUser?.toString() === req.user._id.toString()) {
      throw createHttpError(403, "Doctor accounts cannot own patient profiles.");
    }

    Object.assign(patient, payload, { initials: getInitials(payload.name) || "PT" });
    await patient.save();

    res.json({
      patient: {
        id: patient._id,
        name: patient.name,
        initials: patient.initials,
        age: patient.age,
        gender: patient.gender,
        city: patient.city,
        healthId: patient.healthId,
      },
    });
  }),
);

router.delete(
  "/:patientId",
  requireAuth,
  requireRole("admin", "doctor"),
  asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.patientId);

    if (!patient) {
      throw createHttpError(404, "Patient not found.");
    }

    await Promise.all([
      Record.deleteMany({ patient: patient._id }),
      Audit.deleteMany({ patient: patient._id }),
      patient.deleteOne(),
    ]);

    res.json({ message: "Patient deleted successfully." });
  }),
);

router.post(
  "/:patientId/health-id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const patient = await getAccessiblePatient(req.user, req.params.patientId);

    if (!patient.healthId) {
      patient.healthId = `IN-UP-${crypto.randomInt(10_000_000, 99_999_999)}`;
      await patient.save();
      await createAuditEntry({
        patientId: patient._id,
        actorUserId: req.user._id,
        action: "Digital Health ID generated",
        payload: patient.healthId,
      });
    }

    res.json({
      patient: {
        id: patient._id,
        name: patient.name,
        initials: patient.initials,
        age: patient.age,
        gender: patient.gender,
        city: patient.city,
        healthId: patient.healthId,
      },
      message: "Health ID is available for this patient.",
    });
  }),
);

export default router;
