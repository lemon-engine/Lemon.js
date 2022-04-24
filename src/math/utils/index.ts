export { clamp } from './clamp';
export { roundNumber } from './round-number';
export { intMultiplyFloat } from './int-multiply-float';
export { isPowerIntegerOfTwo } from './is-power-integer-of-two';
export { nearestPowerIntegerOfTwo } from './nearest-power-integer-of-two';

let seed = 1234567;

export type RandomNumberType = ['random', number[]];
export type LinesNumberType = ['lines', number[][]];
export type LineNumberType = ['line', number[][]];
export type CurveNumberType = ['curve', number[][]];
export type BezierNumberType = ['bezier', number[][][]];
export type PathNumberType = ['path', number[][][]];
export type StringNumberType =
  | RandomNumberType
  | LinesNumberType
  | LineNumberType
  | CurveNumberType
  | BezierNumberType
  | PathNumberType
  ;

export const PI2 = Math.PI * 2;

export const kfRadius = 2;

export const DEG2RAD = Math.PI / 180;

export const RAD2DEG = 180 / Math.PI;

export const fixed = (value: number, size: number): number => Math.round(value * Math.pow(10, size)) / Math.pow(10, size);

// compute euclidian modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation
export const euclideanModulo = (n: number, m: number): number => ((n % m) + m) % m;

// Linear mapping from range <a1, a2> to range <b1, b2>

export const mapLinear = (
  x: number,
  a1: number,
  a2: number,
  b1: number,
  b2: number
): number => b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);

// https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
export const inverseLerp = (x: number, y: number, value: number): number => {
  if (x !== y) {
    return (value - x) / (y - x);
  } else {
    return 0;
  }
};

// https://en.wikipedia.org/wiki/Linear_interpolation
export const lerp = (x: number, y: number, t: number): number => (1 - t) * x + t * y;

// http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
export const damp = (x: number, y: number, lambda: number, dt: number): number => lerp(x, y, 1 - Math.exp(-lambda * dt));

// https://www.desmos.com/calculator/vcsjnyz7x4
export const pingpong = (x: number, length = 1): number => length - Math.abs(euclideanModulo(x, length * 2) - length);

// http://en.wikipedia.org/wiki/Smoothstep

export const smoothstep = (x: number, min: number, max: number): number => {
  if (x <= min) { return 0; }
  if (x >= max) { return 1; }

  x = (x - min) / (max - min);

  return x * x * (3 - 2 * x);
};

export const smootherstep = (x: number, min: number, max: number): number => {
  if (x <= min) { return 0; }
  if (x >= max) { return 1; }

  x = (x - min) / (max - min);

  return x * x * x * (x * (x * 6 - 15) + 10);
};

// Random integer from <low, high> interval
export const randInt = (low: number, high: number): number => low + Math.floor(Math.random() * (high - low + 1));

// Random float from <low, high> interval
export const randFloat = (low: number, high: number): number => low + Math.random() * (high - low);

// Random float from <-range/2, range/2> interval
export const randFloatSpread = (range: number): number => range * (0.5 - Math.random());

// Deterministic pseudo-random float in the interval [ 0, 1 ]
export const seededRandom = (s: number): number => {
  if (s !== undefined) { seed = s % 2147483647; }
  // Park-Miller algorithm
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

export const degToRad = (degrees: number): number => degrees * DEG2RAD;

export const radToDeg = (radians: number): number => radians * RAD2DEG;

export const isPowerOfTwo = (value: number): boolean => (value & (value - 1)) === 0 && value !== 0;

export const ceilPowerOfTwo = (value: number): number => Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));

export const floorPowerOfTwo = (value: number): number => Math.pow(2, Math.floor(Math.log(value) / Math.LN2));

/**
 * 最近的 2 的指数值
 * @param {number} value
 * @return {number}
 */
export function nearestPowerOfTwo (value: number): number {
  let n = Math.log(value) / Math.LN2;
  n = n % 1 > 0.9 ? Math.ceil(n) : Math.floor(n);
  return Math.pow(2, n);
}

export function modByFloat (number: number, mod: number): number {
  const left = number % mod;
  number -= left;
  if (Math.abs(left) >= mod / 2) {
    number += mod * Math.sign(number);
  }
  return number;
}

function isNumberArrayType (obj: number[] | StringNumberType): obj is number[] {
  return typeof obj[0] === 'number';
}

export function resetObjectByRatio (obj: number[] | StringNumberType, ratio: number, isIn = true): number[] | StringNumberType {
  if (ratio === 1 || !obj) {
    return obj;
  }

  // obj[0] 是数字
  if (isNumberArrayType(obj)) {
    return obj.map((value, index) => isIn && index < 2 ? value * ratio : value / ratio);
  }

  // obj[0] 是字符串
  if (obj[0] === 'random') {
    const random: number[] = obj[1].map(n => isIn ? n * ratio : n / ratio);
    return ['random', random];
  }
  if (obj[0] === 'lines') {
    // lines [time, value];
    const lines: number[][] = obj[1].map(v => [v[0], isIn ? v[1] * ratio : v[1] / ratio]);
    return ['lines', lines];
  }
  if (obj[0] === 'line') {
    // line [time, value];
    const line: number[][] = obj[1].map(v => [v[0], isIn ? v[1] * ratio : v[1] / ratio]);
    return ['line', line];
  }
  if (obj[0] === 'curve') {
    // curve [time, value];
    const curve: number[][] = obj[1].map(v => [v[0], isIn ? v[1] * ratio : v[1] / ratio, v[2], v[3]]);
    return ['curve', curve];
  }
  if (obj[0] === 'bezier') {
    const times: number[][] = obj[1][0].map(time => [...time]);
    const positions: number[][] = obj[1][1].map(p => (
      isIn
        ? [p[0] * ratio, p[1] * ratio, p[2]]
        : [p[0] / ratio, p[1] / ratio, p[2]]
    ));
    const controls: number[][] = obj[1][2].map(c => (
      isIn
        ? [c[0] * ratio, c[1] * ratio, c[2] * ratio]
        : [c[0] / ratio, c[1] / ratio, c[2] / ratio]
    ));
    return ['bezier', [times, positions, controls]];
  }
  if (obj[0] === 'path') {
    const times: number[][] = obj[1][0].map(time => [...time]);
    const positions: number[][] = obj[1][1].map(p => (
      isIn
        ? [p[0] * ratio, p[1] * ratio, p[2]]
        : [p[0] / ratio, p[1] / ratio, p[2]]
    ));
    return ['path', [times, positions]];
  }
  return [];
}

export function resetPropertyByRatio (obj: number | number[] | StringNumberType, ratio: number, isIn = true): number | number[] | StringNumberType {
  if (typeof obj === 'number') {
    return obj * ratio;
  } else {
    return resetObjectByRatio(obj, ratio, isIn);
  }
}
