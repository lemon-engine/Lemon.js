import type { Euler } from './euler';
import { EulerOrder } from './euler';
import { clamp } from './utils';
import type { Matrix4 } from './matrix4';
import type { Vec3 } from './vec3';

/**
 * @class 四元数
 */
export class Quaternion {
  /**
   * 四元数构造函数，默认为单位值
   * @param {number} [x=0] x分量
   * @param {number} [y=0] y分量
   * @param {number} [z=0] z分量
   * @param {number} [w=1] w分量
   */
  constructor (
    public x = 0,
    public y = 0,
    public z = 0,
    public w = 1,
  ) {
  }

  /**
   * 设置四元数的值
   * @param {number} x x分量
   * @param {number} y y分量
   * @param {number} z z分量
   * @param {number} w w分量
   * @return {Quaternion} 四元数
   */
  set (x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.onChangeCallback();
    return this;
  }

  /**
   * 四元数克隆
   * @return {Quaternion} 克隆结果
   */
  clone (): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  /**
   * 深拷贝四元数
   * @param {Quaternion} quaternion
   * @return {Quaternion}
   */
  copy (quaternion: Quaternion): this {
    this.x = quaternion.x;
    this.y = quaternion.y;
    this.z = quaternion.z;
    this.w = quaternion.w;
    this.onChangeCallback();
    return this;
  }

  /**
   * 由欧拉角设置四元数
   * @param {Euler} euler 欧拉角
   * @param {boolean} [update] 是否触发回调
   * @return {Quaternion} 四元数
   */
  setFromEuler (euler: Euler, update?: boolean): this {
    const cos = Math.cos;
    const sin = Math.sin;

    const c1 = cos(euler.x / 2);
    const c2 = cos(euler.y / 2);
    const c3 = cos(euler.z / 2);

    const s1 = sin(euler.x / 2);
    const s2 = sin(euler.y / 2);
    const s3 = sin(euler.z / 2);

    switch (euler.order) {
      case EulerOrder.XYZ:
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case EulerOrder.YXZ:
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case EulerOrder.ZXY:
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case EulerOrder.ZYX:
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case EulerOrder.YZX:
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case EulerOrder.XZY:
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      default:
        console.warn('THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + euler.order);
    }

    if (update !== false) {
      this.onChangeCallback();
    }

    return this;
  }

  /**
   * 由旋转轴和旋转角度设置四元数
   * @param {Vec3} axis 旋转轴
   * @param {number} angle 旋转角
   * @return {Quaternion} 四元数
   */
  setFromAxisAngle (axis: Vec3, angle: number): this {
    const halfAngle = angle / 2;
    const s = Math.sin(halfAngle);

    this.x = axis.x * s;
    this.y = axis.y * s;
    this.z = axis.z * s;
    this.w = Math.cos(halfAngle);

    this.onChangeCallback();

    return this;
  }

  /**
   * 由空间变换矩阵设置四元数
   * @param {Matrix4} m 四维矩阵
   * @return {Quaternion} 四元数
   */
  setFromRotationMatrix (m: Matrix4): this {
    const te = m.elements;

    const m11 = te[0];
    const m12 = te[4];
    const m13 = te[8];
    const m21 = te[1];
    const m22 = te[5];
    const m23 = te[9];
    const m31 = te[2];
    const m32 = te[6];
    const m33 = te[10];
    const trace = m11 + m22 + m33;

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0);
      this.w = 0.25 / s;
      this.x = (m32 - m23) * s;
      this.y = (m13 - m31) * s;
      this.z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
      this.w = (m32 - m23) / s;
      this.x = 0.25 * s;
      this.y = (m12 + m21) / s;
      this.z = (m13 + m31) / s;
    } else if (m22 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
      this.w = (m13 - m31) / s;
      this.x = (m12 + m21) / s;
      this.y = 0.25 * s;
      this.z = (m23 + m32) / s;
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
      this.w = (m21 - m12) / s;
      this.x = (m13 + m31) / s;
      this.y = (m23 + m32) / s;
      this.z = 0.25 * s;
    }

    this.onChangeCallback();

