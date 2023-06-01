/**
 * 贝塞尔曲线
 * 7、8 阶曲线按照规律自推
 * 2阶 (1-t)   P0 +           tP1
 * 3阶 (1-t)^2 P0 + 2 (1-t)   tP1 +                                                                                                  t^2 P2
 * 4阶 (1-t)^3 P0 + 3 (1-t)^2 tP1 +  3 (1-t)   t^2 P2 +                                                                              t^3 P3
 * 5阶 (1-t)^4 P0 + 4 (1-t)^3 tP1 +  6 (1-t)^2 t^2 P2 +  4 (1-t)   t^3 P3 +                                                          t^4 P4
 * 6阶 (1-t)^5 P0 + 5 (1-t)^4 tP1 + 10 (1-t)^3 t^2 P2 + 10 (1-t)^2 t^3 P3 +  5 (1-t)   t^4 P4 +                                      t^5 P5
 * 7阶 (1-t)^6 P0 + 6 (1-t)^5 tP1 + 15 (1-t)^4 t^2 P2 + 20 (1-t)^3 t^3 P3 + 15 (1-t)^2 t^4 P4 +  6 (1-t)   t^5 P5 +                  t^6 P6
 * 8阶 (1-t)^7 P0 + 7 (1-t)^6 tP1 + 21 (1-t)^5 t^2 P2 + 35 (1-t)^4 t^3 P3 + 35 (1-t)^3 t^4 P4 + 21 (1-t)^2 t^5 P5 + 7 (1-t) t^6 P6 + t^7 P7
 */
export default class BezierUtils extends Laya.Script {
    
    constructor() { super(); }
    
