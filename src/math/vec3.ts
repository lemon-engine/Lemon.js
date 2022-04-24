import { clamp } from './utils';
import type { Euler } from './euler';
import { Quaternion } from './quaternion';
import type { Matrix3 } from './matrix3';
import type { Matrix4 } from './matrix4';
import { Vec2 } from './vec2';
import type { Spherical } from './spherical';

/**
 * @class 三维向量
 */
export class Vec3 {
  /**
   * 构造函数，默认值为三维零向量 | 三维原点
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   */
  constructor (
    public x = 0,
    public y = 0,
    public z = 0,
  ) {
  }

  /**
   * @static 克隆三维向量
   * @param {Vec3} other 克隆对象
   * @return {Vec3} 克隆结果
   */
  static clone (other: Vec3): Vec3 {
    const result = new Vec3();
    result.x = other.x;
    result.y = other.y;
    result.z = other.z;
    return result;
  }

  /**
   * @static 由指定对象设置三维向量
   * @param {object} [other] 对象
   * @param {number} [other.x=0] x分量，默认值为0
   * @param {number} [other.y=0] y分量，默认值为0
   * @param {number} [other.z=0] z分量，默认值为0
   * @return {Vec3} 三维向量
   */
  static from ({ x = 0, y = 0, z = 0 }): Vec3 {
    return new Vec3(x, y, z);
  }

  /**
   * 由对象设置三维向量
   * @param {object} part 对象
   * @param {number} [part.x] x分量，默认值为0
   * @param {number} [part.y] y分量，默认值为0
   * @param {number} [part.z] z分量，默认值为0
   */
  setByPart (part: { x: number | undefined, y: number | undefined, z: number | undefined; }) {
    Object.assign(this, part);
  }

  /**
   * @static 三维向量比例混合
   * @param {Vec3} a 三维向量
   * @param {Vec3} b 三维向量
   * @param {number} [ratio=0.5] 混合比例
   * @return {Vec3} 三维向量
   */
  static mix (a: Vec3, b: Vec3, ratio?: number): Vec3 {
    ratio = ratio ? ratio : 0.5;
    return new Vec3(ratio * a.x + (1 - ratio) * b.x, ratio * a.y + (1 - ratio) * b.y);
  }

  /**
   * @static 屏幕坐标转视口坐标
   * @param {Vec2} view 屏幕坐标
   * @param {number} width 宽度
   * @param {number} height 高度
   * @param {number} z 坐标z值
   * @return {Vec3} 三维向量
   */
  static to3DWorld (view: Vec2, width: number, height: number, z: number): Vec3 {
    const x = view.x / width;
    const y = view.y / height;
    return new Vec3((x - 0.5) * 2, (0.5 - y) * 2, z);
  }

  /**
   * 设置三维向量
   * @param {number|number[]} x 值，数字 | 数组
   * @param {number} [y=x] y轴分量，默认值为x轴分量
   * @param {number} [z=x] z轴分量，默认值为x轴分量
   * @return {Vec3} 三维向量
   */
  set (x: number | number[], y?: number, z?: number): this {
    if (typeof x !== 'number') {
      if (x.length === 3) {
        this.x = x[0];
        this.y = x[1];
        this.z = x[2];
      } else {
        console.warn('Length of array input as Vec3 must be three');
        this.x = this.y = this.z = 0;
      }
    } else if (y !== undefined && z !== undefined) {
      this.x = x;
      this.y = y;
      this.z = z;
    } else {
      this.x = this.y = this.z = x;
    }
    return this;
  }

  /**
   * 三维向量根据下标转二维向量
   * @param {number} [index=2] 下标
   * @return {Vec2} 二维向量
   */
  toVec2 (index = 2): Vec2 {
    const res = new Vec2();
    switch (index) {
      case 0:
        res.x = this.y;
        res.y = this.z;
        break;
      case 1:
        res.x = this.z;
        res.y = this.x;
        break;
      case 2:
      default:
        res.x = this.x;
        res.y = this.y;
        break;
    }
    return res;
  }

