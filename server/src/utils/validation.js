const PATIENT_GENDERS = new Set(["Female", "Male", "Other"]);

function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function buildError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function validateAuthInput(input, options = { requireName: true }) {
  const name = sanitizeText(input?.name);
  const email = sanitizeText(input?.email).toLowerCase();
  const password = sanitizeText(input?.password);

  if ((options.requireName && !name) || !email || !password) {
    throw buildError(400, options.requireName ? "Name, email, and password are required." : "Email and password are required.");
  }

  if (options.requireName && name.length < 3) {
    throw buildError(400, "Name must be at least 3 characters long.");
  }

  if (!email.includes("@")) {
    throw buildError(400, "Please enter a valid email address.");
  }

  if (password.length < 8) {
    throw buildError(400, "Password must be at least 8 characters long.");
  }

  return options.requireName ? { name, email, password } : { email, password };
}

export function validatePatientInput(input) {
  const name = sanitizeText(input?.name);
  const gender = sanitizeText(input?.gender);
  const city = sanitizeText(input?.city);
  const numericAge = Number(input?.age);

  if (!name || !gender || !city || Number.isNaN(numericAge)) {
    throw buildError(400, "Name, age, gender, and city are required.");
  }

  if (name.length < 3) {
    throw buildError(400, "Name must be at least 3 characters long.");
  }

  if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 120) {
    throw buildError(400, "Age must be a valid number between 1 and 120.");
  }

  if (!PATIENT_GENDERS.has(gender)) {
    throw buildError(400, "Gender must be Female, Male, or Other.");
  }

  if (city.length < 2) {
    throw buildError(400, "City must be at least 2 characters long.");
  }

  return { name, age: numericAge, gender, city };
}

export function validateRecordInput(input) {
  const diagnosis = sanitizeText(input?.diagnosis);
  const provider = sanitizeText(input?.provider);
  const notes = sanitizeText(input?.notes);

  if (!diagnosis || !provider || !notes) {
    throw buildError(400, "Diagnosis, provider, and notes are required.");
  }

  if (diagnosis.length < 3) {
    throw buildError(400, "Diagnosis must be at least 3 characters long.");
  }

  if (provider.length < 3) {
    throw buildError(400, "Doctor / Hospital must be at least 3 characters long.");
  }

  if (notes.length < 5) {
    throw buildError(400, "Notes must be at least 5 characters long.");
  }

  return { diagnosis, provider, notes };
}

export function validateMedicineInput(input) {
  const name = sanitizeText(input?.name);
  const category = sanitizeText(input?.category);
  const availability = sanitizeText(input?.availability || "Available");
  const privatePrice = Number(input?.privatePrice);
  const governmentPrice = Number(input?.governmentPrice);

  if (!name || !category || Number.isNaN(privatePrice) || Number.isNaN(governmentPrice)) {
    throw buildError(400, "Medicine name, category, private price, and government price are required.");
  }

  if (privatePrice < 0 || governmentPrice < 0) {
    throw buildError(400, "Medicine prices must be zero or greater.");
  }

  return { name, category, availability, privatePrice, governmentPrice };
}