    onEnable(): void {
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 2阶贝塞尔
    /**
     * 生成2阶贝塞尔曲线定点数据
     * @param p0   起始点  { x : number, y : number, z : number }
     * @param p1   终止点  { x : number, y : number, z : number }
     * @param num  线条精度
     * @param tick 绘制系数
     */
    public createBezier2(p0:Laya.Vector3, p1:Laya.Vector3, num:number, tick:number):Array<Laya.Vector3>
    {
        let pointMum = num || 100;
        let _tick = tick || 1.0;
        let t = _tick / (pointMum - 1);
        let vector3s:Array<Laya.Vector3> = [];
        for (let i = 0; i < pointMum; i++)
        {
            let vector3:Laya.Vector3 = this.getBezier2NowPoint(p0, p1, i, t);
            vector3s.push(vector3);
        }
        return vector3s;
    }

    /**
     * 获取2阶贝塞尔曲线中指定位置的点坐标
     * @param p0
     * @param p1
     * @param num
     * @param tick
     */
    private getBezier2NowPoint(p0:Laya.Vector3, p1:Laya.Vector3, num:number, tick:number):Laya.Vector3
    {
            let x:number = this.bezier2(p0.x, p1.x, num * tick);
            let y:number = this.bezier2(p0.y, p1.y, num * tick);
            let z:number = this.bezier2(p0.z, p1.z, num * tick);
            return new Laya.Vector3(x, y, z);
    }
    
    /**
     * 2阶贝塞尔曲线公式
     * @param p0_XYZ
     * @param p1_XYZ
     * @param t
     * 2阶贝塞尔曲线公式
     * (1-t)P0 + tP1
     * (1-t)*P0 + t*P1
     * P0 = (1-t) * P0
     * P1 = t * P1
     */
    private bezier2(p0_XYZ:number, p1_XYZ:number, t:number):number
    {
        let _P0 = (1 - t) * p0_XYZ;
        let _P1 = t * p1_XYZ;
        return _P0 + _P1;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 3阶贝塞尔
    /**
     * 生成3阶贝塞尔曲线定点数据
     * @param p0   起始点  { x : number, y : number, z : number }
     * @param p1   控制点1 { x : number, y : number, z : number }
     * @param p2   终止点  { x : number, y : number, z : number }
     * @param num  线条精度
     * @param tick 绘制系数
     */
    public createBezier3(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, num:number, tick:number):Array<Laya.Vector3>
    {
        let pointMum = num || 100;
        let _tick = tick || 1.0;
        let t = _tick / (pointMum - 1);
        let vector3s:Array<Laya.Vector3> = [];
        for (let i = 0; i < pointMum; i++)
        {
            let vector3:Laya.Vector3 = this.getBezier3NowPoint(p0, p1, p2, i, t);
            vector3s.push(vector3);
        }
        return vector3s;
    }

    /**
     * 获取3阶贝塞尔曲线中指定位置的点坐标
     * @param p0
     * @param p1
     * @param p2
     * @param num
     * @param tick
     */
    private getBezier3NowPoint(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, num:number, tick:number):Laya.Vector3
    {
            let x:number = this.bezier3(p0.x, p1.x, p2.x, num * tick);
            let y:number = this.bezier3(p0.y, p1.y, p2.y, num * tick);
            let z:number = this.bezier3(p0.z, p1.z, p2.z, num * tick);
            return new Laya.Vector3(x, y, z);
    }
    
    /**
     * 3阶贝塞尔曲线公式
     * @param p0_XYZ
     * @param p1_XYZ
     * @param p2_XYZ
     * @param t
     * 3阶贝塞尔曲线公式
     * (1-t)^2P0 + 2(1-t)tP1 + t^2*P2
     * (1-t)^2*P0 + 2*(1-t)*t*P1 + t^2*P2
     * P0 = (1-t)^2 * P0
     * P1 = 2 * (1-t) * t * P1
     * P2 = t^2 * P2
     */
    private bezier3(p0_XYZ:number, p1_XYZ:number, p2_XYZ:number, t:number):number
    {
        let _P0 =     Math.pow((1 - t), 2) *                  p0_XYZ;
        let _P1 = 2 *          (1 - t)     *             t  * p1_XYZ;
        let _P2 =                            Math.pow(t, 2) * p2_XYZ;
        return _P0 + _P1 + _P2;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 4阶贝塞尔
    /**
     * 生成4阶贝塞尔曲线定点数据
     * @param p0   起始点  { x : number, y : number, z : number }
     * @param p1   控制点1 { x : number, y : number, z : number }
     * @param p2   控制点2 { x : number, y : number, z : number }
     * @param p3   终止点  { x : number, y : number, z : number }
     * @param num  线条精度
     * @param tick 绘制系数
     */
    public createBezier4(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, p3:Laya.Vector3, num:number, tick:number):Array<Laya.Vector3>
    {
        let pointMum = num || 100;
        let _tick = tick || 1.0;
        let t = _tick / (pointMum - 1);
        let vector3s:Array<Laya.Vector3> = [];
        for (let i = 0; i < pointMum; i++)
        {
            let vector3:Laya.Vector3 = this.getBezier4NowPoint(p0, p1, p2, p3, i, t);
            vector3s.push(vector3);
        }
        return vector3s;
    }

    /**
     * 获取4阶贝塞尔曲线中指定位置的点坐标
     * @param p0
     * @param p1
     * @param p2
     * @param p3
     * @param num
     * @param tick
     */
    private getBezier4NowPoint(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, p3:Laya.Vector3, num:number, tick:number):Laya.Vector3
    {
            let x:number = this.bezier4(p0.x, p1.x, p2.x, p3.x, num * tick);
            let y:number = this.bezier4(p0.y, p1.y, p2.y, p3.y, num * tick);
            let z:number = this.bezier4(p0.z, p1.z, p2.z, p3.z, num * tick);
            return new Laya.Vector3(x, y, z);
    }
    
    /**
     * 4阶贝塞尔曲线公式
     * @param p0_XYZ
     * @param p1_XYZ
     * @param p2_XYZ
     * @param p3_XYZ
     * @param t
     * 4阶贝塞尔曲线公式
     * (1-t)^3P0 + 3(1-t)^2tP1 + 3(1-t)t^2P2 + t^3*P3
     * (1-t)^3*P0 + 3*(1-t)^2*t*P1 + 3*(1-t)*t^2*P2 + t^3*P3
     * P0 = (1-t)^3 * P0
     * P1 = 3 * (1-t)^2 * t * P1
     * P2 = 3 * (1-t) * t^2 * P2
     * P3 = t^3 * P3
     */
    private bezier4(p0_XYZ:number, p1_XYZ:number, p2_XYZ:number, p3_XYZ:number, t:number):number
    {
        let _P0 =     Math.pow((1 - t), 3) *                  p0_XYZ;
        let _P1 = 3 * Math.pow((1 - t), 2) *             t  * p1_XYZ;
        let _P2 = 3 *          (1 - t)     * Math.pow(t, 2) * p2_XYZ;
        let _P3 =                            Math.pow(t, 3) * p3_XYZ;
        return _P0 + _P1 + _P2 +_P3;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 5阶贝塞尔
    /**
     * 生成5阶贝塞尔曲线定点数据
     * @param p0   起始点  { x : number, y : number, z : number }
     * @param p1   控制点1 { x : number, y : number, z : number }
     * @param p2   控制点2 { x : number, y : number, z : number }
     * @param p3   控制点3 { x : number, y : number, z : number }
     * @param p4   终止点  { x : number, y : number, z : number }
     * @param num  线条精度
     * @param tick 绘制系数
     */
    public createBezier5(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, p3:Laya.Vector3, p4:Laya.Vector3, num:number, tick:number):Array<Laya.Vector3>
    {
        let pointMum = num || 100;
        let _tick = tick || 1.0;
        let t = _tick / (pointMum - 1);
        let vector3s:Array<Laya.Vector3> = [];
        for (let i = 0; i < pointMum; i++)
        {
            let vector3:Laya.Vector3 = this.getBezier5NowPoint(p0, p1, p2, p3, p4, i, t);
            vector3s.push(vector3);
        }
        return vector3s;
    }

    /**
     * 获取5阶贝塞尔曲线中指定位置的点坐标
     * @param p0
     * @param p1
     * @param p2
     * @param p3
     * @param p4
     * @param num
     * @param tick
     */
    private getBezier5NowPoint(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, p3:Laya.Vector3, p4:Laya.Vector3, num:number, tick:number):Laya.Vector3
    {
            let x:number = this.bezier5(p0.x, p1.x, p2.x, p3.x, p4.x, num * tick);
            let y:number = this.bezier5(p0.y, p1.y, p2.y, p3.y, p4.y, num * tick);
            let z:number = this.bezier5(p0.z, p1.z, p2.z, p3.z, p4.z, num * tick);
            return new Laya.Vector3(x, y, z);
    }
    
    /**
     * 5阶贝塞尔曲线公式
     * @param p0_XYZ
     * @param p1_XYZ
     * @param p2_XYZ
     * @param p3_XYZ
     * @param p4_XYZ
     * @param t
     * 5阶贝塞尔曲线公式
     * (1-t)^4P0 + 4(1-t)^3tP1 + 6(1-t)^2*t^2P2 + 4(1-t)t^3P3 + t^4*P4
     * (1-t)^4*P0 + 4*(1-t)^3*t*P1 + 6*(1-t)^2*t^2*P2 + 4*(1-t)*t^3*p3 + t^4*P4
     * P0 = (1-t)^4 * P0
     * P1 = 4 * (1-t)^3 * t * P1
     * P2 = 6 * (1-t)^2 * t^2 * P2
     * P3 = 4 * (1-t) * t^3 * p3
     * P4 = t^4 * P4
     */
    private bezier5(p0_XYZ:number, p1_XYZ:number, p2_XYZ:number, p3_XYZ:number, p4_XYZ:number, t:number):number
    {
        let _P0 =     Math.pow((1 - t), 4) *                  p0_XYZ;
        let _P1 = 4 * Math.pow((1 - t), 3) *             t  * p1_XYZ;
        let _P2 = 6 * Math.pow((1 - t), 2) * Math.pow(t, 2) * p2_XYZ;
        let _P3 = 4 *          (1 - t)     * Math.pow(t, 3) * p3_XYZ;
        let _P4 =                            Math.pow(t, 4) * p4_XYZ;
        return _P0 + _P1 + _P2 +_P3 + _P4;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 6阶贝塞尔
    /**
     * 生成6阶贝塞尔曲线定点数据
     * @param p0   起始点  { x : number, y : number, z : number }
     * @param p1   控制点1 { x : number, y : number, z : number }
     * @param p2   控制点2 { x : number, y : number, z : number }
     * @param p3   控制点3 { x : number, y : number, z : number }
     * @param p4   控制点4 { x : number, y : number, z : number }
     * @param p5   终止点  { x : number, y : number, z : number }
     * @param num  线条精度
     * @param tick 绘制系数
     */
    public createBezier6(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, p3:Laya.Vector3, p4:Laya.Vector3, p5:Laya.Vector3, num:number, tick:number):Array<Laya.Vector3>
    {
        let pointMum = num || 100;
        let _tick = tick || 1.0;
        let t = _tick / (pointMum - 1);
        let vector3s:Array<Laya.Vector3> = [];
        for (let i = 0; i < pointMum; i++)
        {
            let vector3:Laya.Vector3 = this.getBezier6NowPoint(p0, p1, p2, p3, p4, p5, i, t);
            vector3s.push(vector3);
        }
        return vector3s;
    }

    /**
     * 获取6阶贝塞尔曲线中指定位置的点坐标
     * @param p0
     * @param p1
     * @param p2
     * @param p3
     * @param p4
     * @param p5
     * @param num
     * @param tick
     */
    private getBezier6NowPoint(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, p3:Laya.Vector3, p4:Laya.Vector3, p5:Laya.Vector3, num:number, tick:number):Laya.Vector3
    {
            let x:number = this.bezier6(p0.x, p1.x, p2.x, p3.x, p4.x, p5.x, num * tick);
            let y:number = this.bezier6(p0.y, p1.y, p2.y, p3.y, p4.y, p5.y, num * tick);
            let z:number = this.bezier6(p0.z, p1.z, p2.z, p3.z, p4.z, p5.z, num * tick);
            return new Laya.Vector3(x, y, z);
    }

    /**
     * 6阶贝塞尔曲线公式
     * @param p0_XYZ
     * @param p1_XYZ
     * @param p2_XYZ
     * @param p3_XYZ
     * @param p4_XYZ
     * @param p5_XYZ
     * @param t
     * 6阶贝塞尔曲线公式
     * (1-t)^5P0 + 5(1-t)^4tP1 + 10(1-t)^3*t^2P2 + 10(1-t)^2t^3P3 + 5(1-t)t^4P4 + t^5*P5
     * (1-t)^5*P0 + 5*(1-t)^4*t*P1 + 10*(1-t)^3*t^2*P2 + 10*(1-t)^2*t^3*P3 + 5*(1-t)*t^4*P4 + t^5*P5
     * P0 = (1-t)^5 * P0
     * P1 = 5 * (1-t)^4 * t * P1
     * P2 = 10 * (1-t)^3 * t^2 * P2
     * P3 = 10 * (1-t)^2 * t^3 * P3
     * P4 = 5 * (1-t) * t^4 * P4
     * P5 = t^5 * P5
     */
    private bezier6(p0_XYZ:number, p1_XYZ:number, p2_XYZ:number, p3_XYZ:number, p4_XYZ:number, p5_XYZ:number, t:number):number
    {
        let _P0 =      Math.pow((1 - t), 5) *                  p0_XYZ;
        let _P1 =  5 * Math.pow((1 - t), 4) *             t  * p1_XYZ;
        let _P2 = 10 * Math.pow((1 - t), 3) * Math.pow(t, 2) * p2_XYZ;
        let _P3 = 10 * Math.pow((1 - t), 2) * Math.pow(t, 3) * p3_XYZ;
        let _P4 =  5 * (1 - t)              * Math.pow(t, 4) * p4_XYZ;
        let _P5 =                             Math.pow(t, 5) * p5_XYZ;
        return _P0 + _P1 + _P2 +_P3 + _P4 + _P5;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 7阶贝塞尔
    /**
     * 生成7阶贝塞尔曲线定点数据
     * @param p0   起始点  { x : number, y : number, z : number }
     * @param p1   控制点1 { x : number, y : number, z : number }
     * @param p2   控制点2 { x : number, y : number, z : number }
     * @param p3   控制点3 { x : number, y : number, z : number }
     * @param p4   控制点4 { x : number, y : number, z : number }
     * @param p5   控制点5 { x : number, y : number, z : number }
     * @param p6   终止点  { x : number, y : number, z : number }
     * @param num  线条精度
     * @param tick 绘制系数
     */
    public createBezier7(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, p3:Laya.Vector3, p4:Laya.Vector3, p5:Laya.Vector3, p6:Laya.Vector3, num:number, tick:number):Array<Laya.Vector3>
    {
        let pointMum = num || 100;
        let _tick = tick || 1.0;
        let t = _tick / (pointMum - 1);
        let vector3s:Array<Laya.Vector3> = [];
        for (let i = 0; i < pointMum; i++)
        {
            let vector3:Laya.Vector3 = this.getBezier7NowPoint(p0, p1, p2, p3, p4, p5, p6, i, t);
            vector3s.push(vector3);
        }
        return vector3s;
    }

    /**
     * 获取7阶贝塞尔曲线中指定位置的点坐标
     * @param p0
     * @param p1
     * @param p2
     * @param p3
     * @param p4
     * @param p5
     * @param p6
     * @param num
     * @param tick
     */
    private getBezier7NowPoint(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, p3:Laya.Vector3, p4:Laya.Vector3, p5:Laya.Vector3, p6:Laya.Vector3, num:number, tick:number):Laya.Vector3
    {
            let x:number = this.bezier7(p0.x, p1.x, p2.x, p3.x, p4.x, p5.x, p6.x, num * tick);
            let y:number = this.bezier7(p0.y, p1.y, p2.y, p3.y, p4.y, p5.y, p6.y, num * tick);
            let z:number = this.bezier7(p0.z, p1.z, p2.z, p3.z, p4.z, p5.z, p6.z, num * tick);
            return new Laya.Vector3(x, y, z);
    }

    /**
     * 7阶贝塞尔曲线公式
     * @param p0_XYZ
     * @param p1_XYZ
     * @param p2_XYZ
     * @param p3_XYZ
     * @param p4_XYZ
     * @param p5_XYZ
     * @param p6_XYZ
     * @param t
     * 7阶贝塞尔曲线公式
     * (1-t)^6P0 + 6(1-t)^5tP1 + 15(1-t)^4t^2P2 + 20(1-t)^3t^3P3 + 15(1-t)^2t^4P4 + 6(1-t)t^5P5 + t^6*P6
     * (1-t)^6*P0 + 6*(1-t)^5*t*P1 + 15*(1-t)^4*t^2*P2 + 20*(1-t)^3*t^3*P3 + 15*(1-t)^2*t^4*P4 + 6*(1-t)*t^5*P5 + t^6*P6
     * P0 = (1-t)^6 * P0
     * P1 = 6 * (1-t)^5 * t * P1
     * P2 = 15 * (1-t)^4 * t^2 * P2
     * P3 = 20 * (1-t)^3 * t^3 * P3
     * P4 = 15 * (1-t)^2 * t^4 * P4
     * P5 = 6 * (1-t) * t^5 * P5
     * P6 = t^6 * P6
     */
    private bezier7(p0_XYZ:number, p1_XYZ:number, p2_XYZ:number, p3_XYZ:number, p4_XYZ:number, p5_XYZ:number, p6_XYZ:number, t:number):number
    {
        let _P0 =      Math.pow((1 - t), 6) *                  p0_XYZ;
        let _P1 =  6 * Math.pow((1 - t), 5) *             t  * p1_XYZ;
        let _P2 = 15 * Math.pow((1 - t), 4) * Math.pow(t, 2) * p2_XYZ;
        let _P3 = 20 * Math.pow((1 - t), 3) * Math.pow(t, 3) * p3_XYZ;
        let _P4 = 15 * Math.pow((1 - t), 2) * Math.pow(t, 4) * p4_XYZ;
        let _P5 =  6 *          (1 - t)     * Math.pow(t, 5) * p5_XYZ;
        let _P6 =                             Math.pow(t, 6) * p6_XYZ;
        return _P0 + _P1 + _P2 +_P3 + _P4 + _P5 + _P6;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 8阶贝塞尔
    /**
     * 生成8阶贝塞尔曲线定点数据
     * @param p0   起始点  { x : number, y : number, z : number }
     * @param p1   控制点1 { x : number, y : number, z : number }
     * @param p2   控制点2 { x : number, y : number, z : number }
     * @param p3   控制点3 { x : number, y : number, z : number }
     * @param p4   控制点4 { x : number, y : number, z : number }
     * @param p5   控制点5 { x : number, y : number, z : number }
     * @param p6   控制点6 { x : number, y : number, z : number }
     * @param p7   终止点  { x : number, y : number, z : number }
     * @param num  线条精度
     * @param tick 绘制系数
     */
    public createBezier8(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, p3:Laya.Vector3, p4:Laya.Vector3, p5:Laya.Vector3, p6:Laya.Vector3, p7:Laya.Vector3, num:number, tick:number):Array<Laya.Vector3>
    {
        let pointMum = num || 100;
        let _tick = tick || 1.0;
        let t = _tick / (pointMum - 1);
        let vector3s:Array<Laya.Vector3> = [];
        for (let i = 0; i < pointMum; i++)
        {
            let vector3:Laya.Vector3 = this.getBezier8NowPoint(p0, p1, p2, p3, p4, p5, p6, p7, i, t);
            vector3s.push(vector3);
        }
        return vector3s;
    }

    /**
     * 获取8阶贝塞尔曲线中指定位置的点坐标
     * @param p0
     * @param p1
     * @param p2
     * @param p3
     * @param p4
     * @param p5
     * @param p6
     * @param p7
     * @param num
     * @param tick
     */
    private getBezier8NowPoint(p0:Laya.Vector3, p1:Laya.Vector3, p2:Laya.Vector3, p3:Laya.Vector3, p4:Laya.Vector3, p5:Laya.Vector3, p6:Laya.Vector3, p7:Laya.Vector3, num:number, tick:number):Laya.Vector3
    {
            let x:number = this.bezier8(p0.x, p1.x, p2.x, p3.x, p4.x, p5.x, p6.x, p7.x, num * tick);
            let y:number = this.bezier8(p0.y, p1.y, p2.y, p3.y, p4.y, p5.y, p6.y, p7.y, num * tick);
            let z:number = this.bezier8(p0.z, p1.z, p2.z, p3.z, p4.z, p5.z, p6.z, p7.z, num * tick);
            return new Laya.Vector3(x, y, z);
    }

    /**
     * 8阶贝塞尔曲线公式
     * @param p0_XYZ
     * @param p1_XYZ
     * @param p2_XYZ
     * @param p3_XYZ
     * @param p4_XYZ
     * @param p5_XYZ
     * @param p6_XYZ
     * @param p7_XYZ
     * @param t
     * 8阶贝塞尔曲线公式
     * (1-t)^7P0 + 7(1-t)^6tP1 + 21(1-t)^5t^2P2 + 35(1-t)^4t^3P3 + 35(1-t)^3t^4P4 + 21(1-t)^2t^5P5 + 7(1-t)t^6P6 + t^7P7
     * (1-t)^7*P0 + 7*(1-t)^6*t*P1 + 21*(1-t)^5*t^2*P2 + 35*(1-t)^4*t^3*P3 + 35*(1-t)^3*t^4*P4 + 21*(1-t)^2*t^5*P5 + 7*(1-t)*t^6*P6 + t^7*P7
     * P0 = (1-t)^7 * P0
     * P1 = 7 * (1-t)^6 * t * P1
     * P2 = 21 * (1-t)^5 * t^2 * P2
     * P3 = 35 * (1-t)^4 * t^3 * P3
     * P4 = 35 * (1-t)^3 * t^4 * P4
     * P5 = 21 * (1-t)^2 * t^5 * P5
     * P6 = 7 * (1-t) * t^6 * P6
     * P7 = t^7 * P7
     */
    private bezier8(p0_XYZ:number, p1_XYZ:number, p2_XYZ:number, p3_XYZ:number, p4_XYZ:number, p5_XYZ:number, p6_XYZ:number, p7_XYZ:number, t:number):number
    {
        let _P0 =      Math.pow((1 - t), 7) *                  p0_XYZ;
        let _P1 =  7 * Math.pow((1 - t), 6) *             t  * p1_XYZ;
        let _P2 = 21 * Math.pow((1 - t), 5) * Math.pow(t, 2) * p2_XYZ;
        let _P3 = 35 * Math.pow((1 - t), 4) * Math.pow(t, 3) * p3_XYZ;
        let _P4 = 35 * Math.pow((1 - t), 3) * Math.pow(t, 4) * p4_XYZ;
        let _P5 = 21 * Math.pow((1 - t), 2) * Math.pow(t, 5) * p5_XYZ;
        let _P6 =  7 *          (1 - t)     * Math.pow(t, 6) * p6_XYZ;
        let _P7 =                             Math.pow(t, 7) * p7_XYZ;
        return _P0 + _P1 + _P2 +_P3 + _P4 + _P5 + _P6 + _P7;
    }

    onDisable(): void {
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // n阶贝塞尔
    /**
     * 生成n阶贝塞尔曲线定点数据
     * @param poss 控制点数组
     * @param num 线条精度
     * @param tick 绘制系数
     */
    public createBezierN(poss:Array<Laya.Vector3>, num:number, tick:number):Array<Laya.Vector3>
    {
        let pointMum = num || 100;
        let _tick = tick || 1.0;
        let ratio = _tick / (pointMum - 1);

        //控制点数（阶数）
        let controlPointNum:number = poss.length;

        //杨辉三角
        let mi:Array<number> = new Array<number>(controlPointNum);
        mi[0] = mi[1] = 1;
        for (let i:number=3; i<=controlPointNum; i++)
        {
            let tm:Array<number> = new Array<number>(i - 1);
            for (let j:number=0; j<tm.length; j++)
            {
                tm[j] = mi[j];
            }

            mi[0] = mi[i - 1] = 1;
            for (let k = 0; k < i - 2; k++) {
                mi[k + 1] = tm[k] + tm[k + 1];
            }
        }

        //计算坐标点
        let result:Array<Laya.Vector3> = new Array<Laya.Vector3>();
        for (let l:number=0; l<num; l++)
        {
            let t:number = 0;
            let vector3:Laya.Vector3 = new Laya.Vector3(0, 0, 0);
            for (let m:number=0; m<controlPointNum; m++)
            {
                t = ratio * l;
                vector3.x += Math.pow(1 - t, controlPointNum - m - 1) * poss[m].x * Math.pow(t, m) * mi[m];
                vector3.y += Math.pow(1 - t, controlPointNum - m - 1) * poss[m].y * Math.pow(t, m) * mi[m];
                vector3.z += Math.pow(1 - t, controlPointNum - m - 1) * poss[m].z * Math.pow(t, m) * mi[m];
            }
            result[l] = vector3;
        }
        return result;
    }
}