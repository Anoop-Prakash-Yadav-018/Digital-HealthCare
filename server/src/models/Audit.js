import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    actorUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true, trim: true },
    payload: { type: String, required: true, trim: true },
    hash: { type: String, required: true },
    previousHash: { type: String, required: true },
    signature: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Audit", auditSchema);
