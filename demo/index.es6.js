function clamp(value, min, max) {
    const fixedMin = isNaN(min) ? -Infinity : min;
    const fixedMax = isNaN(max) ? Infinity : max;
    const lower = Math.min(fixedMin, fixedMax);
    const upper = Math.max(fixedMin, fixedMax);
    return Math.min(Math.max(value, lower), upper);
}

function roundNumber(number, precision, method = Math.round) {
    const decimal = Math.pow(10, precision);
    return method(number * decimal) / decimal;
}

function intMultiplyFloat(int, floatMultiplier, precision = 1) {
    if (floatMultiplier % 1 !== 0) {
        return intMultiplyFloat(int, floatMultiplier * 10, precision * 10);
    }
    return (int * floatMultiplier) / precision;
}

/**
 * 是否是的 2 的指数值
 * 无法用来处理小数
 * @param  {Number} value
 * @return {Number}
 */
function isPowerIntegerOfTwo(testNum) {
    return (!isNaN(testNum) &&
        testNum !== Infinity &&
        testNum !== -Infinity &&
        testNum % 1 === 0 &&
        (testNum & (testNum - 1)) === 0 &&
        testNum !== 0);
}

/**
 * 最近的 2 的指数值
 * 无法用来处理小于 1 的数
 * @param  {Number} value
 * @return {Number}
 */
function nearestPowerIntegerOfTwo(value) {
    if (isNaN(value) || value === Infinity || value === -Infinity || value <= 1) {
        return 1;
    }
    let [upper, lower] = [2, 1];
    while (upper < value || lower > value) {
        [upper, lower] = [upper * 2, upper];
    }
    const dis1 = upper - value;
    const dis2 = value - lower;
    return dis1 >= dis2 ? lower : upper;
}

let seed = 1234567;
const PI2 = Math.PI * 2;
const kfRadius = 2;
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const fixed = (value, size) => Math.round(value * Math.pow(10, size)) / Math.pow(10, size);
// compute euclidian modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation
const euclideanModulo = (n, m) => ((n % m) + m) % m;
// Linear mapping from range <a1, a2> to range <b1, b2>
const mapLinear = (x, a1, a2, b1, b2) => b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
// https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
const inverseLerp = (x, y, value) => {
    if (x !== y) {
        return (value - x) / (y - x);
    }
    else {
        return 0;
    }
};
// https://en.wikipedia.org/wiki/Linear_interpolation
const lerp = (x, y, t) => (1 - t) * x + t * y;
// http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
const damp = (x, y, lambda, dt) => lerp(x, y, 1 - Math.exp(-lambda * dt));
// https://www.desmos.com/calculator/vcsjnyz7x4
const pingpong = (x, length = 1) => length - Math.abs(euclideanModulo(x, length * 2) - length);
// http://en.wikipedia.org/wiki/Smoothstep
const smoothstep = (x, min, max) => {
    if (x <= min) {
        return 0;
    }
    if (x >= max) {
        return 1;
    }
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
};
const smootherstep = (x, min, max) => {
    if (x <= min) {
        return 0;
    }
    if (x >= max) {
        return 1;
    }
    x = (x - min) / (max - min);
    return x * x * x * (x * (x * 6 - 15) + 10);
};
// Random integer from <low, high> interval
const randInt = (low, high) => low + Math.floor(Math.random() * (high - low + 1));
// Random float from <low, high> interval
const randFloat = (low, high) => low + Math.random() * (high - low);
// Random float from <-range/2, range/2> interval
const randFloatSpread = (range) => range * (0.5 - Math.random());
// Deterministic pseudo-random float in the interval [ 0, 1 ]
const seededRandom = (s) => {
    if (s !== undefined) {
        seed = s % 2147483647;
    }
    // Park-Miller algorithm
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
};
const degToRad = (degrees) => degrees * DEG2RAD;
const radToDeg = (radians) => radians * RAD2DEG;
const isPowerOfTwo = (value) => (value & (value - 1)) === 0 && value !== 0;
const ceilPowerOfTwo = (value) => Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
const floorPowerOfTwo = (value) => Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
/**
 * 最近的 2 的指数值
 * @param {number} value
 * @return {number}
 */
function nearestPowerOfTwo(value) {
    let n = Math.log(value) / Math.LN2;
    n = n % 1 > 0.9 ? Math.ceil(n) : Math.floor(n);
    return Math.pow(2, n);
}
function modByFloat(number, mod) {
    const left = number % mod;
    number -= left;
    if (Math.abs(left) >= mod / 2) {
        number += mod * Math.sign(number);
    }
    return number;
}
function isNumberArrayType(obj) {
    return typeof obj[0] === 'number';
}
function resetObjectByRatio(obj, ratio, isIn = true) {
    if (ratio === 1 || !obj) {
        return obj;
    }
    // obj[0] 是数字
    if (isNumberArrayType(obj)) {
        return obj.map((value, index) => isIn && index < 2 ? value * ratio : value / ratio);
    }
    // obj[0] 是字符串
    if (obj[0] === 'random') {
        const random = obj[1].map(n => isIn ? n * ratio : n / ratio);
        return ['random', random];
    }
    if (obj[0] === 'lines') {
        // lines [time, value];
        const lines = obj[1].map(v => [v[0], isIn ? v[1] * ratio : v[1] / ratio]);
        return ['lines', lines];
    }
    if (obj[0] === 'line') {
        // line [time, value];
        const line = obj[1].map(v => [v[0], isIn ? v[1] * ratio : v[1] / ratio]);
        return ['line', line];
    }
    if (obj[0] === 'curve') {
        // curve [time, value];
        const curve = obj[1].map(v => [v[0], isIn ? v[1] * ratio : v[1] / ratio, v[2], v[3]]);
        return ['curve', curve];
    }
    if (obj[0] === 'bezier') {
        const times = obj[1][0].map(time => [...time]);
        const positions = obj[1][1].map(p => (isIn
            ? [p[0] * ratio, p[1] * ratio, p[2]]
            : [p[0] / ratio, p[1] / ratio, p[2]]));
        const controls = obj[1][2].map(c => (isIn
            ? [c[0] * ratio, c[1] * ratio, c[2] * ratio]
            : [c[0] / ratio, c[1] / ratio, c[2] / ratio]));
        return ['bezier', [times, positions, controls]];
    }
    if (obj[0] === 'path') {
        const times = obj[1][0].map(time => [...time]);
        const positions = obj[1][1].map(p => (isIn
            ? [p[0] * ratio, p[1] * ratio, p[2]]
            : [p[0] / ratio, p[1] / ratio, p[2]]));
        return ['path', [times, positions]];
    }
    return [];
}
function resetPropertyByRatio(obj, ratio, isIn = true) {
    if (typeof obj === 'number') {
        return obj * ratio;
    }
    else {
        return resetObjectByRatio(obj, ratio, isIn);
    }
}

/**
 * @class 二维向量 | 二维点
 */
