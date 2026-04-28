import React from "react";

export default function PolicyView({ dashboard }) {
  return (
    <section className="view active">
      <div className="section-head">
        <div>
          <p className="eyebrow">Public health insights</p>
          <h2>Aggregated Decision Dashboard</h2>
        </div>
      </div>
      <div className="insight-grid">
        <article className="insight-card">
          <h3>Records digitized</h3>
          <strong>{dashboard?.recordsDigitized || 0}</strong>
          <p>sample records stored in the patient wallet</p>
        </article>
        <article className="insight-card">
          <h3>Average medicine saving</h3>
          <strong>{dashboard?.averageSaving || 0}%</strong>
          <p>by choosing government pharmacy options</p>
        </article>
        <article className="insight-card">
          <h3>Pressure zone</h3>
          <strong>{dashboard?.pressureZone || "Loading"}</strong>
          <p>hospital demand based on forecast load</p>
        </article>
      </div>
    </section>
  );
}
