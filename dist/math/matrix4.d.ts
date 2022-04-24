import { Vec3 } from './vec3';
import { Euler } from './euler';
import type { Matrix3 } from './matrix3';
import { Quaternion } from './quaternion';
/**
 * @class 四维矩阵[三维空间变换矩阵 || 四维空间旋转缩放矩阵]
 */
export declare class Matrix4 {
    /**
     * @member {number[]} 四维矩阵值数组
     */
    elements: number[];
    /**
     * 构造函数，初始值为单位矩阵
     */
    constructor();
    /**
     * @static 克隆四维矩阵
     * @param {Matrix4} other 四维矩阵
     * @return {Matrix4} 克隆结果
     */
    static clone(other: Matrix4): Matrix4;
    /**
     * @static 由透视相机基础参数设置投影矩阵
     * @param {number} near 近平面
     * @param {number} far 远平面
     * @param {number} fov 视角
     * @param {number} aspect 视窗比例
     * @param {number} clipMode 裁切模式, 0表示垂直裁切, 1表示水平裁切
     * @return {Matrix4} 投影矩阵
     */
    static makePerspective(near: number, far: number, fov: number, aspect: number, clipMode?: number): Matrix4;
    /**
     * 设置四维矩阵
     * @param {number} n00 矩阵[0, 0]值
     * @param {number} n01 矩阵[0, 1]值
     * @param {number} n02 矩阵[0, 2]值
     * @param {number} n03 矩阵[0, 3]值
     * @param {number} n10 矩阵[1, 0]值
     * @param {number} n11 矩阵[1, 1]值
     * @param {number} n12 矩阵[1, 2]值
     * @param {number} n13 矩阵[1, 2]值
     * @param {number} n20 矩阵[2, 0]值
     * @param {number} n21 矩阵[2, 1]值
     * @param {number} n22 矩阵[2, 2]值
     * @param {number} n23 矩阵[2, 3]值
     * @param {number} n30 矩阵[3, 0]值
     * @param {number} n32 矩阵[3, 1]值
     * @param {number} n32 矩阵[3, 2]值
     * @param {number} n33 矩阵[3, 3]值
     * @return {Matrix4} 四维矩阵
     */
    set(n00: number, n01: number, n02: number, n03: number, n10: number, n11: number, n12: number, n13: number, n20: number, n21: number, n22: number, n23: number, n30: number, n31: number, n32: number, n33: number): this;
    /**
     * 四维矩阵单位化
     * @return {Matrix4} 单位矩阵
     */
    identity(): this;
    /**
     * 四维矩阵单位判断
     * @return {boolean} 判断结果
     */
    isIdentity(): boolean;
    /**
     * 四维矩阵克隆
     * @return {Matrix4} 克隆结果
     */
    clone(): Matrix4;
    /**
     * 四维矩阵复制
     * @param {Matrix4} m 复制对象
     * @return {Matrix4} 复制结果
     */
    copy(m: Matrix4): this;
    /**
     * 四维矩阵位置信息复制
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 复制结果
     */
    copyPosition(m: Matrix4): this;
    /**
     * 由三维矩阵构建四维矩阵
     * @param {Matrix3} m 三维矩阵
     * @return {Matrix4} 构建结果
     */
    setFromMatrix3(m: Matrix3): this;
    /**
     * 导出四维矩阵[三维空间变换矩阵]分量
     * @param {Vec3} xAxis x轴分量
     * @param {Vec3} yAxis y轴分量
     * @param {Vec3} zAxis z轴分量
     * @return {Matrix4} 四维矩阵
     */
    extractBasis(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): this;
    /**
     * 由分量构建四维矩阵[三维空间变换矩阵]
     * @param {Vec3} xAxis x轴分量
     * @param {Vec3} yAxis y轴分量
     * @param {Vec3} zAxis z轴分量
     * @return {Matrix4} 四维矩阵
     */
    makeBasis(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): this;
    /**
     * 导出四维矩阵[三维空间变换矩阵]旋转部分
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 导出结果
     */
    extractRotation(m: Matrix4): this;
    /**
     * 由欧拉角设置四维矩阵
     * @param {Euler} euler 欧拉角
     * @return {Matrix4} 四维矩阵
     */
    makeRotationFromEuler(euler: Euler): this;
    /**
     * 由四元数这是四维矩阵
     * @param {Quaternion} q 四元数
     * @return {Matrix4} 四维矩阵
     */
    makeRotationFromQuaternion(q: Quaternion): Matrix4;
    /**
     * 由相机位置与目标位置以及向上方向设置四维矩阵[相机视图矩阵]
     * @param {Vec3} eye 相机位置
     * @param {Vec3} target 目标位置
     * @param {Vec3} up 相机方向
     * @return {Matrix4} 四维矩阵[相机视图矩阵]
     */
    lookAt(eye: Vec3, target: Vec3, up: Vec3): this;
    /**
     * 四维矩阵右乘
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 右乘结果
     */
    multiply(m: Matrix4): this;
    /**
     * 四维矩阵左乘
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 左乘结果
     */
    premultiply(m: Matrix4): this;
    /**
     * 四维矩阵相乘(a * b)
     * @param {Matrix4} a 四维矩阵
     * @param {Matrix4} b 四维矩阵
     * @return {Matrix4} 相乘结果
     */
    multiplyMatrices(a: Matrix4, b: Matrix4): this;
    /**
     * 四维矩阵缩放
     * @param {number} s 缩放比例
     * @return {Matrix4} 缩放结果
     */
    multiplyScalar(s: number): this;
    /**
     * 四维矩阵求行列式值
     * @return {number} 行列式值
     */
    determinant(): number;
    /**
     * 四维矩阵转置
     * @return {Matrix4} 转置结果
     */
    transpose(): this;
    /**
     * 设置四维矩阵[三维空间变换矩阵]位置信息
     * @param {number|Vec3} x 位置信息
     * @param {number} [y=x] y轴位置信息
     * @param {number} [z=x] z轴位置信息
     * @return {Matrix4}
     */
    setPosition(x: number | Vec3, y?: number, z?: number): this;
    /**
     * 四维矩阵求逆
     * @return {Matrix4} 逆矩阵
     */
    invert(): this;
    /**
     * 四维矩阵[三维空间变换矩阵]分轴缩放
     * @param {Vec3} v 分轴缩放向量
     * @return {Matrix4} 缩放结果
     */
    scale(v: Vec3): this;
    /**
     * 获取四维矩阵[三维空间变换矩阵]分轴缩放最大值
     * @return {number} 计算结果
     */
    getMaxScaleOnAxis(): number;
    /**
     * 根据三维空间位移信息设置四维矩阵
     * @param {number} x x轴坐标信息
     * @param {number} y y轴坐标信息
     * @param {number} z z轴坐标信息
     * @return {Matrix4} 四维矩阵
     */
    makeTranslation(x: number, y: number, z: number): this;
    /**
     * 根据x轴旋转信息设置四维矩阵
     * @param {number} theta x轴旋转弧度
     * @return {Matrix4} 四维矩阵
     */
    makeRotationX(theta: number): this;
    /**
     * 根据y轴旋转信息设置四维矩阵
     * @param {number} theta y轴旋转弧度
     * @return {Matrix4} 四维矩阵
     */
    makeRotationY(theta: number): this;
    /**
     * 根据z轴旋转信息设置四维矩阵
     * @param {number} theta z轴旋转弧度
     * @return {Matrix4} 四维矩阵
     */
    makeRotationZ(theta: number): this;
    /**
     * 根据三维旋转轴与弧度设置四维矩阵
     * @param {Vec3} axis 三维旋转轴
     * @param {number} angle 旋转弧度
     * @return {Matrix4} 四维矩阵
     */
    makeRotationAxis(axis: Vec3, angle: number): this;
    /**
     * 根据缩放比例设置四维矩阵
     * @param {number} x 缩放比例
     * @param {number} [y=x] y方向缩放比例
     * @param {number} [z=x] z方向缩放比例
     * @return {Matrix4}
     */
    makeScale(x: number, y?: number, z?: number): this;
    /**
     * 设置倾斜矩阵
     * @param {number} x x方向倾斜分量
     * @param {number} y y方向倾斜分量
     * @param {number} z z方向倾斜分量
     * @return {Matrix4} 倾斜矩阵
     */
    makeShear(x: number, y: number, z: number): this;
    /**
     * 根据基础信息组装四维矩阵
     * @param {Vec3} position 位置信息
     * @param {Euler|Quaternion} rotation 旋转信息
     * @param {Vec3} scale 缩放信息
     * @return {Matrix4} 四维矩阵
     */
    compose(position: Vec3, rotation: Euler | Quaternion, scale: Vec3): Matrix4;
    /**
     * 四维矩阵拆分为基础信息
     * @param {Vec3} position 位置信息
     * @param {Quaternion} quaternion 旋转信息
     * @param {Vec3} scale 缩放信息
     * @returns 四维矩阵
     */
    decompose(position: Vec3, quaternion: Quaternion, scale: Vec3): this;
    /**
     * 根据视窗信息设置透视相机投影矩阵
     * @param {number} left 视窗左平面位置
     * @param {number} right 视窗右平面位置
     * @param {number} top 视窗上平面位置
     * @param {number} bottom 视窗下平面位置
     * @param {number} near 视窗近平面位置
     * @param {number} far 视窗远平面位置
     * @return {Matrix4} 四维矩阵
     */
    makePerspective(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
    /**
     * 根据视窗信息设置正交相机投影矩阵
     * @param {number} left 视窗左平面位置
     * @param {number} right 视窗右平面位置
     * @param {number} top 视窗上平面位置
     * @param {number} bottom 视窗下平面位置
     * @param {number} near 视窗近平面位置
     * @param {number} far 视窗远平面位置
     * @return {Matrix4} 四维矩阵
     */
    makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
    /**
     * 四维矩阵判等
     * @param {Matrix4} matrix 四维矩阵
     * @return {boolean} 判等结果
     */
    equals(matrix: Matrix4): boolean;
    /**
     * 由数组设置四维矩阵
     * @param {number[]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Matrix4} 四维矩阵
     */
    fromArray(array: number[], offset?: number): this;
    /**
     * 四维矩阵转数组
     * @param {number[]} [array=[]] 结果保存对象
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 四维矩阵
     */
    toArray(array?: number[], offset?: number): number[];
}
