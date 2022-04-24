import { Quaternion } from './quaternion';
import { Vec3 } from './vec3';
import { Matrix4 } from './matrix4';
export declare enum EulerOrder {
    'XYZ' = 0,
    'XZY' = 1,
    'YXZ' = 2,
    'YZX' = 3,
    'ZXY' = 4,
    'ZYX' = 5
}
/**
 * @class 欧拉角
 */
export declare class Euler {
    x: number;
    y: number;
    z: number;
    order: EulerOrder;
    /**
     * 构造函数,传入值为x, y, z方向分量以及欧拉角计算顺序
     * @param {number} x x方向分量
     * @param {number} y y方向分量
     * @param {number} z z方向分量
     * @param {EulerOrder} order 欧拉角顺序，默认为XYZ顺序
     */
    constructor(x?: number, y?: number, z?: number, order?: EulerOrder);
    /**
     * 设置欧拉角
     * @param {number} x x方向分量
     * @param {number} y y方向分量
     * @param {number} z z方向分量
     * @param {EulerOrder} [order='XYZ'] 欧拉角顺序，默认为XYZ顺序
     * @return {Euler}
     */
    set(x: number, y: number, z: number, order?: EulerOrder): this;
    /**
     * 克隆欧拉角
     * @return {Euler} 克隆结果
     */
    clone(): Euler;
    /**
     * 复制欧拉角
     * @param {Euler} euler 复制对象
     * @return {Euler} 复制结果
     */
    copy(euler: Euler): this;
    /**
     * 有三维空间矩阵设置欧拉角
     * @param {Matrix4} m 三维空间矩阵
     * @param {EulerOrder} [order='XYZ'] 欧拉角顺序
     * @param {boolean} [update=true] 允许设置回调函数
     * @return {Euler} 构建结果
     */
    setFromRotationMatrix(m: Matrix4, order?: EulerOrder, update?: boolean): this;
    /**
     * 由四元数构建欧拉角
     * @param {Quaternion} q 四元数
     * @param {EulerOrder} [order='XYZ'] 欧拉角顺序，默认为XYZ
     * @param {boolean} [update=true] 允许设置回调函数
     * @return {Euler} 构建结果
     */
    setFromQuaternion(q: Quaternion, order?: EulerOrder, update?: boolean): this;
    /**
     * 有三维向量构建欧拉角
     * @param {Vec3} v 三维向量
     * @param {EulerOrder} [order] 欧拉角顺序，默认为XYZ
     * @return {Euler} 欧拉角
     */
    setFromVector3(v: Vec3, order?: EulerOrder): this;
    /**
     * 修改欧拉角顺序
     * @param {EulerOrder} newOrder 欧拉角顺序
     * @return {Euler} 修改结果
     */
    reorder(newOrder: EulerOrder): this;
    /**
     * 欧拉角判等
     * @param {Euler} euler 欧拉角
     * @return {boolean} 判等结果
     */
    equals(euler: Euler): boolean;
    /**
     * 由数组构建欧拉角
     * @param {number[]} array 数组
     * @return {Euler} 构建结果
     */
    fromArray(array: number[]): this;
    /**
     * 欧拉角保存于数组(应用于计算)
     * @param {number[]} [array=[]] 目标保存对象
     * @param {number} [offset=0] 起始偏移值
     * @return {number[]} 保存结果
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * 欧拉角保存于三维向量(应用于计算)
     * @param {Vec3} [optionalResult] 目标保存对象
     * @return {Vec3} 保存结果
     */
    toVector3(optionalResult?: Vec3): Vec3;
    /**
     * 欧拉角变更回调函数
     * @param {function} callback 回调函数
     * @return {Euler} 欧拉角
     */
    onChange(callback: () => void): this;
    onChangeCallback(): ReturnType<() => void>;
}
