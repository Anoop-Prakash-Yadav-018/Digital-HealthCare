import React from "react";

export default function PatientView({
  currentUser,
  patient,
  patients,
  selectedPatientId,
  records,
  audits,
  form,
  setForm,
  patientForm,
  setPatientForm,
  editingPatientId,
  editingRecordId,
  feedback,
  busyAction,
  selectPatient,
  createPatient,
  deletePatient,
  startEditPatient,
  cancelEditPatient,
  generateHealthId,
  saveRecord,
  startEditRecord,
  cancelEditRecord,
  deleteRecord,
}) {
  const canManagePatients = currentUser?.role === "admin" || currentUser?.role === "doctor";

  return (
    <section className="view active">
      <div className="section-head">
        <div>
          <p className="eyebrow">Patient workspace</p>
          <h2>Digital Health ID and Records</h2>
        </div>
        <button
          className="primary-action"
          disabled={!patient.id || Boolean(patient.healthId) || busyAction === "health-id"}
          onClick={generateHealthId}
          type="button"
        >
          {patient.healthId ? "Health ID Created" : busyAction === "health-id" ? "Generating..." : "Generate Health ID"}
        </button>
      </div>

      {feedback.message && <div className={`notice ${feedback.type === "error" ? "notice-error" : ""}`}>{feedback.message}</div>}

      <div className="patient-grid">
        <article className="profile-panel">
          <div className="profile-avatar" aria-hidden="true">
            {patient.initials || "DH"}
          </div>
          <div>
            <p className="muted">Patient</p>
            <h3>{patient.name || "Patient Profile"}</h3>
            <p className="muted">
              {patient.age ? `${patient.age} years` : "Age unavailable"} | {patient.gender || "Gender unavailable"} |{" "}
              {patient.city || "City unavailable"}
            </p>
            <p className="health-id">{patient.healthId || "No Health ID generated"}</p>
            {patient.id && (
              <div className="inline-actions">
                <button className="text-action" onClick={startEditPatient} type="button">
                  Edit
                </button>
                {canManagePatients && (
                  <button
                    className="text-action danger"
                    disabled={!patient.id || busyAction === "delete-patient"}
                    onClick={() => deletePatient(patient.id)}
                    type="button"
                  >
                    {busyAction === "delete-patient" ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            )}
          </div>
        </article>

        <article className="patient-switcher">
          <h3>Select Patient</h3>
          <div className="patient-options">
            {patients.map((item) => (
              <button
                className={`patient-option ${selectedPatientId === item.id ? "active" : ""}`}
                disabled={busyAction === "select-patient" && selectedPatientId !== item.id}
                key={item.id}
                onClick={() => selectPatient(item.id)}
                type="button"
              >
                <span>{item.initials}</span>
                <strong>{item.name}</strong>
              </button>
            ))}
          </div>
        </article>

        {canManagePatients ? (
          <form className="add-patient-form" onSubmit={createPatient}>
            <div className="form-heading">
              <h3>{editingPatientId ? "Edit Patient" : "Add Patient"}</h3>
              {editingPatientId && (
                <button className="text-action" onClick={cancelEditPatient} type="button">
                  Cancel
                </button>
              )}
            </div>
            <label>
              Full Name
              <input
                value={patientForm.name}
                onChange={(event) => setPatientForm({ ...patientForm, name: event.target.value })}
                type="text"
                placeholder="e.g. Rahul Verma"
                required
              />
            </label>
            <div className="form-row">
              <label>
                Age
                <input
                  value={patientForm.age}
                  onChange={(event) => setPatientForm({ ...patientForm, age: event.target.value })}
                  max="120"
                  min="1"
                  placeholder="32"
                  required
                  type="number"
                />
              </label>
              <label>
                Gender
                <select
                  value={patientForm.gender}
                  onChange={(event) => setPatientForm({ ...patientForm, gender: event.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
            <label>
              City
              <input
                value={patientForm.city}
                onChange={(event) => setPatientForm({ ...patientForm, city: event.target.value })}
                type="text"
                placeholder="e.g. Jaipur"
                required
              />
            </label>
            <button className="secondary-action" disabled={busyAction === "save-patient"} type="submit">
              {busyAction === "save-patient"
                ? editingPatientId
                  ? "Updating..."
                  : "Adding..."
                : editingPatientId
                  ? "Update Patient"
                  : "Add Patient"}
            </button>
          </form>
        ) : (
          <article className="patient-switcher">
            <h3>Profile permissions</h3>
            <p className="muted">Patient accounts can manage their own records and profile details. Staff accounts can create and manage patient profiles.</p>
          </article>
        )}

        <form className="record-form" onSubmit={saveRecord}>
          <div className="form-heading">
            <h3>{editingRecordId ? "Edit Medical Record" : "Add Medical Record"}</h3>
            {editingRecordId && (
              <button className="text-action" onClick={cancelEditRecord} type="button">
                Cancel
              </button>
            )}
          </div>
          <label>
            Diagnosis
            <input
              value={form.diagnosis}
              onChange={(event) => setForm({ ...form, diagnosis: event.target.value })}
              type="text"
              placeholder="e.g. Hypertension follow-up"
              required
            />
          </label>
          <label>
            Doctor / Hospital
            <input
              value={form.provider}
              onChange={(event) => setForm({ ...form, provider: event.target.value })}
              type="text"
              placeholder="e.g. City Care Hospital"
              required
            />
          </label>
          <label>
            Notes
            <textarea
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="Medicines, tests, treatment advice"
              required
            ></textarea>
          </label>
          <button className="primary-action" disabled={busyAction === "save-record"} type="submit">
            {busyAction === "save-record"
              ? editingRecordId
                ? "Updating..."
                : "Saving..."
              : editingRecordId
                ? "Update Secure Record"
                : "Save Secure Record"}
          </button>
        </form>
      </div>

      <div className="records-layout">
        <article>
          <div className="panel-title">
            <h3>Patient-Owned Records</h3>
            <span>{records.length} records</span>
          </div>
          <div className="records-list">
            {records.length ? (
              records.map((record) => (
                <div className="record-item" key={record.id}>
                  <strong>{record.diagnosis}</strong>
                  <div className="record-meta">
                    {record.provider} | {record.date}
                    {record.updatedAt ? ` | Updated ${record.updatedAt}` : ""}
                  </div>
                  <p>{record.notes}</p>
                  <div className="inline-actions">
                    <button className="text-action" onClick={() => startEditRecord(record)} type="button">
                      Edit
                    </button>
                    <button
                      className="text-action danger"
                      disabled={busyAction === "delete-record"}
                      onClick={() => deleteRecord(record.id)}
                      type="button"
                    >
                      {busyAction === "delete-record" ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="record-item">No records yet. Add the first consultation or test result.</div>
            )}
          </div>
        </article>

        <article>
          <div className="panel-title">
            <h3>Blockchain Audit Trail</h3>
            <span>Tamper-evident log</span>
          </div>
          <div className="audit-list">
            {audits.length ? (
              audits.map((audit) => (
                <div className="audit-item" key={audit.id}>
                  <strong>{audit.action}</strong>
                  <br />
                  {audit.timestamp}
                  <br />
                  Hash: {audit.hash}
                </div>
              ))
            ) : (
              <div className="audit-item">Audit entries appear after ID generation or record updates.</div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
