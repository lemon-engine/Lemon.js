import { Vec3 } from './vec3';
import { Euler } from './euler';
import { EulerOrder } from './euler';
import { DEG2RAD } from './utils';
import type { Matrix3 } from './matrix3';
import { Quaternion } from './quaternion';

/**
 * @class 四维矩阵[三维空间变换矩阵 || 四维空间旋转缩放矩阵]
 */
export class Matrix4 {
  /**
   * @member {number[]} 四维矩阵值数组
   */
  elements: number[];

  /**
   * 构造函数，初始值为单位矩阵
   */
  constructor () {
    this.elements = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];

    if (arguments.length > 0) {
      console.error('THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.');
    }
  }

  /**
   * @static 克隆四维矩阵
   * @param {Matrix4} other 四维矩阵
   * @return {Matrix4} 克隆结果
   */
  static clone (other: Matrix4) {
    const result = new Matrix4();
    result.elements = [...other.elements];
    return result;
  }

  /**
   * @static 由透视相机基础参数设置投影矩阵
   * @param {number} near 近平面
   * @param {number} far 远平面
   * @param {number} fov 视角
   * @param {number} aspect 视窗比例
   * @param {number} clipMode 裁切模式, 0表示垂直裁切, 1表示水平裁切
   * @return {Matrix4} 投影矩阵
   */
  static makePerspective (near: number, far: number, fov: number, aspect: number, clipMode?: number): Matrix4 {
    const ratio = clipMode ? aspect : 1;
    const matrix = new Matrix4();
    const te = matrix.elements;

    const f = 1.0 / Math.tan((fov * DEG2RAD) / 2) * ratio;
    const a = f / aspect;
    const b = - (near + far) / (far - near);
    const c = -2 * near * far / (far - near);

    te[0] = a; te[4] = 0; te[8] = 0; te[12] = 0;
    te[1] = 0; te[5] = f; te[9] = 0; te[13] = 0;
    te[2] = 0; te[6] = 0; te[10] = b; te[14] = c;
    te[3] = 0; te[7] = 0; te[11] = -1; te[15] = 0;

    return matrix;
  }

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
  set (
    n00: number, n01: number, n02: number, n03: number,
    n10: number, n11: number, n12: number, n13: number,
    n20: number, n21: number, n22: number, n23: number,
    n30: number, n31: number, n32: number, n33: number,
  ): this {
    const te = this.elements;

    te[0] = n00; te[4] = n01; te[8] = n02; te[12] = n03;
    te[1] = n10; te[5] = n11; te[9] = n12; te[13] = n13;
    te[2] = n20; te[6] = n21; te[10] = n22; te[14] = n23;
    te[3] = n30; te[7] = n31; te[11] = n32; te[15] = n33;

    return this;
  }

  /**
   * 四维矩阵单位化
   * @return {Matrix4} 单位矩阵
   */
  identity (): this {
    this.set(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
    return this;
  }

  /**
   * 四维矩阵单位判断
   * @return {boolean} 判断结果
   */
  isIdentity (): boolean {
    const te = this.elements;

    return te[0] === 1 && te[4] === 0 && te[8] === 0 && te[12] === 0
      && te[1] === 0 && te[5] === 1 && te[9] === 0 && te[13] === 0
      && te[2] === 0 && te[6] === 0 && te[10] === 1 && te[14] === 0
      && te[3] === 0 && te[7] === 0 && te[11] === 0 && te[15] === 1;
  }

  /**
   * 四维矩阵克隆
   * @return {Matrix4} 克隆结果
   */
  clone (): Matrix4 {
    return new Matrix4().fromArray(this.elements);
  }

  /**
   * 四维矩阵复制
   * @param {Matrix4} m 复制对象
   * @return {Matrix4} 复制结果
   */
  copy (m: Matrix4): this {
    const te = this.elements;
    const me = m.elements;

    te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
    te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
    te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
    te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];

    return this;
  }

  /**
   * 四维矩阵位置信息复制
   * @param {Matrix4} m 四维矩阵
   * @return {Matrix4} 复制结果
   */
  copyPosition (m: Matrix4): this {
    const te = this.elements;
    const me = m.elements;

    te[12] = me[12];
    te[13] = me[13];
    te[14] = me[14];

    return this;
  }

  /**
   * 由三维矩阵构建四维矩阵
   * @param {Matrix3} m 三维矩阵
   * @return {Matrix4} 构建结果
   */
  setFromMatrix3 (m: Matrix3): this {
    const me = m.elements;

    this.set(
      me[0], me[3], me[6], 0,
      me[1], me[4], me[7], 0,
      me[2], me[5], me[8], 0,
      0, 0, 0, 1,
    );

    return this;
  }

  /**
   * 导出四维矩阵[三维空间变换矩阵]分量
   * @param {Vec3} xAxis x轴分量
   * @param {Vec3} yAxis y轴分量
   * @param {Vec3} zAxis z轴分量
   * @return {Matrix4} 四维矩阵
   */
  extractBasis (xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): this {
    xAxis.setFromMatrixColumn(this, 0);
    yAxis.setFromMatrixColumn(this, 1);
    zAxis.setFromMatrixColumn(this, 2);
    return this;
  }

  /**
   * 由分量构建四维矩阵[三维空间变换矩阵]
   * @param {Vec3} xAxis x轴分量
   * @param {Vec3} yAxis y轴分量
   * @param {Vec3} zAxis z轴分量
   * @return {Matrix4} 四维矩阵
   */
  makeBasis (xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): this {
    this.set(
      xAxis.x, yAxis.x, zAxis.x, 0,
      xAxis.y, yAxis.y, zAxis.y, 0,
      xAxis.z, yAxis.z, zAxis.z, 0,
      0, 0, 0, 1
    );
    return this;
  }

  /**
   * 导出四维矩阵[三维空间变换矩阵]旋转部分
   * @param {Matrix4} m 四维矩阵
   * @return {Matrix4} 导出结果
   */
  extractRotation (m: Matrix4): this {
    // this method does not support reflection matrices
    const _v = new Vec3();
    const me = m.elements;
    const te = this.elements;

    const scaleX = 1 / _v.setFromMatrixColumn(m, 0).length();
    const scaleY = 1 / _v.setFromMatrixColumn(m, 1).length();
    const scaleZ = 1 / _v.setFromMatrixColumn(m, 2).length();

    te[0] = me[0] * scaleX;
    te[1] = me[1] * scaleX;
    te[2] = me[2] * scaleX;
    te[3] = 0;

    te[4] = me[4] * scaleY;
    te[5] = me[5] * scaleY;
    te[6] = me[6] * scaleY;
    te[7] = 0;

    te[8] = me[8] * scaleZ;
    te[9] = me[9] * scaleZ;
    te[10] = me[10] * scaleZ;
    te[11] = 0;

    te[12] = 0;
    te[13] = 0;
    te[14] = 0;
    te[15] = 1;

    return this;
  }

  /**
   * 由欧拉角设置四维矩阵
   * @param {Euler} euler 欧拉角
   * @return {Matrix4} 四维矩阵
   */
  makeRotationFromEuler (euler: Euler): this {
    const te = this.elements;

    const x = euler.x;
    const y = euler.y;
    const z = euler.z;
    const a = Math.cos(x);
    const b = Math.sin(x);
    const c = Math.cos(y);
    const d = Math.sin(y);
    const e = Math.cos(z);
    const f = Math.sin(z);

    if (euler.order === EulerOrder.XYZ) {
      const ae = a * e;
      const af = a * f;
      const be = b * e;
      const bf = b * f;

      te[0] = c * e;
      te[4] = - c * f;
      te[8] = d;

      te[1] = af + be * d;
      te[5] = ae - bf * d;
      te[9] = - b * c;

      te[2] = bf - ae * d;
      te[6] = be + af * d;
      te[10] = a * c;
    } else if (euler.order === EulerOrder.YXZ) {
      const ce = c * e;
      const cf = c * f;
      const de = d * e;
      const df = d * f;

      te[0] = ce + df * b;
      te[4] = de * b - cf;
      te[8] = a * d;

      te[1] = a * f;
      te[5] = a * e;
      te[9] = - b;

      te[2] = cf * b - de;
      te[6] = df + ce * b;
      te[10] = a * c;
    } else if (euler.order === EulerOrder.ZXY) {
      const ce = c * e;
      const cf = c * f;
      const de = d * e;
      const df = d * f;

      te[0] = ce - df * b;
      te[4] = - a * f;
      te[8] = de + cf * b;

      te[1] = cf + de * b;
      te[5] = a * e;
      te[9] = df - ce * b;

      te[2] = - a * d;
      te[6] = b;
      te[10] = a * c;
    } else if (euler.order === EulerOrder.ZYX) {
      const ae = a * e;
      const af = a * f;
      const be = b * e;
      const bf = b * f;

      te[0] = c * e;
      te[4] = be * d - af;
      te[8] = ae * d + bf;

      te[1] = c * f;
      te[5] = bf * d + ae;
      te[9] = af * d - be;

      te[2] = - d;
      te[6] = b * c;
      te[10] = a * c;
    } else if (euler.order === EulerOrder.YZX) {
      const ac = a * c;
      const ad = a * d;
      const bc = b * c;
      const bd = b * d;

      te[0] = c * e;
      te[4] = bd - ac * f;
      te[8] = bc * f + ad;

      te[1] = f;
      te[5] = a * e;
      te[9] = - b * e;

      te[2] = - d * e;
      te[6] = ad * f + bc;
      te[10] = ac - bd * f;
    } else if (euler.order === EulerOrder.XZY) {
      const ac = a * c;
      const ad = a * d;
      const bc = b * c;
      const bd = b * d;

      te[0] = c * e;
      te[4] = - f;
      te[8] = d * e;

      te[1] = ac * f + bd;
      te[5] = a * e;
      te[9] = ad * f - bc;

      te[2] = bc * f - ad;
      te[6] = b * e;
      te[10] = bd * f + ac;
    }

    // bottom row
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;

    // last column
    te[12] = 0;
    te[13] = 0;
    te[14] = 0;
    te[15] = 1;

    return this;
  }

  /**
   * 由四元数这是四维矩阵
   * @param {Quaternion} q 四元数
   * @return {Matrix4} 四维矩阵
   */
  makeRotationFromQuaternion (q: Quaternion): Matrix4 {
    return this.compose(new Vec3(), q, new Vec3());
  }

  /**
   * 由相机位置与目标位置以及向上方向设置四维矩阵[相机视图矩阵]
   * @param {Vec3} eye 相机位置
   * @param {Vec3} target 目标位置
   * @param {Vec3} up 相机方向
   * @return {Matrix4} 四维矩阵[相机视图矩阵]
   */
  lookAt (eye: Vec3, target: Vec3, up: Vec3): this {
    const a = new Vec3();
    const b = new Vec3();
    const c = new Vec3();
    const te = this.elements;

    c.subVectors(eye, target);

    if (c.lengthSq() === 0) {
      // eye and target are in the same position
      c.z = 1;
    }

    c.normalize();
    a.crossVectors(up, c);

    if (a.lengthSq() === 0) {
      // up and z are parallel
      if (Math.abs(up.z) === 1) {
        c.x += 0.0001;
      } else {
        c.z += 0.0001;
      }

      c.normalize();
      a.crossVectors(up, c);
    }

    a.normalize();
    b.crossVectors(c, a);

    te[0] = a.x; te[4] = b.x; te[8] = c.x;
    te[1] = a.y; te[5] = b.y; te[9] = c.y;
    te[2] = a.z; te[6] = b.z; te[10] = c.z;

    return this;
  }

  /**
   * 四维矩阵右乘
   * @param {Matrix4} m 四维矩阵
   * @return {Matrix4} 右乘结果
   */
  multiply (m: Matrix4): this {
    return this.multiplyMatrices(this, m);
  }

  /**
   * 四维矩阵左乘
   * @param {Matrix4} m 四维矩阵
   * @return {Matrix4} 左乘结果
   */
  premultiply (m: Matrix4): this {
    return this.multiplyMatrices(m, this);
  }

  /**
   * 四维矩阵相乘(a * b)
   * @param {Matrix4} a 四维矩阵
   * @param {Matrix4} b 四维矩阵
   * @return {Matrix4} 相乘结果
   */
  multiplyMatrices (a: Matrix4, b: Matrix4): this {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[0]; const a12 = ae[4]; const a13 = ae[8]; const a14 = ae[12];
    const a21 = ae[1]; const a22 = ae[5]; const a23 = ae[9]; const a24 = ae[13];
    const a31 = ae[2]; const a32 = ae[6]; const a33 = ae[10]; const a34 = ae[14];
    const a41 = ae[3]; const a42 = ae[7]; const a43 = ae[11]; const a44 = ae[15];

    const b11 = be[0]; const b12 = be[4]; const b13 = be[8]; const b14 = be[12];
    const b21 = be[1]; const b22 = be[5]; const b23 = be[9]; const b24 = be[13];
    const b31 = be[2]; const b32 = be[6]; const b33 = be[10]; const b34 = be[14];
    const b41 = be[3]; const b42 = be[7]; const b43 = be[11]; const b44 = be[15];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;
  }

  /**
   * 四维矩阵缩放
   * @param {number} s 缩放比例
   * @return {Matrix4} 缩放结果
   */
  multiplyScalar (s: number): this {
    const te = this.elements;

    te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
    te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
    te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
    te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;

    return this;
  }

  /**
   * 四维矩阵求行列式值
   * @return {number} 行列式值
   */
  determinant (): number {
    const te = this.elements;

    const n11 = te[0]; const n12 = te[4]; const n13 = te[8]; const n14 = te[12];
    const n21 = te[1]; const n22 = te[5]; const n23 = te[9]; const n24 = te[13];
    const n31 = te[2]; const n32 = te[6]; const n33 = te[10]; const n34 = te[14];
    const n41 = te[3]; const n42 = te[7]; const n43 = te[11]; const n44 = te[15];

    return (
      n41 * (
        + n14 * n23 * n32
        - n13 * n24 * n32
        - n14 * n22 * n33
        + n12 * n24 * n33
        + n13 * n22 * n34
        - n12 * n23 * n34
      ) +
      n42 * (
        + n11 * n23 * n34
        - n11 * n24 * n33
        + n14 * n21 * n33
        - n13 * n21 * n34
        + n13 * n24 * n31
        - n14 * n23 * n31
      ) +
      n43 * (
        + n11 * n24 * n32
        - n11 * n22 * n34
        - n14 * n21 * n32
        + n12 * n21 * n34
        + n14 * n22 * n31
        - n12 * n24 * n31
      ) +
      n44 * (
        - n13 * n22 * n31
        - n11 * n23 * n32
        + n11 * n22 * n33
        + n13 * n21 * n32
        - n12 * n21 * n33
        + n12 * n23 * n31
      )
    );
  }

  /**
   * 四维矩阵转置
   * @return {Matrix4} 转置结果
   */
  transpose (): this {
    const te = this.elements;
    let tmp;

    tmp = te[1]; te[1] = te[4]; te[4] = tmp;
    tmp = te[2]; te[2] = te[8]; te[8] = tmp;
    tmp = te[6]; te[6] = te[9]; te[9] = tmp;

    tmp = te[3]; te[3] = te[12]; te[12] = tmp;
    tmp = te[7]; te[7] = te[13]; te[13] = tmp;
    tmp = te[11]; te[11] = te[14]; te[14] = tmp;

    return this;
  }

  /**
   * 设置四维矩阵[三维空间变换矩阵]位置信息
   * @param {number|Vec3} x 位置信息
   * @param {number} [y=x] y轴位置信息
   * @param {number} [z=x] z轴位置信息
   * @return {Matrix4}
   */
  setPosition (x: number | Vec3, y?: number, z?: number): this {
    const te = this.elements;

    if (x instanceof Vec3) {
      te[12] = x.x;
      te[13] = x.y;
      te[14] = x.z;
    } else {
      te[12] = x;
      te[13] = y ? y : x;
      te[14] = z ? z : x;
    }

    return this;
  }

  /**
   * 四维矩阵求逆
   * @return {Matrix4} 逆矩阵
   */
  invert (): this {
    // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    const te = this.elements;
    const n11 = te[0]; const n21 = te[1]; const n31 = te[2]; const n41 = te[3];
    const n12 = te[4]; const n22 = te[5]; const n32 = te[6]; const n42 = te[7];
    const n13 = te[8]; const n23 = te[9]; const n33 = te[10]; const n43 = te[11];
    const n14 = te[12]; const n24 = te[13]; const n34 = te[14]; const n44 = te[15];
    const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

    if (det === 0) {
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    const detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

    te[4] = t12 * detInv;
    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

    te[8] = t13 * detInv;
    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

    te[12] = t14 * detInv;
    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

    return this;
  }

  /**
   * 四维矩阵[三维空间变换矩阵]分轴缩放
   * @param {Vec3} v 分轴缩放向量
   * @return {Matrix4} 缩放结果
   */
  scale (v: Vec3): this {
    const te = this.elements;

    te[0] *= v.x; te[4] *= v.y; te[8] *= v.z;
    te[1] *= v.x; te[5] *= v.y; te[9] *= v.z;
    te[2] *= v.x; te[6] *= v.y; te[10] *= v.z;
    te[3] *= v.x; te[7] *= v.y; te[11] *= v.z;

    return this;
  }

  /**
   * 获取四维矩阵[三维空间变换矩阵]分轴缩放最大值
   * @return {number} 计算结果
   */
  getMaxScaleOnAxis (): number {
    const te = this.elements;

    const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
    const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
    const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
  }

  /**
   * 根据三维空间位移信息设置四维矩阵
   * @param {number} x x轴坐标信息
   * @param {number} y y轴坐标信息
   * @param {number} z z轴坐标信息
   * @return {Matrix4} 四维矩阵
   */
  makeTranslation (x: number, y: number, z: number): this {
    this.set(
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1,
    );

    return this;
  }

  /**
   * 根据x轴旋转信息设置四维矩阵
   * @param {number} theta x轴旋转弧度
   * @return {Matrix4} 四维矩阵
   */
  makeRotationX (theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.set(
      1, 0, 0, 0,
      0, c, - s, 0,
      0, s, c, 0,
      0, 0, 0, 1
    );

    return this;
  }

  /**
   * 根据y轴旋转信息设置四维矩阵
   * @param {number} theta y轴旋转弧度
   * @return {Matrix4} 四维矩阵
   */
  makeRotationY (theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.set(
      c, 0, s, 0,
      0, 1, 0, 0,
      - s, 0, c, 0,
      0, 0, 0, 1
    );

    return this;
  }

  /**
   * 根据z轴旋转信息设置四维矩阵
   * @param {number} theta z轴旋转弧度
   * @return {Matrix4} 四维矩阵
   */
  makeRotationZ (theta: number): this {
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    this.set(
      c, - s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );

    return this;
  }

  /**
   * 根据三维旋转轴与弧度设置四维矩阵
   * @param {Vec3} axis 三维旋转轴
   * @param {number} angle 旋转弧度
   * @return {Matrix4} 四维矩阵
   */
  makeRotationAxis (axis: Vec3, angle: number): this {
    // Based on http://www.gamedev.net/reference/articles/article1199.asp
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const x = axis.x; const y = axis.y; const z = axis.z;
    const tx = t * x; const ty = t * y;

    this.set(
      tx * x + c, tx * y - s * z, tx * z + s * y, 0,
      tx * y + s * z, ty * y + c, ty * z - s * x, 0,
      tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
      0, 0, 0, 1,
    );

    return this;
  }

  /**
   * 根据缩放比例设置四维矩阵
   * @param {number} x 缩放比例
   * @param {number} [y=x] y方向缩放比例
   * @param {number} [z=x] z方向缩放比例
   * @return {Matrix4}
   */
  makeScale (x: number, y?: number, z?: number): this {
    if (y === undefined || z === undefined) {
      this.set(
        x, 0, 0, 0,
        0, x, 0, 0,
        0, 0, x, 0,
        0, 0, 0, 1
      );
    } else {
      this.set(
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1
      );
    }

    return this;
  }

  /**
   * 设置倾斜矩阵
   * @param {number} x x方向倾斜分量
   * @param {number} y y方向倾斜分量
   * @param {number} z z方向倾斜分量
   * @return {Matrix4} 倾斜矩阵
   */
  makeShear (x: number, y: number, z: number): this {
    this.set(
      1, y, z, 0,
      x, 1, z, 0,
      x, y, 1, 0,
      0, 0, 0, 1
    );

    return this;
  }

  /**
   * 根据基础信息组装四维矩阵
   * @param {Vec3} position 位置信息
   * @param {Euler|Quaternion} rotation 旋转信息
   * @param {Vec3} scale 缩放信息
   * @return {Matrix4} 四维矩阵
   */
  compose (position: Vec3, rotation: Euler | Quaternion, scale: Vec3): Matrix4 {
    const te = this.elements;
    if (rotation instanceof Euler || rotation instanceof Quaternion) {
      const quaternion: Quaternion = rotation instanceof Euler ? new Quaternion().setFromEuler(rotation) : rotation;

      const x = quaternion.x; const y = quaternion.y; const z = quaternion.z; const w = quaternion.w;
      const x2 = x + x; const y2 = y + y; const z2 = z + z;
      const xx = x * x2; const xy = x * y2; const xz = x * z2;
      const yy = y * y2; const yz = y * z2; const zz = z * z2;
      const wx = w * x2; const wy = w * y2; const wz = w * z2;

      const sx = scale.x; const sy = scale.y; const sz = scale.z;

      te[0] = (1 - (yy + zz)) * sx;
      te[1] = (xy + wz) * sx;
      te[2] = (xz - wy) * sx;
      te[3] = 0;

      te[4] = (xy - wz) * sy;
      te[5] = (1 - (xx + zz)) * sy;
      te[6] = (yz + wx) * sy;
      te[7] = 0;

      te[8] = (xz + wy) * sz;
      te[9] = (yz - wx) * sz;
      te[10] = (1 - (xx + yy)) * sz;
      te[11] = 0;

      te[12] = position.x;
      te[13] = position.y;
      te[14] = position.z;
      te[15] = 1;

      return this;
    } else {
      console.warn('Type of rotation can not be other type beside Euler or Quaternion.');
      return new Matrix4();
    }
  }

  /**
   * 四维矩阵拆分为基础信息
   * @param {Vec3} position 位置信息
   * @param {Quaternion} quaternion 旋转信息
   * @param {Vec3} scale 缩放信息
   * @returns 四维矩阵
   */
  decompose (position: Vec3, quaternion: Quaternion, scale: Vec3): this {
    const v = new Vec3();
    const m = new Matrix4();
    const te = this.elements;

    let sx = v.set(te[0], te[1], te[2]).length();
    const sy = v.set(te[4], te[5], te[6]).length();
    const sz = v.set(te[8], te[9], te[10]).length();

    // if determine is negative, we need to invert one scale
    const det = this.determinant();
    if (det < 0) { sx = - sx; }

    position.x = te[12];
    position.y = te[13];
    position.z = te[14];

    // scale the rotation part
    m.copy(this);

    const invSX = 1 / sx;
    const invSY = 1 / sy;
    const invSZ = 1 / sz;

    m.elements[0] *= invSX;
    m.elements[1] *= invSX;
    m.elements[2] *= invSX;

    m.elements[4] *= invSY;
    m.elements[5] *= invSY;
    m.elements[6] *= invSY;

    m.elements[8] *= invSZ;
    m.elements[9] *= invSZ;
    m.elements[10] *= invSZ;

    quaternion.setFromRotationMatrix(m);

    scale.x = sx;
    scale.y = sy;
    scale.z = sz;

    return this;
  }

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
  makePerspective (left: number, right: number, top: number, bottom: number, near: number, far: number): this {
    const te = this.elements;
    const x = 2 * near / (right - left);
    const y = 2 * near / (top - bottom);

    const a = (right + left) / (right - left);
    const b = (top + bottom) / (top - bottom);
    const c = -(far + near) / (far - near);
    const d = -2 * far * near / (far - near);

    te[0] = x; te[4] = 0; te[8] = a; te[12] = 0;
    te[1] = 0; te[5] = y; te[9] = b; te[13] = 0;
    te[2] = 0; te[6] = 0; te[10] = c; te[14] = d;
    te[3] = 0; te[7] = 0; te[11] = - 1; te[15] = 0;

    return this;
  }

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
  makeOrthographic (left: number, right: number, top: number, bottom: number, near: number, far: number): this {
    const te = this.elements;
    const w = 1.0 / (right - left);
    const h = 1.0 / (top - bottom);
    const p = 1.0 / (far - near);

    const x = (right + left) * w;
    const y = (top + bottom) * h;
    const z = (far + near) * p;

    te[0] = 2 * w; te[4] = 0; te[8] = 0; te[12] = - x;
    te[1] = 0; te[5] = 2 * h; te[9] = 0; te[13] = - y;
    te[2] = 0; te[6] = 0; te[10] = - 2 * p; te[14] = - z;
    te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1;

    return this;
  }

  /**
   * 四维矩阵判等
   * @param {Matrix4} matrix 四维矩阵
   * @return {boolean} 判等结果
   */
  equals (matrix: Matrix4): boolean {
    const te = this.elements;
    const me = matrix.elements;

    for (let i = 0; i < 16; i++) {
      if (te[i] !== me[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * 由数组设置四维矩阵
   * @param {number[]} array 数组
   * @param {number} [offset=0] 起始偏移值
   * @return {Matrix4} 四维矩阵
   */
  fromArray (array: number[], offset = 0): this {
    for (let i = 0; i < 16; i++) {
      this.elements[i] = array[i + offset];
    }
    return this;
  }

  /**
   * 四维矩阵转数组
   * @param {number[]} [array=[]] 结果保存对象
   * @param {number} [offset=0] 保存起始偏移值
   * @return {number[]} 四维矩阵
   */
  toArray (array: number[] = [], offset = 0): number[] {
    const te = this.elements;

    array[offset] = te[0];
    array[offset + 1] = te[1];
    array[offset + 2] = te[2];
    array[offset + 3] = te[3];

    array[offset + 4] = te[4];
    array[offset + 5] = te[5];
    array[offset + 6] = te[6];
    array[offset + 7] = te[7];

    array[offset + 8] = te[8];
    array[offset + 9] = te[9];
    array[offset + 10] = te[10];
    array[offset + 11] = te[11];

    array[offset + 12] = te[12];
    array[offset + 13] = te[13];
    array[offset + 14] = te[14];
    array[offset + 15] = te[15];

    return array;
  }
}
