import { Vec3 } from '../vec3';
/**
 * @class 三维线段
 */
export declare class Line3 {
    start: Vec3;
    end: Vec3;
    /**
     * 构造函数
     * @param {Vec3} [start=new Vec3()] 线段起点，默认值为(0, 0, 0)
     * @param {Vec3} [end=new Vec3()] 线段终点，默认值为(0, 0, 0)
     */
    constructor(start?: Vec3, end?: Vec3);
}
