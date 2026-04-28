import React from "react";

const emptyMedicine = { name: "", privatePrice: "", governmentPrice: "", category: "", availability: "Available" };

export default function AdminView({
  medicines,
  medicineForm,
  setMedicineForm,
  editingMedicineId,
  setEditingMedicineId,
  busyAction,
  createOrUpdateMedicine,
  deleteMedicine,
}) {
  function resetForm() {
    setMedicineForm(emptyMedicine);
    setEditingMedicineId("");
  }

  return (
    <section className="view active">
      <div className="section-head">
        <div>
          <p className="eyebrow">Admin operations</p>
          <h2>Medicine Management</h2>
        </div>
      </div>

      <div className="records-layout">
        <form className="add-patient-form" onSubmit={createOrUpdateMedicine}>
          <div className="form-heading">
            <h3>{editingMedicineId ? "Edit Medicine" : "Add Medicine"}</h3>
            {editingMedicineId && (
              <button className="text-action" onClick={resetForm} type="button">
                Cancel
              </button>
            )}
          </div>
          <label>
            Medicine Name
            <input
              value={medicineForm.name}
              onChange={(event) => setMedicineForm({ ...medicineForm, name: event.target.value })}
              required
              type="text"
            />
          </label>
          <label>
            Category
            <input
              value={medicineForm.category}
              onChange={(event) => setMedicineForm({ ...medicineForm, category: event.target.value })}
              required
              type="text"
            />
          </label>
          <div className="form-row">
            <label>
              Private Price
              <input
                value={medicineForm.privatePrice}
                onChange={(event) => setMedicineForm({ ...medicineForm, privatePrice: event.target.value })}
                min="0"
                required
                type="number"
              />
            </label>
            <label>
              Government Price
              <input
                value={medicineForm.governmentPrice}
                onChange={(event) => setMedicineForm({ ...medicineForm, governmentPrice: event.target.value })}
                min="0"
                required
                type="number"
              />
            </label>
          </div>
          <label>
            Availability
            <input
              value={medicineForm.availability}
              onChange={(event) => setMedicineForm({ ...medicineForm, availability: event.target.value })}
              required
              type="text"
            />
          </label>
          <button className="primary-action" disabled={busyAction === "save-medicine"} type="submit">
            {busyAction === "save-medicine"
              ? editingMedicineId
                ? "Updating..."
                : "Saving..."
              : editingMedicineId
                ? "Update Medicine"
                : "Add Medicine"}
          </button>
        </form>

        <article>
          <div className="panel-title">
            <h3>Catalogue</h3>
            <span>{medicines.length} medicines</span>
          </div>
          <div className="medicine-list">
            {medicines.map((medicine) => (
              <div className="medicine-item" key={medicine.id}>
                <div>
                  <strong>{medicine.name}</strong>
                  <div className="medicine-meta">
                    {medicine.category} | {medicine.availability}
                  </div>
                </div>
                <div className="inline-actions">
                  <button
                    className="text-action"
                    onClick={() => {
                      setEditingMedicineId(medicine.id);
                      setMedicineForm({
                        name: medicine.name,
                        category: medicine.category,
                        privatePrice: String(medicine.privatePrice),
                        governmentPrice: String(medicine.governmentPrice),
                        availability: medicine.availability || "Available",
                      });
                    }}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="text-action danger"
                    disabled={busyAction === "delete-medicine"}
                    onClick={() => deleteMedicine(medicine.id)}
                    type="button"
                  >
                    {busyAction === "delete-medicine" ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
