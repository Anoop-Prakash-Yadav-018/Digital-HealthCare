import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";
import Patient from "../models/Patient.js";
import Record from "../models/Record.js";
import Medicine from "../models/Medicine.js";
import { buildDashboard } from "../services/dashboardService.js";
import { generateForecast } from "../services/forecastService.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.post(
  "/simulate",
  requireAuth,
  requireRole("admin", "doctor"),
  asyncHandler(async (req, res) => {
    const [recordsCount, patientCount, medicines] = await Promise.all([
      Record.countDocuments(),
      Patient.countDocuments(),
      Medicine.find(),
    ]);
    const doctors = Number(req.body?.doctors) > 0 ? Number(req.body.doctors) : 9;
    const forecast = generateForecast({ recordsCount, patientCount, doctors });

    res.json({
      forecast,
      dashboard: buildDashboard({
        forecast,
        medicines,
        recordsDigitized: recordsCount,
      }),
    });
  }),
);

export default router;
