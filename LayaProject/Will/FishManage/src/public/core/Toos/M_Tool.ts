import { NumArray } from "../Data/NumArray";

export default class M_Tool {

    //获取一个概率
    public static GetProRandomNum(proArr: NumArray): number {
        //概率数组
        let numArray: NumArray = proArr;
        // console.log(numArray);
        //要返回概率数组的索引
        let resultIndex: number = -1;
        //求放大1000倍的N 计算概率总和，放大1000倍
        let n: number = numArray.Sum() * 1000;
        //求结果 随机生成0~概率总和的数字
        let x: number = this.GetRandomNum(0, n) / 1000;
        // console.log(x);
        //求区间内的索引
        for (let i = 0; i < numArray.count; i++) {
            let pre: number = numArray.Sum(i);//区间下界;
            let next: number = numArray.Sum(i + 1)//区间上界;
            if (x >= pre && x < next)               //如果在该区间范围内，就返回结果退出循环
            {
                resultIndex = i;
                break;
            }

        }
        return resultIndex;
    }

    //获取一个区间内的随机整数
    public static GetRandomNum(minNum: number, maxNum: number): number {
        let resultNum: number;//结果的数字
        resultNum = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
        return resultNum;
    }

    //获取底层的子节点
    public static GetDeepChildByName(root: Laya.Node, name: string): Laya.Node {
        var targetChild: Laya.Node = root.getChildByName(name);//第一步 让这个目标节点找一下子节点；

        //如果这个目标点没有找到 执行第二步  挨个遍历各个子节点的子节点  
        if (targetChild == null) {
            //for循环遍历子节点
            for (let i = 0; i < root.numChildren; i++) {
                targetChild = this.GetDeepChildByName(root.getChildAt(i), name);
                if (targetChild != null) {
                    //如果中间有找到 就不要执行遍历了不然会顶掉这个值
                    return targetChild;
                }
            }
        }
        return targetChild;
    }

    //获取底层的组件
    public static GetDeepChildGetComponent(root: Laya.Node, component: typeof Laya.Component): any {
        var targetChild: any = root.getComponent(component);//第一步 让这个目标节点找一下子节点；

        //如果这个目标点没有找到 执行第二步  挨个遍历各个子节点的子节点  
        if (targetChild == null) {
            //for循环遍历子节点
            for (let i = 0; i < root.numChildren; i++) {
                targetChild = this.GetDeepChildGetComponent(root.getChildAt(i), component);
                if (targetChild != null) {
                    //如果中间有找到 就不要执行遍历了不然会顶掉这个值
                    return targetChild;
                }
            }
        }
        return targetChild;
    }

    //归一化向量
    public static normalizeObj(target: Laya.Vector3): Laya.Vector3 {
        var result: Laya.Vector3 = new Laya.Vector3();
        Laya.Vector3.normalize(target, result);
        return result;
    }

    //计算两个点的减法
    public static SubtractPoint(first: Laya.Point, second: Laya.Point): Laya.Point {
        let result: Laya.Point = new Laya.Point(first.x - second.x, first.y - second.y);
        return result;
    }

    //计算两个点的加法
    public static Plus(first: Laya.Point, second: Laya.Point): Laya.Point {
        let result: Laya.Point = new Laya.Point(first.x + second.x, first.y + second.y);
        return result;
    }


    /**
     * 获取秒
     */
    public static get Second() {
        let time: number = new Date().getTime();
        time = +(time / 1000).toFixed(0);
        return time;
    }

    /**
     * 通过秒获取以小时为单位的对象
     */
    public static GetHourBySecond(num) {
        let hour = Math.floor(num / 3600);//转换小时 
        let minute = Math.floor((num - hour * 3600) / 60);//转换分钟
        let second = num - (hour * 3600 + minute * 60);//转换秒数

        return [hour, minute, second];
        // console.log(hour, minute, second);
    }
}