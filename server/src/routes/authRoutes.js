import jwt from "jsonwebtoken";
import { Router } from "express";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import { asyncHandler, createHttpError } from "../utils/http.js";
import { validateAuthInput, validatePatientInput } from "../utils/validation.js";

const router = Router();

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    linkedPatientId: user.linkedPatient?._id || user.linkedPatient || null,
  };
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = validateAuthInput(req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      throw createHttpError(409, "An account with this email already exists.");
    }

    const patientProfile = validatePatientInput(req.body.patientProfile || {});
    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "patient",
    });

    const patient = await Patient.create({
      ...patientProfile,
      initials: getInitials(patientProfile.name) || "PT",
      createdBy: user._id,
      ownerUser: user._id,
    });

    user.linkedPatient = patient._id;
    await user.save();

    const hydratedUser = await User.findById(user._id).populate("linkedPatient");

    res.status(201).json({
      token: signToken(hydratedUser),
      user: serializeUser(hydratedUser),
    });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = validateAuthInput(req.body, { requireName: false });
    const user = await User.findOne({ email }).populate("linkedPatient");

    if (!user || !(await user.comparePassword(password))) {
      throw createHttpError(401, "Invalid email or password.");
    }

    res.json({
      token: signToken(user),
      user: serializeUser(user),
    });
  }),
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: serializeUser(req.user) });
  }),
);

export default router;
