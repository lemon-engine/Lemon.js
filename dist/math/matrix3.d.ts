import type { Matrix4 } from './matrix4';
import type { Vec3 } from './vec3';
/**
 * @class 三维矩阵[二维空间变换矩阵 || 三维空间旋转缩放矩阵(列矩阵)]
 */
export declare class Matrix3 {
    /**
     * @member {number[]} 三维矩阵值数组
     */
    elements: number[];
    /**
     * 构造函数，初始值为单位矩阵
     */
    constructor();
    /**
     * 设置三维矩阵矩阵
     * @param {number} n00 矩阵[0, 0]值
     * @param {number} n01 矩阵[0, 1]值
     * @param {number} n02 矩阵[0, 2]值
     * @param {number} n10 矩阵[1, 0]值
     * @param {number} n11 矩阵[1, 1]值
     * @param {number} n12 矩阵[1, 2]值
     * @param {number} n20 矩阵[2, 0]值
     * @param {number} n21 矩阵[2, 1]值
     * @param {number} n22 矩阵[2, 2]值
     * @return {Matrix3}
     */
    set(n00: number, n01: number, n02: number, n10: number, n11: number, n12: number, n20: number, n21: number, n22: number): this;
    /**
     * 三维矩阵矩阵单位化
     * @return {Matrix3} 单位矩阵
     */
    identity(): this;
    /**
     * 复制三维矩阵矩阵
     * @param {Matrix3} m 复制对象
     * @return {Matrix3} 复制结果
     */
    copy(m: Matrix3): this;
    /**
     * 由分轴向量构建三维矩阵
     * @param {Vec3} xAxis x轴分量
     * @param {Vec3} yAxis y轴分量
     * @param {Vec3} zAxis z轴分量
     * @return {Matrix3} 三维矩阵
     */
    extractBasis(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): this;
    /**
     * 由四维矩阵构建三维矩阵(获取三维空间变换矩阵旋转缩放部分)
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix3} 三维矩阵
     */
    setFromMatrix4(m: Matrix4): this;
    /**
     * 三维矩阵右乘
     * @param {Matrix3} m 相乘矩阵
     * @return {Matrix3} 右乘结果
     */
    multiply(m: Matrix3): this;
    /**
     * 三维矩阵左乘
     * @param {Matrix3} m 相乘矩阵
     * @return {Matrix3} 左乘结果
     */
    premultiply(m: Matrix3): this;
    /**
     * 三维矩阵乘法(a * b)
     * @param {Matrix3} a 三维矩阵
     * @param {Matrix3} b 三维矩阵
     * @return {Matrix3} 相乘结果
     */
    multiplyMatrices(a: Matrix3, b: Matrix3): this;
    /**
     * 三维矩阵倍数缩放
     * @param {number} s 放大倍数
     * @return {Matrix3} 缩放结果
     */
    multiplyScalar(s: number): this;
    /**
     * 三维矩阵求行列式值
     * @return {number} 行列式结果
     */
    determinant(): number;
    /**
     * 三维矩阵求逆
     * @return {Matrix3} 逆矩阵
     */
    invert(): this;
    /**
     * 三维矩阵转置
     * @return {Matrix3} 转置结果
     */
    transpose(): this;
    /**
     * 根据四维矩阵设置法线矩阵
     * @param {Matrix4} matrix4 四维矩阵
     * @return {Matrix3} 法线矩阵
     */
    getNormalMatrix(matrix4: Matrix4): this;
    /**
     * 三维矩阵转置并保存于数组中
     * @param {number[]} r 结果保存对象
     * @return {Matrix3} 三维矩阵
     */
    transposeIntoArray(r: number[]): this;
    /**
     * 设置UV变换矩阵
     * @param {number} tx x方向平移
     * @param {number} ty y方向平移
     * @param {number} sx x方向缩放
     * @param {number} sy y方向缩放
     * @param {number} rotation 旋转帧
     * @param {number} cx x方向切变
     * @param {number} cy y方向切变
     * @return {Matrix3} UV变换矩阵
     */
    setUvTransform(tx: number, ty: number, sx: number, sy: number, rotation: number, cx: number, cy: number): this;
    /**
     * 三维矩阵缩放
     * @param {number} sx x轴缩放分量
     * @param {number} sy y轴缩放分量
     * @return {Matrix3} 缩放结果
     */
    scale(sx: number, sy: number): this;
    /**
     * 三维矩阵旋转
     * @param {number} theta 旋转值
     * @return {Matrix3} 旋转结果
     */
    rotate(theta: number): this;
    /**
     * 三维矩阵平移
     * @param {number} tx x轴平移分量
     * @param {number} ty y轴平移分量
     * @return {Matrix3} 平移结果
     */
    translate(tx: number, ty: number): this;
    /**
     * 三维矩阵判等
     * @param {Matrix3} matrix 三维矩阵
     * @return {boolean} 判等结果
     */
    equals(matrix: Matrix3): boolean;
    /**
     * 由数组构建三维矩阵
     * @param {number[]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Matrix3} 三维矩阵
     */
    fromArray(array: number[], offset?: number): this;
    /**
     * 三维矩阵转为数组
     * @param {number[]} [array=[]] 目标保存对象
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 保存结果
     */
    toArray(array?: number[], offset?: number): number[];
    /**
     * 三维矩阵克隆
     * @return {Matrix3} 克隆结果
     */
    clone(): Matrix3;
}