class Vec2 {
    /**
     * 构造函数，默认为二维零向量 | 二维原点
     * @param {number} [x=0] x分量,默认为0
     * @param {number} [y=0] y分量,默认为0
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * @static 复制二维向量
     * @param {Vec2} other 二维向量
     * @return {Vec2} 复制结果
     */
    static copy(other) {
        return new Vec2(other.x, other.y);
    }
    /**
     * @static 二维向量判等
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @return {boolean} 判等结果
     */
    static equal(a, b) {
        return a.x === b.x && a.y === b.y;
    }
    /**
     * @static 二维点x方向差值
     * @param {Vec2} a 二维点
     * @param {Vec2} b 二维点
     * @return {number} 差值
     */
    static distanceX(a, b) {
        return Math.abs(a.x - b.x);
    }
    /**
     * @static 二维点y方向差值
     * @param {Vec2} a 二维点
     * @param {Vec2} b 二维点
     * @return {number} 差值
     */
    static distanceY(a, b) {
        return Math.abs(a.y - b.y);
    }
    /**
     * @static 二维点求距离
     * @param {Vec2} a 二维点
     * @param {Vec2} b 二维点
     * @return {number} 距离
     */
    static distance(a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }
    /**
     * @static 二维向量求分轴最大值
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @return {Vec2} 求值结果
     */
    static max(a, b) {
        return new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }
    /**
     * @static 二维向量求分轴最小值
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @return {Vec2} 求值结果
     */
    static min(a, b) {
        return new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }
    /**
     * 二维向量求混合值
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @param {number} [ratio=0.5] 混合比例，默认为0.5
     * @return {Vec2} 求值结果
     */
    static mix(a, b, ratio) {
        ratio = ratio ? ratio : 0.5;
        return new Vec2(ratio * a.x + (1 - ratio) * b.x, ratio * a.y + (1 - ratio) * b.y);
    }
    static addVectors(a, b) {
        return new Vec2(a.x + b.x, a.y + b.y);
    }
    /**
     * @member {number} 宽度
     */
    get width() {
        return this.x;
    }
    set width(value) {
        this.x = value;
    }
    /**
     * @member {number} 高度
     */
    get height() {
        return this.y;
    }
    set height(value) {
        this.y = value;
    }
    /**
     * 设置二维向量
     * @param {number} x x轴分量
     * @param {number} [y=x] y轴分量，默认为x分量值
     * @return {Vec2}
     */
    set(x, y) {
        this.x = x;
        this.y = y === undefined ? x : y;
        return this;
    }
    /**
     * 设置x轴分量
     * @param {number} x x轴分量
     * @return {Vec2} 二维向量
     */
    setX(x) {
        this.x = x;
        return this;
    }
    /**
     * 设置Y轴分量
     * @param {number} y y轴分量
     * @return {Vec2} 二维向量
     */
    setY(y) {
        this.y = y;
        return this;
    }
    /**
     * 复制二维向量
     * @param {Vec2} v 二维向量
     * @return {Vec2} 复制结果
     */
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    /**
     * 克隆二维向量
     * @return {Vec2} 克隆结果
     */
    clone() {
        return new Vec2(this.x, this.y);
    }
    /**
     * 二维向量求和
     * @param {Vec2|number} v 二维向量 | 数字
     * @return {Vec2} 二维向量
     */
    add(v) {
        if (typeof v === 'number') {
            this.x += v;
            this.y += v;
        }
        else {
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
    addVectors(a, b) {
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
    addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        return this;
    }
    /**
     * 二维向量求差
     * @param {Vec2|number} v 二维向量 |  数字
     * @return {Vec2} 求差结果
     */
    sub(v) {
        if (typeof v === 'number') {
            this.x -= v;
            this.y -= v;
        }
        else {
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
    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }
    /**
     * 二维向量求乘
     * @param {Vec2|number} v 二维向量 | 数字
     * @return {Vec2} 求乘结果
     */
    multiply(v) {
        if (typeof v === 'number') {
            this.x *= v;
            this.y *= v;
        }
        else {
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
    divide(v) {
        if (typeof v === 'number') {
            this.x /= v;
            this.y /= v;
        }
        else {
            this.x /= v.x;
            this.y /= v.y;
        }
        return this;
    }
    /**
     * 二维向量取反
     * @return {Vec2} 取反结果
     */
    inverse() {
        return this.clone().multiply(-1);
    }
    /**
     * 二维向量矩阵变换
     * @param {Matrix3} m 变换矩阵
     * @return {Vec2} 变换结果
     */
    applyMatrix3(m) {
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
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    }
    /**
     * 二维向量求最大值
     * @param {Vec2} v 二维向量
     * @return {Vec2} 最大值
     */
    max(v) {
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
    clamp(min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        return this;
    }
    /**
     * 二维向量向下取整
     * @return {Vec2} 取整结果
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    /**
     * 二维向量向上取整
     * @return {Vec2} 取整结果
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    /**
     * 二维向量取四舍五入
     * @return {Vec2} 四舍五入结果
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    /**
     * 二维向量取反
     * @return {Vec2} 取反结果
     */
    negate() {
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
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    /**
     * 二维向量叉乘
     * @abstract 表示与this && v 向量所在平面垂直的向量
     * @param {Vec2} v 二维向量
     * @return {number} 叉乘结果
     */
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }
    /**
     * 二维向量长度平方
     * @abstract Math.sqrt的效率低于乘法，可以在运算中使用乘法结果与lengthSq的对比替代length与距离的对比
     * @return {number} 求值结果
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    /**
     * 二维向量长度
     * @return {number} 求值结果
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * 二维向量曼哈顿长度
     * @return {number} 求值结果
     */
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y);
    }
    /**
     * 二维向量归一化
     * @abstract 归一化向量可以用用作单位方向
     * @return {Vec2} 归一化结果
     */
    normalize() {
        if (this.length() !== 0) {
            return this.divide(this.length());
        }
        else {
            console.warn('divide value can not be zero');
            return this;
        }
    }
    /**
     * 二维向量与x轴夹角
     * @return {number} 弧度值
     */
    angle() {
        // computes the angle in radians with respect to the positive x-axis
        const angle = Math.atan2(-this.y, -this.x) + Math.PI;
        return angle;
    }
    /**
     * 二维向量夹角
     * @param {Vec2} other 二维向量
     * @return {number} 夹角
     */
    angleToVec2(other) {
        const cosValue = Math.min(Math.max(this.dot(other) / this.length() / other.length(), -1), 1);
        let angle = Math.acos(cosValue);
        angle = this.x * other.y - this.y * other.x > 0 ? angle : -angle;
        return angle;
    }
    /**
     * 二维向量this向二维向量other投影
     * @param {Vec2} other 二维向量
     * @return {Vec2} 投影值
     */
    projectionToVec2(other) {
        const angle = this.angleToVec2(other);
        return Vec2.copy(other).normalize().multiply(this.length() * Math.cos(angle));
    }
    /**
     * 二维向量视图转换
     * @param {number} width 视图宽度
     * @param {number} height 视图高度
     * @return {Vec2} 转换结果
     */
    toView(width, height) {
        this.x = ((this.x + 1) / 2) * width;
        this.y = (1 - (this.y + 1) / 2) * height;
        return this;
    }
    /**
     * 二维点距离平方
     * @param {Vec2} v 二维点
     * @return {number} 距离平方
     */
    distanceToSquared(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }
    /**
     * 二维点距离
     * @param {Vec2} v 二维点
     * @return {number} 距离
     */
    distanceTo(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * 二维点曼哈顿距离
     * @param {Vec2} v 二维点
     * @return {number} 曼哈顿距离
     */
    manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }
    /**
     * 根据长度修改二维向量
     * @param {number} length 长度值
     * @return {Vec2} 计算结果
     */
    setLength(length) {
        return this.normalize().multiply(length);
    }
    /**
     * 二维点(this与other)求线性插值
     * @param {Vec2} other 二维点
     * @param {number} alpha 插值比
     * @return {Vec2} 计算结果
     */
    lerp(other, alpha) {
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
    lerpVectors(v1, v2, alpha) {
        this.x = v1.x + (v2.x - v1.x) * alpha;
        this.y = v1.y + (v2.y - v1.y) * alpha;
        return this;
    }
    /**
     * 二维向量判等
     * @param {Vec2} v 二维向量
     * @return {boolean} 判等结果
     */
    equals(v) {
        return v.x === this.x && v.y === this.y;
    }
    /**
     * 由数组组装二维向量
     * @param {[x: number, y: number]} array 数组
     * @return {Vec2} 二维向量
     */
    fromArray(array) {
        [this.x, this.y] = array;
        return this;
    }
    /**
     * 二维向量转数组
     * @return {[x: number, y: number]} 数组
     */
    toArray() {
        return [this.x, this.y];
    }
    /**
     * 二维点绕点旋转
     * @param {Vec2} center 旋转中心
     * @param {number} angle 旋转角度
     * @return {Vec2} 旋转结果
     */
    rotateAround(center, angle) {
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
    random() {
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
    rotate(angle, center = new Vec2()) {
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
    verticalDistanceToLine(line) {
        const a = (line.end.y - line.start.y) / (line.end.x - line.start.x);
        const b = -1;
        const c = line.start.y - a * line.start.x;
        const v1 = new Vec2(this.x - line.start.x, this.y - line.start.y);
        const v2 = new Vec2(line.end.x - line.start.x, line.end.y - line.start.y);
        const angle = v1.angleToVec2(v2);
        if (angle > -Math.PI / 2 && angle < Math.PI / 2) {
            const dis = (a * this.x + b * this.y + c) / Math.sqrt(a * a + 1);
            return Math.abs(dis);
        }
        else {
            return -1;
        }
    }
    /**
     * 点到直线的最短距离
     * @return {{d: number, t: number}} d表示距离，t表示最近点在直线的比例
     */
    distanceToLine(line) {
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
    isZero() {
        return this.length() === 0;
    }
}

/**
 * @class 四维矩阵[三维空间变换矩阵 || 四维空间旋转缩放矩阵]
 */
class Matrix4 {
    /**
     * 构造函数，初始值为单位矩阵
     */
    constructor() {
        this.elements = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        if (arguments.length > 0) {
            console.error('THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.');
        }
    }
    /**
     * @static 克隆四维矩阵
     * @param {Matrix4} other 四维矩阵
     * @return {Matrix4} 克隆结果
     */
    static clone(other) {
        const result = new Matrix4();
        result.elements = [...other.elements];
        return result;
    }
    /**
     * @static 由透视相机基础参数设置投影矩阵
     * @param {number} near 近平面
     * @param {number} far 远平面
     * @param {number} fov 视角
     * @param {number} aspect 视窗比例
     * @param {number} clipMode 裁切模式, 0表示垂直裁切, 1表示水平裁切
     * @return {Matrix4} 投影矩阵
     */
    static makePerspective(near, far, fov, aspect, clipMode) {
        const ratio = clipMode ? aspect : 1;
        const matrix = new Matrix4();
        const te = matrix.elements;
        const f = 1.0 / Math.tan((fov * DEG2RAD) / 2) * ratio;
        const a = f / aspect;
        const b = -(near + far) / (far - near);
        const c = -2 * near * far / (far - near);
        te[0] = a;
        te[4] = 0;
        te[8] = 0;
        te[12] = 0;
        te[1] = 0;
        te[5] = f;
        te[9] = 0;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = b;
        te[14] = c;
        te[3] = 0;
        te[7] = 0;
        te[11] = -1;
        te[15] = 0;
        return matrix;
    }
    /**
     * 设置四维矩阵
     * @param {number} n00 矩阵[0, 0]值
     * @param {number} n01 矩阵[0, 1]值
     * @param {number} n02 矩阵[0, 2]值
     * @param {number} n03 矩阵[0, 3]值
     * @param {number} n10 矩阵[1, 0]值
     * @param {number} n11 矩阵[1, 1]值
     * @param {number} n12 矩阵[1, 2]值
     * @param {number} n13 矩阵[1, 2]值
     * @param {number} n20 矩阵[2, 0]值
     * @param {number} n21 矩阵[2, 1]值
     * @param {number} n22 矩阵[2, 2]值
     * @param {number} n23 矩阵[2, 3]值
     * @param {number} n30 矩阵[3, 0]值
     * @param {number} n32 矩阵[3, 1]值
     * @param {number} n32 矩阵[3, 2]值
     * @param {number} n33 矩阵[3, 3]值
     * @return {Matrix4} 四维矩阵
     */
    set(n00, n01, n02, n03, n10, n11, n12, n13, n20, n21, n22, n23, n30, n31, n32, n33) {
        const te = this.elements;
        te[0] = n00;
        te[4] = n01;
        te[8] = n02;
        te[12] = n03;
        te[1] = n10;
        te[5] = n11;
        te[9] = n12;
        te[13] = n13;
        te[2] = n20;
        te[6] = n21;
        te[10] = n22;
        te[14] = n23;
        te[3] = n30;
        te[7] = n31;
        te[11] = n32;
        te[15] = n33;
        return this;
    }
    /**
     * 四维矩阵单位化
     * @return {Matrix4} 单位矩阵
     */
    identity() {
        this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
    }
    /**
     * 四维矩阵单位判断
     * @return {boolean} 判断结果
     */
    isIdentity() {
        const te = this.elements;
        return te[0] === 1 && te[4] === 0 && te[8] === 0 && te[12] === 0
            && te[1] === 0 && te[5] === 1 && te[9] === 0 && te[13] === 0
            && te[2] === 0 && te[6] === 0 && te[10] === 1 && te[14] === 0
            && te[3] === 0 && te[7] === 0 && te[11] === 0 && te[15] === 1;
    }
    /**
     * 四维矩阵克隆
     * @return {Matrix4} 克隆结果
     */
    clone() {
        return new Matrix4().fromArray(this.elements);
    }
    /**
     * 四维矩阵复制
     * @param {Matrix4} m 复制对象
     * @return {Matrix4} 复制结果
     */
    copy(m) {
        const te = this.elements;
        const me = m.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        te[9] = me[9];
        te[10] = me[10];
        te[11] = me[11];
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        te[15] = me[15];
        return this;
    }
    /**
     * 四维矩阵位置信息复制
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 复制结果
     */
    copyPosition(m) {
        const te = this.elements;
        const me = m.elements;
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        return this;
    }
    /**
     * 由三维矩阵构建四维矩阵
     * @param {Matrix3} m 三维矩阵
     * @return {Matrix4} 构建结果
     */
    setFromMatrix3(m) {
        const me = m.elements;
        this.set(me[0], me[3], me[6], 0, me[1], me[4], me[7], 0, me[2], me[5], me[8], 0, 0, 0, 0, 1);
        return this;
    }
    /**
     * 导出四维矩阵[三维空间变换矩阵]分量
     * @param {Vec3} xAxis x轴分量
     * @param {Vec3} yAxis y轴分量
     * @param {Vec3} zAxis z轴分量
     * @return {Matrix4} 四维矩阵
     */
    extractBasis(xAxis, yAxis, zAxis) {
        xAxis.setFromMatrixColumn(this, 0);
        yAxis.setFromMatrixColumn(this, 1);
        zAxis.setFromMatrixColumn(this, 2);
        return this;
    }
    /**
     * 由分量构建四维矩阵[三维空间变换矩阵]
     * @param {Vec3} xAxis x轴分量
     * @param {Vec3} yAxis y轴分量
     * @param {Vec3} zAxis z轴分量
     * @return {Matrix4} 四维矩阵
     */
    makeBasis(xAxis, yAxis, zAxis) {
        this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1);
        return this;
    }
    /**
     * 导出四维矩阵[三维空间变换矩阵]旋转部分
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 导出结果
     */
    extractRotation(m) {
        // this method does not support reflection matrices
        const _v = new Vec3();
        const me = m.elements;
        const te = this.elements;
        const scaleX = 1 / _v.setFromMatrixColumn(m, 0).length();
        const scaleY = 1 / _v.setFromMatrixColumn(m, 1).length();
        const scaleZ = 1 / _v.setFromMatrixColumn(m, 2).length();
        te[0] = me[0] * scaleX;
        te[1] = me[1] * scaleX;
        te[2] = me[2] * scaleX;
        te[3] = 0;
        te[4] = me[4] * scaleY;
        te[5] = me[5] * scaleY;
        te[6] = me[6] * scaleY;
        te[7] = 0;
        te[8] = me[8] * scaleZ;
        te[9] = me[9] * scaleZ;
        te[10] = me[10] * scaleZ;
        te[11] = 0;
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;
        return this;
    }
    /**
     * 由欧拉角设置四维矩阵
     * @param {Euler} euler 欧拉角
     * @return {Matrix4} 四维矩阵
     */
    makeRotationFromEuler(euler) {
        const te = this.elements;
        const x = euler.x;
        const y = euler.y;
        const z = euler.z;
        const a = Math.cos(x);
        const b = Math.sin(x);
        const c = Math.cos(y);
        const d = Math.sin(y);
        const e = Math.cos(z);
        const f = Math.sin(z);
        if (euler.order === EulerOrder.XYZ) {
            const ae = a * e;
            const af = a * f;
            const be = b * e;
            const bf = b * f;
            te[0] = c * e;
            te[4] = -c * f;
            te[8] = d;
            te[1] = af + be * d;
            te[5] = ae - bf * d;
            te[9] = -b * c;
            te[2] = bf - ae * d;
            te[6] = be + af * d;
            te[10] = a * c;
        }
        else if (euler.order === EulerOrder.YXZ) {
            const ce = c * e;
            const cf = c * f;
            const de = d * e;
            const df = d * f;
            te[0] = ce + df * b;
            te[4] = de * b - cf;
            te[8] = a * d;
            te[1] = a * f;
            te[5] = a * e;
            te[9] = -b;
            te[2] = cf * b - de;
            te[6] = df + ce * b;
            te[10] = a * c;
        }
        else if (euler.order === EulerOrder.ZXY) {
            const ce = c * e;
            const cf = c * f;
            const de = d * e;
            const df = d * f;
            te[0] = ce - df * b;
            te[4] = -a * f;
            te[8] = de + cf * b;
            te[1] = cf + de * b;
            te[5] = a * e;
            te[9] = df - ce * b;
            te[2] = -a * d;
            te[6] = b;
            te[10] = a * c;
        }
        else if (euler.order === EulerOrder.ZYX) {
            const ae = a * e;
            const af = a * f;
            const be = b * e;
            const bf = b * f;
            te[0] = c * e;
            te[4] = be * d - af;
            te[8] = ae * d + bf;
            te[1] = c * f;
            te[5] = bf * d + ae;
            te[9] = af * d - be;
            te[2] = -d;
            te[6] = b * c;
            te[10] = a * c;
        }
        else if (euler.order === EulerOrder.YZX) {
            const ac = a * c;
            const ad = a * d;
            const bc = b * c;
            const bd = b * d;
            te[0] = c * e;
            te[4] = bd - ac * f;
            te[8] = bc * f + ad;
            te[1] = f;
            te[5] = a * e;
            te[9] = -b * e;
            te[2] = -d * e;
            te[6] = ad * f + bc;
            te[10] = ac - bd * f;
        }
        else if (euler.order === EulerOrder.XZY) {
            const ac = a * c;
            const ad = a * d;
            const bc = b * c;
            const bd = b * d;
            te[0] = c * e;
            te[4] = -f;
            te[8] = d * e;
            te[1] = ac * f + bd;
            te[5] = a * e;
            te[9] = ad * f - bc;
            te[2] = bc * f - ad;
            te[6] = b * e;
            te[10] = bd * f + ac;
        }
        // bottom row
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        // last column
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;
        return this;
    }
    /**
     * 由四元数这是四维矩阵
     * @param {Quaternion} q 四元数
     * @return {Matrix4} 四维矩阵
     */
    makeRotationFromQuaternion(q) {
        return this.compose(new Vec3(), q, new Vec3());
    }
    /**
     * 由相机位置与目标位置以及向上方向设置四维矩阵[相机视图矩阵]
     * @param {Vec3} eye 相机位置
     * @param {Vec3} target 目标位置
     * @param {Vec3} up 相机方向
     * @return {Matrix4} 四维矩阵[相机视图矩阵]
     */
    lookAt(eye, target, up) {
        const a = new Vec3();
        const b = new Vec3();
        const c = new Vec3();
        const te = this.elements;
        c.subVectors(eye, target);
        if (c.lengthSq() === 0) {
            // eye and target are in the same position
            c.z = 1;
        }
        c.normalize();
        a.crossVectors(up, c);
        if (a.lengthSq() === 0) {
            // up and z are parallel
            if (Math.abs(up.z) === 1) {
                c.x += 0.0001;
            }
            else {
                c.z += 0.0001;
            }
            c.normalize();
            a.crossVectors(up, c);
        }
        a.normalize();
        b.crossVectors(c, a);
        te[0] = a.x;
        te[4] = b.x;
        te[8] = c.x;
        te[1] = a.y;
        te[5] = b.y;
        te[9] = c.y;
        te[2] = a.z;
        te[6] = b.z;
        te[10] = c.z;
        return this;
    }
    /**
     * 四维矩阵右乘
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 右乘结果
     */
    multiply(m) {
        return this.multiplyMatrices(this, m);
    }
    /**
     * 四维矩阵左乘
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix4} 左乘结果
     */
    premultiply(m) {
        return this.multiplyMatrices(m, this);
    }
    /**
     * 四维矩阵相乘(a * b)
     * @param {Matrix4} a 四维矩阵
     * @param {Matrix4} b 四维矩阵
     * @return {Matrix4} 相乘结果
     */
    multiplyMatrices(a, b) {
        const ae = a.elements;
        const be = b.elements;
        const te = this.elements;
        const a11 = ae[0];
        const a12 = ae[4];
        const a13 = ae[8];
        const a14 = ae[12];
        const a21 = ae[1];
        const a22 = ae[5];
        const a23 = ae[9];
        const a24 = ae[13];
        const a31 = ae[2];
        const a32 = ae[6];
        const a33 = ae[10];
        const a34 = ae[14];
        const a41 = ae[3];
        const a42 = ae[7];
        const a43 = ae[11];
        const a44 = ae[15];
        const b11 = be[0];
        const b12 = be[4];
        const b13 = be[8];
        const b14 = be[12];
        const b21 = be[1];
        const b22 = be[5];
        const b23 = be[9];
        const b24 = be[13];
        const b31 = be[2];
        const b32 = be[6];
        const b33 = be[10];
        const b34 = be[14];
        const b41 = be[3];
        const b42 = be[7];
        const b43 = be[11];
        const b44 = be[15];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return this;
    }
    /**
     * 四维矩阵缩放
     * @param {number} s 缩放比例
     * @return {Matrix4} 缩放结果
     */
    multiplyScalar(s) {
        const te = this.elements;
        te[0] *= s;
        te[4] *= s;
        te[8] *= s;
        te[12] *= s;
        te[1] *= s;
        te[5] *= s;
        te[9] *= s;
        te[13] *= s;
        te[2] *= s;
        te[6] *= s;
        te[10] *= s;
        te[14] *= s;
        te[3] *= s;
        te[7] *= s;
        te[11] *= s;
        te[15] *= s;
        return this;
    }
    /**
     * 四维矩阵求行列式值
     * @return {number} 行列式值
     */
    determinant() {
        const te = this.elements;
        const n11 = te[0];
        const n12 = te[4];
        const n13 = te[8];
        const n14 = te[12];
        const n21 = te[1];
        const n22 = te[5];
        const n23 = te[9];
        const n24 = te[13];
        const n31 = te[2];
        const n32 = te[6];
        const n33 = te[10];
        const n34 = te[14];
        const n41 = te[3];
        const n42 = te[7];
        const n43 = te[11];
        const n44 = te[15];
        return (n41 * (+n14 * n23 * n32
            - n13 * n24 * n32
            - n14 * n22 * n33
            + n12 * n24 * n33
            + n13 * n22 * n34
            - n12 * n23 * n34) +
            n42 * (+n11 * n23 * n34
                - n11 * n24 * n33
                + n14 * n21 * n33
                - n13 * n21 * n34
                + n13 * n24 * n31
                - n14 * n23 * n31) +
            n43 * (+n11 * n24 * n32
                - n11 * n22 * n34
                - n14 * n21 * n32
                + n12 * n21 * n34
                + n14 * n22 * n31
                - n12 * n24 * n31) +
            n44 * (-n13 * n22 * n31
                - n11 * n23 * n32
                + n11 * n22 * n33
                + n13 * n21 * n32
                - n12 * n21 * n33
                + n12 * n23 * n31));
    }
    /**
     * 四维矩阵转置
     * @return {Matrix4} 转置结果
     */
    transpose() {
        const te = this.elements;
        let tmp;
        tmp = te[1];
        te[1] = te[4];
        te[4] = tmp;
        tmp = te[2];
        te[2] = te[8];
        te[8] = tmp;
        tmp = te[6];
        te[6] = te[9];
        te[9] = tmp;
        tmp = te[3];
        te[3] = te[12];
        te[12] = tmp;
        tmp = te[7];
        te[7] = te[13];
        te[13] = tmp;
        tmp = te[11];
        te[11] = te[14];
        te[14] = tmp;
        return this;
    }
    /**
     * 设置四维矩阵[三维空间变换矩阵]位置信息
     * @param {number|Vec3} x 位置信息
     * @param {number} [y=x] y轴位置信息
     * @param {number} [z=x] z轴位置信息
     * @return {Matrix4}
     */
    setPosition(x, y, z) {
        const te = this.elements;
        if (x instanceof Vec3) {
            te[12] = x.x;
            te[13] = x.y;
            te[14] = x.z;
        }
        else {
            te[12] = x;
            te[13] = y ? y : x;
            te[14] = z ? z : x;
        }
        return this;
    }
    /**
     * 四维矩阵求逆
     * @return {Matrix4} 逆矩阵
     */
    invert() {
        // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
        const te = this.elements;
        const n11 = te[0];
        const n21 = te[1];
        const n31 = te[2];
        const n41 = te[3];
        const n12 = te[4];
        const n22 = te[5];
        const n32 = te[6];
        const n42 = te[7];
        const n13 = te[8];
        const n23 = te[9];
        const n33 = te[10];
        const n43 = te[11];
        const n14 = te[12];
        const n24 = te[13];
        const n34 = te[14];
        const n44 = te[15];
        const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
        const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
        const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
        const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
        const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
        if (det === 0) {
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
        const detInv = 1 / det;
        te[0] = t11 * detInv;
        te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
        te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
        te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
        te[4] = t12 * detInv;
        te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
        te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
        te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
        te[8] = t13 * detInv;
        te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
        te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
        te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
        te[12] = t14 * detInv;
        te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
        te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
        te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
        return this;
    }
    /**
     * 四维矩阵[三维空间变换矩阵]分轴缩放
     * @param {Vec3} v 分轴缩放向量
     * @return {Matrix4} 缩放结果
     */
    scale(v) {
        const te = this.elements;
        te[0] *= v.x;
        te[4] *= v.y;
        te[8] *= v.z;
        te[1] *= v.x;
        te[5] *= v.y;
        te[9] *= v.z;
        te[2] *= v.x;
        te[6] *= v.y;
        te[10] *= v.z;
        te[3] *= v.x;
        te[7] *= v.y;
        te[11] *= v.z;
        return this;
    }
    /**
     * 获取四维矩阵[三维空间变换矩阵]分轴缩放最大值
     * @return {number} 计算结果
     */
    getMaxScaleOnAxis() {
        const te = this.elements;
        const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
        const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
        const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
        return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
    }
    /**
     * 根据三维空间位移信息设置四维矩阵
     * @param {number} x x轴坐标信息
     * @param {number} y y轴坐标信息
     * @param {number} z z轴坐标信息
     * @return {Matrix4} 四维矩阵
     */
    makeTranslation(x, y, z) {
        this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
        return this;
    }
    /**
     * 根据x轴旋转信息设置四维矩阵
     * @param {number} theta x轴旋转弧度
     * @return {Matrix4} 四维矩阵
     */
    makeRotationX(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
        return this;
    }
    /**
     * 根据y轴旋转信息设置四维矩阵
     * @param {number} theta y轴旋转弧度
     * @return {Matrix4} 四维矩阵
     */
    makeRotationY(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
        return this;
    }
    /**
     * 根据z轴旋转信息设置四维矩阵
     * @param {number} theta z轴旋转弧度
     * @return {Matrix4} 四维矩阵
     */
    makeRotationZ(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
    }
    /**
     * 根据三维旋转轴与弧度设置四维矩阵
     * @param {Vec3} axis 三维旋转轴
     * @param {number} angle 旋转弧度
     * @return {Matrix4} 四维矩阵
     */
    makeRotationAxis(axis, angle) {
        // Based on http://www.gamedev.net/reference/articles/article1199.asp
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const t = 1 - c;
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;
        const tx = t * x;
        const ty = t * y;
        this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        return this;
    }
    /**
     * 根据缩放比例设置四维矩阵
     * @param {number} x 缩放比例
     * @param {number} [y=x] y方向缩放比例
     * @param {number} [z=x] z方向缩放比例
     * @return {Matrix4}
     */
    makeScale(x, y, z) {
        if (y === undefined || z === undefined) {
            this.set(x, 0, 0, 0, 0, x, 0, 0, 0, 0, x, 0, 0, 0, 0, 1);
        }
        else {
            this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
        }
        return this;
    }
    /**
     * 设置倾斜矩阵
     * @param {number} x x方向倾斜分量
     * @param {number} y y方向倾斜分量
     * @param {number} z z方向倾斜分量
     * @return {Matrix4} 倾斜矩阵
     */
    makeShear(x, y, z) {
        this.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);
        return this;
    }
    /**
     * 根据基础信息组装四维矩阵
     * @param {Vec3} position 位置信息
     * @param {Euler|Quaternion} rotation 旋转信息
     * @param {Vec3} scale 缩放信息
     * @return {Matrix4} 四维矩阵
     */
    compose(position, rotation, scale) {
        const te = this.elements;
        if (rotation instanceof Euler || rotation instanceof Quaternion) {
            const quaternion = rotation instanceof Euler ? new Quaternion().setFromEuler(rotation) : rotation;
            const x = quaternion.x;
            const y = quaternion.y;
            const z = quaternion.z;
            const w = quaternion.w;
            const x2 = x + x;
            const y2 = y + y;
            const z2 = z + z;
            const xx = x * x2;
            const xy = x * y2;
            const xz = x * z2;
            const yy = y * y2;
            const yz = y * z2;
            const zz = z * z2;
            const wx = w * x2;
            const wy = w * y2;
            const wz = w * z2;
            const sx = scale.x;
            const sy = scale.y;
            const sz = scale.z;
            te[0] = (1 - (yy + zz)) * sx;
            te[1] = (xy + wz) * sx;
            te[2] = (xz - wy) * sx;
            te[3] = 0;
            te[4] = (xy - wz) * sy;
            te[5] = (1 - (xx + zz)) * sy;
            te[6] = (yz + wx) * sy;
            te[7] = 0;
            te[8] = (xz + wy) * sz;
            te[9] = (yz - wx) * sz;
            te[10] = (1 - (xx + yy)) * sz;
            te[11] = 0;
            te[12] = position.x;
            te[13] = position.y;
            te[14] = position.z;
            te[15] = 1;
            return this;
        }
        else {
            console.warn('Type of rotation can not be other type beside Euler or Quaternion.');
            return new Matrix4();
        }
    }
    /**
     * 四维矩阵拆分为基础信息
     * @param {Vec3} position 位置信息
     * @param {Quaternion} quaternion 旋转信息
     * @param {Vec3} scale 缩放信息
     * @returns 四维矩阵
     */
    decompose(position, quaternion, scale) {
        const v = new Vec3();
        const m = new Matrix4();
        const te = this.elements;
        let sx = v.set(te[0], te[1], te[2]).length();
        const sy = v.set(te[4], te[5], te[6]).length();
        const sz = v.set(te[8], te[9], te[10]).length();
        // if determine is negative, we need to invert one scale
        const det = this.determinant();
        if (det < 0) {
            sx = -sx;
        }
        position.x = te[12];
        position.y = te[13];
        position.z = te[14];
        // scale the rotation part
        m.copy(this);
        const invSX = 1 / sx;
        const invSY = 1 / sy;
        const invSZ = 1 / sz;
        m.elements[0] *= invSX;
        m.elements[1] *= invSX;
        m.elements[2] *= invSX;
        m.elements[4] *= invSY;
        m.elements[5] *= invSY;
        m.elements[6] *= invSY;
        m.elements[8] *= invSZ;
        m.elements[9] *= invSZ;
        m.elements[10] *= invSZ;
        quaternion.setFromRotationMatrix(m);
        scale.x = sx;
        scale.y = sy;
        scale.z = sz;
        return this;
    }
    /**
     * 根据视窗信息设置透视相机投影矩阵
     * @param {number} left 视窗左平面位置
     * @param {number} right 视窗右平面位置
     * @param {number} top 视窗上平面位置
     * @param {number} bottom 视窗下平面位置
     * @param {number} near 视窗近平面位置
     * @param {number} far 视窗远平面位置
     * @return {Matrix4} 四维矩阵
     */
    makePerspective(left, right, top, bottom, near, far) {
        const te = this.elements;
        const x = 2 * near / (right - left);
        const y = 2 * near / (top - bottom);
        const a = (right + left) / (right - left);
        const b = (top + bottom) / (top - bottom);
        const c = -(far + near) / (far - near);
        const d = -2 * far * near / (far - near);
        te[0] = x;
        te[4] = 0;
        te[8] = a;
        te[12] = 0;
        te[1] = 0;
        te[5] = y;
        te[9] = b;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = c;
        te[14] = d;
        te[3] = 0;
        te[7] = 0;
        te[11] = -1;
        te[15] = 0;
        return this;
    }
    /**
     * 根据视窗信息设置正交相机投影矩阵
     * @param {number} left 视窗左平面位置
     * @param {number} right 视窗右平面位置
     * @param {number} top 视窗上平面位置
     * @param {number} bottom 视窗下平面位置
     * @param {number} near 视窗近平面位置
     * @param {number} far 视窗远平面位置
     * @return {Matrix4} 四维矩阵
     */
    makeOrthographic(left, right, top, bottom, near, far) {
        const te = this.elements;
        const w = 1.0 / (right - left);
        const h = 1.0 / (top - bottom);
        const p = 1.0 / (far - near);
        const x = (right + left) * w;
        const y = (top + bottom) * h;
        const z = (far + near) * p;
        te[0] = 2 * w;
        te[4] = 0;
        te[8] = 0;
        te[12] = -x;
        te[1] = 0;
        te[5] = 2 * h;
        te[9] = 0;
        te[13] = -y;
        te[2] = 0;
        te[6] = 0;
        te[10] = -2 * p;
        te[14] = -z;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;
        return this;
    }
    /**
     * 四维矩阵判等
     * @param {Matrix4} matrix 四维矩阵
     * @return {boolean} 判等结果
     */
    equals(matrix) {
        const te = this.elements;
        const me = matrix.elements;
        for (let i = 0; i < 16; i++) {
            if (te[i] !== me[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * 由数组设置四维矩阵
     * @param {number[]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Matrix4} 四维矩阵
     */
    fromArray(array, offset = 0) {
        for (let i = 0; i < 16; i++) {
            this.elements[i] = array[i + offset];
        }
        return this;
    }
    /**
     * 四维矩阵转数组
     * @param {number[]} [array=[]] 结果保存对象
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 四维矩阵
     */
    toArray(array = [], offset = 0) {
        const te = this.elements;
        array[offset] = te[0];
        array[offset + 1] = te[1];
        array[offset + 2] = te[2];
        array[offset + 3] = te[3];
        array[offset + 4] = te[4];
        array[offset + 5] = te[5];
        array[offset + 6] = te[6];
        array[offset + 7] = te[7];
        array[offset + 8] = te[8];
        array[offset + 9] = te[9];
        array[offset + 10] = te[10];
        array[offset + 11] = te[11];
        array[offset + 12] = te[12];
        array[offset + 13] = te[13];
        array[offset + 14] = te[14];
        array[offset + 15] = te[15];
        return array;
    }
}

// 欧拉角顺序
var EulerOrder;
(function (EulerOrder) {
    EulerOrder[EulerOrder["XYZ"] = 0] = "XYZ";
    EulerOrder[EulerOrder["XZY"] = 1] = "XZY";
    EulerOrder[EulerOrder["YXZ"] = 2] = "YXZ";
    EulerOrder[EulerOrder["YZX"] = 3] = "YZX";
    EulerOrder[EulerOrder["ZXY"] = 4] = "ZXY";
    EulerOrder[EulerOrder["ZYX"] = 5] = "ZYX";
})(EulerOrder || (EulerOrder = {}));
/**
 * @class 欧拉角
 */
class Euler {
    /**
     * 构造函数,传入值为x, y, z方向分量以及欧拉角计算顺序
     * @param {number} x x方向分量
     * @param {number} y y方向分量
     * @param {number} z z方向分量
     * @param {EulerOrder} order 欧拉角顺序，默认为XYZ顺序
     */
    constructor(x = 0, y = 0, z = 0, order = EulerOrder.XYZ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.order = order;
    }
    /**
     * 设置欧拉角
     * @param {number} x x方向分量
     * @param {number} y y方向分量
     * @param {number} z z方向分量
     * @param {EulerOrder} [order='XYZ'] 欧拉角顺序，默认为XYZ顺序
     * @return {Euler}
     */
    set(x, y, z, order = EulerOrder.XYZ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.order = order;
        this.onChangeCallback();
        return this;
    }
    /**
     * 克隆欧拉角
     * @return {Euler} 克隆结果
     */
    clone() {
        return new Euler(this.x, this.y, this.z, this.order);
    }
    /**
     * 复制欧拉角
     * @param {Euler} euler 复制对象
     * @return {Euler} 复制结果
     */
    copy(euler) {
        this.x = euler.x;
        this.y = euler.y;
        this.z = euler.z;
        this.order = euler.order;
        this.onChangeCallback();
        return this;
    }
    /**
     * 有三维空间矩阵设置欧拉角
     * @param {Matrix4} m 三维空间矩阵
     * @param {EulerOrder} [order='XYZ'] 欧拉角顺序
     * @param {boolean} [update=true] 允许设置回调函数
     * @return {Euler} 构建结果
     */
    setFromRotationMatrix(m, order = EulerOrder.XYZ, update = true) {
        const te = m.elements;
        const m11 = te[0];
        const m12 = te[4];
        const m13 = te[8];
        const m21 = te[1];
        const m22 = te[5];
        const m23 = te[9];
        const m31 = te[2];
        const m32 = te[6];
        const m33 = te[10];
        order = order || this.order;
        switch (order) {
            case EulerOrder.XYZ:
                this.y = Math.asin(clamp(m13, -1, 1));
                if (Math.abs(m13) < 0.9999999) {
                    this.x = Math.atan2(-m23, m33);
                    this.z = Math.atan2(-m12, m11);
                }
                else {
                    this.x = Math.atan2(m32, m22);
                    this.z = 0;
                }
                break;
            case EulerOrder.YXZ:
                this.x = Math.asin(-clamp(m23, -1, 1));
                if (Math.abs(m23) < 0.9999999) {
                    this.y = Math.atan2(m13, m33);
                    this.z = Math.atan2(m21, m22);
                }
                else {
                    this.y = Math.atan2(-m31, m11);
                    this.z = 0;
                }
                break;
            case EulerOrder.ZXY:
                this.x = Math.asin(clamp(m32, -1, 1));
                if (Math.abs(m32) < 0.9999999) {
                    this.y = Math.atan2(-m31, m33);
                    this.z = Math.atan2(-m12, m22);
                }
                else {
                    this.y = 0;
                    this.z = Math.atan2(m21, m11);
                }
                break;
            case EulerOrder.ZYX:
                this.y = Math.asin(-clamp(m31, -1, 1));
                if (Math.abs(m31) < 0.9999999) {
                    this.x = Math.atan2(m32, m33);
                    this.z = Math.atan2(m21, m11);
                }
                else {
                    this.x = 0;
                    this.z = Math.atan2(-m12, m22);
                }
                break;
            case EulerOrder.YZX:
                this.z = Math.asin(clamp(m21, -1, 1));
                if (Math.abs(m21) < 0.9999999) {
                    this.x = Math.atan2(-m23, m22);
                    this.y = Math.atan2(-m31, m11);
                }
                else {
                    this.x = 0;
                    this.y = Math.atan2(m13, m33);
                }
                break;
            case EulerOrder.XZY:
                this.z = Math.asin(-clamp(m12, -1, 1));
                if (Math.abs(m12) < 0.9999999) {
                    this.x = Math.atan2(m32, m22);
                    this.y = Math.atan2(m13, m11);
                }
                else {
                    this.x = Math.atan2(-m23, m33);
                    this.y = 0;
                }
                break;
            default:
                console.warn('THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ' + order);
        }
        this.order = order;
        if (update !== false) {
            this.onChangeCallback();
        }
        return this;
    }
    /**
     * 由四元数构建欧拉角
     * @param {Quaternion} q 四元数
     * @param {EulerOrder} [order='XYZ'] 欧拉角顺序，默认为XYZ
     * @param {boolean} [update=true] 允许设置回调函数
     * @return {Euler} 构建结果
     */
    setFromQuaternion(q, order = EulerOrder.XYZ, update = true) {
        const matrix = new Matrix4();
        matrix.makeRotationFromQuaternion(q);
        return this.setFromRotationMatrix(matrix, order, update);
    }
    /**
     * 有三维向量构建欧拉角
     * @param {Vec3} v 三维向量
     * @param {EulerOrder} [order] 欧拉角顺序，默认为XYZ
     * @return {Euler} 欧拉角
     */
    setFromVector3(v, order) {
        return this.set(v.x, v.y, v.z, order || this.order);
    }
    /**
     * 修改欧拉角顺序
     * @param {EulerOrder} newOrder 欧拉角顺序
     * @return {Euler} 修改结果
     */
    reorder(newOrder) {
        const quaternion = new Quaternion();
        quaternion.setFromEuler(this);
        return this.setFromQuaternion(quaternion, newOrder);
    }
    /**
     * 欧拉角判等
     * @param {Euler} euler 欧拉角
     * @return {boolean} 判等结果
     */
    equals(euler) {
        return euler.x === this.x
            && euler.y === this.y
            && euler.z === this.z
            && euler.order === this.order;
    }
    /**
     * 由数组构建欧拉角
     * @param {number[]} array 数组
     * @return {Euler} 构建结果
     */
    fromArray(array) {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
        if (array[3] !== undefined) {
            this.order = array[3];
        }
        this.onChangeCallback();
        return this;
    }
    /**
     * 欧拉角保存于数组(应用于计算)
     * @param {number[]} [array=[]] 目标保存对象
     * @param {number} [offset=0] 起始偏移值
     * @return {number[]} 保存结果
     */
    toArray(array = [], offset = 0) {
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        array[offset + 3] = this.order;
        return array;
    }
    /**
     * 欧拉角保存于三维向量(应用于计算)
     * @param {Vec3} [optionalResult] 目标保存对象
     * @return {Vec3} 保存结果
     */
    toVector3(optionalResult) {
        if (optionalResult) {
            return optionalResult.set(this.x, this.y, this.z);
        }
        else {
            return new Vec3(this.x, this.y, this.z);
        }
    }
    /**
     * 欧拉角变更回调函数
     * @param {function} callback 回调函数
     * @return {Euler} 欧拉角
     */
    onChange(callback) {
        this.onChangeCallback = callback;
        return this;
    }
    onChangeCallback() { }
}

/**
 * @class 四元数
 */
class Quaternion {
    /**
     * 四元数构造函数，默认为单位值
     * @param {number} [x=0] x分量
     * @param {number} [y=0] y分量
     * @param {number} [z=0] z分量
     * @param {number} [w=1] w分量
     */
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /**
     * 设置四元数的值
     * @param {number} x x分量
     * @param {number} y y分量
     * @param {number} z z分量
     * @param {number} w w分量
     * @return {Quaternion} 四元数
     */
    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.onChangeCallback();
        return this;
    }
    /**
     * 四元数克隆
     * @return {Quaternion} 克隆结果
     */
    clone() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }
    /**
     * 深拷贝四元数
     * @param {Quaternion} quaternion
     * @return {Quaternion}
     */
    copy(quaternion) {
        this.x = quaternion.x;
        this.y = quaternion.y;
        this.z = quaternion.z;
        this.w = quaternion.w;
        this.onChangeCallback();
        return this;
    }
    /**
     * 由欧拉角设置四元数
     * @param {Euler} euler 欧拉角
     * @param {boolean} [update] 是否触发回调
     * @return {Quaternion} 四元数
     */
    setFromEuler(euler, update) {
        const cos = Math.cos;
        const sin = Math.sin;
        const c1 = cos(euler.x / 2);
        const c2 = cos(euler.y / 2);
        const c3 = cos(euler.z / 2);
        const s1 = sin(euler.x / 2);
        const s2 = sin(euler.y / 2);
        const s3 = sin(euler.z / 2);
        switch (euler.order) {
            case EulerOrder.XYZ:
                this.x = s1 * c2 * c3 + c1 * s2 * s3;
                this.y = c1 * s2 * c3 - s1 * c2 * s3;
                this.z = c1 * c2 * s3 + s1 * s2 * c3;
                this.w = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case EulerOrder.YXZ:
                this.x = s1 * c2 * c3 + c1 * s2 * s3;
                this.y = c1 * s2 * c3 - s1 * c2 * s3;
                this.z = c1 * c2 * s3 - s1 * s2 * c3;
                this.w = c1 * c2 * c3 + s1 * s2 * s3;
                break;
            case EulerOrder.ZXY:
                this.x = s1 * c2 * c3 - c1 * s2 * s3;
                this.y = c1 * s2 * c3 + s1 * c2 * s3;
                this.z = c1 * c2 * s3 + s1 * s2 * c3;
                this.w = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case EulerOrder.ZYX:
                this.x = s1 * c2 * c3 - c1 * s2 * s3;
                this.y = c1 * s2 * c3 + s1 * c2 * s3;
                this.z = c1 * c2 * s3 - s1 * s2 * c3;
                this.w = c1 * c2 * c3 + s1 * s2 * s3;
                break;
            case EulerOrder.YZX:
                this.x = s1 * c2 * c3 + c1 * s2 * s3;
                this.y = c1 * s2 * c3 + s1 * c2 * s3;
                this.z = c1 * c2 * s3 - s1 * s2 * c3;
                this.w = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case EulerOrder.XZY:
                this.x = s1 * c2 * c3 - c1 * s2 * s3;
                this.y = c1 * s2 * c3 - s1 * c2 * s3;
                this.z = c1 * c2 * s3 + s1 * s2 * c3;
                this.w = c1 * c2 * c3 + s1 * s2 * s3;
                break;
            default:
                console.warn('THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + euler.order);
        }
        if (update !== false) {
            this.onChangeCallback();
        }
        return this;
    }
    /**
     * 由旋转轴和旋转角度设置四元数
     * @param {Vec3} axis 旋转轴
     * @param {number} angle 旋转角
     * @return {Quaternion} 四元数
     */
    setFromAxisAngle(axis, angle) {
        const halfAngle = angle / 2;
        const s = Math.sin(halfAngle);
        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = Math.cos(halfAngle);
        this.onChangeCallback();
        return this;
    }
    /**
     * 由空间变换矩阵设置四元数
     * @param {Matrix4} m 四维矩阵
     * @return {Quaternion} 四元数
     */
    setFromRotationMatrix(m) {
        const te = m.elements;
        const m11 = te[0];
        const m12 = te[4];
        const m13 = te[8];
        const m21 = te[1];
        const m22 = te[5];
        const m23 = te[9];
        const m31 = te[2];
        const m32 = te[6];
        const m33 = te[10];
        const trace = m11 + m22 + m33;
        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);
            this.w = 0.25 / s;
            this.x = (m32 - m23) * s;
            this.y = (m13 - m31) * s;
            this.z = (m21 - m12) * s;
        }
        else if (m11 > m22 && m11 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
            this.w = (m32 - m23) / s;
            this.x = 0.25 * s;
            this.y = (m12 + m21) / s;
            this.z = (m13 + m31) / s;
        }
        else if (m22 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
            this.w = (m13 - m31) / s;
            this.x = (m12 + m21) / s;
            this.y = 0.25 * s;
            this.z = (m23 + m32) / s;
        }
        else {
            const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
            this.w = (m21 - m12) / s;
            this.x = (m13 + m31) / s;
            this.y = (m23 + m32) / s;
            this.z = 0.25 * s;
        }
        this.onChangeCallback();
        return this;
    }
    setFromUnitVectors(vFrom, vTo) {
        // assumes direction vectors vFrom and vTo are normalized
        let r = vFrom.dot(vTo) + 1;
        if (r < Number.EPSILON) {
            r = 0;
            if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                this.x = -vFrom.y;
                this.y = vFrom.x;
                this.z = 0;
                this.w = r;
            }
            else {
                this.x = 0;
                this.y = -vFrom.z;
                this.z = vFrom.y;
                this.w = r;
            }
        }
        else {
            // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
            this.x = vFrom.y * vTo.z - vFrom.z * vTo.y;
            this.y = vFrom.z * vTo.x - vFrom.x * vTo.z;
            this.z = vFrom.x * vTo.y - vFrom.y * vTo.x;
            this.w = r;
        }
        return this.normalize();
    }
    /**
     * 与四元数other之间的夹角
     * @param {Quaternion} other 四元数
     * @return {number} 夹角
     */
    angleTo(other) {
        return 2 * Math.acos(Math.abs(clamp(this.dot(other), -1, 1)));
    }
    // TODO
    /**
     * 四元数向目标旋转
     * @param {Quaternion} q 四元数
     * @param {number} step 旋转弧度
     * @return {Quaternion} 目标四元数
     */
    rotateTowards(q, step) {
        const angle = this.angleTo(q);
        if (angle === 0) {
            return this;
        }
        const t = Math.min(1, step / angle);
        this.slerp(q, t);
        return this;
    }
    /**
     * 四元数单位化
     * @return {Quaternion} 单位四元数
     */
    identity() {
        return this.set(0, 0, 0, 1);
    }
    /**
     * 四元数求逆
     * @return {Quaternion} 四元数的逆
     */
    invert() {
        // quaternion is assumed to have unit length
        return this.conjugate();
    }
    /**
     * 四元数求共轭值
     * @return {Quaternion} 四元数的共轭值
     */
    conjugate() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        this.onChangeCallback();
        return this;
    }
    /**
     * 四元数点乘结果
     * @param {Quaternion} v
     * @return {number}
     */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }
    /**
     * 四元数的模平方
     * @return {number}
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    /**
     * 四元数的欧式长度
     * @return {number} 长度
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    /**
     * 四元数归一化
     * @return {Quaternion} 归一化值
     */
    normalize() {
        let l = this.length();
        if (l === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        }
        else {
            l = 1 / l;
            this.x = this.x * l;
            this.y = this.y * l;
            this.z = this.z * l;
            this.w = this.w * l;
        }
        this.onChangeCallback();
        return this;
    }
    /**
     * 右乘四元数other
     * @param {Quaternion} other
     * @return {Quaternion}
     */
    multiply(other) {
        return this.multiplyQuaternions(this, other);
    }
    /**
     * 左乘四元数other
     * @param {Quaternion} other
     * @return {Quaternion}
     */
    premultiply(other) {
        return this.multiplyQuaternions(other, this);
    }
    /**
     * 四元数乘法(a * b)
     * @param {Quaternion} a 四元数
     * @param {Quaternion} b 四元数
     * @return {Quaternion} 四元数
     */
    multiplyQuaternions(a, b) {
        // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
        const qax = a.x;
        const qay = a.y;
        const qaz = a.z;
        const qaw = a.w;
        const qbx = b.x;
        const qby = b.y;
        const qbz = b.z;
        const qbw = b.w;
        this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
        this.onChangeCallback();
        return this;
    }
    /**
     * 与四元数other取线性插值
     * @see http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
     * @param {Quaternion} other 四元数
     * @param {number} t 插值比
     * @return {Quaternion} 插值结果
     */
    slerp(other, t) {
        if (t === 0) {
            return this;
        }
        if (t === 1) {
            return this.copy(other);
        }
        const x = this.x, y = this.y, z = this.z, w = this.w;
        let cosHalfTheta = w * other.w + x * other.x + y * other.y + z * other.z;
        if (cosHalfTheta < 0) {
            this.w = -other.w;
            this.x = -other.x;
            this.y = -other.y;
            this.z = -other.z;
            cosHalfTheta = -cosHalfTheta;
        }
        else {
            this.copy(other);
        }
        if (cosHalfTheta >= 1.0) {
            this.w = w;
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }
        const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;
        if (sqrSinHalfTheta <= Number.EPSILON) {
            const s = 1 - t;
            this.w = s * w + t * this.w;
            this.x = s * x + t * this.x;
            this.y = s * y + t * this.y;
            this.z = s * z + t * this.z;
            this.normalize();
            this.onChangeCallback();
            return this;
        }
        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
        this.w = (w * ratioA + this.w * ratioB);
        this.x = (x * ratioA + this.x * ratioB);
        this.y = (y * ratioA + this.y * ratioB);
        this.z = (z * ratioA + this.z * ratioB);
        this.onChangeCallback();
        return this;
    }
    /**
     * 取两个四元数的线性插值
     * @param {Quaternion} qa 四元数
     * @param {Quaternion} qb 四元数
     * @param {number} t 插值比
     */
    slerpQuaternions(qa, qb, t) {
        this.copy(qa).slerp(qb, t);
    }
    /**
     * 四元数判等
     * @param {Quaternion} quaternion 四元数
     * @return {boolean} 判等结果
     */
    equals(quaternion) {
        return quaternion.x === this.x
            && quaternion.y === this.y
            && quaternion.z === this.z
            && quaternion.w === this.w;
    }
    /**
     * 由数组获取四元数
     * @param {number[]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Quaternion} 四元数
     */
    fromArray(array, offset = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        this.w = array[offset + 3];
        this.onChangeCallback();
        return this;
    }
    /**
     * 四元数保存为数组
     * @param {number[]} [array=[]] 目标保存结果
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 数组
     */
    toArray(array = [], offset = 0) {
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        array[offset + 3] = this.w;
        return array;
    }
    /**
     * 四元数回调函数
     * @param {funciton} callback 回调函数
     * @return {Quaternion} 四元数
     */
    onChange(callback) {
        this.onChangeCallback = callback;
        return this;
    }
    /**
     * 四元数回调函数
     */
    onChangeCallback() { }
}

/**
 * @class 三维向量
 */
class Vec3 {
    /**
     * 构造函数，默认值为三维零向量 | 三维原点
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [z=0]
     */
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * @static 克隆三维向量
     * @param {Vec3} other 克隆对象
     * @return {Vec3} 克隆结果
     */
    static clone(other) {
        const result = new Vec3();
        result.x = other.x;
        result.y = other.y;
        result.z = other.z;
        return result;
    }
    /**
     * @static 由指定对象设置三维向量
     * @param {object} [other] 对象
     * @param {number} [other.x=0] x分量，默认值为0
     * @param {number} [other.y=0] y分量，默认值为0
     * @param {number} [other.z=0] z分量，默认值为0
     * @return {Vec3} 三维向量
     */
    static from({ x = 0, y = 0, z = 0 }) {
        return new Vec3(x, y, z);
    }
    /**
     * 由对象设置三维向量
     * @param {object} part 对象
     * @param {number} [part.x] x分量，默认值为0
     * @param {number} [part.y] y分量，默认值为0
     * @param {number} [part.z] z分量，默认值为0
     */
    setByPart(part) {
        Object.assign(this, part);
    }
    /**
     * @static 三维向量比例混合
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @param {number} [ratio=0.5] 混合比例
     * @return {Vec3} 三维向量
     */
    static mix(a, b, ratio) {
        ratio = ratio ? ratio : 0.5;
        return new Vec3(ratio * a.x + (1 - ratio) * b.x, ratio * a.y + (1 - ratio) * b.y);
    }
    /**
     * @static 屏幕坐标转视口坐标
     * @param {Vec2} view 屏幕坐标
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {number} z 坐标z值
     * @return {Vec3} 三维向量
     */
    static to3DWorld(view, width, height, z) {
        const x = view.x / width;
        const y = view.y / height;
        return new Vec3((x - 0.5) * 2, (0.5 - y) * 2, z);
    }
    /**
     * 设置三维向量
     * @param {number|number[]} x 值，数字 | 数组
     * @param {number} [y=x] y轴分量，默认值为x轴分量
     * @param {number} [z=x] z轴分量，默认值为x轴分量
     * @return {Vec3} 三维向量
     */
    set(x, y, z) {
        if (typeof x !== 'number') {
            if (x.length === 3) {
                this.x = x[0];
                this.y = x[1];
                this.z = x[2];
            }
            else {
                console.warn('Length of array input as Vec3 must be three');
                this.x = this.y = this.z = 0;
            }
        }
        else if (y !== undefined && z !== undefined) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        else {
            this.x = this.y = this.z = x;
        }
        return this;
    }
    /**
     * 三维向量根据下标转二维向量
     * @param {number} [index=2] 下标
     * @return {Vec2} 二维向量
     */
    toVec2(index = 2) {
        const res = new Vec2();
        switch (index) {
            case 0:
                res.x = this.y;
                res.y = this.z;
                break;
            case 1:
                res.x = this.z;
                res.y = this.x;
                break;
            case 2:
            default:
                res.x = this.x;
                res.y = this.y;
                break;
        }
        return res;
    }
    /**
     * 克隆三维向量
     * @return {Vec3} 三维向量
     */
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
    /**
     * 复制三维向量
     * @param {Vec3} v 复制对象
     * @return {Vec3} 三维向量
     */
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    /**
     * 三维向量求和
     * @param {Vec3|number} v 三维向量 | 数字
     * @return {Vec3} 求和结果
     */
    add(v) {
        if (typeof v === 'number') {
            this.x += v;
            this.y += v;
            this.z += v;
        }
        else {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
        }
        return this;
    }
    /**
     * 三维向量求和
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 求和结果
     */
    addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }
    /**
     * 三维向量比例相交
     * @param {Vec3} v 三维向量
     * @param {number} s 比例
     * @returns {Vec3} 三维向量
     */
    addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        return this;
    }
    /**
     * 三维向量求差
     * @param {Vec3|number} v 三维向量 | 数字
     * @return {Vec3} 三维向量
     */
    sub(v) {
        if (typeof v === 'number') {
            this.x -= v;
            this.y -= v;
            this.z -= v;
        }
        else {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
        }
        return this;
    }
    /**
     * 三维向量求差
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 求差结果
     */
    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }
    /**
     * 三维向量比例求差
     * @param {Vec3} v 三维向量
     * @param {number} s 比例
     * @return {Vec3} 求差结果
     */
    subScaledVector(v, s) {
        this.x -= v.x * s;
        this.y -= v.y * s;
        this.z -= v.z * s;
        return this;
    }
    /**
     * 三维向量取反
     * @return {Vec3} 取反结果
     */
    inverse() {
        return this.clone().multiply(-1);
    }
    /**
     * 三维向量求乘
     * @param {Vec3|number} v 三维向量 | 数字
     * @returns 三维向量
     */
    multiply(v) {
        if (typeof v === 'number') {
            this.x *= v;
            this.y *= v;
            this.z *= v;
        }
        else {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
        }
        return this;
    }
    /**
     * 三维向量求乘
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 三维向量
     */
    multiplyVectors(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    }
    /**
     * 三维点以center为中心欧拉角euler旋转结果
     * @param {Euler} euler 欧拉角
     * @param {Vec3} [center] 旋转中心
     * @return {Vec3} 三维点
     */
    applyEuler(euler, center) {
        return this.applyQuaternion(new Quaternion().setFromEuler(euler), center);
    }
    /**
     * 三维点以center为中心绕axis轴旋转angle角度的结果
     * @param {Vec3} axis 旋转轴
     * @param {number} angle 旋转角度
     * @param {Vec3} [center] 旋转中心
     * @return {Vec3} 三维点
     */
    applyAxisAngle(axis, angle, center) {
        return this.applyQuaternion(new Quaternion().setFromAxisAngle(axis, angle), center);
    }
    /**
     * 三维点根据三维矩阵选准
     * @param {Matrix3} m 旋转矩阵
     * @return {Vec3} 三维点
     */
    applyMatrix3(m) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;
        return this;
    }
    /**
     * 三维向量旋转归一化
     * @param {Matrix3} m 旋转矩阵
     * @return {Vec3} 三维向量
     */
    applyNormalMatrix(m) {
        return this.applyMatrix3(m).normalize();
    }
    /**
     * 三维点根据矩阵进变换
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 三维点
     */
    applyMatrix4(m) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const e = m.elements;
        {
            const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
            this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
            this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
            this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
        }
        return this;
    }
    /**
     * 三维点根据四元数绕点的旋转
     * @param {Quaternion} q 四元数
     * @param {Vec3} [center=new Vec3()] 旋转中心
     * @return {Vec3} 旋转结果
     */
    applyQuaternion(q, center = new Vec3()) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const { x: qx, y: qy, z: qz, w: qw } = q;
        const { x: centerX, y: centerY, z: centerZ } = center;
        const ix = qw * (x - centerX) + qy * (z - centerZ) - qz * (y - centerY);
        const iy = qw * (y - centerY) + qz * (x - centerX) - qx * (z - centerZ);
        const iz = qw * (z - centerZ) + qx * (y - centerY) - qy * (x - centerX);
        const iw = -qx * (x - centerX) - qy * (y - centerY) - qz * (z - centerZ);
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy + centerX;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz + centerY;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx + centerZ;
        return this;
    }
    /**
     * 三维点投影
     * @param camera 相机
     * @return {Vec3} 投影结果
     */
    project(camera) {
        return this.applyMatrix4(camera.viewProjectMatrix);
    }
    /**
     * 三维点逆投影
     * @param camera 相机
     * @return {Vec3} 逆投影结果
     */
    unproject(camera) {
        // TODO: 补齐 camera 类型
        return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
    }
    /**
     * 三维向量空间变换归一化
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 三维向量
     */
    transformDirection(m) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;
        return this.normalize();
    }
    /**
     * 三维向量求除
     * @param {Vec3|number} v 三维向量 | 数字
     * @return {Vec3} 求除结果
     */
    divide(v) {
        if (typeof v === 'number') {
            this.x /= v;
            this.y /= v;
            this.z /= v;
        }
        else {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
        }
        return this;
    }
    /**
     * 三维向量求最小值
     * @param {Vec3} v 三维向量
     * @return {Vec3} 求值结果
     */
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        return this;
    }
    /**
     * 三维向量求最大值
     * @param {Vec3} v 三维向量
     * @return {Vec3} 求值结果
     */
    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        return this;
    }
    /**
     * 三维向量阈值约束
     * @param {Vec3} min 三维向量
     * @param {Vec3} max 三维向量
     * @return {Vec3} 求值结果
     */
    clamp(min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        return this;
    }
    /**
     * 三维向量根据数值阈值约束
     * @param {number} minVal 最小值
     * @param {number} maxVal 最大值
     * @return {Vec3} 求值结果
     */
    clampScalar(minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        this.z = Math.max(minVal, Math.min(maxVal, this.z));
        return this;
    }
    /**
     * 三维向量根据阈值约束长度
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @return {Vec3} 三维向量
     */
    clampLength(min, max) {
        const length = this.length();
        return this.divide(length || 1).multiply(Math.max(min, Math.min(max, length)));
    }
    /**
     * 三维向量向下取整
     * @return {Vec3} 取整结果
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }
    /**
     * 三维向量向上取整
     * @return {Vec3} 取整结果
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }
    /**
     * 三维向量四舍五入
     * @return {Vec3} 计算结果
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }
    /**
     * 三维向量分类处理
     * @return {Vec3} 三维向量
     */
    roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
        return this;
    }
    /**
     * 三维向量取反
     * @return {Vec3} 三维向量
     */
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
    /**
     * 三维向量求点积
     * @param {Vec3} v 三维向量
     * @return {number} 点积结果
     */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    /**
     * 三维向量长度平方
     * @return {number} 长度平方
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    /**
     * 三维向量长度
     * @return {number} 长度
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    /**
     * 三维向量曼哈顿长度
     * @return {number} 曼哈顿长度
     */
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    /**
     * 三维向量归一化
     * @return {Vec3} 三维向量
     */
    normalize() {
        return this.divide(this.length() || 1);
    }
    /**
     * 根据长度设置三维向量
     * @param {number} length 长度
     * @return {Vec3} 三维向量
     */
    setLength(length) {
        return this.normalize().multiply(length);
    }
    /**
     * 三维点(this与other)求线性插值
     * @param {Vec3} other 三维点
     * @param {number} alpha 插值比例
     * @return {Vec3} 求值结果
     */
    lerp(other, alpha) {
        this.x += (other.x - this.x) * alpha;
        this.y += (other.y - this.y) * alpha;
        this.z += (other.z - this.z) * alpha;
        return this;
    }
    /**
     * 三维点(v1与v2)求线性插值
     * @param {Vec3} v1 三维点
     * @param {Vec3} v2 三维点
     * @param {number} alpha 插值比例
     * @return {Vec3} 求值结果
     */
    lerpVectors(v1, v2, alpha) {
        this.x = v1.x + (v2.x - v1.x) * alpha;
        this.y = v1.y + (v2.y - v1.y) * alpha;
        this.z = v1.z + (v2.z - v1.z) * alpha;
        return this;
    }
    /**
     * 三维向量(this与other)求叉积
     * @param {Vec3} v 三维向量
     * @return {Vec3} 叉积结果
     */
    cross(v) {
        return this.crossVectors(this, v);
    }
    /**
     * 三维向量(a与b)求叉积
     * @param {Vec3} a 三维向量
     * @param {Vec3} b 三维向量
     * @return {Vec3} 叉积结果
     */
    crossVectors(a, b) {
        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    }
    /**
     * 三维向量this在三维向量v的投影
     * @param {Vec3} v 三维向量
     * @return {Vec3} 投影结果
     */
    projectOnVector(v) {
        const denominator = v.lengthSq();
        if (denominator === 0) {
            return this.set(0, 0, 0);
        }
        const scalar = v.dot(this) / denominator;
        return this.copy(v).multiply(scalar);
    }
    /**
     * 三维点在平面的投影
     * @param {Vec3} planeNormal 平面法线
     * @return {Vec3} 投影结果
     */
    projectOnPlane(planeNormal) {
        const vector = new Vec3();
        vector.copy(this).projectOnVector(planeNormal);
        return this.sub(vector);
    }
    /**
     * 三维向量反射
     * @param {Vec3} normal 法线
     * @return {Vec3} 反射结果
     */
    reflect(normal) {
        // reflect incident vector off plane orthogonal to normal
        // normal is assumed to have unit length
        const vector = new Vec3();
        return this.sub(vector.copy(normal).multiply(2 * this.dot(normal)));
    }
    /**
     * 三维向量求夹角
     * @param {Vec3} v 三维向量
     * @return {number} 夹角
     */
    angleTo(v) {
        const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
        if (denominator === 0) {
            return Math.PI / 2;
        }
        const theta = this.dot(v) / denominator;
        // clamp, to handle numerical problems
        return Math.acos(clamp(theta, -1, 1));
    }
    /**
     * 三维点求距离
     * @param {Vec3} v 三维点
     * @return {number} 距离
     */
    distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }
    /**
     * 三维点距离平方
     * @param {Vec3} v 三维点
     * @return {number} 距离平方
     */
    distanceToSquared(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    }
    /**
     * 三维点曼哈顿距离
     * @param {Vec3} v 三维点
     * @return {number} 曼哈顿距离
     */
    manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
    }
    /**
     * 由球坐标获取笛卡尔坐标
     * @param s 球坐标
     * @returns 笛卡尔坐标
     */
    setFromSpherical(s) {
        return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
    }
    /**
     * 根据值设置球坐标
     * @param {number} radius 半径
     * @param {number} phi y轴的极坐标角
     * @param {number} theta 绕y轴的方位角
     * @return {Vec3} 三维向量
     */
    setFromSphericalCoords(radius, phi, theta) {
        const sinPhiRadius = Math.sin(phi) * radius;
        this.x = sinPhiRadius * Math.sin(theta);
        this.y = Math.cos(phi) * radius;
        this.z = sinPhiRadius * Math.cos(theta);
        return this;
    }
    // setFromCylindrical(c) {
    //   return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
    // }
    /**
     * 根据圆柱设置三维向量
     * @param {number} radius 半径
     * @param {number} theta 方位角
     * @param {number} y 高
     * @return {Vec3} 三维向量
     */
    setFromCylindricalCoords(radius, theta, y) {
        this.x = radius * Math.sin(theta);
        this.y = y;
        this.z = radius * Math.cos(theta);
        return this;
    }
    /**
     * 由空间变换矩阵保存三维偏移值
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 偏移值
     */
    setFromMatrixPosition(m) {
        const e = m.elements;
        this.x = e[12];
        this.y = e[13];
        this.z = e[14];
        return this;
    }
    /**
     * 由空间变换矩阵保存三维缩放值
     * @param {Matrix4} m 四维矩阵
     * @return {Vec3} 缩放至
     */
    setFromMatrixScale(m) {
        const sx = this.setFromMatrixColumn(m, 0).length();
        const sy = this.setFromMatrixColumn(m, 1).length();
        const sz = this.setFromMatrixColumn(m, 2).length();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    }
    /**
     * 由空间变换矩阵保存三维分量
     * @param {Matrix4} m 四维矩阵
     * @param {number} index 下标
     * @return {Vec3} 指定三维分量
     */
    setFromMatrixColumn(m, index) {
        // 这里断言了，类型不安全，之后加 lint，必须有明显的 disable lint 起提示作用
        return this.fromArray(m.elements.slice(index * 4));
    }
    /**
     * 由三维矩阵下标保存分量
     * @param {Matrix3} m 三维矩阵
     * @param {number} index 下标
     * @return {Vec3} 三维向量
     */
    setFromMatrix3Column(m, index) {
        // 这里断言了，类型不安全，之后加 lint，必须有明显的 disable lint 起提示作用
        return this.fromArray(m.elements.slice(index * 3));
    }
    /**
     * 三维向量判等
     * @param {Vec3} v 三维向量
     * @return {boolean} 判等结果
     */
    equals(v) {
        return v.x === this.x
            && v.y === this.y
            && v.z === this.z;
    }
    /**
     * 由数组组装三维向量
     * @param {[x: number, y: number, z: number]|object} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Vec3} 三维向量
     */
    fromArray(array) {
        if (Array.isArray(array)) {
            [this.x, this.y, this.z] = array;
        }
        else {
            this.x = array.x;
            this.y = array.y;
            this.z = array.z;
        }
        return this;
    }
    /**
     * 三维向量转数组
     * @param {number[]} array 目标保存对象
     * @return {number[]} 数组
     */
    toArray() {
        return [this.x, this.y, this.z];
    }
    /**
     * 获取随机三维向量
     * @return {Vec3}
     */
    random() {
        this.x = Math.random();
        this.y = Math.random();
        this.z = Math.random();
        return this;
    }
}

