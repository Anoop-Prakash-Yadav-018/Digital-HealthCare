import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    privatePrice: { type: Number, required: true, min: 0 },
    governmentPrice: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    availability: { type: String, default: "Available", trim: true },
  },
  { timestamps: true },
);

export default mongoose.model("Medicine", medicineSchema);