    return this;
  }

  setFromUnitVectors (vFrom: Vec3, vTo: Vec3): this {

    // assumes direction vectors vFrom and vTo are normalized
    let r = vFrom.dot(vTo) + 1;
    if (r < Number.EPSILON) {
      r = 0;
      if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
        this.x = - vFrom.y;
        this.y = vFrom.x;
        this.z = 0;
        this.w = r;
      } else {
        this.x = 0;
        this.y = - vFrom.z;
        this.z = vFrom.y;
        this.w = r;
      }
    } else {
      // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
      this.x = vFrom.y * vTo.z - vFrom.z * vTo.y;
      this.y = vFrom.z * vTo.x - vFrom.x * vTo.z;
      this.z = vFrom.x * vTo.y - vFrom.y * vTo.x;
      this.w = r;
    }

    return this.normalize();
  }

  /**
   * 与四元数other之间的夹角
   * @param {Quaternion} other 四元数
   * @return {number} 夹角
   */
  angleTo (other: Quaternion): number {
    return 2 * Math.acos(Math.abs(clamp(this.dot(other), - 1, 1)));
  }

  // TODO
  /**
   * 四元数向目标旋转
   * @param {Quaternion} q 四元数
   * @param {number} step 旋转弧度
   * @return {Quaternion} 目标四元数
   */
  rotateTowards (q: Quaternion, step: number): this {
    const angle = this.angleTo(q);
    if (angle === 0) {
      return this;
    }
    const t = Math.min(1, step / angle);
    this.slerp(q, t);
    return this;
  }

  /**
   * 四元数单位化
   * @return {Quaternion} 单位四元数
   */
  identity (): this {
    return this.set(0, 0, 0, 1);
  }

  /**
   * 四元数求逆
   * @return {Quaternion} 四元数的逆
   */
  invert (): this {
    // quaternion is assumed to have unit length
    return this.conjugate();
  }

  /**
   * 四元数求共轭值
   * @return {Quaternion} 四元数的共轭值
   */
  conjugate (): this {
    this.x *= - 1;
    this.y *= - 1;
    this.z *= - 1;
    this.onChangeCallback();
    return this;
  }

  /**
   * 四元数点乘结果
   * @param {Quaternion} v
   * @return {number}
   */
  dot (v: Quaternion): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  /**
   * 四元数的模平方
   * @return {number}
   */
  lengthSq (): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  /**
   * 四元数的欧式长度
   * @return {number} 长度
   */
  length (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  /**
   * 四元数归一化
   * @return {Quaternion} 归一化值
   */
  normalize (): this {
    let l = this.length();

    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
    } else {
      l = 1 / l;
      this.x = this.x * l;
      this.y = this.y * l;
      this.z = this.z * l;
      this.w = this.w * l;
    }

    this.onChangeCallback();

    return this;
  }

  /**
   * 右乘四元数other
   * @param {Quaternion} other
   * @return {Quaternion}
   */
  multiply (other: Quaternion): this {
    return this.multiplyQuaternions(this, other);
  }

  /**
   * 左乘四元数other
   * @param {Quaternion} other
   * @return {Quaternion}
   */
  premultiply (other: Quaternion): this {
    return this.multiplyQuaternions(other, this);
  }

  /**
   * 四元数乘法(a * b)
   * @param {Quaternion} a 四元数
   * @param {Quaternion} b 四元数
   * @return {Quaternion} 四元数
   */
  multiplyQuaternions (a: Quaternion, b: Quaternion): this {
    // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
    const qax = a.x;
    const qay = a.y;
    const qaz = a.z;
    const qaw = a.w;
    const qbx = b.x;
    const qby = b.y;
    const qbz = b.z;
    const qbw = b.w;

    this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

    this.onChangeCallback();

    return this;
  }

  /**
   * 与四元数other取线性插值
   * @see http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
   * @param {Quaternion} other 四元数
   * @param {number} t 插值比
   * @return {Quaternion} 插值结果
   */
  slerp (other: Quaternion, t: number): this {
    if (t === 0) { return this; }
    if (t === 1) { return this.copy(other); }

    const x = this.x, y = this.y, z = this.z, w = this.w;
    let cosHalfTheta = w * other.w + x * other.x + y * other.y + z * other.z;

    if (cosHalfTheta < 0) {
      this.w = - other.w;
      this.x = - other.x;
      this.y = - other.y;
      this.z = - other.z;
      cosHalfTheta = - cosHalfTheta;
    } else {
      this.copy(other);
    }

    if (cosHalfTheta >= 1.0) {
      this.w = w;
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }

    const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

    if (sqrSinHalfTheta <= Number.EPSILON) {
      const s = 1 - t;
      this.w = s * w + t * this.w;
      this.x = s * x + t * this.x;
      this.y = s * y + t * this.y;
      this.z = s * z + t * this.z;
      this.normalize();
      this.onChangeCallback();
      return this;
    }

    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    this.w = (w * ratioA + this.w * ratioB);
    this.x = (x * ratioA + this.x * ratioB);
    this.y = (y * ratioA + this.y * ratioB);
    this.z = (z * ratioA + this.z * ratioB);

    this.onChangeCallback();

    return this;
  }

  /**
   * 取两个四元数的线性插值
   * @param {Quaternion} qa 四元数
   * @param {Quaternion} qb 四元数
   * @param {number} t 插值比
   */
  slerpQuaternions (qa: Quaternion, qb: Quaternion, t: number) {
    this.copy(qa).slerp(qb, t);
  }

  /**
   * 四元数判等
   * @param {Quaternion} quaternion 四元数
   * @return {boolean} 判等结果
   */
  equals (quaternion: Quaternion): boolean {
    return quaternion.x === this.x
      && quaternion.y === this.y
      && quaternion.z === this.z
      && quaternion.w === this.w;
  }

  /**
   * 由数组获取四元数
   * @param {number[]} array 数组
   * @param {number} [offset=0] 起始偏移值
   * @return {Quaternion} 四元数
   */
  fromArray (array: number[], offset = 0): this {
    this.x = array[offset];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    this.w = array[offset + 3];

    this.onChangeCallback();

    return this;
  }

  /**
   * 四元数保存为数组
   * @param {number[]} [array=[]] 目标保存结果
   * @param {number} [offset=0] 保存起始偏移值
   * @return {number[]} 数组
   */
  toArray (array: number[] = [], offset = 0): number[] {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.w;
    return array;
  }

  /**
   * 四元数回调函数
   * @param {funciton} callback 回调函数
   * @return {Quaternion} 四元数
   */
  onChange (callback: () => void): this {
    this.onChangeCallback = callback;
    return this;
  }

  /**
   * 四元数回调函数
   */
  onChangeCallback (): ReturnType<() => void> { }
}
