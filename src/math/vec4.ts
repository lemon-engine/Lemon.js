import type { Matrix4 } from './matrix4';
import type { Quaternion } from './quaternion';
import type { Vec3 } from './vec3';

/**
 * @class 四维向量
 */
export class Vec4 {
  /**
   * 构造函数，默认为w为1的单位四维向量
   * @param {number} [x=0] x轴分量
   * @param {number} [y=0] y轴分量
   * @param {number} [z=0] z轴分量
   * @param {number} [w=1] w轴分量
   */
  constructor (
    public x = 0,
    public y = 0,
    public z = 0,
    public w = 1,
  ) {
  }

  /**
   * @member {number} 宽度
   */
  get width () {
    return this.z;
  }
  set width (value) {
    this.z = value;
  }

  /**
   * @member {number} 高度
   */
  get height () {
    return this.w;
  }
  set height (value) {
    this.w = value;
  }

  /**
   * 设置四维向量
   * @param {number|Vec3} x 数字 | 三维向量
   * @param {number} [y=x] y轴分量
   * @param {number} [z=x] z轴分量
   * @param {number} [w=x] w轴分量
   * @returns
   */
  set (x: number | Vec3, y?: number, z?: number, w?: number): this {
    if (typeof x === 'number') {
      if (y === undefined || z === undefined || w === undefined) {
        this.x = this.y = this.z = this.w = x;
      } else {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
      }
    } else {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = y === undefined ? 1 : y;
    }
    return this;
  }

  /**
   * 设置x轴分量
   * @param {number} x x轴分量
   * @return {Vec4} 四维向量
   */
  setX (x: number): this {
    this.x = x;
    return this;
  }

  /**
   * 设置y轴分量
   * @param {number} y y轴分量
   * @return {Vec4} 四维向量
   */
  setY (y: number): this {
    this.y = y;
    return this;
  }

  /**
   * 设置z轴分量
   * @param {number} z z轴分量
   * @return {Vec4} 四维向量
   */
  setZ (z: number): this {
    this.z = z;
    return this;
  }

  /**
   * 设置w轴分量
   * @param {number} w w轴分量
   * @return {Vec4} 四维向量
   */
  setW (w: number): this {
    this.w = w;
    return this;
  }

  /**
   * 根据下标设置四维向量
   * @param {number} index 下标值
   * @param {number} value 数字
   * @return {Vec4} 四维向量
   */
  setComponent (index: number, value: number): this {
    switch (index) {
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      case 2: this.z = value; break;
      case 3: this.w = value; break;
      default: throw new Error('index is out of range: ' + index);
    }
    return this;
  }

  /**
   * 根据下标获取值
   * @param {number} index 下标
   * @return {number} 值
   */
  getComponent (index: number): number {
    switch (index) {
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      case 3: return this.w;
      default: throw new Error('index is out of range: ' + index);
    }
  }

