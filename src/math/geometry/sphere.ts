import { Box3 } from './box3';
import type { Matrix4 } from '../matrix4';
import { Vec3 } from '../vec3';

/**
 * @class 球
 */
export class Sphere {

  /**
   * 构造函数
   * @param center 球心，默认值为(0, 0, 0)
   * @param radius 半径，默认值为-1
   */
  constructor (
    public center = new Vec3(),
    public radius = - 1
  ) {
  }

  /**
   * 通过参数设置球
   * @param center 球心
   * @param radius 半径
   * @returns 球
   */
  set (center: Vec3, radius: number): Sphere {

    this.center.copy(center);
    this.radius = radius;

    return this;

  }

  /**
   * 通过空间点与球心设置球
   * @param points 三维空间点
   * @param optionalCenter 指定球心
   * @returns 球
   */
  setFromPoints (points: Vec3[], optionalCenter?: Vec3): Sphere {

    const { center } = this;

    if (optionalCenter !== undefined) {

      center.copy(optionalCenter);

      let maxRadiusSq = 0;

      for (let i = 0; i < points.length; i++) {

        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));

      }

      this.radius = Math.sqrt(maxRadiusSq);

    } else {

      const box = new Box3().setFromPoints(points);

      box.getCenter(center);

      this.radius = box.getSize().length() / 2;

    }


    return this;

  }

  /**
   * 复制球
   * @param sphere 球信息
   * @returns 复制结果
   */
  copy (sphere: Sphere): Sphere {

    this.center.copy(sphere.center);
    this.radius = sphere.radius;

    return this;

  }

  /**
   * 球判空
   * @returns 判空结果
   */
  isEmpty (): boolean {

    return (this.radius < 0);

  }

  /**
   * 球置空
   * @returns 置空结果
   */
  makeEmpty (): Sphere {

    this.center.set(0, 0, 0);
    this.radius = - 1;

    return this;

  }

  /**
   * 三维空间点包围判断
   * @param point 三维空间点
   * @returns 空间点包含判断
   */
  containsPoint (point: Vec3): boolean {

    return (point.distanceToSquared(this.center) <= (this.radius * this.radius));

  }

  /**
   * 空间点与球表面的最短距离
   * @param point 三维空间点
   * @returns 距离结果
   */
  distanceToPoint (point: Vec3): number {

    return (point.distanceTo(this.center) - this.radius);

  }

  /**
   * 与球相交判断
   * @param sphere 球
   * @returns 相交判断结果
   */
  intersectsSphere (sphere: Sphere): boolean {

    const radiusSum = this.radius + sphere.radius;

    return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);

  }

  /**
   * 与包围盒相交判断
   * @param box 三维包围盒
   * @returns 相交判断结果
   */
  intersectsBox (box: Box3): boolean {

    return box.intersectsSphere(this);

  }

  /**
   * 收敛空间点在球范围内
   * 注：乘法的效率要比开方高很多
   * @param point 三维空间点
   * @param target 结果保存对象
   * @returns 收敛结果
   */
  clampPoint (point: Vec3, target?: Vec3): Vec3 {

    const deltaLengthSq = this.center.distanceToSquared(point);

    if (target === undefined) { target = new Vec3(); }

    target.copy(point);

    if (deltaLengthSq > (this.radius * this.radius)) {

      target.sub(this.center).normalize();
      target.multiply(this.radius).add(this.center);

    }

    return target;

  }

  /**
   * 根据包围盒获取球
   * @param target 包围盒
   * @returns 球
   */
  getBoundingBox (target: Box3): Box3 {

    if (target === undefined) { target = new Box3(); }

    if (this.isEmpty()) {

      // Empty sphere produces empty bounding box
      target.makeEmpty();
      return target;

    }

    target.set(this.center, this.center);
    target.expandByScalar(this.radius);

    return target;

  }

  /**
   * 球空间变换
   * @param matrix 空间变化矩阵
   * @returns 变换结果
   */
  applyMatrix4 (matrix: Matrix4): Sphere {

    this.center.applyMatrix4(matrix);
    this.radius = this.radius * matrix.getMaxScaleOnAxis();

    return this;

  }

  /**
   * 球位移
   * @param offset 位移信息
   * @returns 位移结果
   */
  translate (offset: Vec3): Sphere {

    this.center.add(offset);

    return this;

  }

  /**
   * 通过三维空间点对球进行扩展[最小扩展集]
   * @param point 扩展点
   * @returns 扩展结果
   */
  expandByPoint (point: Vec3): Sphere {

    const vector = new Vec3().subVectors(point, this.center);

    const lengthSq = vector.lengthSq();

    if (lengthSq > (this.radius * this.radius)) {

      const length = Math.sqrt(lengthSq);
      const missingRadiusHalf = (length - this.radius) * 0.5;

      this.center.add(vector.multiply(missingRadiusHalf / length));
      this.radius += missingRadiusHalf;

    }

    return this;

  }

  /**
   * 包围球求并集
   * @param sphere 包围球
   * @returns 求并结果
   */
  union (sphere: Sphere): Sphere {

    const v1 = new Vec3();
    const toFarthestPoint = new Vec3();

    toFarthestPoint.subVectors(sphere.center, this.center).normalize().multiply(sphere.radius);

    this.expandByPoint(v1.copy(sphere.center).add(toFarthestPoint));
    this.expandByPoint(v1.copy(sphere.center).sub(toFarthestPoint));

    return this;

  }

  /**
   * 包围球求交集
   * @param other 其它包围球
   * @returns 求交结果
   */
  intersect (other: Sphere): Sphere {

    const vector = new Vec3().subVectors(this.center, other.center);
    const distance = vector.length();
    const radiusSum = this.radius + other.radius;

    if (distance > radiusSum) {
      return this.makeEmpty();
    }

    this.center = this.center.add(vector.normalize().multiply(distance / 2));
    this.radius = this.radius + other.radius - distance;

    return this;

  }

  /**
   * 包围球判等
   * @param sphere 包围球
   * @returns 判等结果
   */
  equals (sphere: Sphere): boolean {

    return sphere.center.equals(this.center) && (sphere.radius === this.radius);

  }

  /**
   * 包围球克隆
   * @returns 克隆结果
   */
  clone (): Sphere {

    return new Sphere().copy(this);

  }

}