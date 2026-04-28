import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";
import Medicine from "../models/Medicine.js";
import { asyncHandler, createHttpError } from "../utils/http.js";
import { validateMedicineInput } from "../utils/validation.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const medicines = await Medicine.find().sort({ name: 1 });
    res.json({
      medicines: medicines.map((medicine) => ({
        id: medicine._id,
        name: medicine.name,
        privatePrice: medicine.privatePrice,
        governmentPrice: medicine.governmentPrice,
        category: medicine.category,
        availability: medicine.availability,
      })),
    });
  }),
);

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const payload = validateMedicineInput(req.body);
    const medicine = await Medicine.create(payload);
    res.status(201).json({ medicine });
  }),
);

router.put(
  "/:medicineId",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const payload = validateMedicineInput(req.body);
    const medicine = await Medicine.findByIdAndUpdate(req.params.medicineId, payload, {
      new: true,
      runValidators: true,
    });

    if (!medicine) {
      throw createHttpError(404, "Medicine not found.");
    }

    res.json({ medicine });
  }),
);

router.delete(
  "/:medicineId",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const medicine = await Medicine.findById(req.params.medicineId);

    if (!medicine) {
      throw createHttpError(404, "Medicine not found.");
    }

    await medicine.deleteOne();
    res.json({ message: "Medicine deleted successfully." });
  }),
);

export default router;
