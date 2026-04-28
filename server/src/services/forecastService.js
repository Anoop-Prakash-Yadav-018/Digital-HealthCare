export function generateForecast({ recordsCount, patientCount, doctors = 9 }) {
  const now = new Date();
  const hour = now.getHours();
  const weekday = now.getDay();
  const peakBoost = hour >= 9 && hour <= 13 ? 12 : hour >= 17 && hour <= 20 ? 8 : 4;
  const weekdayBoost = weekday >= 1 && weekday <= 5 ? 6 : 2;
  const recordsBoost = Math.min(recordsCount * 2, 18);
  const patientBoost = Math.min(patientCount * 3, 14);
  const baseline = 18 + peakBoost + weekdayBoost + recordsBoost + patientBoost;

  const hourlyLoad = Array.from({ length: 8 }, (_, index) => {
    const centerDistance = Math.abs(index - 3);
    const taper = centerDistance * 4;
    return Math.max(10, baseline - taper + (index % 2 === 0 ? 2 : -1));
  });

  return {
    doctors,
    hourlyLoad,
  };
}
