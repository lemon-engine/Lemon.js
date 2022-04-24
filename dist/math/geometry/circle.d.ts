import type { Box2 } from './box2';
import { Vec2 } from '../vec2';
/**
 * @class 二维圆
 */
export declare class Circle {
    center: Vec2;
    radius: number;
    /**
     * 构造函数，默认值为圆心为原点,半径为0
     * @param {Vec2} [center=new Vec2()] 圆心
     * @param {number} [radius=0] 半径
     */
    constructor(center?: Vec2, radius?: number);
    /**
     * 通过中心点与大小设置圆
     * @param {Vec2} center 圆心
     * @param {number} radius 半径
     * @return {Circle}
     */
    set(center: Vec2, radius: number): this;
    /**
     * 克隆圆
     * @return {Circle} 克隆结果
     */
    clone(): Circle;
    /**
     * 复制圆
     * @param {Circle} circle 复制对象
     * @return {Circle} 复制结果
     */
    copy(circle: Circle): this;
    /**
     * 圆置空
     * @return {Circle} 置空结果
     */
    makeEmpty(): this;
    /**
     * 圆判空
     * @return {boolean} 判空结果
     */
    isEmpty(): boolean;
    /**
     * 获取圆心
     * @param {Vec2} [target=new Vec2()] 目标结果对象
     * @return {Vec2} 圆心
     */
    getCenter(target?: Vec2): Vec2;
    /**
     * 获取半径
     * @param {number} [radius] 目标结果对象
     * @return {number} 半径
     */
    getRadius(radius?: number): number;
    /**
     * 通过二维空间点扩展圆
     * @param {Vec2} point 二维空间点
     * @return {Circle} 扩展结果
     */
    expandByPoint(point: Vec2): this;
    /**
     * 通过大小扩展圆
     * @param {number} scalar 扩展大小
     * @return {Circle} 扩展结果
     */
    expandByScalar(scalar: number): this;
    /**
     * 判断圆是否包含二维空间点
     * @param {Vec2} point 二维空间点
     * @return {boolean}  包含判断结果
     */
    containsPoint(point: Vec2): boolean;
    /**
     * 判断圆是否包含二维包围盒
     * @param {Box2} box 二维包围盒
     * @return {boolean} 包含判断结果
     */
    containsBox(box: Box2): boolean;
    /**
     * 判断圆与二维包围盒的相交关系
     * @param {Box2} box 二维包围盒
     * @return {boolean} 相交判断结果
     */
    intersectsBox(box: Box2): boolean;
    /**
     * 求点与圆的最短距离
     * @param {Vec2} point 二维空间点
     * @return {number} 距离
     */
    distanceToPoint(point: Vec2): number;
    /**
     * 圆求交集
     * @param {Circle} circle 二维圆
     * @return {Circle} 求交结果
     */
    intersect(circle: Circle): this;
    /**
     * 圆求并集
     * @param {Circle} circle 二维圆
     * @return {Circle} 求并结果
     */
    union(circle: Circle): this;
    /**
     * 圆的位移
     * @param {Vec2} offset 二维向量
     * @return {Circle} 位移结果
     */
    translate(offset: Vec2): this;
    /**
     * 圆判等
     * @param {Circle} circle 二维圆
     * @return {boolean} 判等结果
     */
    equals(circle: Circle): boolean;
}
