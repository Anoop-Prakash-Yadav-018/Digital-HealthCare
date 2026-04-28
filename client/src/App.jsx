import React, { useEffect, useMemo, useState } from "react";
import AdminView from "./components/AdminView.jsx";
import AuthView from "./components/AuthView.jsx";
import HospitalView from "./components/HospitalView.jsx";
import PatientView from "./components/PatientView.jsx";
import PharmacyView from "./components/PharmacyView.jsx";
import PolicyView from "./components/PolicyView.jsx";
import {
  createMedicineRequest,
  createPatientRequest,
  deleteMedicineRequest,
  deletePatientRequest,
  deleteRecordRequest,
  generateHealthIdRequest,
  getBootstrap,
  loginRequest,
  registerRequest,
  saveRecordRequest,
  setAuthToken,
  simulateForecastRequest,
  updateMedicineRequest,
  updatePatientRequest,
  updateRecordRequest,
} from "./services/api.js";

const emptyRecordForm = { diagnosis: "", provider: "", notes: "" };
const emptyPatientForm = { name: "", age: "", gender: "", city: "" };
const emptyMedicineForm = { name: "", privatePrice: "", governmentPrice: "", category: "", availability: "Available" };
const emptyLoginForm = { email: "", password: "" };
const emptyRegisterForm = {
  name: "",
  email: "",
  password: "",
  patientProfile: { name: "", age: "", gender: "", city: "" },
};

