import { Quaternion } from './quaternion';
import { Vec3 } from './vec3';
import { Matrix4 } from './matrix4';
import { clamp } from './utils';

// 欧拉角顺序
export enum EulerOrder {
  'XYZ' = 0,
  'XZY' = 1,
  'YXZ' = 2,
  'YZX' = 3,
  'ZXY' = 4,
  'ZYX' = 5,
}

/**
 * @class 欧拉角
 */
export class Euler {
  /**
   * 构造函数,传入值为x, y, z方向分量以及欧拉角计算顺序
   * @param {number} x x方向分量
   * @param {number} y y方向分量
   * @param {number} z z方向分量
   * @param {EulerOrder} order 欧拉角顺序，默认为XYZ顺序
   */
  constructor (
    public x = 0,
    public y = 0,
    public z = 0,
    public order: EulerOrder = EulerOrder.XYZ
  ) {
  }

  /**
   * 设置欧拉角
   * @param {number} x x方向分量
   * @param {number} y y方向分量
   * @param {number} z z方向分量
   * @param {EulerOrder} [order='XYZ'] 欧拉角顺序，默认为XYZ顺序
   * @return {Euler}
   */
  set (x: number, y: number, z: number, order = EulerOrder.XYZ): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
    this.onChangeCallback();
    return this;
  }

  /**
   * 克隆欧拉角
   * @return {Euler} 克隆结果
   */
  clone (): Euler {
    return new Euler(this.x, this.y, this.z, this.order);
  }

  /**
   * 复制欧拉角
   * @param {Euler} euler 复制对象
   * @return {Euler} 复制结果
   */
  copy (euler: Euler): this {
    this.x = euler.x;
    this.y = euler.y;
    this.z = euler.z;
    this.order = euler.order;
    this.onChangeCallback();
    return this;
  }

  /**
   * 有三维空间矩阵设置欧拉角
   * @param {Matrix4} m 三维空间矩阵
   * @param {EulerOrder} [order='XYZ'] 欧拉角顺序
   * @param {boolean} [update=true] 允许设置回调函数
   * @return {Euler} 构建结果
   */
  setFromRotationMatrix (m: Matrix4, order: EulerOrder = EulerOrder.XYZ, update = true): this {
    const te = m.elements;
    const m11 = te[0]; const m12 = te[4]; const m13 = te[8];
    const m21 = te[1]; const m22 = te[5]; const m23 = te[9];
    const m31 = te[2]; const m32 = te[6]; const m33 = te[10];

    order = order || this.order;

    switch (order) {
      case EulerOrder.XYZ:
        this.y = Math.asin(clamp(m13, -1, 1));
        if (Math.abs(m13) < 0.9999999) {
          this.x = Math.atan2(-m23, m33);
          this.z = Math.atan2(-m12, m11);
        } else {
          this.x = Math.atan2(m32, m22);
          this.z = 0;
        }
        break;
      case EulerOrder.YXZ:
        this.x = Math.asin(-clamp(m23, -1, 1));
        if (Math.abs(m23) < 0.9999999) {
          this.y = Math.atan2(m13, m33);
          this.z = Math.atan2(m21, m22);
        } else {
          this.y = Math.atan2(-m31, m11);
          this.z = 0;
        }
        break;
      case EulerOrder.ZXY:
        this.x = Math.asin(clamp(m32, -1, 1));
        if (Math.abs(m32) < 0.9999999) {
          this.y = Math.atan2(-m31, m33);
          this.z = Math.atan2(-m12, m22);
        } else {
          this.y = 0;
          this.z = Math.atan2(m21, m11);
        }
        break;
      case EulerOrder.ZYX:
        this.y = Math.asin(-clamp(m31, -1, 1));
        if (Math.abs(m31) < 0.9999999) {
          this.x = Math.atan2(m32, m33);
          this.z = Math.atan2(m21, m11);
        } else {
          this.x = 0;
          this.z = Math.atan2(-m12, m22);
        }
        break;
      case EulerOrder.YZX:
        this.z = Math.asin(clamp(m21, -1, 1));
        if (Math.abs(m21) < 0.9999999) {
          this.x = Math.atan2(-m23, m22);
          this.y = Math.atan2(-m31, m11);
        } else {
          this.x = 0;
          this.y = Math.atan2(m13, m33);
        }
        break;
      case EulerOrder.XZY:
        this.z = Math.asin(-clamp(m12, -1, 1));
        if (Math.abs(m12) < 0.9999999) {
          this.x = Math.atan2(m32, m22);
          this.y = Math.atan2(m13, m11);
        } else {
          this.x = Math.atan2(-m23, m33);
          this.y = 0;
        }
        break;
      default:
        console.warn('THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ' + order);
    }

    this.order = order;

    if (update !== false) {
      this.onChangeCallback();
    }

    return this;
  }

  /**
   * 由四元数构建欧拉角
   * @param {Quaternion} q 四元数
   * @param {EulerOrder} [order='XYZ'] 欧拉角顺序，默认为XYZ
   * @param {boolean} [update=true] 允许设置回调函数
   * @return {Euler} 构建结果
   */
  setFromQuaternion (q: Quaternion, order: EulerOrder = EulerOrder.XYZ, update = true): this {
    const matrix = new Matrix4();
    matrix.makeRotationFromQuaternion(q);
    return this.setFromRotationMatrix(matrix, order, update);
  }

  /**
   * 有三维向量构建欧拉角
   * @param {Vec3} v 三维向量
   * @param {EulerOrder} [order] 欧拉角顺序，默认为XYZ
   * @return {Euler} 欧拉角
   */
  setFromVector3 (v: Vec3, order?: EulerOrder): this {
    return this.set(v.x, v.y, v.z, order || this.order);
  }

  /**
   * 修改欧拉角顺序
   * @param {EulerOrder} newOrder 欧拉角顺序
   * @return {Euler} 修改结果
   */
  reorder (newOrder: EulerOrder): this {
    const quaternion = new Quaternion();
    quaternion.setFromEuler(this);
    return this.setFromQuaternion(quaternion, newOrder);
  }

  /**
   * 欧拉角判等
   * @param {Euler} euler 欧拉角
   * @return {boolean} 判等结果
   */
  equals (euler: Euler): boolean {
    return euler.x === this.x
      && euler.y === this.y
      && euler.z === this.z
      && euler.order === this.order;
  }

  /**
   * 由数组构建欧拉角
   * @param {number[]} array 数组
   * @return {Euler} 构建结果
   */
  fromArray (array: number[]): this {
    this.x = array[0];
    this.y = array[1];
    this.z = array[2];
    if (array[3] !== undefined) {
      this.order = array[3];
    }
    this.onChangeCallback();
    return this;
  }

  /**
   * 欧拉角保存于数组(应用于计算)
   * @param {number[]} [array=[]] 目标保存对象
   * @param {number} [offset=0] 起始偏移值
   * @return {number[]} 保存结果
   */
  toArray (array: number[] = [], offset = 0): number[] {
    array[offset] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.order;
    return array;
  }

  /**
   * 欧拉角保存于三维向量(应用于计算)
   * @param {Vec3} [optionalResult] 目标保存对象
   * @return {Vec3} 保存结果
   */
  toVector3 (optionalResult?: Vec3): Vec3 {
    if (optionalResult) {
      return optionalResult.set(this.x, this.y, this.z);
    } else {
      return new Vec3(this.x, this.y, this.z);
    }
  }

  /**
   * 欧拉角变更回调函数
   * @param {function} callback 回调函数
   * @return {Euler} 欧拉角
   */
  onChange (callback: () => void): this {
    this.onChangeCallback = callback;
    return this;
  }

  onChangeCallback (): ReturnType<() => void> { }
}