  /**
   * 克隆三维向量
   * @return {Vec3} 三维向量
   */
  clone (): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * 复制三维向量
   * @param {Vec3} v 复制对象
   * @return {Vec3} 三维向量
   */
  copy (v: Vec3): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  /**
   * 三维向量求和
   * @param {Vec3|number} v 三维向量 | 数字
   * @return {Vec3} 求和结果
   */
  add (v: Vec3 | number): this {
    if (typeof v === 'number') {
      this.x += v;
      this.y += v;
      this.z += v;
    } else {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
    }
    return this;
  }

  /**
   * 三维向量求和
   * @param {Vec3} a 三维向量
   * @param {Vec3} b 三维向量
   * @return {Vec3} 求和结果
   */
  addVectors (a: Vec3, b: Vec3): this {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  }

  /**
   * 三维向量比例相交
   * @param {Vec3} v 三维向量
   * @param {number} s 比例
   * @returns {Vec3} 三维向量
   */
  addScaledVector (v: Vec3, s: number): this {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
  }

  /**
   * 三维向量求差
   * @param {Vec3|number} v 三维向量 | 数字
   * @return {Vec3} 三维向量
   */
  sub (v: Vec3 | number): this {
    if (typeof v === 'number') {
      this.x -= v;
      this.y -= v;
      this.z -= v;
    } else {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
    }
    return this;
  }

  /**
   * 三维向量求差
   * @param {Vec3} a 三维向量
   * @param {Vec3} b 三维向量
   * @return {Vec3} 求差结果
   */
  subVectors (a: Vec3, b: Vec3): this {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }

  /**
   * 三维向量比例求差
   * @param {Vec3} v 三维向量
   * @param {number} s 比例
   * @return {Vec3} 求差结果
   */
  subScaledVector (v: Vec3, s: number): this {
    this.x -= v.x * s;
    this.y -= v.y * s;
    this.z -= v.z * s;
    return this;
  }

  /**
   * 三维向量取反
   * @return {Vec3} 取反结果
   */
  inverse (): Vec3 {
    return this.clone().multiply(-1);
  }

  /**
   * 三维向量求乘
   * @param {Vec3|number} v 三维向量 | 数字
   * @returns 三维向量
   */
  multiply (v: Vec3 | number): this {
    if (typeof v === 'number') {
      this.x *= v;
      this.y *= v;
      this.z *= v;
    } else {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
    }
    return this;
  }

  /**
   * 三维向量求乘
   * @param {Vec3} a 三维向量
   * @param {Vec3} b 三维向量
   * @return {Vec3} 三维向量
   */
  multiplyVectors (a: Vec3, b: Vec3): this {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;
    return this;
  }

  /**
   * 三维点以center为中心欧拉角euler旋转结果
   * @param {Euler} euler 欧拉角
   * @param {Vec3} [center] 旋转中心
   * @return {Vec3} 三维点
   */
  applyEuler (euler: Euler, center?: Vec3): Vec3 {
    return this.applyQuaternion(new Quaternion().setFromEuler(euler), center);
  }

  /**
   * 三维点以center为中心绕axis轴旋转angle角度的结果
   * @param {Vec3} axis 旋转轴
   * @param {number} angle 旋转角度
   * @param {Vec3} [center] 旋转中心
   * @return {Vec3} 三维点
   */
  applyAxisAngle (axis: Vec3, angle: number, center?: Vec3): Vec3 {
    return this.applyQuaternion(new Quaternion().setFromAxisAngle(axis, angle), center);
  }

  /**
   * 三维点根据三维矩阵选准
   * @param {Matrix3} m 旋转矩阵
   * @return {Vec3} 三维点
   */
  applyMatrix3 (m: Matrix3): this {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const e = m.elements;
    this.x = e[0] * x + e[3] * y + e[6] * z;
    this.y = e[1] * x + e[4] * y + e[7] * z;
    this.z = e[2] * x + e[5] * y + e[8] * z;
    return this;
  }

  /**
   * 三维向量旋转归一化
   * @param {Matrix3} m 旋转矩阵
   * @return {Vec3} 三维向量
   */
  applyNormalMatrix (m: Matrix3): Vec3 {
    return this.applyMatrix3(m).normalize();
  }

