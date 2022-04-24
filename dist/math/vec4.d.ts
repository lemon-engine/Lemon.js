import type { Matrix4 } from './matrix4';
import type { Quaternion } from './quaternion';
import type { Vec3 } from './vec3';
/**
 * @class 四维向量
 */
export declare class Vec4 {
    x: number;
    y: number;
    z: number;
    w: number;
    /**
     * 构造函数，默认为w为1的单位四维向量
     * @param {number} [x=0] x轴分量
     * @param {number} [y=0] y轴分量
     * @param {number} [z=0] z轴分量
     * @param {number} [w=1] w轴分量
     */
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * @member {number} 宽度
     */
    get width(): number;
    set width(value: number);
    /**
     * @member {number} 高度
     */
    get height(): number;
    set height(value: number);
    /**
     * 设置四维向量
     * @param {number|Vec3} x 数字 | 三维向量
     * @param {number} [y=x] y轴分量
     * @param {number} [z=x] z轴分量
     * @param {number} [w=x] w轴分量
     * @returns
     */
    set(x: number | Vec3, y?: number, z?: number, w?: number): this;
    /**
     * 设置x轴分量
     * @param {number} x x轴分量
     * @return {Vec4} 四维向量
     */
    setX(x: number): this;
    /**
     * 设置y轴分量
     * @param {number} y y轴分量
     * @return {Vec4} 四维向量
     */
    setY(y: number): this;
    /**
     * 设置z轴分量
     * @param {number} z z轴分量
     * @return {Vec4} 四维向量
     */
    setZ(z: number): this;
    /**
     * 设置w轴分量
     * @param {number} w w轴分量
     * @return {Vec4} 四维向量
     */
    setW(w: number): this;
    /**
     * 根据下标设置四维向量
     * @param {number} index 下标值
     * @param {number} value 数字
     * @return {Vec4} 四维向量
     */
    setComponent(index: number, value: number): this;
    /**
     * 根据下标获取值
     * @param {number} index 下标
     * @return {number} 值
     */
    getComponent(index: number): number;
    /**
     * 克隆四维向量
     * @return {Vec4} 克隆结果
     */
    clone(): Vec4;
    /**
     * 复制四维向量
     * @param {Vec4} v 复制对象
     * @return {Vec4} 复制结果
     */
    copy(v: Vec4): this;
    /**
     * 四维向量求和
     * @param {Vec4|number} v 求和对象，四维向量 | 数字
     * @return {Vec4} 求和结果
     */
    add(v: Vec4 | number): this;
    /**
     * 四维向量求和
     * @param {Vec3} a 四维向量
     * @param {Vec4} b 四维向量
     * @return {Vec4} 求和结果
     */
    addVectors(a: Vec4, b: Vec4): this;
    /**
     * 四维向量比例求和
     * @param {Vec4} v 四维向量
     * @param {number} s 比例
     * @returns {Vec4} 求和结果
     */
    addScaledVec(v: Vec4, s: number): this;
    /**
     * 四维向量求差
     * @param {Vec4|number} v 求差对象，四维向量 | 数字
     * @return {Vec4} 四维向量
     */
    sub(v: Vec4 | number): this;
    /**
     * 四维向量取反
     * @return {Vec4} 取反结果
     */
    inverse(): Vec4;
    /**
     * 四维向量求差
     * @param {Vec4} a 四维向量
     * @param {Vec4} b 四维向量
     * @return {Vec4} 四维向量
     */
    subVectors(a: Vec4, b: Vec4): this;
    /**
     * 四维向量求乘
     * @param {Vec4|number} v 求乘对象，四维对象 | 数字
     * @return {Vec4} 四维向量
     */
    multiply(v: Vec4 | number): this;
    /**
     * 四维向量矩阵变换
     * @param {Matrix4} m 变换矩阵
     * @return {Vec4} 四维向量
     */
    applyMatrix4(m: Matrix4): this;
    /**
     * 四维向量求除
     * @param {number} scalar 除数
     * @return {Vec4} 求除结果
     */
    divideScalar(scalar: number): this;
    /**
     * 根据四元数设置四维向量[旋转轴，旋转角度]
     * @param {Quaternion} q 四元数
     * @return {Vec4} 四维向量
     */
    setAxisAngleFromQuaternion(q: Quaternion): this;
    /**
     * 根据矩阵设置四维向量[旋转轴，旋转角度]
     * @param {Matrix4} m 矩阵
     * @return {Vec4} 四维向量
     */
    setAxisAngleFromRotationMatrix(m: Matrix4): this;
    /**
     * 四维向量求最小值
     * @param {Vec4} v 四维向量
     * @return {Vec4} 最小值
     */
    min(v: Vec4): this;
    /**
     * 四维向量求最大值
     * @param {Vec4} v 四维向量
     * @return {Vec4} 最大值
     */
    max(v: Vec4): this;
    /**
     * 四维向量阈值约束
     * @param {Vec4} min 最小值
     * @param {Vec4} max 最大值
     * @return {Vec4} 四维向量
     */
    clamp(min: Vec4, max: Vec4): this;
    /**
     * 四维向量数值阈值约束
     * @param {number} minVal 最小数值
     * @param {number} maxVal 最大数值
     * @return {Vec4} 四维向量
     */
    clampScalar(minVal: number, maxVal: number): this;
    /**
     * 四维向量根据数值约束长度
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @return {Vec4} 四维向量
     */
    clampLength(min: number, max: number): this;
    /**
     * 四维向量向下取整
     * @return {Vec4} 取整结果
     */
    floor(): this;
    /**
     * 四维向量向上取整
     * @return {Vec4} 取整结果
     */
    ceil(): this;
    /**
     * 四维向量四舍五入
     * @return {Vec4} 求值结果
     */
    round(): this;
    /**
     * 四维向量分类处理
     * @return {Vec4} 计算结果
     */
    roundToZero(): this;
    /**
     * 四维向量取反
     * @return {Vec4} 取反结果
     */
    negate(): this;
    /**
     * 四维向量求点积
     * @param {Vec4} v 四维向量
     * @return {number} 点积结果
     */
    dot(v: Vec4): number;
    /**
     * 四维向量长度平方
     * @return {number} 长度平方
     */
    lengthSq(): number;
    /**
     * 四维向量长度
     * @return {number} 长度
     */
    length(): number;
    /**
     * 四维向量曼哈顿长度
     * @return {number} 曼哈顿长度
     */
    manhattanLength(): number;
    /**
     * 四维向量归一化
     * @return {Vec4} 归一化结果
     */
    normalize(): this;
    /**
     * 根据四维向量方向与长度设置四维向量
     * @param {number} length 长度
     * @return {Vec4} 四维向量
     */
    setLength(length: number): this;
    /**
     * 四维点求线性插值
     * @param {Vec4} v 四维点
     * @param {number} alpha 插值比例
     * @return {Vec4} 求值结果
     */
    lerp(v: Vec4, alpha: number): this;
    /**
     * 四维点求线性插值
     * @param {Vec4} v1 四维点
     * @param {Vec4} v2 思维点
     * @param {number} alpha 插值比例
     * @returns {Vec4} 求值结果
     */
    lerpVecs(v1: Vec4, v2: Vec4, alpha: number): this;
    /**
     * 四维向量判等
     * @param {Vec4} v 四维向量
     * @return {boolean} 判等结果
     */
    equals(v: Vec4): boolean;
    /**
     * 由数组组装四维向量
     * @param {[x: number, y: number, z: number, z: number]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Vec4} 四维向量
     */
    fromArray(array: [x: number, y: number, z: number, z: number, ...rest: number[]]): this;
    /**
     * 四维向量转数组
     * @param {number[]} [array=[]] 目标保存对象
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 数组
     */
    toArray(): [x: number, y: number, z: number, z: number];
    /**
     * 生成随机四维向量
     * @return {Vec4} 四维向量
     */
    random(): this;
}
