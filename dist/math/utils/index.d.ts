export { clamp } from './clamp';
export { roundNumber } from './round-number';
export { intMultiplyFloat } from './int-multiply-float';
export { isPowerIntegerOfTwo } from './is-power-integer-of-two';
export { nearestPowerIntegerOfTwo } from './nearest-power-integer-of-two';
export declare type RandomNumberType = ['random', number[]];
export declare type LinesNumberType = ['lines', number[][]];
export declare type LineNumberType = ['line', number[][]];
export declare type CurveNumberType = ['curve', number[][]];
export declare type BezierNumberType = ['bezier', number[][][]];
export declare type PathNumberType = ['path', number[][][]];
export declare type StringNumberType = RandomNumberType | LinesNumberType | LineNumberType | CurveNumberType | BezierNumberType | PathNumberType;
export declare const PI2: number;
export declare const kfRadius = 2;
export declare const DEG2RAD: number;
export declare const RAD2DEG: number;
export declare const fixed: (value: number, size: number) => number;
export declare const euclideanModulo: (n: number, m: number) => number;
export declare const mapLinear: (x: number, a1: number, a2: number, b1: number, b2: number) => number;
export declare const inverseLerp: (x: number, y: number, value: number) => number;
export declare const lerp: (x: number, y: number, t: number) => number;
export declare const damp: (x: number, y: number, lambda: number, dt: number) => number;
export declare const pingpong: (x: number, length?: number) => number;
export declare const smoothstep: (x: number, min: number, max: number) => number;
export declare const smootherstep: (x: number, min: number, max: number) => number;
export declare const randInt: (low: number, high: number) => number;
export declare const randFloat: (low: number, high: number) => number;
export declare const randFloatSpread: (range: number) => number;
export declare const seededRandom: (s: number) => number;
export declare const degToRad: (degrees: number) => number;
export declare const radToDeg: (radians: number) => number;
export declare const isPowerOfTwo: (value: number) => boolean;
export declare const ceilPowerOfTwo: (value: number) => number;
export declare const floorPowerOfTwo: (value: number) => number;
/**
 * 最近的 2 的指数值
 * @param {number} value
 * @return {number}
 */
export declare function nearestPowerOfTwo(value: number): number;
export declare function modByFloat(number: number, mod: number): number;
export declare function resetObjectByRatio(obj: number[] | StringNumberType, ratio: number, isIn?: boolean): number[] | StringNumberType;
export declare function resetPropertyByRatio(obj: number | number[] | StringNumberType, ratio: number, isIn?: boolean): number | number[] | StringNumberType;
