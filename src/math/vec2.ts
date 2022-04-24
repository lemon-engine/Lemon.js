import { clamp } from './utils';
import type { Line2 } from './geometry/line2';
import type { Matrix3 } from './matrix3';

/**
 * @class 二维向量 | 二维点
 */
export class Vec2 {
  /**
   * 构造函数，默认为二维零向量 | 二维原点
   * @param {number} [x=0] x分量,默认为0
   * @param {number} [y=0] y分量,默认为0
   */
  constructor (
    public x = 0,
    public y = 0,
  ) {
  }

  /**
   * @static 复制二维向量
   * @param {Vec2} other 二维向量
   * @return {Vec2} 复制结果
   */
  static copy (other: Vec2): Vec2 {
    return new Vec2(other.x, other.y);
  }

  /**
   * @static 二维向量判等
   * @param {Vec2} a 二维向量
   * @param {Vec2} b 二维向量
   * @return {boolean} 判等结果
   */
  static equal (a: Vec2, b: Vec2): boolean {
    return a.x === b.x && a.y === b.y;
  }

  /**
   * @static 二维点x方向差值
   * @param {Vec2} a 二维点
   * @param {Vec2} b 二维点
   * @return {number} 差值
   */
  static distanceX (a: Vec2, b: Vec2): number {
    return Math.abs(a.x - b.x);
  }

  /**
   * @static 二维点y方向差值
   * @param {Vec2} a 二维点
   * @param {Vec2} b 二维点
   * @return {number} 差值
   */
  static distanceY (a: Vec2, b: Vec2): number {
    return Math.abs(a.y - b.y);
  }

  /**
   * @static 二维点求距离
   * @param {Vec2} a 二维点
   * @param {Vec2} b 二维点
   * @return {number} 距离
   */
  static distance (a: Vec2, b: Vec2): number {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  }

  /**
   * @static 二维向量求分轴最大值
   * @param {Vec2} a 二维向量
   * @param {Vec2} b 二维向量
   * @return {Vec2} 求值结果
   */
  static max (a: Vec2, b: Vec2): Vec2 {
    return new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
  }

  /**
   * @static 二维向量求分轴最小值
   * @param {Vec2} a 二维向量
   * @param {Vec2} b 二维向量
   * @return {Vec2} 求值结果
   */
  static min (a: Vec2, b: Vec2): Vec2 {
    return new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
  }

  /**
   * 二维向量求混合值
   * @param {Vec2} a 二维向量
   * @param {Vec2} b 二维向量
   * @param {number} [ratio=0.5] 混合比例，默认为0.5
   * @return {Vec2} 求值结果
   */
  static mix (a: Vec2, b: Vec2, ratio?: number): Vec2 {
    ratio = ratio ? ratio : 0.5;
    return new Vec2(ratio * a.x + (1 - ratio) * b.x, ratio * a.y + (1 - ratio) * b.y);
  }

  static addVectors(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(
      a.x + b.x,
      a.y + b.y,
    )
  }

  /**
   * @member {number} 宽度
   */
  get width () {
    return this.x;
  }
  set width (value: number) {
    this.x = value;
  }

  /**
   * @member {number} 高度
   */
  get height () {
    return this.y;
  }
  set height (value: number) {
    this.y = value;
  }

  /**
   * 设置二维向量
   * @param {number} x x轴分量
   * @param {number} [y=x] y轴分量，默认为x分量值
   * @return {Vec2}
   */
  set (x: number, y?: number): this {
    this.x = x;
    this.y = y === undefined ? x : y;
    return this;
  }

  /**
   * 设置x轴分量
   * @param {number} x x轴分量
   * @return {Vec2} 二维向量
   */
  setX (x: number): this {
    this.x = x;
    return this;
  }

  /**
   * 设置Y轴分量
   * @param {number} y y轴分量
   * @return {Vec2} 二维向量
   */
  setY (y: number): this {
    this.y = y;
    return this;
  }