  /**
   * 三维点根据矩阵进变换
   * @param {Matrix4} m 四维矩阵
   * @return {Vec3} 三维点
   */
  applyMatrix4 (m: Matrix4): this {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const e = m.elements;

    if (false) {
      //@ts-ignore
      this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
      this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
      this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
    } else {
      const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
      this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
      this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
      this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
    }
    return this;
  }

  /**
   * 三维点根据四元数绕点的旋转
   * @param {Quaternion} q 四元数
   * @param {Vec3} [center=new Vec3()] 旋转中心
   * @return {Vec3} 旋转结果
   */
  applyQuaternion (q: Quaternion, center: Vec3 = new Vec3()): this {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const { x: qx, y: qy, z: qz, w: qw } = q;
    const { x: centerX, y: centerY, z: centerZ } = center;

    const ix = qw * (x - centerX) + qy * (z - centerZ) - qz * (y - centerY);
    const iy = qw * (y - centerY) + qz * (x - centerX) - qx * (z - centerZ);
    const iz = qw * (z - centerZ) + qx * (y - centerY) - qy * (x - centerX);
    const iw = - qx * (x - centerX) - qy * (y - centerY) - qz * (z - centerZ);

    this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy + centerX;
    this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz + centerY;
    this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx + centerZ;

    return this;
  }

  /**
   * 三维点投影
   * @param camera 相机
   * @return {Vec3} 投影结果
   */
  project (camera: any): this {
    return this.applyMatrix4(camera.viewProjectMatrix);
  }

  /**
   * 三维点逆投影
   * @param camera 相机
   * @return {Vec3} 逆投影结果
   */
  unproject (camera: any): this {
    // TODO: 补齐 camera 类型
    return this.applyMatrix4(camera.projectionMatrixInverse as Matrix4).applyMatrix4(camera.matrixWorld as Matrix4);
  }

  /**
   * 三维向量空间变换归一化
   * @param {Matrix4} m 四维矩阵
   * @return {Vec3} 三维向量
   */
  transformDirection (m: Matrix4): Vec3 {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;

    return this.normalize();
  }

  /**
   * 三维向量求除
   * @param {Vec3|number} v 三维向量 | 数字
   * @return {Vec3} 求除结果
   */
  divide (v: Vec3 | number): this {
    if (typeof v === 'number') {
      this.x /= v;
      this.y /= v;
      this.z /= v;
    } else {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
    }
    return this;
  }

