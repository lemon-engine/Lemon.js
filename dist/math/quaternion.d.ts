import type { Euler } from './euler';
import type { Matrix4 } from './matrix4';
import type { Vec3 } from './vec3';
/**
 * @class 四元数
 */
export declare class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    /**
     * 四元数构造函数，默认为单位值
     * @param {number} [x=0] x分量
     * @param {number} [y=0] y分量
     * @param {number} [z=0] z分量
     * @param {number} [w=1] w分量
     */
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * 设置四元数的值
     * @param {number} x x分量
     * @param {number} y y分量
     * @param {number} z z分量
     * @param {number} w w分量
     * @return {Quaternion} 四元数
     */
    set(x: number, y: number, z: number, w: number): this;
    /**
     * 四元数克隆
     * @return {Quaternion} 克隆结果
     */
    clone(): Quaternion;
    /**
     * 深拷贝四元数
     * @param {Quaternion} quaternion
     * @return {Quaternion}
     */
    copy(quaternion: Quaternion): this;
    /**
     * 由欧拉角设置四元数
     * @param {Euler} euler 欧拉角
     * @param {boolean} [update] 是否触发回调
     * @return {Quaternion} 四元数
     */
    setFromEuler(euler: Euler, update?: boolean): this;
    /**
     * 由旋转轴和旋转角度设置四元数
     * @param {Vec3} axis 旋转轴
     * @param {number} angle 旋转角
     * @return {Quaternion} 四元数
     */
    setFromAxisAngle(axis: Vec3, angle: number): this;
    /**
     * 由空间变换矩阵设置四元数
     * @param {Matrix4} m 四维矩阵
     * @return {Quaternion} 四元数
     */
    setFromRotationMatrix(m: Matrix4): this;
    setFromUnitVectors(vFrom: Vec3, vTo: Vec3): this;
    /**
     * 与四元数other之间的夹角
     * @param {Quaternion} other 四元数
     * @return {number} 夹角
     */
    angleTo(other: Quaternion): number;
    /**
     * 四元数向目标旋转
     * @param {Quaternion} q 四元数
     * @param {number} step 旋转弧度
     * @return {Quaternion} 目标四元数
     */
    rotateTowards(q: Quaternion, step: number): this;
    /**
     * 四元数单位化
     * @return {Quaternion} 单位四元数
     */
    identity(): this;
    /**
     * 四元数求逆
     * @return {Quaternion} 四元数的逆
     */
    invert(): this;
    /**
     * 四元数求共轭值
     * @return {Quaternion} 四元数的共轭值
     */
    conjugate(): this;
    /**
     * 四元数点乘结果
     * @param {Quaternion} v
     * @return {number}
     */
    dot(v: Quaternion): number;
    /**
     * 四元数的模平方
     * @return {number}
     */
    lengthSq(): number;
    /**
     * 四元数的欧式长度
     * @return {number} 长度
     */
    length(): number;
    /**
     * 四元数归一化
     * @return {Quaternion} 归一化值
     */
    normalize(): this;
    /**
     * 右乘四元数other
     * @param {Quaternion} other
     * @return {Quaternion}
     */
    multiply(other: Quaternion): this;
    /**
     * 左乘四元数other
     * @param {Quaternion} other
     * @return {Quaternion}
     */
    premultiply(other: Quaternion): this;
    /**
     * 四元数乘法(a * b)
     * @param {Quaternion} a 四元数
     * @param {Quaternion} b 四元数
     * @return {Quaternion} 四元数
     */
    multiplyQuaternions(a: Quaternion, b: Quaternion): this;
    /**
     * 与四元数other取线性插值
     * @see http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
     * @param {Quaternion} other 四元数
     * @param {number} t 插值比
     * @return {Quaternion} 插值结果
     */
    slerp(other: Quaternion, t: number): this;
    /**
     * 取两个四元数的线性插值
     * @param {Quaternion} qa 四元数
     * @param {Quaternion} qb 四元数
     * @param {number} t 插值比
     */
    slerpQuaternions(qa: Quaternion, qb: Quaternion, t: number): void;
    /**
     * 四元数判等
     * @param {Quaternion} quaternion 四元数
     * @return {boolean} 判等结果
     */
    equals(quaternion: Quaternion): boolean;
    /**
     * 由数组获取四元数
     * @param {number[]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Quaternion} 四元数
     */
    fromArray(array: number[], offset?: number): this;
    /**
     * 四元数保存为数组
     * @param {number[]} [array=[]] 目标保存结果
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 数组
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * 四元数回调函数
     * @param {funciton} callback 回调函数
     * @return {Quaternion} 四元数
     */
    onChange(callback: () => void): this;
    /**
     * 四元数回调函数
     */
    onChangeCallback(): ReturnType<() => void>;
}
