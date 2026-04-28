import { Router } from "express";
import authRoutes from "./authRoutes.js";
import bootstrapRoutes from "./bootstrapRoutes.js";
import forecastRoutes from "./forecastRoutes.js";
import healthRoutes from "./healthRoutes.js";
import medicineRoutes from "./medicineRoutes.js";
import patientRoutes from "./patientRoutes.js";
import recordRoutes from "./recordRoutes.js";

const router = Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/bootstrap", bootstrapRoutes);
router.use("/patient", patientRoutes);
router.use("/records", recordRoutes);
router.use("/forecast", forecastRoutes);
router.use("/medicines", medicineRoutes);

export default router;
