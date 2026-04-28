export function savingPercent(privatePrice, governmentPrice) {
  return Math.round(((privatePrice - governmentPrice) / privatePrice) * 100);
}
