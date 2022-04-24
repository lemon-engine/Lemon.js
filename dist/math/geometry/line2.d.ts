import { Vec2 } from '../vec2';
/**
 * @class 二维线段
 */
export declare class Line2 {
    start: Vec2;
    end: Vec2;
    /**
     * 构造函数
     * @param {Vec2} [start=new Vec2()] 线段起点，默认值为(0, 0)
     * @param {Vec2} [end=new Vec2()] 线段终点，默认值为(0, 0)
     */
    constructor(start?: Vec2, end?: Vec2);
    /**
     * 设置二维线段
     * @param {Vec2} start 线段起点
     * @param {Vec2} end 线段终点
     * @return {Line2} 二维线段
     */
    set(start: Vec2, end: Vec2): this;
    /**
     * 复制二维线段
     * @param {Line2} line 复制对象
     * @return {Line2} 复制结果
     */
    copy(line: Line2): this;
    /**
     * 二维线段求方向
     * @return {Vec2} 二维线段方向
     */
    direction(): Vec2;
    /**
     * 二维线段求中点
     * @param {Vec2} [target=new Vec2()] 目标保存对象
     * @return {Vec2} 二维线段中点
     */
    getCenter(target?: Vec2): Vec2;
    /**
     * 二维线段向量值
     * @param {Vec2} [target=new Vec2()] 目标保存对象
     * @return {Vec2} 二维线段向量值
     */
    delta(target?: Vec2): Vec2;
    /**
     * 二维线段欧式距离平方(应用于计算)
     * @return {number} 计算结果
     */
    distanceSq(): number;
    /**
     * 二维线段欧式距离
     * @return {number} 计算结果
     */
    distance(): number;
    /**
     * 求二维线段比例点
     * @param {number} t 比例值
     * @param {Vec2} target 目标保存对象
     * @return {Vec2} 比例点结果
     */
    at(t: number, target?: Vec2): Vec2;
    /**
     * 求点与线段的最短距离
     * @param {Vec2} point 二维空间点
     * @param {boolean} clampToLine 是否限制于线段内
     * @return {number} 距离结果
     */
    closestPointToPointParameter(point: Vec2, clampToLine: boolean): number;
    /**
     * 求点与线段的最近交点
     * @param {Vec2} point 二维空间点
     * @param {boolean} clampToLine 是否限制于线段内
     * @param {Vec2} target 目标保存对象
     * @return {Vec2} 最近交点
     */
    closestPointToPoint(point: Vec2, clampToLine: boolean, target?: Vec2): Vec2;
    /**
     * 二维线段判等
     * @param {Line2} line 二维线段
     * @return {boolean} 判等结果
     */
    equals(line: Line2): boolean;
    /**
     * 克隆二维线段
     * @return {Line2} 克隆结果
     */
    clone(): Line2;
    /**
     * 二维线段求长度
     * @return {number} 长度
     */
    length(): number;
    /**
     * 二维线段判断相交
     * @param {Line2} other 二维线段
     * @return {boolean} 相交判断结果
     */
    crossWithLine(other: Line2): boolean;
}
