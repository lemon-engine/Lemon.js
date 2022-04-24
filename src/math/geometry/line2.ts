import { clamp } from '../utils';
import { Vec2 } from '../vec2';

/**
 * @class 二维线段
 */
export class Line2 {
  /**
   * 构造函数
   * @param {Vec2} [start=new Vec2()] 线段起点，默认值为(0, 0)
   * @param {Vec2} [end=new Vec2()] 线段终点，默认值为(0, 0)
   */
  constructor (
    public start: Vec2 = new Vec2(),
    public end: Vec2 = new Vec2(),
  ) {
  }

  /**
   * 设置二维线段
   * @param {Vec2} start 线段起点
   * @param {Vec2} end 线段终点
   * @return {Line2} 二维线段
   */
  set (start: Vec2, end: Vec2): this {
    this.start.copy(start);
    this.end.copy(end);
    return this;
  }

  /**
   * 复制二维线段
   * @param {Line2} line 复制对象
   * @return {Line2} 复制结果
   */
  copy (line: Line2): this {
    this.start.copy(line.start);
    this.end.copy(line.end);
    return this;
  }

  /**
   * 二维线段求方向
   * @return {Vec2} 二维线段方向
   */
  direction (): Vec2 {
    return new Vec2().subVectors(this.end, this.start).normalize();
  }

  /**
   * 二维线段求中点
   * @param {Vec2} [target=new Vec2()] 目标保存对象
   * @return {Vec2} 二维线段中点
   */
  getCenter (target: Vec2 = new Vec2()): Vec2 {
    return target.addVectors(this.start, this.end).multiply(0.5);
  }

  /**
   * 二维线段向量值
   * @param {Vec2} [target=new Vec2()] 目标保存对象
   * @return {Vec2} 二维线段向量值
   */
  delta (target: Vec2 = new Vec2()): Vec2 {
    return target.subVectors(this.end, this.start);
  }

  /**
   * 二维线段欧式距离平方(应用于计算)
   * @return {number} 计算结果
   */
  distanceSq (): number {
    return this.start.distanceToSquared(this.end);
  }

  /**
   * 二维线段欧式距离
   * @return {number} 计算结果
   */
  distance (): number {
    return this.start.distanceTo(this.end);
  }

  /**
   * 求二维线段比例点
   * @param {number} t 比例值
   * @param {Vec2} target 目标保存对象
   * @return {Vec2} 比例点结果
   */
  at (t: number, target: Vec2 = new Vec2()): Vec2 {
    return this.delta(target).multiply(t).add(this.start);
  }

  /**
   * 求点与线段的最短距离
   * @param {Vec2} point 二维空间点
   * @param {boolean} clampToLine 是否限制于线段内
   * @return {number} 距离结果
   */
  closestPointToPointParameter (point: Vec2, clampToLine: boolean): number {
    const startP = new Vec2();
    const startEnd = new Vec2();

    startP.subVectors(point, this.start);
    startEnd.subVectors(this.end, this.start);

    const se2se = startEnd.dot(startEnd);
    const se2sp = startEnd.dot(startP);

    let t = se2sp / se2se;

    if (clampToLine) {
      t = clamp(t, 0, 1);
    }

    return t;
  }

  /**
   * 求点与线段的最近交点
   * @param {Vec2} point 二维空间点
   * @param {boolean} clampToLine 是否限制于线段内
   * @param {Vec2} target 目标保存对象
   * @return {Vec2} 最近交点
   */
  closestPointToPoint (point: Vec2, clampToLine: boolean, target: Vec2 = new Vec2()): Vec2 {
    const t = this.closestPointToPointParameter(point, clampToLine);
    return this.delta(target).multiply(t).add(this.start);
  }

  /**
   * 二维线段判等
   * @param {Line2} line 二维线段
   * @return {boolean} 判等结果
   */
  equals (line: Line2): boolean {
    return line.start.equals(this.start) && line.end.equals(this.end);
  }

  /**
   * 克隆二维线段
   * @return {Line2} 克隆结果
   */
  clone (): Line2 {
    return new Line2().copy(this);
  }

  /**
   * 二维线段求长度
   * @return {number} 长度
   */
  length (): number {
    return new Vec2().subVectors(this.end, this.start).length();
  }

  /**
   * 二维线段判断相交
   * @param {Line2} other 二维线段
   * @return {boolean} 相交判断结果
   */
  crossWithLine (other: Line2): boolean {
    const vecA = this.delta();
    const vecB = other.delta();
    const vecAStart = new Vec2().subVectors(other.start, this.start);
    const vecAEnd = new Vec2().subVectors(other.end, this.start);
    const vecBStart = new Vec2().subVectors(this.start, other.start);
    const vecBEnd = new Vec2().subVectors(this.end, other.start);

    const crossA2BStart = vecAStart.cross(vecA);
    const crossA2BEnd = vecAEnd.cross(vecA);

    const crossB2AStart = vecBStart.cross(vecB);
    const crossB2AEnd = vecBEnd.cross(vecB);

    if (crossA2BStart * crossA2BEnd < 0 && crossB2AStart * crossB2AEnd < 0) {
      return true;
    }

    return false;
  }
}