/**
 * @class 四维向量
 */
class Vec4 {
    /**
     * 构造函数，默认为w为1的单位四维向量
     * @param {number} [x=0] x轴分量
     * @param {number} [y=0] y轴分量
     * @param {number} [z=0] z轴分量
     * @param {number} [w=1] w轴分量
     */
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /**
     * @member {number} 宽度
     */
    get width() {
        return this.z;
    }
    set width(value) {
        this.z = value;
    }
    /**
     * @member {number} 高度
     */
    get height() {
        return this.w;
    }
    set height(value) {
        this.w = value;
    }
    /**
     * 设置四维向量
     * @param {number|Vec3} x 数字 | 三维向量
     * @param {number} [y=x] y轴分量
     * @param {number} [z=x] z轴分量
     * @param {number} [w=x] w轴分量
     * @returns
     */
    set(x, y, z, w) {
        if (typeof x === 'number') {
            if (y === undefined || z === undefined || w === undefined) {
                this.x = this.y = this.z = this.w = x;
            }
            else {
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
        }
        else {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = y === undefined ? 1 : y;
        }
        return this;
    }
    /**
     * 设置x轴分量
     * @param {number} x x轴分量
     * @return {Vec4} 四维向量
     */
    setX(x) {
        this.x = x;
        return this;
    }
    /**
     * 设置y轴分量
     * @param {number} y y轴分量
     * @return {Vec4} 四维向量
     */
    setY(y) {
        this.y = y;
        return this;
    }
    /**
     * 设置z轴分量
     * @param {number} z z轴分量
     * @return {Vec4} 四维向量
     */
    setZ(z) {
        this.z = z;
        return this;
    }
    /**
     * 设置w轴分量
     * @param {number} w w轴分量
     * @return {Vec4} 四维向量
     */
    setW(w) {
        this.w = w;
        return this;
    }
    /**
     * 根据下标设置四维向量
     * @param {number} index 下标值
     * @param {number} value 数字
     * @return {Vec4} 四维向量
     */
    setComponent(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            case 3:
                this.w = value;
                break;
            default: throw new Error('index is out of range: ' + index);
        }
        return this;
    }
    /**
     * 根据下标获取值
     * @param {number} index 下标
     * @return {number} 值
     */
    getComponent(index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            case 3: return this.w;
            default: throw new Error('index is out of range: ' + index);
        }
    }
    /**
     * 克隆四维向量
     * @return {Vec4} 克隆结果
     */
    clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }
    /**
     * 复制四维向量
     * @param {Vec4} v 复制对象
     * @return {Vec4} 复制结果
     */
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
    /**
     * 四维向量求和
     * @param {Vec4|number} v 求和对象，四维向量 | 数字
     * @return {Vec4} 求和结果
     */
    add(v) {
        if (typeof v === 'number') {
            this.x += v;
            this.y += v;
            this.z += v;
            this.w += v;
        }
        else {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            this.w += v.w;
        }
        return this;
    }
    /**
     * 四维向量求和
     * @param {Vec3} a 四维向量
     * @param {Vec4} b 四维向量
     * @return {Vec4} 求和结果
     */
    addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;
        return this;
    }
    /**
     * 四维向量比例求和
     * @param {Vec4} v 四维向量
     * @param {number} s 比例
     * @returns {Vec4} 求和结果
     */
    addScaledVec(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        this.w += v.w * s;
        return this;
    }
    /**
     * 四维向量求差
     * @param {Vec4|number} v 求差对象，四维向量 | 数字
     * @return {Vec4} 四维向量
     */
    sub(v) {
        if (typeof v === 'number') {
            this.x -= v;
            this.y -= v;
            this.z -= v;
            this.w -= v;
        }
        else {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            this.w -= v.w;
        }
        return this;
    }
    /**
     * 四维向量取反
     * @return {Vec4} 取反结果
     */
    inverse() {
        return this.clone().multiply(-1);
    }
    /**
     * 四维向量求差
     * @param {Vec4} a 四维向量
     * @param {Vec4} b 四维向量
     * @return {Vec4} 四维向量
     */
    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;
        return this;
    }
    /**
     * 四维向量求乘
     * @param {Vec4|number} v 求乘对象，四维对象 | 数字
     * @return {Vec4} 四维向量
     */
    multiply(v) {
        if (typeof v === 'number') {
            this.x *= v;
            this.y *= v;
            this.z *= v;
            this.w *= v;
        }
        else {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            this.w *= v.w;
        }
        return this;
    }
    /**
     * 四维向量矩阵变换
     * @param {Matrix4} m 变换矩阵
     * @return {Vec4} 四维向量
     */
    applyMatrix4(m) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const w = this.w;
        const e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
        this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
        return this;
    }
    /**
     * 四维向量求除
     * @param {number} scalar 除数
     * @return {Vec4} 求除结果
     */
    divideScalar(scalar) {
        return this.multiply(1 / scalar);
    }
    /**
     * 根据四元数设置四维向量[旋转轴，旋转角度]
     * @param {Quaternion} q 四元数
     * @return {Vec4} 四维向量
     */
    setAxisAngleFromQuaternion(q) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
        // q is assumed to be normalized
        this.w = 2 * Math.acos(q.w);
        const s = Math.sqrt(1 - q.w * q.w);
        if (s < 0.0001) {
            this.x = 1;
            this.y = 0;
            this.z = 0;
        }
        else {
            this.x = q.x / s;
            this.y = q.y / s;
            this.z = q.z / s;
        }
        return this;
    }
    /**
     * 根据矩阵设置四维向量[旋转轴，旋转角度]
     * @param {Matrix4} m 矩阵
     * @return {Vec4} 四维向量
     */
    setAxisAngleFromRotationMatrix(m) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        let angle;
        let x;
        let y;
        let z; // variables for result
        const epsilon = 0.01; // margin to allow for rounding errors
        const epsilon2 = 0.1; // margin to distinguish between 0 and 180 degrees
        const te = m.elements;
        const m11 = te[0];
        const m12 = te[4];
        const m13 = te[8];
        const m21 = te[1];
        const m22 = te[5];
        const m23 = te[9];
        const m31 = te[2];
        const m32 = te[6], m33 = te[10];
        if (Math.abs(m12 - m21) < epsilon
            && Math.abs(m13 - m31) < epsilon
            && Math.abs(m23 - m32) < epsilon) {
            // singularity found
            // first check for identity matrix which must have +1 for all terms
            // in leading diagonal and zero in other terms
            if (Math.abs(m12 + m21) < epsilon2
                && Math.abs(m13 + m31) < epsilon2
                && Math.abs(m23 + m32) < epsilon2
                && Math.abs(m11 + m22 + m33 - 3) < epsilon2) {
                // this singularity is identity matrix so angle = 0
                this.set(1, 0, 0, 0);
                return this; // zero angle, arbitrary axis
            }
            // otherwise this singularity is angle = 180
            angle = Math.PI;
            const xx = (m11 + 1) / 2;
            const yy = (m22 + 1) / 2;
            const zz = (m33 + 1) / 2;
            const xy = (m12 + m21) / 4;
            const xz = (m13 + m31) / 4;
            const yz = (m23 + m32) / 4;
            if ((xx > yy) && (xx > zz)) {
                // m11 is the largest diagonal term
                if (xx < epsilon) {
                    x = 0;
                    y = 0.707106781;
                    z = 0.707106781;
                }
                else {
                    x = Math.sqrt(xx);
                    y = xy / x;
                    z = xz / x;
                }
            }
            else if (yy > zz) {
                // m22 is the largest diagonal term
                if (yy < epsilon) {
                    x = 0.707106781;
                    y = 0;
                    z = 0.707106781;
                }
                else {
                    y = Math.sqrt(yy);
                    x = xy / y;
                    z = yz / y;
                }
            }
            else {
                // m33 is the largest diagonal term so base result on this
                if (zz < epsilon) {
                    x = 0.707106781;
                    y = 0.707106781;
                    z = 0;
                }
                else {
                    z = Math.sqrt(zz);
                    x = xz / z;
                    y = yz / z;
                }
            }
            this.set(x, y, z, angle);
            return this; // return 180 deg rotation
        }
        // as we have reached here there are no singularities so we can handle normally
        let s = Math.sqrt((m32 - m23) * (m32 - m23) +
            (m13 - m31) * (m13 - m31) +
            (m21 - m12) * (m21 - m12)); // used to normalize
        if (Math.abs(s) < 0.001) {
            s = 1;
        }
        // prevent divide by zero, should not happen if matrix is orthogonal and should be
        // caught by singularity test above, but I've left it in just in case
        this.x = (m32 - m23) / s;
        this.y = (m13 - m31) / s;
        this.z = (m21 - m12) / s;
        this.w = Math.acos((m11 + m22 + m33 - 1) / 2);
        return this;
    }
    /**
     * 四维向量求最小值
     * @param {Vec4} v 四维向量
     * @return {Vec4} 最小值
     */
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        this.w = Math.min(this.w, v.w);
        return this;
    }
    /**
     * 四维向量求最大值
     * @param {Vec4} v 四维向量
     * @return {Vec4} 最大值
     */
    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        this.w = Math.max(this.w, v.w);
        return this;
    }
    /**
     * 四维向量阈值约束
     * @param {Vec4} min 最小值
     * @param {Vec4} max 最大值
     * @return {Vec4} 四维向量
     */
    clamp(min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        this.w = Math.max(min.w, Math.min(max.w, this.w));
        return this;
    }
    /**
     * 四维向量数值阈值约束
     * @param {number} minVal 最小数值
     * @param {number} maxVal 最大数值
     * @return {Vec4} 四维向量
     */
    clampScalar(minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        this.z = Math.max(minVal, Math.min(maxVal, this.z));
        this.w = Math.max(minVal, Math.min(maxVal, this.w));
        return this;
    }
    /**
     * 四维向量根据数值约束长度
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @return {Vec4} 四维向量
     */
    clampLength(min, max) {
        const length = this.length();
        return this.divideScalar(length || 1).multiply(Math.max(min, Math.min(max, length)));
    }
    /**
     * 四维向量向下取整
     * @return {Vec4} 取整结果
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        this.w = Math.floor(this.w);
        return this;
    }
    /**
     * 四维向量向上取整
     * @return {Vec4} 取整结果
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        this.w = Math.ceil(this.w);
        return this;
    }
    /**
     * 四维向量四舍五入
     * @return {Vec4} 求值结果
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        this.w = Math.round(this.w);
        return this;
    }
    /**
     * 四维向量分类处理
     * @return {Vec4} 计算结果
     */
    roundToZero() {
        this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
        this.w = (this.w < 0) ? Math.ceil(this.w) : Math.floor(this.w);
        return this;
    }
    /**
     * 四维向量取反
     * @return {Vec4} 取反结果
     */
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
        return this;
    }
    /**
     * 四维向量求点积
     * @param {Vec4} v 四维向量
     * @return {number} 点积结果
     */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }
    /**
     * 四维向量长度平方
     * @return {number} 长度平方
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    /**
     * 四维向量长度
     * @return {number} 长度
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    /**
     * 四维向量曼哈顿长度
     * @return {number} 曼哈顿长度
     */
    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    }
    /**
     * 四维向量归一化
     * @return {Vec4} 归一化结果
     */
    normalize() {
        return this.divideScalar(this.length() || 1);
    }
    /**
     * 根据四维向量方向与长度设置四维向量
     * @param {number} length 长度
     * @return {Vec4} 四维向量
     */
    setLength(length) {
        return this.normalize().multiply(length);
    }
    /**
     * 四维点求线性插值
     * @param {Vec4} v 四维点
     * @param {number} alpha 插值比例
     * @return {Vec4} 求值结果
     */
    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        this.w += (v.w - this.w) * alpha;
        return this;
    }
    /**
     * 四维点求线性插值
     * @param {Vec4} v1 四维点
     * @param {Vec4} v2 思维点
     * @param {number} alpha 插值比例
     * @returns {Vec4} 求值结果
     */
    lerpVecs(v1, v2, alpha) {
        this.x = v1.x + (v2.x - v1.x) * alpha;
        this.y = v1.y + (v2.y - v1.y) * alpha;
        this.z = v1.z + (v2.z - v1.z) * alpha;
        this.w = v1.w + (v2.w - v1.w) * alpha;
        return this;
    }
    /**
     * 四维向量判等
     * @param {Vec4} v 四维向量
     * @return {boolean} 判等结果
     */
    equals(v) {
        return v.x === this.x
            && v.y === this.y
            && v.z === this.z
            && v.w === this.w;
    }
    /**
     * 由数组组装四维向量
     * @param {[x: number, y: number, z: number, z: number]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Vec4} 四维向量
     */
    fromArray(array) {
        [this.x, this.y, this.z, this.w] = array;
        return this;
    }
    /**
     * 四维向量转数组
     * @param {number[]} [array=[]] 目标保存对象
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 数组
     */
    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
    /**
     * 生成随机四维向量
     * @return {Vec4} 四维向量
     */
    random() {
        this.x = Math.random();
        this.y = Math.random();
        this.z = Math.random();
        this.w = Math.random();
        return this;
    }
}

