import type { Matrix4 } from '../matrix4';
import type { Sphere } from './sphere';
import { Vec3 } from '../vec3';
/**
 * 三维包围盒
 * @class
 */
export declare class Box3 {
    min: Vec3;
    max: Vec3;
    intersectsSphere(sphere: Sphere): boolean;
    /**
     * 构造函数，传入值为空时表示空包围盒
     * @param {Vec3} [min=new Vec3(Number(Infinity))] 最小角点
     * @param {Vec3} [max=new Vec3(-Infinity)] 最大角点
     */
    constructor(min?: Vec3, max?: Vec3);
    /**
     * 设置三维包围盒的值
     * @param {Vec3} min 三维包围盒最小点
     * @param {Vec3} max 三维包围盒最大点
     * @return {Box3}
     */
    set(min: Vec3, max: Vec3): this;
    /**
     * 由数组构建三维包围盒
     * @param {number[]} array 数组集合(每三个数视为一个三维空间点)
     * @return {Box3} 三维包围盒
     */
    setFromArray(array: number[]): this;
    /**
     * 由三维空间点构建三维包围盒
     * @param {Vec3[]} points 三维空间点集合
     * @return {Box3} 三维包围盒
     */
    setFromPoints(points: Vec3[]): this;
    /**
     * 由三维空间点（包围盒中心）和大小确定包围盒
     * @param {Vec3} center 三维包围盒中心点
     * @param {Vec3} size 三维包围盒大小值
     * @return {Box3} 三维包围盒
     */
    setFromCenterAndSize(center: Vec3, size: Vec3): this;
    /**
     * 由实体构建包围盒
     * @param object 构件实体
     * @returns 三维包围盒
     */
    setFromObject(object: any): this;
    /**
     * 克隆三维包围盒
     * @return {Box3} 克隆结果
     */
    clone(): Box3;
    /**
     * 复制三维包围盒
     * @param {Box3} box 复制对象
     * @return {Box3} 复制结果
     */
    copy(box: Box3): this;
    /**
     * 三维包围盒置空
     * @return {Box3} 置空结果
     */
    makeEmpty(): this;
    /**
     * 三维包围盒判空
     * @return {boolean} 判空结果
     */
    isEmpty(): boolean;
    /**
     * 获取三维包围盒中心
     * @param {Vec3} [target=new Vec3()]
     * @return {Vec3}
     */
    getCenter(target?: Vec3): Vec3;
    /**
     * 获取三维包围盒大小
     * @param {Vec3} [target=new Vec3()] 结果保存对象
     * @return {Vec3} 三维包围盒大小
     */
    getSize(target?: Vec3): Vec3;
    /**
     * 通过三维空间点扩展三维包围盒
     * @param {Vec3} point 三维空间点
     * @return {Box3} 扩展结果
     */
    expandByPoint(point: Vec3): this;
    /**
     * 通过三维向量扩展三维包围盒
     * @param {Vec3} vector 三维向量
     * @return {Box3} 扩展结果
     */
    expandByVector(vector: Vec3): this;
    /**
     * 通过实数扩展三维包围盒
     * @param {number} scalar 扩展大小
     * @return {Box3} 扩展结果
     */
    expandByScalar(scalar: number): this;
    /**
     * 通过实体扩展三维包围盒
     * @param object 构件实体
     * @return {Box3} 扩展结果
     */
    expandByObject(object: any): this;
    /**
     * 判断三维包围盒相交关系(if this intersect other)
     * @param {Vec3} point 三维空间点
     * @return {boolean} 点包含判断结果
     */
    containsPoint(point: Vec3): boolean;
    /**
     * 判断三维包围盒与三维包围盒的包含关系
     * @param {Box3} other 三维包围盒
     * @return {boolean} 包围盒包含结果(true表示this包含other, false表示this不包含other)
     */
    containsBox(other: Box3): boolean;
    /**
     * 获取点在三维包围盒的比例位置
     * @param {Vec3} point 三维空间点
     * @param {Vec3} [target=new Vec3()] 结果保存对象
     * @return {Vec3} 点在包围盒比例位置
     */
    getParameter(point: Vec3, target?: Vec3): Vec3;
    /**
     * 判断三维包围盒相交关系(if this intersect other)
     * @param {Box3} other 三维包围盒
     * @return {boolean} 相交判断结果
     */
    intersectsBox(other: Box3): boolean;
    /**
     * 求点与三维包围盒的最近点
     * @param {Vec3} point 三维空间点
     * @param {Vec3} [target=new Vec3()] 结果存放对象
     * @return {Vec3} 计算结果
     */
    clampPoint(point: Vec3, target?: Vec3): Vec3;
    /**
     * 三维空间点到三维包围盒的距离
     * @param {Vec3} point 三维包围盒
     * @return {number} 距离结果
     */
    distanceToPoint(point: Vec3): number;
    /**
     * 三维包围盒求交集
     * @param {Box3} box 三维包围盒
     * @return {Box3} 求交结果
     */
    intersect(box: Box3): this;
    /**
     * 三维包围盒求并集
     * @param {Box3} box 三维包围盒
     * @return {Box3} 求并结果
     */
    union(box: Box3): this;
    /**
     * 通过三维变换矩阵变化三维包围盒
     * @param {Matrix4} matrix 三维变换矩阵
     * @return {Box3} 变换结果
     */
    applyMatrix4(matrix: Matrix4): this;
    /**
     * 三维包围盒位移
     * @param {Vec3} offset 三维位移向量
     * @return {Box3} 位移结果
     */
    translate(offset: Vec3): this;
    /**
     * 三维包围盒判等
     * @param {Box3} other 三维包围盒
     * @return {boolean} 判等结果
     */
    equals(other: Box3): boolean;
}