  /**
   * 复制二维向量
   * @param {Vec2} v 二维向量
   * @return {Vec2} 复制结果
   */
  copy (v: Vec2): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  /**
   * 克隆二维向量
   * @return {Vec2} 克隆结果
   */
  clone (): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * 二维向量求和
   * @param {Vec2|number} v 二维向量 | 数字
   * @return {Vec2} 二维向量
   */
  add (v: Vec2 | number): this {
    if (typeof v === 'number') {
      this.x += v;
      this.y += v;
    } else {
      this.x += v.x;
      this.y += v.y;
    }
    return this;
  }

  /**
   * 二维向量求和(a + b)
   * @param {Vec2} a 二维向量
   * @param {Vec2} b 二维向量
   * @return {Vec2} 求和结果
   */
  addVectors (a: Vec2, b: Vec2): this {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  }

  /**
   * 二维向量比例求和
   * @param {Vec2} v 二维向量
   * @param {number} s 比例值
   * @return {Vec2} 求和结果
   */
  addScaledVector (v: Vec2, s: number): this {
    this.x += v.x * s;
    this.y += v.y * s;
    return this;
  }

  /**
   * 二维向量求差
   * @param {Vec2|number} v 二维向量 |  数字
   * @return {Vec2} 求差结果
   */
  sub (v: Vec2 | number): this {
    if (typeof v === 'number') {
      this.x -= v;
      this.y -= v;
    } else {
      this.x -= v.x;
      this.y -= v.y;
    }
    return this;
  }

  /**
   * 二维向量求差
   * @param {Vec2} a 二维向量
   * @param {Vec2} b 二维向量
   * @return {Vec2} 求差结果
   */
  subVectors (a: Vec2, b: Vec2): this {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }

  /**
   * 二维向量求乘
   * @param {Vec2|number} v 二维向量 | 数字
   * @return {Vec2} 求乘结果
   */
  multiply (v: Vec2 | number): this {
    if (typeof v === 'number') {
      this.x *= v;
      this.y *= v;
    } else {
      this.x *= v.x;
      this.y *= v.y;
    }
    return this;
  }

  /**
   * 二维向量求除
   * @param {Vec2|number} v 二维向量 | 数字
   * @return {Vec2} 求除结果
   */
  divide (v: Vec2 | number): this {
    if (typeof v === 'number') {
      this.x /= v;
      this.y /= v;
    } else {
      this.x /= v.x;
      this.y /= v.y;
    }
    return this;
  }

  /**
   * 二维向量取反
   * @return {Vec2} 取反结果
   */
  inverse (): Vec2 {
    return this.clone().multiply(-1);
  }

  /**
   * 二维向量矩阵变换
   * @param {Matrix3} m 变换矩阵
   * @return {Vec2} 变换结果
   */
  applyMatrix3 (m: Matrix3): this {
    const x = this.x;
    const y = this.y;
    const e = m.elements;

    this.x = e[0] * x + e[3] * y + e[6];
    this.y = e[1] * x + e[4] * y + e[7];
    return this;
  }

  /**
   * 二维向量求最小值
   * @param {Vec2} v 二维向量
   * @return {Vec2} 最小值
   */
  min (v: Vec2): this {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    return this;
  }

  /**
   * 二维向量求最大值
   * @param {Vec2} v 二维向量
   * @return {Vec2} 最大值
   */
  max (v: Vec2): this {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    return this;
  }