/**
 * @class 三维矩阵[二维空间变换矩阵 || 三维空间旋转缩放矩阵(列矩阵)]
 */
class Matrix3 {
    /**
     * 构造函数，初始值为单位矩阵
     */
    constructor() {
        this.elements = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
        if (arguments.length > 0) {
            console.error('THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.');
        }
    }
    /**
     * 设置三维矩阵矩阵
     * @param {number} n00 矩阵[0, 0]值
     * @param {number} n01 矩阵[0, 1]值
     * @param {number} n02 矩阵[0, 2]值
     * @param {number} n10 矩阵[1, 0]值
     * @param {number} n11 矩阵[1, 1]值
     * @param {number} n12 矩阵[1, 2]值
     * @param {number} n20 矩阵[2, 0]值
     * @param {number} n21 矩阵[2, 1]值
     * @param {number} n22 矩阵[2, 2]值
     * @return {Matrix3}
     */
    set(n00, n01, n02, n10, n11, n12, n20, n21, n22) {
        const te = this.elements;
        te[0] = n00;
        te[1] = n10;
        te[2] = n20;
        te[3] = n01;
        te[4] = n11;
        te[5] = n21;
        te[6] = n02;
        te[7] = n12;
        te[8] = n22;
        return this;
    }
    /**
     * 三维矩阵矩阵单位化
     * @return {Matrix3} 单位矩阵
     */
    identity() {
        this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        return this;
    }
    /**
     * 复制三维矩阵矩阵
     * @param {Matrix3} m 复制对象
     * @return {Matrix3} 复制结果
     */
    copy(m) {
        const te = this.elements;
        const me = m.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        return this;
    }
    /**
     * 由分轴向量构建三维矩阵
     * @param {Vec3} xAxis x轴分量
     * @param {Vec3} yAxis y轴分量
     * @param {Vec3} zAxis z轴分量
     * @return {Matrix3} 三维矩阵
     */
    extractBasis(xAxis, yAxis, zAxis) {
        xAxis.setFromMatrix3Column(this, 0);
        yAxis.setFromMatrix3Column(this, 1);
        zAxis.setFromMatrix3Column(this, 2);
        return this;
    }
    /**
     * 由四维矩阵构建三维矩阵(获取三维空间变换矩阵旋转缩放部分)
     * @param {Matrix4} m 四维矩阵
     * @return {Matrix3} 三维矩阵
     */
    setFromMatrix4(m) {
        const me = m.elements;
        this.set(me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]);
        return this;
    }
    /**
     * 三维矩阵右乘
     * @param {Matrix3} m 相乘矩阵
     * @return {Matrix3} 右乘结果
     */
    multiply(m) {
        return this.multiplyMatrices(this, m);
    }
    /**
     * 三维矩阵左乘
     * @param {Matrix3} m 相乘矩阵
     * @return {Matrix3} 左乘结果
     */
    premultiply(m) {
        return this.multiplyMatrices(m, this);
    }
    /**
     * 三维矩阵乘法(a * b)
     * @param {Matrix3} a 三维矩阵
     * @param {Matrix3} b 三维矩阵
     * @return {Matrix3} 相乘结果
     */
    multiplyMatrices(a, b) {
        const ae = a.elements;
        const be = b.elements;
        const te = this.elements;
        const a11 = ae[0];
        const a12 = ae[3];
        const a13 = ae[6];
        const a21 = ae[1];
        const a22 = ae[4];
        const a23 = ae[7];
        const a31 = ae[2];
        const a32 = ae[5];
        const a33 = ae[8];
        const b11 = be[0];
        const b12 = be[3];
        const b13 = be[6];
        const b21 = be[1];
        const b22 = be[4];
        const b23 = be[7];
        const b31 = be[2];
        const b32 = be[5];
        const b33 = be[8];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31;
        te[3] = a11 * b12 + a12 * b22 + a13 * b32;
        te[6] = a11 * b13 + a12 * b23 + a13 * b33;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31;
        te[4] = a21 * b12 + a22 * b22 + a23 * b32;
        te[7] = a21 * b13 + a22 * b23 + a23 * b33;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31;
        te[5] = a31 * b12 + a32 * b22 + a33 * b32;
        te[8] = a31 * b13 + a32 * b23 + a33 * b33;
        return this;
    }
    /**
     * 三维矩阵倍数缩放
     * @param {number} s 放大倍数
     * @return {Matrix3} 缩放结果
     */
    multiplyScalar(s) {
        const te = this.elements;
        te[0] *= s;
        te[3] *= s;
        te[6] *= s;
        te[1] *= s;
        te[4] *= s;
        te[7] *= s;
        te[2] *= s;
        te[5] *= s;
        te[8] *= s;
        return this;
    }
    /**
     * 三维矩阵求行列式值
     * @return {number} 行列式结果
     */
    determinant() {
        const te = this.elements;
        const a = te[0];
        const b = te[1];
        const c = te[2];
        const d = te[3];
        const e = te[4];
        const f = te[5];
        const g = te[6];
        const h = te[7];
        const i = te[8];
        return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
    }
    /**
     * 三维矩阵求逆
     * @return {Matrix3} 逆矩阵
     */
    invert() {
        const te = this.elements;
        const n11 = te[0];
        const n21 = te[1];
        const n31 = te[2];
        const n12 = te[3];
        const n22 = te[4];
        const n32 = te[5];
        const n13 = te[6];
        const n23 = te[7];
        const n33 = te[8];
        const t11 = n33 * n22 - n32 * n23;
        const t12 = n32 * n13 - n33 * n12;
        const t13 = n23 * n12 - n22 * n13;
        const det = n11 * t11 + n21 * t12 + n31 * t13;
        if (det === 0) {
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
        const detInv = 1 / det;
        te[0] = t11 * detInv;
        te[1] = (n31 * n23 - n33 * n21) * detInv;
        te[2] = (n32 * n21 - n31 * n22) * detInv;
        te[3] = t12 * detInv;
        te[4] = (n33 * n11 - n31 * n13) * detInv;
        te[5] = (n31 * n12 - n32 * n11) * detInv;
        te[6] = t13 * detInv;
        te[7] = (n21 * n13 - n23 * n11) * detInv;
        te[8] = (n22 * n11 - n21 * n12) * detInv;
        return this;
    }
    /**
     * 三维矩阵转置
     * @return {Matrix3} 转置结果
     */
    transpose() {
        let tmp;
        const m = this.elements;
        tmp = m[1];
        m[1] = m[3];
        m[3] = tmp;
        tmp = m[2];
        m[2] = m[6];
        m[6] = tmp;
        tmp = m[5];
        m[5] = m[7];
        m[7] = tmp;
        return this;
    }
    /**
     * 根据四维矩阵设置法线矩阵
     * @param {Matrix4} matrix4 四维矩阵
     * @return {Matrix3} 法线矩阵
     */
    getNormalMatrix(matrix4) {
        return this.setFromMatrix4(matrix4).invert().transpose();
    }
    /**
     * 三维矩阵转置并保存于数组中
     * @param {number[]} r 结果保存对象
     * @return {Matrix3} 三维矩阵
     */
    transposeIntoArray(r) {
        const m = this.elements;
        r[0] = m[0];
        r[1] = m[3];
        r[2] = m[6];
        r[3] = m[1];
        r[4] = m[4];
        r[5] = m[7];
        r[6] = m[2];
        r[7] = m[5];
        r[8] = m[8];
        return this;
    }
    /**
     * 设置UV变换矩阵
     * @param {number} tx x方向平移
     * @param {number} ty y方向平移
     * @param {number} sx x方向缩放
     * @param {number} sy y方向缩放
     * @param {number} rotation 旋转帧
     * @param {number} cx x方向切变
     * @param {number} cy y方向切变
     * @return {Matrix3} UV变换矩阵
     */
    setUvTransform(tx, ty, sx, sy, rotation, cx, cy) {
        const c = Math.cos(rotation);
        const s = Math.sin(rotation);
        this.set(sx * c, sx * s, -sx * (c * cx + s * cy) + cx + tx, -sy * s, sy * c, -sy * (-s * cx + c * cy) + cy + ty, 0, 0, 1);
        return this;
    }
    /**
     * 三维矩阵缩放
     * @param {number} sx x轴缩放分量
     * @param {number} sy y轴缩放分量
     * @return {Matrix3} 缩放结果
     */
    scale(sx, sy) {
        const te = this.elements;
        te[0] *= sx;
        te[3] *= sx;
        te[6] *= sx;
        te[1] *= sy;
        te[4] *= sy;
        te[7] *= sy;
        return this;
    }
    /**
     * 三维矩阵旋转
     * @param {number} theta 旋转值
     * @return {Matrix3} 旋转结果
     */
    rotate(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        const te = this.elements;
        const a11 = te[0], a12 = te[3], a13 = te[6];
        const a21 = te[1], a22 = te[4], a23 = te[7];
        te[0] = c * a11 + s * a21;
        te[3] = c * a12 + s * a22;
        te[6] = c * a13 + s * a23;
        te[1] = -s * a11 + c * a21;
        te[4] = -s * a12 + c * a22;
        te[7] = -s * a13 + c * a23;
        return this;
    }
    /**
     * 三维矩阵平移
     * @param {number} tx x轴平移分量
     * @param {number} ty y轴平移分量
     * @return {Matrix3} 平移结果
     */
    translate(tx, ty) {
        const te = this.elements;
        te[0] += tx * te[2];
        te[3] += tx * te[5];
        te[6] += tx * te[8];
        te[1] += ty * te[2];
        te[4] += ty * te[5];
        te[7] += ty * te[8];
        return this;
    }
    /**
     * 三维矩阵判等
     * @param {Matrix3} matrix 三维矩阵
     * @return {boolean} 判等结果
     */
    equals(matrix) {
        const te = this.elements;
        const me = matrix.elements;
        for (let i = 0; i < 9; i++) {
            if (te[i] !== me[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * 由数组构建三维矩阵
     * @param {number[]} array 数组
     * @param {number} [offset=0] 起始偏移值
     * @return {Matrix3} 三维矩阵
     */
    fromArray(array, offset = 0) {
        for (let i = 0; i < 9; i++) {
            this.elements[i] = array[i + offset];
        }
        return this;
    }
    /**
     * 三维矩阵转为数组
     * @param {number[]} [array=[]] 目标保存对象
     * @param {number} [offset=0] 保存起始偏移值
     * @return {number[]} 保存结果
     */
    toArray(array = [], offset = 0) {
        const te = this.elements;
        array[offset] = te[0];
        array[offset + 1] = te[1];
        array[offset + 2] = te[2];
        array[offset + 3] = te[3];
        array[offset + 4] = te[4];
        array[offset + 5] = te[5];
        array[offset + 6] = te[6];
        array[offset + 7] = te[7];
        array[offset + 8] = te[8];
        return array;
    }
    /**
     * 三维矩阵克隆
     * @return {Matrix3} 克隆结果
     */
    clone() {
        return new Matrix3().fromArray(this.elements);
    }
}

/**
 * @class 二维线段
 */
class Line2 {
    /**
     * 构造函数
     * @param {Vec2} [start=new Vec2()] 线段起点，默认值为(0, 0)
     * @param {Vec2} [end=new Vec2()] 线段终点，默认值为(0, 0)
     */
    constructor(start = new Vec2(), end = new Vec2()) {
        this.start = start;
        this.end = end;
    }
    /**
     * 设置二维线段
     * @param {Vec2} start 线段起点
     * @param {Vec2} end 线段终点
     * @return {Line2} 二维线段
     */
    set(start, end) {
        this.start.copy(start);
        this.end.copy(end);
        return this;
    }
    /**
     * 复制二维线段
     * @param {Line2} line 复制对象
     * @return {Line2} 复制结果
     */
    copy(line) {
        this.start.copy(line.start);
        this.end.copy(line.end);
        return this;
    }
    /**
     * 二维线段求方向
     * @return {Vec2} 二维线段方向
     */
    direction() {
        return new Vec2().subVectors(this.end, this.start).normalize();
    }
    /**
     * 二维线段求中点
     * @param {Vec2} [target=new Vec2()] 目标保存对象
     * @return {Vec2} 二维线段中点
     */
    getCenter(target = new Vec2()) {
        return target.addVectors(this.start, this.end).multiply(0.5);
    }
    /**
     * 二维线段向量值
     * @param {Vec2} [target=new Vec2()] 目标保存对象
     * @return {Vec2} 二维线段向量值
     */
    delta(target = new Vec2()) {
        return target.subVectors(this.end, this.start);
    }
    /**
     * 二维线段欧式距离平方(应用于计算)
     * @return {number} 计算结果
     */
    distanceSq() {
        return this.start.distanceToSquared(this.end);
    }
    /**
     * 二维线段欧式距离
     * @return {number} 计算结果
     */
    distance() {
        return this.start.distanceTo(this.end);
    }
    /**
     * 求二维线段比例点
     * @param {number} t 比例值
     * @param {Vec2} target 目标保存对象
     * @return {Vec2} 比例点结果
     */
    at(t, target = new Vec2()) {
        return this.delta(target).multiply(t).add(this.start);
    }
    /**
     * 求点与线段的最短距离
     * @param {Vec2} point 二维空间点
     * @param {boolean} clampToLine 是否限制于线段内
     * @return {number} 距离结果
     */
    closestPointToPointParameter(point, clampToLine) {
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
    closestPointToPoint(point, clampToLine, target = new Vec2()) {
        const t = this.closestPointToPointParameter(point, clampToLine);
        return this.delta(target).multiply(t).add(this.start);
    }
    /**
     * 二维线段判等
     * @param {Line2} line 二维线段
     * @return {boolean} 判等结果
     */
    equals(line) {
        return line.start.equals(this.start) && line.end.equals(this.end);
    }
    /**
     * 克隆二维线段
     * @return {Line2} 克隆结果
     */
    clone() {
        return new Line2().copy(this);
    }
    /**
     * 二维线段求长度
     * @return {number} 长度
     */
    length() {
        return new Vec2().subVectors(this.end, this.start).length();
    }
    /**
     * 二维线段判断相交
     * @param {Line2} other 二维线段
     * @return {boolean} 相交判断结果
     */
    crossWithLine(other) {
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

/**
 * @class 二维包围盒
 */
class Box2 {
    /**
     * 构造函数，传入值为空时表示空包围盒
     * @param {Vec2} [min=new Vec2(+Infinity, +Infinity)] 最小点
     * @param {Vec2} [max=new Vec2(-Infinity, -Infinity)] 最大点
     */
    constructor(min = new Vec2(+Infinity, +Infinity), max = new Vec2(-Infinity, -Infinity)) {
        this.min = min;
        this.max = max;
        if (!min.equals(new Vec2(+Infinity, +Infinity)) && !max.equals(new Vec2(-Infinity, -Infinity))) {
            this.corners = [
                Vec2.copy(min),
                new Vec2(max.x, min.y),
                Vec2.copy(max),
                new Vec2(min.x, max.y),
            ];
        }
        else {
            this.corners = [];
        }
    }
    /**
     * 通过最大最小点设置二维包围盒
     * @param {Vec2} min 最小点
     * @param {Vec2} max 最大点
     * @return {Box2} 二维包围盒
     */
    set(min, max) {
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
    setFromVec2Array(vecArray) {
        this.min = new Vec2().copy(vecArray[0]);
        this.max = new Vec2().copy(vecArray[0]);
        vecArray.forEach((v) => {
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
    setFromCenterAndSize(center, size) {
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
    clone() {
        return new Box2().copy(this);
    }
    /**
     * 复制二维包围盒
     * @param {Box2} box 二维包围盒
     * @return {Box2} 复制结果
     */
    copy(box) {
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
    makeEmpty() {
        this.min.x = this.min.y = +Infinity;
        this.max.x = this.max.y = -Infinity;
        this.corners = [];
        return this;
    }
    /**
     * 二维包围盒判空
     * @return {boolean} 判空结果
     */
    isEmpty() {
        // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
        return (this.max.x <= this.min.x) || (this.max.y <= this.min.y);
    }
    /**
     * 获取二维包围盒角点
     * @return {Vec2[]} 二维包围盒角点
     */
    getCorners() {
        const res = [];
        this.corners.forEach(corner => {
            res.push(Vec2.copy(corner));
        });
        return res;
    }
    /**
     * 获取二维包围盒左上角点
     * @return {Vec2} 二维包围盒左上角点
     */
    getLeftTopCorner() {
        return Vec2.copy(this.corners[0]);
    }
    /**
     * 获取二维包围盒右上角点
     * @return {Vec2} 二维包围盒右上角点
     */
    getRightTopCorner() {
        return Vec2.copy(this.corners[1]);
    }
    /**
     * 获取二维包围盒右下角点
     * @return {Vec2} 二维包围盒右下角点
     */
    getRightBottomCorner() {
        return Vec2.copy(this.corners[2]);
    }
    /**
     * 获取二维包围盒左下角点
     * @return {Vec2} 二维包围盒左下角点
     */
    getLeftBottomCorner() {
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
    getPoint(type) {
        const size = this.getSize();
        const center = this.getCenter();
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
    getCenter(target = new Vec2()) {
        return this.isEmpty() ? target.set(0, 0) : target.addVectors(this.min, this.max).multiply(0.5);
    }
    /**
     * 获取二维包围盒大小
     * @param {Vec2} [target=new Vec2()] 目标向量(用以存放二维包围盒大小)
     * @return {Vec2} 二维包围盒大小
     */
    getSize(target = new Vec2()) {
        return this.isEmpty() ? target.set(0, 0) : target.subVectors(this.max, this.min);
    }
    /**
     * 通过二维空间点扩展二维包围盒
     * @param {Vec2} point 二维空间点
     * @return {Box2} 扩展包围盒
     */
    expandByPoint(point) {
        this.min.min(point);
        this.max.max(point);
        return this;
    }
    /**
     * 通过向量扩展二维包围盒
     * @param {Vec2} vector 二维向量
     * @return {Box2} 扩展结果
     */
    expandByVector(vector) {
        this.min.sub(vector);
        this.max.add(vector);
        return this;
    }
    /**
     * 通过大小扩展二维包围盒
     * @param {number} scalar 扩展大小
     * @return {Box2} 扩展结果
     */
    expandByScalar(scalar) {
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
    containsPoint(point, isOrthogonal = true) {
        if (isOrthogonal) {
            return point.x < this.min.x || point.x > this.max.x ||
                point.y < this.min.y || point.y > this.max.y ? false : true;
        }
        else {
            if (this.isEmpty()) {
                return false;
            }
            for (let i = 0; i < this.corners.length; i++) {
                const corner = this.corners[i];
                const next = this.corners[(i + 1) % 4];
                const edge = new Vec2(next.x - corner.x, next.y - corner.y);
                const vec = new Vec2(point.x - corner.x, point.y - corner.y);
                if (edge.cross(vec) < 0) {
                    return false;
                }
            }
            return true;
        }
    }
    /**
     * 判断二维包围盒包含关系(if this contains other)
     * @param {Box2} box 其它包围盒
     * @return {boolean} 二维包围盒包含判断结果
     */
    containsBox(box) {
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
    getParameter(point, target = new Vec2()) {
        // This can potentially have a divide by zero if the box
        // has a size dimension of 0.
        return target.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y));
    }
    /**
     * 判断二维包围盒相交关系(if this intersect other)
     * @param {Box2} box 二维包围盒
     * @param {boolean} [isOrthogonal=true] 正交判断(当前包围盒)
     * @return {boolean} 相交判断结果
     */
    intersectsBox(box, isOrthogonal = true) {
        // using 4 splitting planes to rule out intersections
        // 基于点判断
        if (isOrthogonal) {
            return !(box.max.x < this.min.x
                || box.min.x > this.max.x
                || box.max.y < this.min.y
                || box.min.y > this.max.y);
        }
        else {
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
    clampPoint(point, target = new Vec2()) {
        return target.copy(point).clamp(this.min, this.max);
    }
    /**
     * 求点到二维包围盒的距离
     * @param {Vec2} point 二维空间点
     * @return {number} 距离
     */
    distanceToPoint(point) {
        const clampedPoint = new Vec2().copy(point).clamp(this.min, this.max);
        return clampedPoint.sub(point).length();
    }
    /**
     * 二维包围盒求交集
     * @param {Box2} box 二维包围盒
     * @return {Box2} 求交结果
     */
    intersect(box) {
        this.min.max(box.min);
        this.max.min(box.max);
        if (this.min.x > this.max.x || this.min.y > this.max.y) {
            return this.makeEmpty();
        }
        return this;
    }
    /**
     * 二维包围盒求并集
     * @param {Box2} box 二维包围盒
     * @return {Box2} 求并结果
     */
    union(box) {
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
    translate(offset) {
        this.min.add(offset);
        this.max.add(offset);
        return this;
    }
    /**
     * 二维包围盒判等
     * @param {Box2} box 二维包围盒
     * @return {boolean} 判等结果
     */
    equals(box) {
        return box.min.equals(this.min) && box.max.equals(this.max);
    }
}

/**
 * 三维包围盒
 * @class
 */
class Box3 {
    /**
     * 构造函数，传入值为空时表示空包围盒
     * @param {Vec3} [min=new Vec3(Number(Infinity))] 最小角点
     * @param {Vec3} [max=new Vec3(-Infinity)] 最大角点
     */
    constructor(min = new Vec3(Number(Infinity)), max = new Vec3(-Infinity)) {
        this.min = min;
        this.max = max;
    }
    intersectsSphere(sphere) {
        throw new Error('Method not implemented.');
    }
    /**
     * 设置三维包围盒的值
     * @param {Vec3} min 三维包围盒最小点
     * @param {Vec3} max 三维包围盒最大点
     * @return {Box3}
     */
    set(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    }
    /**
     * 由数组构建三维包围盒
     * @param {number[]} array 数组集合(每三个数视为一个三维空间点)
     * @return {Box3} 三维包围盒
     */
    setFromArray(array) {
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
            if (x < minX) {
                minX = x;
            }
            if (y < minY) {
                minY = y;
            }
            if (z < minZ) {
                minZ = z;
            }
            if (x > maxX) {
                maxX = x;
            }
            if (y > maxY) {
                maxY = y;
            }
            if (z > maxZ) {
                maxZ = z;
            }
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
    setFromPoints(points) {
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
    setFromCenterAndSize(center, size) {
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
    setFromObject(object) {
        this.makeEmpty();
        return this.expandByObject(object);
    }
    /**
     * 克隆三维包围盒
     * @return {Box3} 克隆结果
     */
    clone() {
        return new Box3().copy(this);
    }
    /**
     * 复制三维包围盒
     * @param {Box3} box 复制对象
     * @return {Box3} 复制结果
     */
    copy(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);
        return this;
    }
    /**
     * 三维包围盒置空
     * @return {Box3} 置空结果
     */
    makeEmpty() {
        this.min.x = this.min.y = this.min.z = Number(Infinity);
        this.max.x = this.max.y = this.max.z = -Infinity;
        return this;
    }
    /**
     * 三维包围盒判空
     * @return {boolean} 判空结果
     */
    isEmpty() {
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
    getCenter(target = new Vec3()) {
        return this.isEmpty() ? target.set(0, 0, 0) : target.addVectors(this.min, this.max).multiply(0.5);
    }
    /**
     * 获取三维包围盒大小
     * @param {Vec3} [target=new Vec3()] 结果保存对象
     * @return {Vec3} 三维包围盒大小
     */
    getSize(target = new Vec3()) {
        return this.isEmpty() ? target.set(0, 0, 0) : target.subVectors(this.max, this.min);
    }
    /**
     * 通过三维空间点扩展三维包围盒
     * @param {Vec3} point 三维空间点
     * @return {Box3} 扩展结果
     */
    expandByPoint(point) {
        this.min.min(point);
        this.max.max(point);
        return this;
    }
    /**
     * 通过三维向量扩展三维包围盒
     * @param {Vec3} vector 三维向量
     * @return {Box3} 扩展结果
     */
    expandByVector(vector) {
        this.min.sub(vector);
        this.max.add(vector);
        return this;
    }
    /**
     * 通过实数扩展三维包围盒
     * @param {number} scalar 扩展大小
     * @return {Box3} 扩展结果
     */
    expandByScalar(scalar) {
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
    expandByObject(object) {
        // Computes the world-axis-aligned bounding box of an object (including its children),
        // accounting for both the object's, and children's, world transforms
        object.updateWorldMatrix(false, false);
        const geometry = object.geometry;
        if (geometry !== undefined) {
            if (geometry.boundingBox === null) {
                geometry.computeBoundingBox();
            }
            const box3 = new Box3();
            box3.copy(geometry.boundingBox);
            box3.applyMatrix4(object.matrixWorld);
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
    containsPoint(point) {
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
    containsBox(other) {
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
    getParameter(point, target = new Vec3()) {
        // This can potentially have a divide by zero if the box
        // has a size dimension of 0.
        return target.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y), (point.z - this.min.z) / (this.max.z - this.min.z));
    }
    /**
     * 判断三维包围盒相交关系(if this intersect other)
     * @param {Box3} other 三维包围盒
     * @return {boolean} 相交判断结果
     */
    intersectsBox(other) {
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
    clampPoint(point, target = new Vec3()) {
        return target.copy(point).clamp(this.min, this.max);
    }
    /**
     * 三维空间点到三维包围盒的距离
     * @param {Vec3} point 三维包围盒
     * @return {number} 距离结果
     */
    distanceToPoint(point) {
        const clampedPoint = new Vec3().copy(point).clamp(this.min, this.max);
        return clampedPoint.sub(point).length();
    }
    /**
     * 三维包围盒求交集
     * @param {Box3} box 三维包围盒
     * @return {Box3} 求交结果
     */
    intersect(box) {
        this.min.max(box.min);
        this.max.min(box.max);
        // ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
        if (this.isEmpty()) {
            this.makeEmpty();
        }
        return this;
    }
    /**
     * 三维包围盒求并集
     * @param {Box3} box 三维包围盒
     * @return {Box3} 求并结果
     */
    union(box) {
        this.min.min(box.min);
        this.max.max(box.max);
        return this;
    }
    /**
     * 通过三维变换矩阵变化三维包围盒
     * @param {Matrix4} matrix 三维变换矩阵
     * @return {Box3} 变换结果
     */
    applyMatrix4(matrix) {
        // transform of empty box is an empty box.
        if (this.isEmpty()) {
            return this;
        }
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
    translate(offset) {
        this.min.add(offset);
        this.max.add(offset);
        return this;
    }
    /**
     * 三维包围盒判等
     * @param {Box3} other 三维包围盒
     * @return {boolean} 判等结果
     */
    equals(other) {
        return other.min.equals(this.min) && other.max.equals(this.max);
    }
}

/**
 * @class 三维线段
 */
class Line3 {
    /**
     * 构造函数
     * @param {Vec3} [start=new Vec3()] 线段起点，默认值为(0, 0, 0)
     * @param {Vec3} [end=new Vec3()] 线段终点，默认值为(0, 0, 0)
     */
    constructor(start = new Vec3(), end = new Vec3()) {
        this.start = start;
        this.end = end;
    }
}

/**
 * @class 二维圆
 */
class Circle {
    /**
     * 构造函数，默认值为圆心为原点,半径为0
     * @param {Vec2} [center=new Vec2()] 圆心
     * @param {number} [radius=0] 半径
     */
    constructor(center = new Vec2(), radius = 0) {
        this.center = center;
        this.radius = radius;
        this.center = Vec2.copy(center);
    }
    /**
     * 通过中心点与大小设置圆
     * @param {Vec2} center 圆心
     * @param {number} radius 半径
     * @return {Circle}
     */
    set(center, radius) {
        this.center = Vec2.copy(center);
        this.radius = radius;
        return this;
    }
    /**
     * 克隆圆
     * @return {Circle} 克隆结果
     */
    clone() {
        return new Circle().copy(this);
    }
    /**
     * 复制圆
     * @param {Circle} circle 复制对象
     * @return {Circle} 复制结果
     */
    copy(circle) {
        this.center.copy(circle.center);
        this.radius = circle.radius;
        return this;
    }
    /**
     * 圆置空
     * @return {Circle} 置空结果
     */
    makeEmpty() {
        this.center = new Vec2();
        this.radius = 0;
        return this;
    }
    /**
     * 圆判空
     * @return {boolean} 判空结果
     */
    isEmpty() {
        // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
        return this.radius === 0;
    }
    /**
     * 获取圆心
     * @param {Vec2} [target=new Vec2()] 目标结果对象
     * @return {Vec2} 圆心
     */
    getCenter(target = new Vec2()) {
        target.copy(this.center);
        return target;
    }
    /**
     * 获取半径
     * @param {number} [radius] 目标结果对象
     * @return {number} 半径
     */
    getRadius(radius) {
        return this.radius;
    }
    /**
     * 通过二维空间点扩展圆
     * @param {Vec2} point 二维空间点
     * @return {Circle} 扩展结果
     */
    expandByPoint(point) {
        this.radius = this.center.distanceTo(point);
        return this;
    }
    /**
     * 通过大小扩展圆
     * @param {number} scalar 扩展大小
     * @return {Circle} 扩展结果
     */
    expandByScalar(scalar) {
        this.radius += scalar;
        return this;
    }
    /**
     * 判断圆是否包含二维空间点
     * @param {Vec2} point 二维空间点
     * @return {boolean}  包含判断结果
     */
    containsPoint(point) {
        return this.center.distanceTo(point) < this.radius;
    }
    /**
     * 判断圆是否包含二维包围盒
     * @param {Box2} box 二维包围盒
     * @return {boolean} 包含判断结果
     */
    containsBox(box) {
        for (let i = 0; i < 4; i++) {
            if (!this.containsPoint(box.corners[i])) {
                return false;
            }
        }
        return true;
    }
    /**
     * 判断圆与二维包围盒的相交关系
     * @param {Box2} box 二维包围盒
     * @return {boolean} 相交判断结果
     */
    intersectsBox(box) {
        // using 4 splitting planes to rule out intersections
        for (let i = 0; i < 4; i++) {
            if (this.containsPoint(box.corners[i])) {
                return true;
            }
        }
        return false;
    }
    /**
     * 求点与圆的最短距离
     * @param {Vec2} point 二维空间点
     * @return {number} 距离
     */
    distanceToPoint(point) {
        return this.center.distanceTo(point) - this.radius;
    }
    /**
     * 圆求交集
     * @param {Circle} circle 二维圆
     * @return {Circle} 求交结果
     */
    intersect(circle) {
        this.center = this.center.add(circle.center);
        this.radius = this.radius + circle.radius - this.center.distanceTo(circle.center);
        this.radius = this.radius < 0 ? 0 : this.radius;
        return this;
    }
    /**
     * 圆求并集
     * @param {Circle} circle 二维圆
     * @return {Circle} 求并结果
     */
    union(circle) {
        this.center = this.center.add(circle.center);
        this.radius = (this.radius + circle.radius + this.center.distanceTo(circle.center)) / 2;
        return this;
    }
    /**
     * 圆的位移
     * @param {Vec2} offset 二维向量
     * @return {Circle} 位移结果
     */
    translate(offset) {
        this.center.add(offset);
        return this;
    }
    /**
     * 圆判等
     * @param {Circle} circle 二维圆
     * @return {boolean} 判等结果
     */
    equals(circle) {
        return this.center.equals(circle.center) && this.radius === circle.radius;
    }
}

export { Box2, Box3, Circle, DEG2RAD, Euler, EulerOrder, Line2, Line3, Matrix3, Matrix4, PI2, Quaternion, RAD2DEG, Vec2, Vec3, Vec4, ceilPowerOfTwo, clamp, damp, degToRad, euclideanModulo, fixed, floorPowerOfTwo, intMultiplyFloat, inverseLerp, isPowerIntegerOfTwo, isPowerOfTwo, kfRadius, lerp, mapLinear, modByFloat, nearestPowerIntegerOfTwo, nearestPowerOfTwo, pingpong, radToDeg, randFloat, randFloatSpread, randInt, resetObjectByRatio, resetPropertyByRatio, roundNumber, seededRandom, smootherstep, smoothstep };
//# sourceMappingURL=index.es6.js.map
