import { Line2 } from './line2';
import { Vec2 } from '../vec2';

/**
 * @class 二维包围盒
 */
export class Box2 {
  /**
   * @member {Vec2[]} corners 二维包围盒角点
   */
  corners: Vec2[];

  /**
   * 构造函数，传入值为空时表示空包围盒
   * @param {Vec2} [min=new Vec2(+Infinity, +Infinity)] 最小点
   * @param {Vec2} [max=new Vec2(-Infinity, -Infinity)] 最大点
   */
  constructor (
    public min: Vec2 = new Vec2(+Infinity, +Infinity),
    public max: Vec2 = new Vec2(-Infinity, -Infinity),
  ) {
    if (!min.equals(new Vec2(+Infinity, +Infinity)) && !max.equals(new Vec2(-Infinity, -Infinity))) {
      this.corners = [
        Vec2.copy(min),
        new Vec2(max.x, min.y),
        Vec2.copy(max),
        new Vec2(min.x, max.y),
      ];
    } else {
      this.corners = [];
    }
  }

  /**
   * 通过最大最小点设置二维包围盒
   * @param {Vec2} min 最小点
   * @param {Vec2} max 最大点
   * @return {Box2} 二维包围盒
   */
  set (min: Vec2, max: Vec2): this {
    this.min.copy(min);
    this.max.copy(max);
    this.corners = [
      Vec2.copy(min),
      new Vec2(max.x, min.y),
      Vec2.copy(max),
      new Vec2(min.x, max.y),
    ];
    return this;
  }

  /**
   * 通过角点设置二维包围盒
   * @param {Vec2[]} vecArray 二维空间点数组
   * @return {Box2} 二维包围盒
   */
  setFromVec2Array (vecArray: Vec2[]): this {
    this.min = new Vec2().copy(vecArray[0]);
    this.max = new Vec2().copy(vecArray[0]);
    vecArray.forEach((v: Vec2) => {
      this.min = Vec2.min(v, this.min);
      this.max = Vec2.max(v, this.max);
      this.corners.push(Vec2.copy(v));
    });
    return this;
  }

  /**
   * 通过中心与大小设置二维包围盒
   * @param {Vec2} center 二维中心点
   * @param {Vec2} size 二维大小
   * @return {Box2} 二维包围盒
   */
  setFromCenterAndSize (center: Vec2, size: Vec2): this {
    const halfSize = new Vec2().copy(size).multiply(0.5);
    this.min.copy(center).sub(halfSize);
    this.max.copy(center).add(halfSize);
    this.corners = [
      Vec2.copy(this.min),
      new Vec2(this.max.x, this.min.y),
      Vec2.copy(this.max),
      new Vec2(this.min.x, this.max.y),
    ];
    return this;
  }

  /**
   * 克隆二维包围盒
   * @return {Box2} 克隆结果
   */
  clone (): Box2 {
    return new Box2().copy(this);
  }

  /**
   * 复制二维包围盒
   * @param {Box2} box 二维包围盒
   * @return {Box2} 复制结果
   */
  copy (box: Box2): this {
    this.min.copy(box.min);
    this.max.copy(box.max);
    box.corners.forEach(corner => {
      this.corners.push(Vec2.copy(corner));
    });
    return this;
  }

  /**
   * 二维包围盒置空
   * @return {Box2} 置空结果
   */
  makeEmpty (): this {
    this.min.x = this.min.y = +Infinity;
    this.max.x = this.max.y = -Infinity;
    this.corners = [];
    return this;
  }

  /**
   * 二维包围盒判空
   * @return {boolean} 判空结果
   */
  isEmpty (): boolean {
    // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
    return (this.max.x <= this.min.x) || (this.max.y <= this.min.y);
  }

  /**
   * 获取二维包围盒角点
   * @return {Vec2[]} 二维包围盒角点
   */
  getCorners (): Vec2[] {
    const res: Vec2[] = [];
    this.corners.forEach(corner => {
      res.push(Vec2.copy(corner));
    });
    return res;
  }

  /**
   * 获取二维包围盒左上角点
   * @return {Vec2} 二维包围盒左上角点
   */
  getLeftTopCorner (): Vec2 {
    return Vec2.copy(this.corners[0]);
  }

