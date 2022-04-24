export function roundNumber (number: number, precision: number, method = Math.round): number {
  const decimal = Math.pow(10, precision);
  return method(number * decimal) / decimal;
}
