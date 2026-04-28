import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { createHttpError } from "../utils/http.js";

export async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw createHttpError(401, "Authentication required.");
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).populate("linkedPatient");

    if (!user) {
      throw createHttpError(401, "User session is no longer valid.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.status ? error : createHttpError(401, "Invalid or expired token."));
  }
}
