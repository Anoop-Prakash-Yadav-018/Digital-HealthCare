const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

let authToken = "";

export function setAuthToken(token) {
  authToken = token || "";
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Unable to connect to the backend API.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed." }));
    throw new Error(error.message || "Request failed.");
  }

  return response.json();
}

export function loginRequest(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function registerRequest(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getBootstrap(patientId = "") {
  const query = patientId ? `?patientId=${encodeURIComponent(patientId)}` : "";
  return request(`/bootstrap${query}`);
}

export function createPatientRequest(patient) {
  return request("/patient", {
    method: "POST",
    body: JSON.stringify(patient),
  });
}

export function updatePatientRequest(patientId, patient) {
  return request(`/patient/${patientId}`, {
    method: "PUT",
    body: JSON.stringify(patient),
  });
}

export function deletePatientRequest(patientId) {
  return request(`/patient/${patientId}`, { method: "DELETE" });
}

export function generateHealthIdRequest(patientId) {
  return request(`/patient/${patientId}/health-id`, { method: "POST" });
}

export function saveRecordRequest(record) {
  return request("/records", {
    method: "POST",
    body: JSON.stringify(record),
  });
}

export function updateRecordRequest(recordId, record) {
  return request(`/records/${recordId}`, {
    method: "PUT",
    body: JSON.stringify(record),
  });
}

export function deleteRecordRequest(recordId) {
  return request(`/records/${recordId}`, { method: "DELETE" });
}

export function simulateForecastRequest(payload = {}) {
  return request("/forecast/simulate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function createMedicineRequest(medicine) {
  return request("/medicines", {
    method: "POST",
    body: JSON.stringify(medicine),
  });
}

export function updateMedicineRequest(medicineId, medicine) {
  return request(`/medicines/${medicineId}`, {
    method: "PUT",
    body: JSON.stringify(medicine),
  });
}

export function deleteMedicineRequest(medicineId) {
  return request(`/medicines/${medicineId}`, { method: "DELETE" });
}