  /**
   * 获取二维包围盒右上角点
   * @return {Vec2} 二维包围盒右上角点
   */
  getRightTopCorner (): Vec2 {
    return Vec2.copy(this.corners[1]);
  }

  /**
   * 获取二维包围盒右下角点
   * @return {Vec2} 二维包围盒右下角点
   */
  getRightBottomCorner (): Vec2 {
    return Vec2.copy(this.corners[2]);
  }

  /**
   * 获取二维包围盒左下角点
   * @return {Vec2} 二维包围盒左下角点
   */
  getLeftBottomCorner (): Vec2 {
    return Vec2.copy(this.corners[3]);
  }

  // type 0 = 'center'
  // type 1 = 'left top'
  // type 2 = 'left center'
  // type 3 = 'left bottom'
  // type 4 = 'middle top'
  // type 5 = 'middle bottom'
  // type 6 = 'right top'
  // type 7 = 'right center'
  // type 8 = 'right bottom'
  /**
   * 通过类型获取二维包围盒指定点
   * @param {number} type 包围盒顶点顺序
   * @return {Vec2} 二维包围盒指定点
   */
  getPoint (type: number): Vec2 {
    const size: Vec2 = this.getSize();
    const center: Vec2 = this.getCenter();

    switch (type) {
      case 0: {
        return center;
      }
      case 1: {
        return center.add(size.multiply(-1 / 2));
      }
      case 2: {
        return center.add(new Vec2(-size.x / 2, 0));
      }
      case 3: {
        return center.add(new Vec2(-size.x / 2, size.y / 2));
      }
      case 4: {
        return center.add(new Vec2(0, -size.y / 2));
      }
      case 5: {
        return center.add(new Vec2(0, size.y / 2));
      }
      case 6: {
        return center.add(new Vec2(size.x / 2, -size.y / 2));
      }
      case 7: {
        return center.add(new Vec2(size.x / 2, 0));
      }
      case 8: {
        return center.add(size.multiply(1 / 2));
      }
      default: {
        return center;
      }
    }
  }

  /**
   * 获取二维包围盒中心点
   * @param {Vec2} [target=new Vec2()] 目标点(用以存放二维包围盒中心点)
   * @return {Vec2} 二维包围盒中心点
   */
  getCenter (target: Vec2 = new Vec2()): Vec2 {
    return this.isEmpty() ? target.set(0, 0) : target.addVectors(this.min, this.max).multiply(0.5);
  }

  /**
   * 获取二维包围盒大小
   * @param {Vec2} [target=new Vec2()] 目标向量(用以存放二维包围盒大小)
   * @return {Vec2} 二维包围盒大小
   */
  getSize (target: Vec2 = new Vec2()): Vec2 {
    return this.isEmpty() ? target.set(0, 0) : target.subVectors(this.max, this.min);
  }

  /**
   * 通过二维空间点扩展二维包围盒
   * @param {Vec2} point 二维空间点
   * @return {Box2} 扩展包围盒
   */
  expandByPoint (point: Vec2): this {
    this.min.min(point);
    this.max.max(point);
    return this;
  }

  /**
   * 通过向量扩展二维包围盒
   * @param {Vec2} vector 二维向量
   * @return {Box2} 扩展结果
   */
  expandByVector (vector: Vec2): this {
    this.min.sub(vector);
    this.max.add(vector);
    return this;
  }

  /**
   * 通过大小扩展二维包围盒
   * @param {number} scalar 扩展大小
   * @return {Box2} 扩展结果
   */
  expandByScalar (scalar: number): this {
    this.min.add(-scalar);
    this.max.add(scalar);
    return this;
  }

  /**
   * 判断二维包围盒是否包含二维空间点
   * @param {Vec2} point 二维空间点
   * @param {boolean} [isOrthogonal=true] 包围盒正交判断(默认为true)
   * @return {boolean} 点包含判断结果
   */
  containsPoint (point: Vec2, isOrthogonal = true): boolean {
    if (isOrthogonal) {
      return point.x < this.min.x || point.x > this.max.x ||
        point.y < this.min.y || point.y > this.max.y ? false : true;
    } else {
      if (this.isEmpty()) {
        return false;
      }

      for (let i = 0; i < this.corners.length; i++) {
        const corner = this.corners[i];
        const next = this.corners[(i + 1) % 4];
        const edge = new Vec2(next.x - corner.x, next.y - corner.y);
        const vec = new Vec2(point.x - corner.x, point.y - corner.y);
        if (edge.cross(vec) < 0) { return false; }
      }

      return true;
    }
  }