  /**
   * 三维向量求最小值
   * @param {Vec3} v 三维向量
   * @return {Vec3} 求值结果
   */
  min (v: Vec3): this {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);
    return this;
  }

  /**
   * 三维向量求最大值
   * @param {Vec3} v 三维向量
   * @return {Vec3} 求值结果
   */
  max (v: Vec3): this {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);
    return this;
  }

  /**
   * 三维向量阈值约束
   * @param {Vec3} min 三维向量
   * @param {Vec3} max 三维向量
   * @return {Vec3} 求值结果
   */
  clamp (min: Vec3, max: Vec3): this {
    // assumes min < max, componentwise
    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));
    this.z = Math.max(min.z, Math.min(max.z, this.z));
    return this;
  }

  /**
   * 三维向量根据数值阈值约束
   * @param {number} minVal 最小值
   * @param {number} maxVal 最大值
   * @return {Vec3} 求值结果
   */
  clampScalar (minVal: number, maxVal: number): this {
    this.x = Math.max(minVal, Math.min(maxVal, this.x));
    this.y = Math.max(minVal, Math.min(maxVal, this.y));
    this.z = Math.max(minVal, Math.min(maxVal, this.z));
    return this;
  }

  /**
   * 三维向量根据阈值约束长度
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @return {Vec3} 三维向量
   */
  clampLength (min: number, max: number): this {
    const length = this.length();
    return this.divide(length || 1).multiply(Math.max(min, Math.min(max, length)));
  }

  /**
   * 三维向量向下取整
   * @return {Vec3} 取整结果
   */
  floor (): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  }

  /**
   * 三维向量向上取整
   * @return {Vec3} 取整结果
   */
  ceil (): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    return this;
  }

  /**
   * 三维向量四舍五入
   * @return {Vec3} 计算结果
   */
  round (): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }

  /**
   * 三维向量分类处理
   * @return {Vec3} 三维向量
   */
  roundToZero (): this {
    this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
    this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
    return this;
  }

  /**
   * 三维向量取反
   * @return {Vec3} 三维向量
   */
  negate (): this {
    this.x = - this.x;
    this.y = - this.y;
    this.z = - this.z;
    return this;
  }

  /**
   * 三维向量求点积
   * @param {Vec3} v 三维向量
   * @return {number} 点积结果
   */
  dot (v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * 三维向量长度平方
   * @return {number} 长度平方
   */
  lengthSq (): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * 三维向量长度
   * @return {number} 长度
   */
  length (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * 三维向量曼哈顿长度
   * @return {number} 曼哈顿长度
   */
  manhattanLength (): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }

  /**
   * 三维向量归一化
   * @return {Vec3} 三维向量
   */
  normalize (): this {
    return this.divide(this.length() || 1);
  }

  /**
   * 根据长度设置三维向量
   * @param {number} length 长度
   * @return {Vec3} 三维向量
   */
  setLength (length: number): this {
    return this.normalize().multiply(length);
  }

  /**
   * 三维点(this与other)求线性插值
   * @param {Vec3} other 三维点
   * @param {number} alpha 插值比例
   * @return {Vec3} 求值结果
   */
  lerp (other: Vec3, alpha: number): this {
    this.x += (other.x - this.x) * alpha;
    this.y += (other.y - this.y) * alpha;
    this.z += (other.z - this.z) * alpha;
    return this;
  }

  /**
   * 三维点(v1与v2)求线性插值
   * @param {Vec3} v1 三维点
   * @param {Vec3} v2 三维点
   * @param {number} alpha 插值比例
   * @return {Vec3} 求值结果
   */
  lerpVectors (v1: Vec3, v2: Vec3, alpha: number): this {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;
    return this;
  }

  /**
   * 三维向量(this与other)求叉积
   * @param {Vec3} v 三维向量
   * @return {Vec3} 叉积结果
   */
  cross (v: Vec3): this {
    return this.crossVectors(this, v);
  }

  /**
   * 三维向量(a与b)求叉积
   * @param {Vec3} a 三维向量
   * @param {Vec3} b 三维向量
   * @return {Vec3} 叉积结果
   */
  crossVectors (a: Vec3, b: Vec3): this {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }

  /**
   * 三维向量this在三维向量v的投影
   * @param {Vec3} v 三维向量
   * @return {Vec3} 投影结果
   */
  projectOnVector (v: Vec3): this {
    const denominator = v.lengthSq();
    if (denominator === 0) {
      return this.set(0, 0, 0);
    }
    const scalar = v.dot(this) / denominator;
    return this.copy(v).multiply(scalar);
  }

  /**
   * 三维点在平面的投影
   * @param {Vec3} planeNormal 平面法线
   * @return {Vec3} 投影结果
   */
  projectOnPlane (planeNormal: Vec3): this {
    const vector = new Vec3();
    vector.copy(this).projectOnVector(planeNormal);
    return this.sub(vector);
  }

  /**
   * 三维向量反射
   * @param {Vec3} normal 法线
   * @return {Vec3} 反射结果
   */
  reflect (normal: Vec3): this {
    // reflect incident vector off plane orthogonal to normal
    // normal is assumed to have unit length
    const vector = new Vec3();
    return this.sub(vector.copy(normal).multiply(2 * this.dot(normal)));
  }

  /**
   * 三维向量求夹角
   * @param {Vec3} v 三维向量
   * @return {number} 夹角
   */
  angleTo (v: Vec3): number {
    const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());

    if (denominator === 0) {
      return Math.PI / 2;
    }

    const theta = this.dot(v) / denominator;
    // clamp, to handle numerical problems
    return Math.acos(clamp(theta, - 1, 1));
  }

  /**
   * 三维点求距离
   * @param {Vec3} v 三维点
   * @return {number} 距离
   */
  distanceTo (v: Vec3): number {
    return Math.sqrt(this.distanceToSquared(v));
  }

  /**
   * 三维点距离平方
   * @param {Vec3} v 三维点
   * @return {number} 距离平方
   */
  distanceToSquared (v: Vec3): number {
    const dx = this.x - v.x; const dy = this.y - v.y; const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * 三维点曼哈顿距离
   * @param {Vec3} v 三维点
   * @return {number} 曼哈顿距离
   */
  manhattanDistanceTo (v: Vec3): number {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
  }

  /**
   * 由球坐标获取笛卡尔坐标
   * @param s 球坐标
   * @returns 笛卡尔坐标
   */
  setFromSpherical (s: Spherical) {
    return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
  }

  /**
   * 根据值设置球坐标
   * @param {number} radius 半径
   * @param {number} phi y轴的极坐标角
   * @param {number} theta 绕y轴的方位角
   * @return {Vec3} 三维向量
   */
  setFromSphericalCoords (radius: number, phi: number, theta: number): this {
    const sinPhiRadius = Math.sin(phi) * radius;
    this.x = sinPhiRadius * Math.sin(theta);
    this.y = Math.cos(phi) * radius;
    this.z = sinPhiRadius * Math.cos(theta);
    return this;
  }

  // setFromCylindrical(c) {
  //   return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
  // }

  /**
   * 根据圆柱设置三维向量
   * @param {number} radius 半径
   * @param {number} theta 方位角
   * @param {number} y 高
   * @return {Vec3} 三维向量
   */
  setFromCylindricalCoords (radius: number, theta: number, y: number): this {
    this.x = radius * Math.sin(theta);
    this.y = y;
    this.z = radius * Math.cos(theta);
    return this;
  }

  /**
   * 由空间变换矩阵保存三维偏移值
   * @param {Matrix4} m 四维矩阵
   * @return {Vec3} 偏移值
   */
  setFromMatrixPosition (m: Matrix4): this {
    const e = m.elements;
    this.x = e[12];
    this.y = e[13];
    this.z = e[14];
    return this;
  }

  /**
   * 由空间变换矩阵保存三维缩放值
   * @param {Matrix4} m 四维矩阵
   * @return {Vec3} 缩放至
   */
  setFromMatrixScale (m: Matrix4): this {
    const sx = this.setFromMatrixColumn(m, 0).length();
    const sy = this.setFromMatrixColumn(m, 1).length();
    const sz = this.setFromMatrixColumn(m, 2).length();
    this.x = sx;
    this.y = sy;
    this.z = sz;
    return this;
  }

  /**
   * 由空间变换矩阵保存三维分量
   * @param {Matrix4} m 四维矩阵
   * @param {number} index 下标
   * @return {Vec3} 指定三维分量
   */
  setFromMatrixColumn (m: Matrix4, index: number): Vec3 {
    // 这里断言了，类型不安全，之后加 lint，必须有明显的 disable lint 起提示作用
    return this.fromArray(m.elements.slice(index * 4) as [x: number, y: number, z: number]);
  }

  /**
   * 由三维矩阵下标保存分量
   * @param {Matrix3} m 三维矩阵
   * @param {number} index 下标
   * @return {Vec3} 三维向量
   */
  setFromMatrix3Column (m: Matrix3, index: number): Vec3 {
    // 这里断言了，类型不安全，之后加 lint，必须有明显的 disable lint 起提示作用
    return this.fromArray(m.elements.slice(index * 3) as [x: number, y: number, z: number]);
  }

  /**
   * 三维向量判等
   * @param {Vec3} v 三维向量
   * @return {boolean} 判等结果
   */
  equals (v: Vec3): boolean {
    return v.x === this.x
      && v.y === this.y
      && v.z === this.z;
  }

  /**
   * 由数组组装三维向量
   * @param {[x: number, y: number, z: number]|object} array 数组
   * @param {number} [offset=0] 起始偏移值
   * @return {Vec3} 三维向量
   */
  fromArray (array: [x: number, y: number, z: number, ...rest: number[]] | { x: number, y: number, z: number; }): this {
    if (Array.isArray(array)) {
      [this.x, this.y, this.z] = array;
    } else {
      this.x = array.x;
      this.y = array.y;
      this.z = array.z;
    }

    return this;
  }

  /**
   * 三维向量转数组
   * @param {number[]} array 目标保存对象
   * @return {number[]} 数组
   */
  toArray (): [x: number, y: number, z: number] {
    return [this.x, this.y, this.z];
  }

  /**
   * 获取随机三维向量
   * @return {Vec3}
   */
  random (): this {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
    return this;
  }
}
