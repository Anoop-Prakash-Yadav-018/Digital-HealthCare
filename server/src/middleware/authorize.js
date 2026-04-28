import { createHttpError } from "../utils/http.js";

export function requireRole(...roles) {
  return function authorize(req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(createHttpError(403, "You do not have access to this resource."));
    }

    return next();
  };
}
