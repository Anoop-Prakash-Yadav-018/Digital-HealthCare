import React from "react";
import { savingPercent } from "../utils/pricing.js";

export default function PharmacyView({ medicines, medicineQuery, setMedicineQuery }) {
  return (
    <section className="view active">
      <div className="section-head">
        <div>
          <p className="eyebrow">Medicine access</p>
          <h2>Private vs Government Pharmacy Prices</h2>
        </div>
        <label className="search-box">
          <span>Search</span>
          <input
            value={medicineQuery}
            onChange={(event) => setMedicineQuery(event.target.value)}
            type="search"
            placeholder="Search medicine"
          />
        </label>
      </div>
      <div className="medicine-list">
        {medicines.length ? (
          medicines.map((medicine) => (
            <article className="medicine-item" key={medicine.id}>
              <div>
                <strong>{medicine.name}</strong>
                <div className="medicine-meta">{medicine.category}</div>
              </div>
              <div>
                <div className="price-row">
                  <span className="price-chip">Private: Rs {medicine.privatePrice}</span>
                  <span className="price-chip">Government: Rs {medicine.governmentPrice}</span>
                </div>
                <div className="saving">Save {savingPercent(medicine.privatePrice, medicine.governmentPrice)}%</div>
              </div>
            </article>
          ))
        ) : (
          <article className="medicine-item">No matching medicine found in the sample catalogue.</article>
        )}
      </div>
    </section>
  );
}
