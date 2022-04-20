import type { Matrix4 } from './matrix4';
import type { Sphere } from './sphere';
import { Vec3 } from './vec3';

/**
 * 三维包围盒
 * @class
 */
export class Box3 {
  intersectsSphere (sphere: Sphere): boolean {
    throw new Error('Method not implemented.');
  }

  /**
   * 构造函数，传入值为空时表示空包围盒
   * @param {Vec3} [min=new Vec3(Number(Infinity))] 最小角点
   * @param {Vec3} [max=new Vec3(-Infinity)] 最大角点
   */
  constructor (
    public min: Vec3 = new Vec3(Number(Infinity)),
    public max: Vec3 = new Vec3(-Infinity),
  ) {
  }

  /**
   * 设置三维包围盒的值
   * @param {Vec3} min 三维包围盒最小点
   * @param {Vec3} max 三维包围盒最大点
   * @return {Box3}
   */
  set (min: Vec3, max: Vec3): this {
    this.min.copy(min);
    this.max.copy(max);
    return this;
  }

  /**
   * 由数组构建三维包围盒
   * @param {number[]} array 数组集合(每三个数视为一个三维空间点)
   * @return {Box3} 三维包围盒
   */
  setFromArray (array: number[]): this {
    let minX = Number(Infinity);
    let minY = Number(Infinity);
    let minZ = Number(Infinity);

    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;

    for (let i = 0, l = array.length; i < l; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      if (x < minX) { minX = x; }
      if (y < minY) { minY = y; }
      if (z < minZ) { minZ = z; }

      if (x > maxX) { maxX = x; }
      if (y > maxY) { maxY = y; }
      if (z > maxZ) { maxZ = z; }
    }

    this.min.set(minX, minY, minZ);
    this.max.set(maxX, maxY, maxZ);

    return this;
  }


  /**
   * 由三维空间点构建三维包围盒
   * @param {Vec3[]} points 三维空间点集合
   * @return {Box3} 三维包围盒
   */
  setFromPoints (points: Vec3[]): this {
    this.makeEmpty();

    for (let i = 0, il = points.length; i < il; i++) {
      this.expandByPoint(points[i]);
    }

    return this;
  }

  /**
   * 由三维空间点（包围盒中心）和大小确定包围盒
   * @param {Vec3} center 三维包围盒中心点
   * @param {Vec3} size 三维包围盒大小值
   * @return {Box3} 三维包围盒
   */
  setFromCenterAndSize (center: Vec3, size: Vec3): this {
    const halfSize = new Vec3().copy(size).multiply(0.5);

    this.min.copy(center).sub(halfSize);
    this.max.copy(center).add(halfSize);

    return this;
  }

  // TODO
  /**
   * 由实体构建包围盒
   * @param object 构件实体
   * @returns 三维包围盒
   */
  setFromObject (object: any) {
    this.makeEmpty();
    return this.expandByObject(object);
  }

  /**
   * 克隆三维包围盒
   * @return {Box3} 克隆结果
   */
  clone (): Box3 {
    return new Box3().copy(this);
  }

  /**
   * 复制三维包围盒
   * @param {Box3} box 复制对象
   * @return {Box3} 复制结果
   */
  copy (box: Box3): this {
    this.min.copy(box.min);
    this.max.copy(box.max);
    return this;
  }

  /**
   * 三维包围盒置空
   * @return {Box3} 置空结果
   */
  makeEmpty (): this {
    this.min.x = this.min.y = this.min.z = Number(Infinity);
    this.max.x = this.max.y = this.max.z = -Infinity;
    return this;
  }

  /**
   * 三维包围盒判空
   * @return {boolean} 判空结果
   */
  isEmpty (): boolean {
    // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
    return this.max.x < this.min.x
      || this.max.y < this.min.y
      || this.max.z < this.min.z;
  }

  /**
   * 获取三维包围盒中心
   * @param {Vec3} [target=new Vec3()]
   * @return {Vec3}
   */
  getCenter (target: Vec3 = new Vec3()): Vec3 {
    return this.isEmpty() ? target.set(0, 0, 0) : target.addVectors(this.min, this.max).multiply(0.5);
  }

  /**
   * 获取三维包围盒大小
   * @param {Vec3} [target=new Vec3()] 结果保存对象
   * @return {Vec3} 三维包围盒大小
   */
  getSize (target: Vec3 = new Vec3()): Vec3 {
    return this.isEmpty() ? target.set(0, 0, 0) : target.subVectors(this.max, this.min);
  }

  /**
   * 通过三维空间点扩展三维包围盒
   * @param {Vec3} point 三维空间点
   * @return {Box3} 扩展结果
   */
  expandByPoint (point: Vec3): this {
    this.min.min(point);
    this.max.max(point);
    return this;
  }

  /**
   * 通过三维向量扩展三维包围盒
   * @param {Vec3} vector 三维向量
   * @return {Box3} 扩展结果
   */
  expandByVector (vector: Vec3): this {
    this.min.sub(vector);
    this.max.add(vector);
    return this;
  }