  /**
   * 二维向量阈值约束
   * @param {Vec2} min 极小值
   * @param {Vec2} max 极大值
   * @return {Vec2} 二维向量
   */
  clamp (min: Vec2, max: Vec2): this {
    // assumes min < max, componentwise
    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));
    return this;
  }

  /**
   * 二维向量向下取整
   * @return {Vec2} 取整结果
   */
  floor (): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  /**
   * 二维向量向上取整
   * @return {Vec2} 取整结果
   */
  ceil (): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  /**
   * 二维向量取四舍五入
   * @return {Vec2} 四舍五入结果
   */
  round (): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  /**
   * 二维向量取反
   * @return {Vec2} 取反结果
   */
  negate (): this {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * 二维向量点乘
   * @abstract 可以用来辅助运算向量之间的夹角
   * @param {Vec2} v 二维向量
   * @return {number} 点乘结果
   */
  dot (v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 二维向量叉乘
   * @abstract 表示与this && v 向量所在平面垂直的向量
   * @param {Vec2} v 二维向量
   * @return {number} 叉乘结果
   */
  cross (v: Vec2): number {
    return this.x * v.y - this.y * v.x;
  }

  /**
   * 二维向量长度平方
   * @abstract Math.sqrt的效率低于乘法，可以在运算中使用乘法结果与lengthSq的对比替代length与距离的对比
   * @return {number} 求值结果
   */
  lengthSq (): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * 二维向量长度
   * @return {number} 求值结果
   */
  length (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 二维向量曼哈顿长度
   * @return {number} 求值结果
   */
  manhattanLength (): number {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  /**
   * 二维向量归一化
   * @abstract 归一化向量可以用用作单位方向
   * @return {Vec2} 归一化结果
   */
  normalize (): this {
    if (this.length() !== 0) {
      return this.divide(this.length());
    } else {
      console.warn('divide value can not be zero');
      return this;
    }
  }

  /**
   * 二维向量与x轴夹角
   * @return {number} 弧度值
   */
  angle (): number {
    // computes the angle in radians with respect to the positive x-axis
    const angle = Math.atan2(- this.y, - this.x) + Math.PI;
    return angle;
  }

  /**
   * 二维向量夹角
   * @param {Vec2} other 二维向量
   * @return {number} 夹角
   */
  angleToVec2 (other: Vec2): number {
    const cosValue = Math.min(
      Math.max(
        this.dot(other) / this.length() / other.length(),
        -1,
      ),
      1,
    );
    let angle = Math.acos(cosValue);
    angle = this.x * other.y - this.y * other.x > 0 ? angle : -angle;
    return angle;
  }

  /**
   * 二维向量this向二维向量other投影
   * @param {Vec2} other 二维向量
   * @return {Vec2} 投影值
   */
  projectionToVec2 (other: Vec2): Vec2 {
    const angle = this.angleToVec2(other);
    return Vec2.copy(other).normalize().multiply(this.length() * Math.cos(angle));
  }

  /**
   * 二维向量视图转换
   * @param {number} width 视图宽度
   * @param {number} height 视图高度
   * @return {Vec2} 转换结果
   */
  toView (width: number, height: number): this {
    this.x = ((this.x + 1) / 2) * width;
    this.y = (1 - (this.y + 1) / 2) * height;
    return this;
  }

  /**
   * 二维点距离平方
   * @param {Vec2} v 二维点
   * @return {number} 距离平方
   */
  distanceToSquared (v: Vec2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  /**
   * 二维点距离
   * @param {Vec2} v 二维点
   * @return {number} 距离
   */
  distanceTo (v: Vec2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 二维点曼哈顿距离
   * @param {Vec2} v 二维点
   * @return {number} 曼哈顿距离
   */
  manhattanDistanceTo (v: Vec2): number {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  }

  /**
   * 根据长度修改二维向量
   * @param {number} length 长度值
   * @return {Vec2} 计算结果
   */
  setLength (length: number): this {
    return this.normalize().multiply(length);
  }

  /**
   * 二维点(this与other)求线性插值
   * @param {Vec2} other 二维点
   * @param {number} alpha 插值比
   * @return {Vec2} 计算结果
   */
  lerp (other: Vec2, alpha: number): this {
    this.x += (other.x - this.x) * alpha;
    this.y += (other.y - this.y) * alpha;
    return this;
  }

  /**
   * 二维点(v1与v2)求线性插值
   * @param {Vec2} v1 二维点
   * @param {Vec2} v2 二维点
   * @param {number} alpha 插值比
   * @return {Vec2} 计算结果
   */
  lerpVectors (v1: Vec2, v2: Vec2, alpha: number): this {
    this.x = v1.x + (v2.x - v1.x) * alpha;
    this.y = v1.y + (v2.y - v1.y) * alpha;
    return this;
  }

  /**
   * 二维向量判等
   * @param {Vec2} v 二维向量
   * @return {boolean} 判等结果
   */
  equals (v: Vec2): boolean {
    return v.x === this.x && v.y === this.y;
  }

  /**
   * 由数组组装二维向量
   * @param {[x: number, y: number]} array 数组
   * @return {Vec2} 二维向量
   */
   fromArray (array: [x: number, y: number, ...rest: number[]]): this {
    [this.x, this.y] = array;
    return this;
  }

  /**
   * 二维向量转数组
   * @return {[x: number, y: number]} 数组
   */
  toArray (): [x: number, y: number] {
    return [this.x, this.y];
  }

  /**
   * 二维点绕点旋转
   * @param {Vec2} center 旋转中心
   * @param {number} angle 旋转角度
   * @return {Vec2} 旋转结果
   */
  rotateAround (center: Vec2, angle: number): this {
    const c = Math.cos(angle), s = Math.sin(angle);
    const x = this.x - center.x;
    const y = this.y - center.y;
    this.x = x * c - y * s + center.x;
    this.y = x * s + y * c + center.y;
    return this;
  }

  /**
   * 随机生成二维向量
   * @return {Vec2} 二维向量
   */
  random (): this {
    this.x = Math.random();
    this.y = Math.random();
    return this;
  }

  /**
   * 二维点旋转
   * @param {number} angle 旋转角度
   * @param {Vec2} [center=new Vec2()] 旋转中心，默认值为原点
   * @return {Vec2} 旋转结果
   */
  rotate (angle: number, center: Vec2 = new Vec2()): this {
    const origin = Vec2.copy(this).sub(center);
    this.x = origin.x * Math.cos(angle) + origin.y * Math.sin(angle) + center.x;
    this.y = origin.x * -Math.sin(angle) + origin.y * Math.cos(angle) + center.y;
    return this;
  }

  // TODO: 容错机制
  /**
   * 二维点到线的垂直距离
   * @param {Line2} line 二维线
   * @return {number} 距离值
   */
  verticalDistanceToLine (line: Line2): number {
    const a = (line.end.y - line.start.y) / (line.end.x - line.start.x);
    const b = -1;
    const c = line.start.y - a * line.start.x;

    const v1 = new Vec2(this.x - line.start.x, this.y - line.start.y);
    const v2 = new Vec2(line.end.x - line.start.x, line.end.y - line.start.y);
    const angle = v1.angleToVec2(v2);

    if (angle > -Math.PI / 2 && angle < Math.PI / 2) {
      const dis = (a * this.x + b * this.y + c) / Math.sqrt(a * a + 1);

      return Math.abs(dis);
    } else {
      return -1;
    }
  }

  /**
   * 点到直线的最短距离
   * @return {{d: number, t: number}} d表示距离，t表示最近点在直线的比例
   */
  distanceToLine (line: Line2): { d: number, t: number } {
    const l2 = Math.pow(line.length(), 2);
    const { start, end } = line;

    if (l2 === 0) {
      return { d: new Vec2().subVectors(this, start).length(), t: 0 };
    }
    const t = ((this.x - start.x) * (end.x - start.x) + (this.y - start.y) * (end.y - start.y)) / l2;
    const clampedT = clamp(t, 0, 1);
    return { d: new Vec2().subVectors(this, line.at(clampedT)).length(), t: clampedT };
  }

  /**
   * 二维向量判空
   * @return {boolean} 判空结果
   */
  isZero () {
    return this.length() === 0;
  }
}
