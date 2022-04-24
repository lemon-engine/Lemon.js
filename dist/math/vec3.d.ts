import type { Euler } from './euler';
import { Quaternion } from './quaternion';
import type { Matrix3 } from './matrix3';
import type { Matrix4 } from './matrix4';
import { Vec2 } from './vec2';
import type { Spherical } from './spherical';
/**
 * @class 三维向量
 */
export declare class Vec3 {
    x: number;
    y: number;
    z: number;
    /**
     * 构造函数，默认值为三维零向量 | 三维原点
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [z=0]
     */
    constructor(x?: number, y?: number, z?: number);
    /**
     * @static 克隆三维向量
     * @param {Vec3} other 克隆对象
     * @return {Vec3} 克隆结果
     */
    static clone(other: Vec3): Vec3;
    /**
     * @static 由指定对象设置三维向量
     * @param {object} [other] 对象
     * @param {number} [other.x=0] x分量，默认值为0
     * @param {number} [other.y=0] y分量，默认值为0
     * @param {number} [other.z=0] z分量，默认值为0
     * @return {Vec3} 三维向量
     */
    static from({ x, y, z }: {
        x?: number | undefined;
        y?: number | undefined;
        z?: number | undefined;
    }): Vec3;
    /**
     * 由对象设置三维向量
     * @param {object} part 对象
     * @param {number} [part.x] x分量，默认值为0
     * @param {number} [part.y] y分量，默认值为0
     * @param {number} [part.z] z分量，默认值为0
     */
    setByPart(part: {
        x: number | undefined;
        y: number | undefined;
        z: number | undefined;
    }): void;
    /**
     * @static 三维向量比例混合
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @param {number} [ratio=0.5] 混合比例
     * @return {Vec3} 三维向量
     */
    static mix(a: Vec3, b: Vec3, ratio?: number): Vec3;
    /**
     * @static 屏幕坐标转视口坐标
     * @param {Vec2} view 屏幕坐标
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {number} z 坐标z值
     * @return {Vec3} 三维向量
     */
    static to3DWorld(view: Vec2, width: number, height: number, z: number): Vec3;
    /**
     * 设置三维向量
     * @param {number|number[]} x 值，数字 | 数组
     * @param {number} [y=x] y轴分量，默认值为x轴分量
     * @param {number} [z=x] z轴分量，默认值为x轴分量
     * @return {Vec3} 三维向量
     */
    set(x: number | number[], y?: number, z?: number): this;
    /**
     * 三维向量根据下标转二维向量
     * @param {number} [index=2] 下标
     * @return {Vec2} 二维向量
     */
    toVec2(index?: number): Vec2;
    /**
     * 克隆三维向量
     * @return {Vec3} 三维向量
     */
    clone(): Vec3;
    /**
     * 复制三维向量
     * @param {Vec3} v 复制对象
     * @return {Vec3} 三维向量
     */
    copy(v: Vec3): this;
    /**
     * 三维向量求和
     * @param {Vec3|number} v 三维向量 | 数字
     * @return {Vec3} 求和结果
     */
    add(v: Vec3 | number): this;
    /**
     * 三维向量求和
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 求和结果
     */
    addVectors(a: Vec3, b: Vec3): this;
    /**
     * 三维向量比例相交
     * @param {Vec3} v 三维向量
     * @param {number} s 比例
     * @returns {Vec3} 三维向量
     */
    addScaledVector(v: Vec3, s: number): this;
    /**
     * 三维向量求差
     * @param {Vec3|number} v 三维向量 | 数字
     * @return {Vec3} 三维向量
     */
    sub(v: Vec3 | number): this;
    /**
     * 三维向量求差
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 求差结果
     */
    subVectors(a: Vec3, b: Vec3): this;
    /**
     * 三维向量比例求差
     * @param {Vec3} v 三维向量
     * @param {number} s 比例
     * @return {Vec3} 求差结果
     */
    subScaledVector(v: Vec3, s: number): this;
    /**
     * 三维向量取反
     * @return {Vec3} 取反结果
     */
    inverse(): Vec3;
    /**
     * 三维向量求乘
     * @param {Vec3|number} v 三维向量 | 数字
     * @returns 三维向量
     */
    multiply(v: Vec3 | number): this;
    /**
     * 三维向量求乘
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 三维向量
     */
    multiplyVectors(a: Vec3, b: Vec3): this;
    /**
     * 三维点以center为中心欧拉角euler旋转结果
     * @param {Euler} euler 欧拉角
     * @param {Vec3} [center] 旋转中心
     * @return {Vec3} 三维点
     */
    applyEuler(euler: Euler, center?: Vec3): Vec3;
    /**
     * 三维点以center为中心绕axis轴旋转angle角度的结果
     * @param {Vec3} axis 旋转轴
     * @param {number} angle 旋转角度
     * @param {Vec3} [center] 旋转中心
     * @return {Vec3} 三维点
     */
    applyAxisAngle(axis: Vec3, angle: number, center?: Vec3): Vec3;
    /**
     * 三维点根据三维矩阵选准
     * @param {Matrix3} m 旋转矩阵
     * @return {Vec3} 三维点
     */
    applyMatrix3(m: Matrix3): this;
    /**
     * 三维向量旋转归一化
     * @param {Matrix3} m 旋转矩阵
     * @return {Vec3} 三维向量
     */
    applyNormalMatrix(m: Matrix3): Vec3;
    /**
     * 三维点根据矩阵进变换
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 三维点
     */
    applyMatrix4(m: Matrix4): this;
    /**
     * 三维点根据四元数绕点的旋转
     * @param {Quaternion} q 四元数
     * @param {Vec3} [center=new Vec3()] 旋转中心
     * @return {Vec3} 旋转结果
     */
    applyQuaternion(q: Quaternion, center?: Vec3): this;
    /**
     * 三维点投影
     * @param camera 相机
     * @return {Vec3} 投影结果
     */
    project(camera: any): this;
    /**
     * 三维点逆投影
     * @param camera 相机
     * @return {Vec3} 逆投影结果
     */
    unproject(camera: any): this;
    /**
     * 三维向量空间变换归一化
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 三维向量
     */
    transformDirection(m: Matrix4): Vec3;
    /**
     * 三维向量求除
     * @param {Vec3|number} v 三维向量 | 数字
     * @return {Vec3} 求除结果
     */
    divide(v: Vec3 | number): this;
    /**
     * 三维向量求最小值
     * @param {Vec3} v 三维向量
     * @return {Vec3} 求值结果
     */
    min(v: Vec3): this;
    /**
     * 三维向量求最大值
     * @param {Vec3} v 三维向量
     * @return {Vec3} 求值结果
     */
    max(v: Vec3): this;
    /**
     * 三维向量阈值约束
     * @param {Vec3} min 三维向量
     * @param {Vec3} max 三维向量
     * @return {Vec3} 求值结果
     */
    clamp(min: Vec3, max: Vec3): this;
    /**
     * 三维向量根据数值阈值约束
     * @param {number} minVal 最小值
     * @param {number} maxVal 最大值
     * @return {Vec3} 求值结果
     */
    clampScalar(minVal: number, maxVal: number): this;
    /**
     * 三维向量根据阈值约束长度
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @return {Vec3} 三维向量
     */
    clampLength(min: number, max: number): this;
    /**
     * 三维向量向下取整
     * @return {Vec3} 取整结果
     */
    floor(): this;
    /**
     * 三维向量向上取整
     * @return {Vec3} 取整结果
     */
    ceil(): this;
    /**
     * 三维向量四舍五入
     * @return {Vec3} 计算结果
     */
    round(): this;
    /**
     * 三维向量分类处理
     * @return {Vec3} 三维向量
     */
    roundToZero(): this;
    /**
     * 三维向量取反
     * @return {Vec3} 三维向量
     */
    negate(): this;
    /**
     * 三维向量求点积
     * @param {Vec3} v 三维向量
     * @return {number} 点积结果
     */
    dot(v: Vec3): number;
    /**
     * 三维向量长度平方
     * @return {number} 长度平方
     */
    lengthSq(): number;
    /**
     * 三维向量长度
     * @return {number} 长度
     */
    length(): number;
    /**
     * 三维向量曼哈顿长度
     * @return {number} 曼哈顿长度
     */
    manhattanLength(): number;
    /**
     * 三维向量归一化
     * @return {Vec3} 三维向量
     */
    normalize(): this;
    /**
     * 根据长度设置三维向量
     * @param {number} length 长度
     * @return {Vec3} 三维向量
     */
    setLength(length: number): this;
    /**
     * 三维点(this与other)求线性插值
     * @param {Vec3} other 三维点
     * @param {number} alpha 插值比例
     * @return {Vec3} 求值结果
     */
    lerp(other: Vec3, alpha: number): this;
    /**
     * 三维点(v1与v2)求线性插值
     * @param {Vec3} v1 三维点
     * @param {Vec3} v2 三维点
     * @param {number} alpha 插值比例
     * @return {Vec3} 求值结果
     */
    lerpVectors(v1: Vec3, v2: Vec3, alpha: number): this;
    /**
     * 三维向量(this与other)求叉积
     * @param {Vec3} v 三维向量
     * @return {Vec3} 叉积结果
     */
    cross(v: Vec3): this;
    /**
     * 三维向量(a与b)求叉积
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 叉积结果
     */
    crossVectors(a: Vec3, b: Vec3): this;
    /**
     * 三维向量this在三维向量v的投影
     * @param {Vec3} v 三维向量
     * @return {Vec3} 投影结果
     */
    projectOnVector(v: Vec3): this;
    /**
     * 三维点在平面的投影
     * @param {Vec3} planeNormal 平面法线
     * @return {Vec3} 投影结果
     */
    projectOnPlane(planeNormal: Vec3): this;
    /**
     * 三维向量反射
     * @param {Vec3} normal 法线
     * @return {Vec3} 反射结果
     */
    reflect(normal: Vec3): this;
    /**
     * 三维向量求夹角
     * @param {Vec3} v 三维向量
     * @return {number} 夹角
     */
    angleTo(v: Vec3): number;
    /**
     * 三维点求距离
     * @param {Vec3} v 三维点
     * @return {number} 距离
     */
    distanceTo(v: Vec3): number;
    /**
     * 三维点距离平方
     * @param {Vec3} v 三维点
     * @return {number} 距离平方
     */
    distanceToSquared(v: Vec3): number;
    /**
     * 三维点曼哈顿距离
     * @param {Vec3} v 三维点
     * @return {number} 曼哈顿距离
     */
    manhattanDistanceTo(v: Vec3): number;
    /**
     * 由球坐标获取笛卡尔坐标
     * @param s 球坐标
     * @returns 笛卡尔坐标
     */
    setFromSpherical(s: Spherical): this;
    /**
     * 根据值设置球坐标
     * @param {number} radius 半径
     * @param {number} phi y轴的极坐标角
     * @param {number} theta 绕y轴的方位角
     * @return {Vec3} 三维向量
     */
    setFromSphericalCoords(radius: number, phi: number, theta: number): this;
    /**
     * 根据圆柱设置三维向量
     * @param {number} radius 半径
     * @param {number} theta 方位角
     * @param {number} y 高
     * @return {Vec3} 三维向量
     */
    setFromCylindricalCoords(radius: number, theta: number, y: number): this;
    /**
     * 由空间变换矩阵保存三维偏移值
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 偏移值
     */
    setFromMatrixPosition(m: Matrix4): this;
    /**
     * 由空间变换矩阵保存三维缩放值
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 缩放至
     */
    setFromMatrixScale(m: Matrix4): this;
    /**
     * 由空间变换矩阵保存三维分量
     * @param {Matrix4} m 四维矩阵
     * @param {number} index 下标
     * @return {Vec3} 指定三维分量
     */
    setFromMatrixColumn(m: Matrix4, index: number): Vec3;
    /**
     * 由三维矩阵下标保存分量
     * @param {Matrix3} m 三维矩阵
     * @param {number} index 下标
     * @return {Vec3} 三维向量
     */
    setFromMatrix3Column(m: Matrix3, index: number): Vec3;
    /**
     * 三维向量判等
     * @param {Vec3} v 三维向量
     * @return {boolean} 判等结果
     */
    equals(v: Vec3): boolean;
    /**
     * 由数组组装三维向量
     * @param {[x: number, y: number, z: number]|object} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Vec3} 三维向量
     */
    fromArray(array: [x: number, y: number, z: number, ...rest: number[]] | {
        x: number;
        y: number;
        z: number;
    }): this;
    /**
     * 三维向量转数组
     * @param {number[]} array 目标保存对象
     * @return {number[]} 数组
     */
    toArray(): [x: number, y: number, z: number];
    /**
     * 获取随机三维向量
     * @return {Vec3}
     */
    random(): this;
}
