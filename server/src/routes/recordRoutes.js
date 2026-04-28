import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Patient from "../models/Patient.js";
import Record from "../models/Record.js";
import { createAuditEntry } from "../services/auditService.js";
import { asyncHandler, createHttpError } from "../utils/http.js";
import { validateRecordInput } from "../utils/validation.js";

const router = Router();

async function ensurePatientAccess(user, patientId) {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw createHttpError(404, "Patient not found.");
  }

  if (user.role === "patient" && patient.ownerUser?.toString() !== user._id.toString()) {
    throw createHttpError(403, "You do not have access to this patient.");
  }

  return patient;
}

async function ensureRecordAccess(user, recordId) {
  const record = await Record.findById(recordId).populate("patient");

  if (!record) {
    throw createHttpError(404, "Record not found.");
  }

  if (user.role === "patient" && record.patient.ownerUser?.toString() !== user._id.toString()) {
    throw createHttpError(403, "You do not have access to this record.");
  }

  return record;
}

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const payload = validateRecordInput(req.body);
    const patientId = req.body.patientId;

    if (!patientId) {
      throw createHttpError(400, "A patient ID is required.");
    }

    const patient = await ensurePatientAccess(req.user, patientId);
    const record = await Record.create({
      patient: patient._id,
      ...payload,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await createAuditEntry({
      patientId: patient._id,
      actorUserId: req.user._id,
      action: "Medical record saved",
      payload: `${record.diagnosis}-${record.provider}`,
    });

    res.status(201).json({
      record: {
        id: record._id,
        patientId: patient._id,
        diagnosis: record.diagnosis,
        provider: record.provider,
        notes: record.notes,
      },
    });
  }),
);

router.put(
  "/:recordId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const payload = validateRecordInput(req.body);
    const record = await ensureRecordAccess(req.user, req.params.recordId);

    record.diagnosis = payload.diagnosis;
    record.provider = payload.provider;
    record.notes = payload.notes;
    record.updatedBy = req.user._id;
    await record.save();

    await createAuditEntry({
      patientId: record.patient._id,
      actorUserId: req.user._id,
      action: "Medical record updated",
      payload: `${record.diagnosis}-${record.provider}`,
    });

    res.json({ message: "Medical record updated successfully." });
  }),
);

router.delete(
  "/:recordId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const record = await ensureRecordAccess(req.user, req.params.recordId);

    await createAuditEntry({
      patientId: record.patient._id,
      actorUserId: req.user._id,
      action: "Medical record deleted",
      payload: `${record.diagnosis}-${record.provider}`,
    });

    await record.deleteOne();

    res.json({ message: "Medical record deleted successfully." });
  }),
);

export default router;
