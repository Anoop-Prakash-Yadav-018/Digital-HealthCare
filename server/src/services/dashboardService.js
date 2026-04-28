export function calculateAverageSaving(medicines) {
  const valid = medicines.filter((item) => item.privatePrice > 0);

  if (!valid.length) {
    return 0;
  }

  return Math.round(
    valid.reduce(
      (total, item) => total + ((item.privatePrice - item.governmentPrice) / item.privatePrice) * 100,
      0,
    ) / valid.length,
  );
}

export function buildDashboard({ forecast, recordsDigitized, medicines }) {
  const inflow = forecast.hourlyLoad[2] || 0;
  const doctors = Math.max(forecast.doctors || 0, 1);
  const estimatedWait = Math.max(8, Math.round((inflow / doctors) * 6));

  return {
    expectedInflow: inflow,
    doctors: forecast.doctors,
    estimatedWait,
    recommendedAction: estimatedWait > 35 ? "Add triage team" : estimatedWait > 24 ? "Open 2 counters" : "Normal staffing",
    pressureZone: estimatedWait > 35 ? "High" : estimatedWait > 24 ? "Moderate" : "Stable",
    recordsDigitized,
    averageSaving: calculateAverageSaving(medicines),
  };
}
