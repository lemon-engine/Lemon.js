export function clamp (value: number, min: number, max: number): number {
  const fixedMin = isNaN(min) ? -Infinity : min;
  const fixedMax = isNaN(max) ? Infinity : max;
  const lower = Math.min(fixedMin, fixedMax);
  const upper = Math.max(fixedMin, fixedMax);
  return Math.min(Math.max(value, lower), upper);
}
