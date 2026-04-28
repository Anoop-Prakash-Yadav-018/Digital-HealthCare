import crypto from "node:crypto";
import { env } from "../config/env.js";
import Audit from "../models/Audit.js";

function digest(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sign(value) {
  return crypto.createHmac("sha256", env.auditSecret).update(value).digest("hex");
}

export async function createAuditEntry({ patientId, actorUserId, action, payload }) {
  const previousEntry = await Audit.findOne({ patient: patientId }).sort({ createdAt: -1 });
  const previousHash = previousEntry?.hash || "GENESIS";
  const base = `${patientId}:${actorUserId}:${action}:${payload}:${previousHash}:${Date.now()}`;
  const hash = digest(base);
  const signature = sign(`${hash}:${previousHash}`);

  return Audit.create({
    patient: patientId,
    actorUser: actorUserId,
    action,
    payload,
    hash,
    previousHash,
    signature,
  });
}