  /**
   * 通过实数扩展三维包围盒
   * @param {number} scalar 扩展大小
   * @return {Box3} 扩展结果
   */
  expandByScalar (scalar: number): this {
    this.min.add(-scalar);
    this.max.add(scalar);
    return this;
  }

  // TODO
  /**
   * 通过实体扩展三维包围盒
   * @param object 构件实体
   * @return {Box3} 扩展结果
   */
  expandByObject (object: any): this {
    // Computes the world-axis-aligned bounding box of an object (including its children),
    // accounting for both the object's, and children's, world transforms
    object.updateWorldMatrix(false, false);

    const geometry = object.geometry;

    if (geometry !== undefined) {
      if (geometry.boundingBox === null) {
        geometry.computeBoundingBox();
      }

      const box3 = new Box3();
      box3.copy(geometry.boundingBox as Box3);
      box3.applyMatrix4(object.matrixWorld as Matrix4);

      this.union(box3);
    }

    const children = object.children;

    for (let i = 0, l = children.length; i < l; i++) {
      this.expandByObject(children[i]);
    }

    return this;
  }

  /**
   * 判断三维包围盒相交关系(if this intersect other)
   * @param {Vec3} point 三维空间点
   * @return {boolean} 点包含判断结果
   */
  containsPoint (point: Vec3): boolean {
    return !(point.x < this.min.x
      || point.x > this.max.x
      || point.y < this.min.y
      || point.y > this.max.y
      || point.z < this.min.z
      || point.z > this.max.z);
  }

  /**
   * 判断三维包围盒与三维包围盒的包含关系
   * @param {Box3} other 三维包围盒
   * @return {boolean} 包围盒包含结果(true表示this包含other, false表示this不包含other)
   */
  containsBox (other: Box3): boolean {
    return this.min.x <= other.min.x
      && this.max.x >= other.max.x
      && this.min.y <= other.min.y
      && this.max.y >= other.max.y
      && this.min.z <= other.min.z
      && this.max.z >= other.max.z;
  }

  // TODO
  /**
   * 获取点在三维包围盒的比例位置
   * @param {Vec3} point 三维空间点
   * @param {Vec3} [target=new Vec3()] 结果保存对象
   * @return {Vec3} 点在包围盒比例位置
   */
  getParameter (point: Vec3, target: Vec3 = new Vec3()): Vec3 {
    // This can potentially have a divide by zero if the box
    // has a size dimension of 0.
    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y),
      (point.z - this.min.z) / (this.max.z - this.min.z)
    );
  }

  /**
   * 判断三维包围盒相交关系(if this intersect other)
   * @param {Box3} other 三维包围盒
   * @return {boolean} 相交判断结果
   */
  intersectsBox (other: Box3): boolean {
    // using 6 splitting planes to rule out intersections.
    return !(other.max.x < this.min.x || other.min.x > this.max.x
      || other.max.y < this.min.y || other.min.y > this.max.y
      || other.max.z < this.min.z || other.min.z > this.max.z);
  }

  /**
   * 求点与三维包围盒的最近点
   * @param {Vec3} point 三维空间点
   * @param {Vec3} [target=new Vec3()] 结果存放对象
   * @return {Vec3} 计算结果
   */
  clampPoint (point: Vec3, target: Vec3 = new Vec3()): Vec3 {
    return target.copy(point).clamp(this.min, this.max);
  }

  /**
   * 三维空间点到三维包围盒的距离
   * @param {Vec3} point 三维包围盒
   * @return {number} 距离结果
   */
  distanceToPoint (point: Vec3): number {
    const clampedPoint = new Vec3().copy(point).clamp(this.min, this.max);
    return clampedPoint.sub(point).length();
  }

  /**
   * 三维包围盒求交集
   * @param {Box3} box 三维包围盒
   * @return {Box3} 求交结果
   */
  intersect (box: Box3): this {
    this.min.max(box.min);
    this.max.min(box.max);

    // ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
    if (this.isEmpty()) { this.makeEmpty(); }

    return this;
  }

  /**
   * 三维包围盒求并集
   * @param {Box3} box 三维包围盒
   * @return {Box3} 求并结果
   */
  union (box: Box3): this {
    this.min.min(box.min);
    this.max.max(box.max);
    return this;
  }

  /**
   * 通过三维变换矩阵变化三维包围盒
   * @param {Matrix4} matrix 三维变换矩阵
   * @return {Box3} 变换结果
   */
  applyMatrix4 (matrix: Matrix4): this {
    // transform of empty box is an empty box.
    if (this.isEmpty()) { return this; }

    const points = [new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
    // NOTE: I am using a binary pattern to specify all 2^3 combinations below
    points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
    points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
    points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
    points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
    points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
    points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
    points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
    points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

    this.setFromPoints(points);
    return this;
  }

  /**
   * 三维包围盒位移
   * @param {Vec3} offset 三维位移向量
   * @return {Box3} 位移结果
   */
  translate (offset: Vec3): this {
    this.min.add(offset);
    this.max.add(offset);
    return this;
  }

  /**
   * 三维包围盒判等
   * @param {Box3} other 三维包围盒
   * @return {boolean} 判等结果
   */
  equals (other: Box3): boolean {
    return other.min.equals(this.min) && other.max.equals(this.max);
  }
}