  /**
   * 克隆四维向量
   * @return {Vec4} 克隆结果
   */
  clone (): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  /**
   * 复制四维向量
   * @param {Vec4} v 复制对象
   * @return {Vec4} 复制结果
   */
  copy (v: Vec4): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
  }

  /**
   * 四维向量求和
   * @param {Vec4|number} v 求和对象，四维向量 | 数字
   * @return {Vec4} 求和结果
   */
  add (v: Vec4 | number): this {
    if (typeof v === 'number') {
      this.x += v;
      this.y += v;
      this.z += v;
      this.w += v;
    } else {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      this.w += v.w;
    }
    return this;
  }

  /**
   * 四维向量求和
   * @param {Vec3} a 四维向量
   * @param {Vec4} b 四维向量
   * @return {Vec4} 求和结果
   */
  addVectors (a: Vec4, b: Vec4): this {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    this.w = a.w + b.w;
    return this;
  }

  /**
   * 四维向量比例求和
   * @param {Vec4} v 四维向量
   * @param {number} s 比例
   * @returns {Vec4} 求和结果
   */
  addScaledVec (v: Vec4, s: number): this {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    this.w += v.w * s;
    return this;
  }

  /**
   * 四维向量求差
   * @param {Vec4|number} v 求差对象，四维向量 | 数字
   * @return {Vec4} 四维向量
   */
  sub (v: Vec4 | number): this {
    if (typeof v === 'number') {
      this.x -= v;
      this.y -= v;
      this.z -= v;
      this.w -= v;
    } else {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      this.w -= v.w;
    }

    return this;
  }

  /**
   * 四维向量取反
   * @return {Vec4} 取反结果
   */
  inverse (): Vec4 {
    return this.clone().multiply(-1);
  }

  /**
   * 四维向量求差
   * @param {Vec4} a 四维向量
   * @param {Vec4} b 四维向量
   * @return {Vec4} 四维向量
   */
  subVectors (a: Vec4, b: Vec4): this {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    this.w = a.w - b.w;
    return this;
  }

  /**
   * 四维向量求乘
   * @param {Vec4|number} v 求乘对象，四维对象 | 数字
   * @return {Vec4} 四维向量
   */
  multiply (v: Vec4 | number): this {
    if (typeof v === 'number') {
      this.x *= v;
      this.y *= v;
      this.z *= v;
      this.w *= v;
    } else {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      this.w *= v.w;
    }
    return this;
  }

  /**
   * 四维向量矩阵变换
   * @param {Matrix4} m 变换矩阵
   * @return {Vec4} 四维向量
   */
  applyMatrix4 (m: Matrix4): this {
    const x = this.x; const y = this.y; const z = this.z; const w = this.w;
    const e = m.elements;

    this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
    this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
    this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
    this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

    return this;
  }

  /**
   * 四维向量求除
   * @param {number} scalar 除数
   * @return {Vec4} 求除结果
   */
  divideScalar (scalar: number): this {
    return this.multiply(1 / scalar);
  }

  /**
   * 根据四元数设置四维向量[旋转轴，旋转角度]
   * @param {Quaternion} q 四元数
   * @return {Vec4} 四维向量
   */
  setAxisAngleFromQuaternion (q: Quaternion): this {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

    // q is assumed to be normalized
    this.w = 2 * Math.acos(q.w);

    const s = Math.sqrt(1 - q.w * q.w);

    if (s < 0.0001) {
      this.x = 1;
      this.y = 0;
      this.z = 0;
    } else {
      this.x = q.x / s;
      this.y = q.y / s;
      this.z = q.z / s;
    }

    return this;
  }

  /**
   * 根据矩阵设置四维向量[旋转轴，旋转角度]
   * @param {Matrix4} m 矩阵
   * @return {Vec4} 四维向量
   */
  setAxisAngleFromRotationMatrix (m: Matrix4): this {

    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    let angle; let x; let y; let z; // variables for result
    const epsilon = 0.01;		// margin to allow for rounding errors
    const epsilon2 = 0.1;		// margin to distinguish between 0 and 180 degrees

    const te = m.elements;

    const m11 = te[0]; const m12 = te[4]; const m13 = te[8];
    const m21 = te[1]; const m22 = te[5]; const m23 = te[9];
    const m31 = te[2]; const m32 = te[6], m33 = te[10];

    if (Math.abs(m12 - m21) < epsilon
      && Math.abs(m13 - m31) < epsilon
      && Math.abs(m23 - m32) < epsilon) {
      // singularity found
      // first check for identity matrix which must have +1 for all terms
      // in leading diagonal and zero in other terms
      if (Math.abs(m12 + m21) < epsilon2
        && Math.abs(m13 + m31) < epsilon2
        && Math.abs(m23 + m32) < epsilon2
        && Math.abs(m11 + m22 + m33 - 3) < epsilon2) {
        // this singularity is identity matrix so angle = 0
        this.set(1, 0, 0, 0);
        return this; // zero angle, arbitrary axis
      }

      // otherwise this singularity is angle = 180
      angle = Math.PI;

      const xx = (m11 + 1) / 2;
      const yy = (m22 + 1) / 2;
      const zz = (m33 + 1) / 2;
      const xy = (m12 + m21) / 4;
      const xz = (m13 + m31) / 4;
      const yz = (m23 + m32) / 4;

      if ((xx > yy) && (xx > zz)) {
        // m11 is the largest diagonal term
        if (xx < epsilon) {
          x = 0;
          y = 0.707106781;
          z = 0.707106781;
        } else {
          x = Math.sqrt(xx);
          y = xy / x;
          z = xz / x;
        }
      } else if (yy > zz) {
        // m22 is the largest diagonal term
        if (yy < epsilon) {
          x = 0.707106781;
          y = 0;
          z = 0.707106781;
        } else {
          y = Math.sqrt(yy);
          x = xy / y;
          z = yz / y;
        }
      } else {
        // m33 is the largest diagonal term so base result on this
        if (zz < epsilon) {
          x = 0.707106781;
          y = 0.707106781;
          z = 0;
        } else {
          z = Math.sqrt(zz);
          x = xz / z;
          y = yz / z;
        }
      }

      this.set(x, y, z, angle);

      return this; // return 180 deg rotation
    }

    // as we have reached here there are no singularities so we can handle normally
    let s = Math.sqrt(
      (m32 - m23) * (m32 - m23) +
      (m13 - m31) * (m13 - m31) +
      (m21 - m12) * (m21 - m12)
    ); // used to normalize

    if (Math.abs(s) < 0.001) {
      s = 1;
    }

    // prevent divide by zero, should not happen if matrix is orthogonal and should be
    // caught by singularity test above, but I've left it in just in case
    this.x = (m32 - m23) / s;
    this.y = (m13 - m31) / s;
    this.z = (m21 - m12) / s;
    this.w = Math.acos((m11 + m22 + m33 - 1) / 2);

    return this;
  }

  /**
   * 四维向量求最小值
   * @param {Vec4} v 四维向量
   * @return {Vec4} 最小值
   */
  min (v: Vec4): this {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);
    this.w = Math.min(this.w, v.w);
    return this;
  }

  /**
   * 四维向量求最大值
   * @param {Vec4} v 四维向量
   * @return {Vec4} 最大值
   */
  max (v: Vec4): this {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);
    this.w = Math.max(this.w, v.w);
    return this;
  }

  /**
   * 四维向量阈值约束
   * @param {Vec4} min 最小值
   * @param {Vec4} max 最大值
   * @return {Vec4} 四维向量
   */
  clamp (min: Vec4, max: Vec4): this {
    // assumes min < max, componentwise
    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));
    this.z = Math.max(min.z, Math.min(max.z, this.z));
    this.w = Math.max(min.w, Math.min(max.w, this.w));
    return this;
  }

  /**
   * 四维向量数值阈值约束
   * @param {number} minVal 最小数值
   * @param {number} maxVal 最大数值
   * @return {Vec4} 四维向量
   */
  clampScalar (minVal: number, maxVal: number): this {
    this.x = Math.max(minVal, Math.min(maxVal, this.x));
    this.y = Math.max(minVal, Math.min(maxVal, this.y));
    this.z = Math.max(minVal, Math.min(maxVal, this.z));
    this.w = Math.max(minVal, Math.min(maxVal, this.w));
    return this;
  }

  /**
   * 四维向量根据数值约束长度
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @return {Vec4} 四维向量
   */
  clampLength (min: number, max: number): this {
    const length = this.length();
    return this.divideScalar(length || 1).multiply(Math.max(min, Math.min(max, length)));
  }

  /**
   * 四维向量向下取整
   * @return {Vec4} 取整结果
   */
  floor (): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    this.w = Math.floor(this.w);
    return this;
  }

  /**
   * 四维向量向上取整
   * @return {Vec4} 取整结果
   */
  ceil (): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    this.w = Math.ceil(this.w);
    return this;
  }

  /**
   * 四维向量四舍五入
   * @return {Vec4} 求值结果
   */
  round (): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    this.w = Math.round(this.w);
    return this;
  }

  /**
   * 四维向量分类处理
   * @return {Vec4} 计算结果
   */
  roundToZero (): this {
    this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
    this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
    this.w = (this.w < 0) ? Math.ceil(this.w) : Math.floor(this.w);
    return this;
  }

  /**
   * 四维向量取反
   * @return {Vec4} 取反结果
   */
  negate (): this {
    this.x = - this.x;
    this.y = - this.y;
    this.z = - this.z;
    this.w = - this.w;
    return this;
  }

  /**
   * 四维向量求点积
   * @param {Vec4} v 四维向量
   * @return {number} 点积结果
   */
  dot (v: Vec4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  /**
   * 四维向量长度平方
   * @return {number} 长度平方
   */
  lengthSq (): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  /**
   * 四维向量长度
   * @return {number} 长度
   */
  length (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  /**
   * 四维向量曼哈顿长度
   * @return {number} 曼哈顿长度
   */
  manhattanLength (): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }

  /**
   * 四维向量归一化
   * @return {Vec4} 归一化结果
   */
  normalize (): this {
    return this.divideScalar(this.length() || 1);
  }

  /**
   * 根据四维向量方向与长度设置四维向量
   * @param {number} length 长度
   * @return {Vec4} 四维向量
   */
  setLength (length: number): this {
    return this.normalize().multiply(length);
  }

  /**
   * 四维点求线性插值
   * @param {Vec4} v 四维点
   * @param {number} alpha 插值比例
   * @return {Vec4} 求值结果
   */
  lerp (v: Vec4, alpha: number): this {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    this.w += (v.w - this.w) * alpha;
    return this;
  }

  /**
   * 四维点求线性插值
   * @param {Vec4} v1 四维点
   * @param {Vec4} v2 思维点
   * @param {number} alpha 插值比例
   * @returns {Vec4} 求值结果
   */
  lerpVecs (v1: Vec4, v2: Vec4, alpha: number): this {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    this.z = v1.z + (v2.z - v1.z) * alpha;
    this.w = v1.w + (v2.w - v1.w) * alpha;
    return this;
  }

  /**
   * 四维向量判等
   * @param {Vec4} v 四维向量
   * @return {boolean} 判等结果
   */
  equals (v: Vec4): boolean {
    return v.x === this.x
      && v.y === this.y
      && v.z === this.z
      && v.w === this.w;
  }

  /**
   * 由数组组装四维向量
   * @param {[x: number, y: number, z: number, z: number]} array 数组
   * @param {number} [offset=0] 起始偏移值
   * @return {Vec4} 四维向量
   */
  fromArray (array: [x: number, y: number, z: number, z: number, ...rest: number[]]): this {
    [this.x, this.y, this.z, this.w] = array;
    return this;
  }

  /**
   * 四维向量转数组
   * @param {number[]} [array=[]] 目标保存对象
   * @param {number} [offset=0] 保存起始偏移值
   * @return {number[]} 数组
   */
  toArray (): [x: number, y: number, z: number, z: number] {
    return [this.x, this.y, this.z, this.w];
  }

  /**
   * 生成随机四维向量
   * @return {Vec4} 四维向量
   */
  random (): this {
    this.x = Math.random();
    this.y = Math.random();
    this.z = Math.random();
    this.w = Math.random();
    return this;
  }
}