  /**
   * 判断二维包围盒包含关系(if this contains other)
   * @param {Box2} box 其它包围盒
   * @return {boolean} 二维包围盒包含判断结果
   */
  containsBox (box: Box2): boolean {
    return this.min.x <= box.min.x
      && box.max.x <= this.max.x
      && this.min.y <= box.min.y
      && box.max.y <= this.max.y;
  }

  /**
   * 获取点以包围盒左上角顶点为原点的相对位置
   * @param {Vec2} point 指定二维空间点
   * @param {Vec2} [target=new Vec2()] 目标空间点
   * @return {Vec2} 计算结果空间点
   */
  getParameter (point: Vec2, target: Vec2 = new Vec2()): Vec2 {
    // This can potentially have a divide by zero if the box
    // has a size dimension of 0.
    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y),
    );
  }

  /**
   * 判断二维包围盒相交关系(if this intersect other)
   * @param {Box2} box 二维包围盒
   * @param {boolean} [isOrthogonal=true] 正交判断(当前包围盒)
   * @return {boolean} 相交判断结果
   */
  intersectsBox (box: Box2, isOrthogonal = true): boolean {
    // using 4 splitting planes to rule out intersections
    // 基于点判断
    if (isOrthogonal) {
      return !(box.max.x < this.min.x
        || box.min.x > this.max.x
        || box.max.y < this.min.y
        || box.min.y > this.max.y);
    } else {
      if (!this.isEmpty()) {
        for (let i = 0; i < this.corners.length; i++) {
          const line = new Line2(this.corners[i], this.corners[(i + 1) % 4]);
          if (box.containsPoint(this.corners[i], false)) {
            return true;
          }
          for (let j = 0; j < box.corners.length; j++) {
            const boxLine = new Line2(box.corners[j], box.corners[(j + 1) % 4]);
            if (this.containsPoint(box.corners[j], false)) {
              return true;
            }
            if (line.crossWithLine(boxLine)) {
              return true;
            }
          }
        }
      }

      for (let i = 0; i < box.corners.length; i++) {
        const state = this.containsPoint(box.corners[i], false);
        const stateOther = box.containsPoint(this.corners[i], false);

        if (state || stateOther) {
          return true;
        }
      }

      return false;
    }
  }

  /**
   * 求点与二维包围盒的最近点
   * @param {Vec2} point 二维空间点
   * @param {Vec2} [target=new Vec2()] 结果点
   * @return {Vec2} 二维空间点
   */
  clampPoint (point: Vec2, target: Vec2 = new Vec2()): Vec2 {
    return target.copy(point).clamp(this.min, this.max);
  }

  /**
   * 求点到二维包围盒的距离
   * @param {Vec2} point 二维空间点
   * @return {number} 距离
   */
  distanceToPoint (point: Vec2): number {
    const clampedPoint = new Vec2().copy(point).clamp(this.min, this.max);
    return clampedPoint.sub(point).length();
  }

  /**
   * 二维包围盒求交集
   * @param {Box2} box 二维包围盒
   * @return {Box2} 求交结果
   */
  intersect (box: Box2): this {
    this.min.max(box.min);
    this.max.min(box.max);
    if(this.min.x > this.max.x || this.min.y > this.max.y) {
      return this.makeEmpty();
    }
    return this;
  }

  /**
   * 二维包围盒求并集
   * @param {Box2} box 二维包围盒
   * @return {Box2} 求并结果
   */
  union (box: Box2): this {
    this.min.min(box.min);
    this.max.max(box.max);

    this.corners = [
      Vec2.copy(this.min),
      new Vec2(this.max.x, this.min.y),
      Vec2.copy(this.max),
      new Vec2(this.min.x, this.max.y),
    ];

    return this;
  }

  /**
   * 二维包围盒位移
   * @param {Vec2} offset 位移向量
   * @return {Box2} 位移结果
   */
  translate (offset: Vec2): this {
    this.min.add(offset);
    this.max.add(offset);
    return this;
  }

  /**
   * 二维包围盒判等
   * @param {Box2} box 二维包围盒
   * @return {boolean} 判等结果
   */
  equals (box: Box2): boolean {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}