export default function App() {
  const storedToken = window.localStorage.getItem("dhc_token") || "";
  const [activeView, setActiveView] = useState("patient");
  const [token, setToken] = useState(storedToken);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyLoginForm);
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patient, setPatient] = useState({ id: "", name: "", initials: "", healthId: "" });
  const [records, setRecords] = useState([]);
  const [audits, setAudits] = useState([]);
  const [forecast, setForecast] = useState({ doctors: 0, hourlyLoad: [] });
  const [medicines, setMedicines] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [medicineQuery, setMedicineQuery] = useState("");
  const [medicineForm, setMedicineForm] = useState(emptyMedicineForm);
  const [editingMedicineId, setEditingMedicineId] = useState("");
  const [form, setForm] = useState(emptyRecordForm);
  const [patientForm, setPatientForm] = useState(emptyPatientForm);
  const [editingPatientId, setEditingPatientId] = useState("");
  const [editingRecordId, setEditingRecordId] = useState("");
  const [feedback, setFeedback] = useState({ type: "success", message: "" });
  const [status, setStatus] = useState(storedToken ? "Loading backend data..." : "Sign in to continue.");
  const [busyAction, setBusyAction] = useState("");

  function applyPatientPayload(data) {
    setCurrentUser(data.user);
    setPatients(data.patients);
    setSelectedPatientId(data.selectedPatientId);
    setPatient(data.patient);
    setRecords(data.records);
    setAudits(data.audits);
    setDashboard(data.dashboard);
  }

  async function loadBootstrap(patientId = "") {
    const data = await getBootstrap(patientId);
    applyPatientPayload(data);
    setForecast(data.forecast);
    setMedicines(data.medicines);
    setStatus("Connected to backend API");
  }

  useEffect(() => {
    setAuthToken(token);

    if (!token) {
      return;
    }

    loadBootstrap()
      .catch((error) => {
        setFeedback({ type: "error", message: error.message || "Session expired. Please sign in again." });
        handleLogout();
      });
  }, [token]);

  const filteredMedicines = useMemo(
    () => medicines.filter((medicine) => medicine.name.toLowerCase().includes(medicineQuery.trim().toLowerCase())),
    [medicines, medicineQuery],
  );

  function resetForms() {
    setForm(emptyRecordForm);
    setPatientForm(emptyPatientForm);
    setMedicineForm(emptyMedicineForm);
    setEditingMedicineId("");
    setEditingPatientId("");
    setEditingRecordId("");
  }

  function handleAuthSuccess(data) {
    window.localStorage.setItem("dhc_token", data.token);
    setToken(data.token);
    setCurrentUser(data.user);
    setAuthForm(emptyLoginForm);
    setRegisterForm(emptyRegisterForm);
    setFeedback({ type: "success", message: "Authenticated successfully." });
  }

  function handleLogout() {
    window.localStorage.removeItem("dhc_token");
    setAuthToken("");
    setToken("");
    setCurrentUser(null);
    setPatients([]);
    setSelectedPatientId("");
    setPatient({ id: "", name: "", initials: "", healthId: "" });
    setRecords([]);
    setAudits([]);
    setForecast({ doctors: 0, hourlyLoad: [] });
    setMedicines([]);
    setDashboard(null);
    resetForms();
    setStatus("Sign in to continue.");
  }

  async function runAction(actionName, work, successMessage) {
    setBusyAction(actionName);

    try {
      const result = await work();

      if (successMessage) {
        setFeedback({ type: "success", message: successMessage });
      }

      return result;
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Something went wrong." });
      return null;
    } finally {
      setBusyAction("");
    }
  }

  async function generateHealthId() {
    await runAction("health-id", async () => {
      const data = await generateHealthIdRequest(selectedPatientId);
      setPatient(data.patient);
      await loadBootstrap(selectedPatientId);
      setFeedback({ type: "success", message: data.message || "Digital Health ID generated." });
    });
  }

  async function selectPatient(patientId) {
    await runAction("select-patient", async () => {
      await loadBootstrap(patientId);
      resetForms();
      setFeedback({ type: "success", message: "" });
    });
  }

  async function createPatient(event) {
    event.preventDefault();

    await runAction("save-patient", async () => {
      const data = editingPatientId
        ? await updatePatientRequest(editingPatientId, patientForm)
        : await createPatientRequest(patientForm);
      await loadBootstrap(data.patient.id);
      setPatientForm(emptyPatientForm);
      setEditingPatientId("");
    }, editingPatientId ? "Patient updated successfully." : "Patient added successfully.");
  }

  async function deletePatient(patientId) {
    const patientToDelete = patients.find((item) => item.id === patientId);
    const confirmed = window.confirm(`Delete ${patientToDelete?.name || "this patient"} and related records?`);

    if (!confirmed) {
      return;
    }

    await runAction("delete-patient", async () => {
      await deletePatientRequest(patientId);
      await loadBootstrap();
      setPatientForm(emptyPatientForm);
      setEditingPatientId("");
    }, "Patient deleted successfully.");
  }

  function startEditPatient() {
    setEditingPatientId(patient.id);
    setPatientForm({
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "",
      city: patient.city || "",
    });
    setFeedback({ type: "success", message: "" });
  }

  function cancelEditPatient() {
    setEditingPatientId("");
    setPatientForm(emptyPatientForm);
  }

  async function saveRecord(event) {
    event.preventDefault();

    await runAction("save-record", async () => {
      if (editingRecordId) {
        await updateRecordRequest(editingRecordId, form);
      } else {
        await saveRecordRequest({ ...form, patientId: selectedPatientId });
      }
      await loadBootstrap(selectedPatientId);
      setForm(emptyRecordForm);
      setEditingRecordId("");
    }, editingRecordId ? "Medical record updated successfully." : "Medical record saved successfully.");
  }

  function startEditRecord(record) {
    setEditingRecordId(record.id);
    setForm({
      diagnosis: record.diagnosis,
      provider: record.provider,
      notes: record.notes,
    });
    setFeedback({ type: "success", message: "" });
  }

  function cancelEditRecord() {
    setEditingRecordId("");
    setForm(emptyRecordForm);
  }

  async function deleteRecord(recordId) {
    const confirmed = window.confirm("Delete this medical record?");

    if (!confirmed) {
      return;
    }

    await runAction("delete-record", async () => {
      await deleteRecordRequest(recordId);
      await loadBootstrap(selectedPatientId);
    }, "Medical record deleted successfully.");
  }

  async function simulateForecast() {
    await runAction("simulate-forecast", async () => {
      const data = await simulateForecastRequest();
      setForecast(data.forecast);
      setDashboard(data.dashboard);
    }, "Forecast refreshed from backend simulation.");
  }

  async function submitLogin(event) {
    event.preventDefault();
    await runAction("login", async () => {
      const data = await loginRequest(authForm);
      handleAuthSuccess(data);
    });
  }

  async function submitRegister(event) {
    event.preventDefault();
    await runAction("register", async () => {
      const payload = {
        ...registerForm,
        patientProfile: {
          ...registerForm.patientProfile,
          name: registerForm.name,
        },
      };
      const data = await registerRequest(payload);
      handleAuthSuccess(data);
      setAuthMode("login");
    });
  }

  async function createOrUpdateMedicine(event) {
    event.preventDefault();

    await runAction("save-medicine", async () => {
      const payload = {
        ...medicineForm,
        privatePrice: Number(medicineForm.privatePrice),
        governmentPrice: Number(medicineForm.governmentPrice),
      };

      if (editingMedicineId) {
        await updateMedicineRequest(editingMedicineId, payload);
      } else {
        await createMedicineRequest(payload);
      }

      await loadBootstrap(selectedPatientId);
      setMedicineForm(emptyMedicineForm);
      setEditingMedicineId("");
    }, editingMedicineId ? "Medicine updated successfully." : "Medicine added successfully.");
  }

  async function deleteMedicine(medicineId) {
    const confirmed = window.confirm("Delete this medicine from the catalogue?");
    if (!confirmed) {
      return;
    }

    await runAction("delete-medicine", async () => {
      await deleteMedicineRequest(medicineId);
      await loadBootstrap(selectedPatientId);
    }, "Medicine deleted successfully.");
  }

  if (!token) {
    return (
      <AuthView
        authForm={authForm}
        authMode={authMode}
        busyAction={busyAction}
        feedback={feedback}
        registerForm={registerForm}
        setAuthForm={setAuthForm}
        setRegisterForm={setRegisterForm}
        submitLogin={submitLogin}
        submitRegister={submitRegister}
        switchAuthMode={setAuthMode}
      />
    );
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            +
          </span>
          <div>
            <strong>Digital HealthCare</strong>
            <span>{status}</span>
          </div>
        </div>
        <div className="session-meta">
          <span>
            {currentUser?.name} | {currentUser?.role}
          </span>
          <button className="text-action" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
        <nav className="tabs" aria-label="Primary navigation">
          {["patient", "hospital", "pharmacy", "policy", ...(currentUser?.role === "admin" ? ["admin"] : [])].map((view) => (
            <button
              className={`tab ${activeView === view ? "active" : ""}`}
              key={view}
              onClick={() => setActiveView(view)}
              type="button"
            >
              {view === "policy" ? "Insights" : view === "admin" ? "Admin" : view[0].toUpperCase() + view.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero-band">
          <div className="hero-copy">
            <p className="eyebrow">Digital Health ID | Medical Records | Affordable Medicines</p>
            <h1>Digital HealthCare</h1>
            <p>
              A full-stack React and Express prototype for secure health records, hospital planning,
              and medicine price transparency designed for India&apos;s healthcare ecosystem.
            </p>
          </div>
          <div className="system-map" aria-label="Healthcare platform visual summary">
            <div className="map-node patient-node">Patient</div>
            <div className="map-line line-one"></div>
            <div className="map-node record-node">Records</div>
            <div className="map-line line-two"></div>
            <div className="map-node ai-node">AI Queue</div>
            <div className="map-line line-three"></div>
            <div className="map-node med-node">Medicines</div>
          </div>
        </section>

        {activeView === "patient" && (
          <PatientView
            audits={audits}
            busyAction={busyAction}
            cancelEditPatient={cancelEditPatient}
            cancelEditRecord={cancelEditRecord}
            createPatient={createPatient}
            currentUser={currentUser}
            deletePatient={deletePatient}
            deleteRecord={deleteRecord}
            editingPatientId={editingPatientId}
            editingRecordId={editingRecordId}
            feedback={feedback}
            form={form}
            generateHealthId={generateHealthId}
            patient={patient}
            patientForm={patientForm}
            patients={patients}
            records={records}
            saveRecord={saveRecord}
            selectPatient={selectPatient}
            selectedPatientId={selectedPatientId}
            setForm={setForm}
            setPatientForm={setPatientForm}
            startEditPatient={startEditPatient}
            startEditRecord={startEditRecord}
          />
        )}

        {activeView === "hospital" && (
          <HospitalView
            busyAction={busyAction}
            currentUser={currentUser}
            dashboard={dashboard}
            forecast={forecast}
            simulateForecast={simulateForecast}
          />
        )}

        {activeView === "pharmacy" && (
          <PharmacyView
            medicineQuery={medicineQuery}
            medicines={filteredMedicines}
            setMedicineQuery={setMedicineQuery}
          />
        )}

        {activeView === "policy" && <PolicyView dashboard={dashboard} />}

        {activeView === "admin" && currentUser?.role === "admin" && (
          <AdminView
            busyAction={busyAction}
            createOrUpdateMedicine={createOrUpdateMedicine}
            deleteMedicine={deleteMedicine}
            editingMedicineId={editingMedicineId}
            medicineForm={medicineForm}
            medicines={medicines}
            setEditingMedicineId={setEditingMedicineId}
            setMedicineForm={setMedicineForm}
          />
        )}
      </main>
    </>
  );
}
