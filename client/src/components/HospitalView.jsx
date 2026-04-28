import React from "react";

function Metric({ title, value, note, alert = false }) {
  return (
    <article className={`metric-card ${alert ? "alert" : ""}`}>
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

export default function HospitalView({ currentUser, dashboard, forecast, simulateForecast, busyAction }) {
  const loads = forecast.hourlyLoad.length ? forecast.hourlyLoad : [0];
  const maxLoad = Math.max(...loads, 1);

  return (
    <section className="view active">
      <div className="section-head">
        <div>
          <p className="eyebrow">Hospital operations</p>
          <h2>AI Patient Flow Forecast</h2>
        </div>
        <button
          className="secondary-action"
          disabled={busyAction === "simulate-forecast" || currentUser?.role === "patient"}
          onClick={simulateForecast}
          type="button"
        >
          {busyAction === "simulate-forecast" ? "Simulating..." : "Simulate Next Hour"}
        </button>
      </div>

      <div className="metrics-grid">
        <Metric title="Expected inflow" value={dashboard?.expectedInflow || 0} note="patients in next 60 minutes" />
        <Metric title="Available doctors" value={dashboard?.doctors || 0} note="general + emergency" />
        <Metric title="Estimated wait" value={`${dashboard?.estimatedWait || 0}m`} note="average queue time" />
        <Metric
          title="Recommended action"
          value={dashboard?.recommendedAction || "Loading"}
          note="based on demand trend"
          alert
        />
      </div>

      <article className="forecast-panel">
        <div className="panel-title">
          <h3>Hourly Load</h3>
          <span>AI-assisted estimate from backend</span>
        </div>
        <div className="chart" aria-label="Hourly patient load chart">
          {forecast.hourlyLoad.length ? (
            forecast.hourlyLoad.map((load, index) => (
              <div className="bar-wrap" key={`${load}-${index}`}>
                <div
                  className="bar"
                  style={{ height: `${Math.max(18, Math.round((load / maxLoad) * 190))}px` }}
                  title={`${load} patients`}
                ></div>
                <div className="bar-label">{index + 8}:00</div>
              </div>
            ))
          ) : (
            <div className="empty-chart">Forecast data will appear here.</div>
          )}
        </div>
      </article>
    </section>
  );
}
