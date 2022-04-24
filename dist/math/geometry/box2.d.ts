import { Vec2 } from '../vec2';
/**
 * @class 二维包围盒
 */
export declare class Box2 {
    min: Vec2;
    max: Vec2;
    /**
     * @member {Vec2[]} corners 二维包围盒角点
     */
    corners: Vec2[];
    /**
     * 构造函数，传入值为空时表示空包围盒
     * @param {Vec2} [min=new Vec2(+Infinity, +Infinity)] 最小点
     * @param {Vec2} [max=new Vec2(-Infinity, -Infinity)] 最大点
     */
    constructor(min?: Vec2, max?: Vec2);
    /**
     * 通过最大最小点设置二维包围盒
     * @param {Vec2} min 最小点
     * @param {Vec2} max 最大点
     * @return {Box2} 二维包围盒
     */
    set(min: Vec2, max: Vec2): this;
    /**
     * 通过角点设置二维包围盒
     * @param {Vec2[]} vecArray 二维空间点数组
     * @return {Box2} 二维包围盒
     */
    setFromVec2Array(vecArray: Vec2[]): this;
    /**
     * 通过中心与大小设置二维包围盒
     * @param {Vec2} center 二维中心点
     * @param {Vec2} size 二维大小
     * @return {Box2} 二维包围盒
     */
    setFromCenterAndSize(center: Vec2, size: Vec2): this;
    /**
     * 克隆二维包围盒
     * @return {Box2} 克隆结果
     */
    clone(): Box2;
    /**
     * 复制二维包围盒
     * @param {Box2} box 二维包围盒
     * @return {Box2} 复制结果
     */
    copy(box: Box2): this;
    /**
     * 二维包围盒置空
     * @return {Box2} 置空结果
     */
    makeEmpty(): this;
    /**
     * 二维包围盒判空
     * @return {boolean} 判空结果
     */
    isEmpty(): boolean;
    /**
     * 获取二维包围盒角点
     * @return {Vec2[]} 二维包围盒角点
     */
    getCorners(): Vec2[];
    /**
     * 获取二维包围盒左上角点
     * @return {Vec2} 二维包围盒左上角点
     */
    getLeftTopCorner(): Vec2;
    /**
     * 获取二维包围盒右上角点
     * @return {Vec2} 二维包围盒右上角点
     */
    getRightTopCorner(): Vec2;
    /**
     * 获取二维包围盒右下角点
     * @return {Vec2} 二维包围盒右下角点
     */
    getRightBottomCorner(): Vec2;
    /**
     * 获取二维包围盒左下角点
     * @return {Vec2} 二维包围盒左下角点
     */
    getLeftBottomCorner(): Vec2;
    /**
     * 通过类型获取二维包围盒指定点
     * @param {number} type 包围盒顶点顺序
     * @return {Vec2} 二维包围盒指定点
     */
    getPoint(type: number): Vec2;
    /**
     * 获取二维包围盒中心点
     * @param {Vec2} [target=new Vec2()] 目标点(用以存放二维包围盒中心点)
     * @return {Vec2} 二维包围盒中心点
     */
    getCenter(target?: Vec2): Vec2;
    /**
     * 获取二维包围盒大小
     * @param {Vec2} [target=new Vec2()] 目标向量(用以存放二维包围盒大小)
     * @return {Vec2} 二维包围盒大小
     */
    getSize(target?: Vec2): Vec2;
    /**
     * 通过二维空间点扩展二维包围盒
     * @param {Vec2} point 二维空间点
     * @return {Box2} 扩展包围盒
     */
    expandByPoint(point: Vec2): this;
    /**
     * 通过向量扩展二维包围盒
     * @param {Vec2} vector 二维向量
     * @return {Box2} 扩展结果
     */
    expandByVector(vector: Vec2): this;
    /**
     * 通过大小扩展二维包围盒
     * @param {number} scalar 扩展大小
     * @return {Box2} 扩展结果
     */
    expandByScalar(scalar: number): this;
    /**
     * 判断二维包围盒是否包含二维空间点
     * @param {Vec2} point 二维空间点
     * @param {boolean} [isOrthogonal=true] 包围盒正交判断(默认为true)
     * @return {boolean} 点包含判断结果
     */
    containsPoint(point: Vec2, isOrthogonal?: boolean): boolean;
    /**
     * 判断二维包围盒包含关系(if this contains other)
     * @param {Box2} box 其它包围盒
     * @return {boolean} 二维包围盒包含判断结果
     */
    containsBox(box: Box2): boolean;
    /**
     * 获取点以包围盒左上角顶点为原点的相对位置
     * @param {Vec2} point 指定二维空间点
     * @param {Vec2} [target=new Vec2()] 目标空间点
     * @return {Vec2} 计算结果空间点
     */
    getParameter(point: Vec2, target?: Vec2): Vec2;
    /**
     * 判断二维包围盒相交关系(if this intersect other)
     * @param {Box2} box 二维包围盒
     * @param {boolean} [isOrthogonal=true] 正交判断(当前包围盒)
     * @return {boolean} 相交判断结果
     */
    intersectsBox(box: Box2, isOrthogonal?: boolean): boolean;
    /**
     * 求点与二维包围盒的最近点
     * @param {Vec2} point 二维空间点
     * @param {Vec2} [target=new Vec2()] 结果点
     * @return {Vec2} 二维空间点
     */
    clampPoint(point: Vec2, target?: Vec2): Vec2;
    /**
     * 求点到二维包围盒的距离
     * @param {Vec2} point 二维空间点
     * @return {number} 距离
     */
    distanceToPoint(point: Vec2): number;
    /**
     * 二维包围盒求交集
     * @param {Box2} box 二维包围盒
     * @return {Box2} 求交结果
     */
    intersect(box: Box2): this;
    /**
     * 二维包围盒求并集
     * @param {Box2} box 二维包围盒
     * @return {Box2} 求并结果
     */
    union(box: Box2): this;
    /**
     * 二维包围盒位移
     * @param {Vec2} offset 位移向量
     * @return {Box2} 位移结果
     */
    translate(offset: Vec2): this;
    /**
     * 二维包围盒判等
     * @param {Box2} box 二维包围盒
     * @return {boolean} 判等结果
     */
    equals(box: Box2): boolean;
}
