import { Dictionary } from "../core/Data/Dictionary";
import OfflineTimerCtrl from "../core/Toos/OfflineTimerCtrl";
import GameLocalStorage from "../localStorage/GameLocalStorage";

/**
 * 此类用于计算收益增加步长固定  收益时间固定的函数   为1.1版本 
 * 存在问题：时间会统一计算，假如在开始计算收益后是当前分钟的第59秒，会从1秒后计算一次收益 解决这个问题需要重新启动一共loop，考虑项目存在大量的计时器，所以选择这种方式节省内存
 */
export default class offlineTime_mrg {

    private static instance: offlineTime_mrg;

    public static get Instance(): offlineTime_mrg {
        if (!this.instance) {
            this.instance = new offlineTime_mrg;
        }
        return this.instance;
    }

    //每次奖励的间隔时间
    public onceReward: number = 1000;

    public totalTime: number = 60;

    //用来储存所有的时间一个总的集合  //表结构是  { "tag" : {reward:{xx:100,y:200},pasaTimer:1111} }
    private totalTimeDic;
    private addTimeDic;

    public Init() {
        this.totalTimeDic = GameLocalStorage.Instance.gameData.totalTimeDic;
        this.addTimeDic = GameLocalStorage.Instance.gameData.addTimeDic;

        if (!this.totalTimeDic) {
            this.totalTimeDic = {};
            this.addTimeDic = {}
            this.save();
        }

        //获取离线的分钟数
        let offlineTime = OfflineTimerCtrl.Instance.GetOfflineTime(0);

        //遍历当前的节点  增加离线的收益
        for (const key in this.totalTimeDic) {
            //所有逻辑都要建立在时间不为0 的情况下
            if (this.totalTimeDic[key]["time"] != 0) {
                let otherTime;
                //如果超过了120分钟
                if (offlineTime + this.totalTimeDic[key]["time"] > this.totalTime) {
                    otherTime = this.totalTime - this.totalTimeDic[key]["time"];
                    this.totalTimeDic[key]["time"] = 0;//重置时间
                }
                else {
                    //否则就正常加上时间和材料
                    otherTime = offlineTime;
                    this.totalTimeDic[key]["time"] += offlineTime;
                }

                //给每个材料结算剩下的钱就结束循环了
                for (const key_reward in this.totalTimeDic[key]["reward"]) {
                    let reward = otherTime * this.addTimeDic[key]["reward"][key_reward];
                    this.totalTimeDic[key]["reward"][key_reward] += reward;
                }
            }

        }

        //继续开始奖励的循环
        this.startReward();
    }


    /**
     * 开始执行奖励的循环
     */
    private startReward() {
        Laya.timer.loop(this.onceReward, this, () => {
            for (const key in this.totalTimeDic) {
                //在当前时间不为0的情况下进行走时间的操作  否则就不增加了
                if (this.totalTimeDic[key]["time"] != 0) {
                    for (const key_reward in this.totalTimeDic[key]["reward"]) {
                        this.totalTimeDic[key]["reward"][key_reward] += this.addTimeDic[key]["reward"][key_reward];
                    }
                    this.totalTimeDic[key]["time"] += 1;
                    if (this.totalTimeDic[key]["time"] > this.totalTime) {
                        this.totalTimeDic[key]["time"] = 0;//重置时间 相当于重置
                    }

                    //如果有回调函数就执行
                    if (this.runFncDic.ContainsKey(key)) {
                        let fun: Function = this.runFncDic.GetValue(key);
                        // console.log("执行了函数");
                        fun();
                    }
                }
            }
            this.save();
        })
    }

    /**
     *  添加奖励到集合中
     * @param rewardDic  字典格式 {tag:{材料A:1,材料B:2}}
     *    // let rewardDic = { fishPoint: { reward: { a: 2, b: 2 } } };
        // this.AddReward(rewardDic)
     * @param isReset 是否重置时间  一般在领取之后重新添加这个奖励或者第一次  不重置是在材料奖励升级后调用的方法
     */
    public AddReward(rewardDic, isReset: boolean = false) {
        // console.log(rewardDic);
        for (const key in rewardDic) {
            //这是新增
            if (!this.totalTimeDic[key]) {
                let str: string = JSON.stringify(rewardDic);
                let obj = JSON.parse(str);
                this.totalTimeDic[key] = obj[key];
                this.totalTimeDic[key]["time"] = 1;
                this.addTimeDic[key] = rewardDic[key];
            }
            else {
                this.addTimeDic[key] = rewardDic[key];
                //如果需要重置时间
                if (isReset) {
                    console.log("重置事件了");
                    for (const key_reward in this.totalTimeDic[key]["reward"]) {
                        this.totalTimeDic[key]["reward"][key_reward] = 0;
                    }
                    this.totalTimeDic[key]["time"] = 1;
                }
            }
        }
        this.save();
    }


    /**
     * 通过奖励集合的Key值 获得奖励的集合
     * @param rewardDic 可以写空的 因为值用的了集合的key
     * this.GetReward({ fishPoint: {} }) 
     */
    public GetReward(rewardDic) {
        for (const key in rewardDic) {
            return this.totalTimeDic[key];
        }
    }

    /** 要执行的字典函数 */
    private runFncDic: Dictionary<string, Function> = new Dictionary;

    /**
     * 添加函数到字典中
     * 
     */
    public AddFncToDic(tag: string, Fnc: Function) {
        if (!this.runFncDic.ContainsKey(tag)) {
            this.runFncDic.Add(tag, Fnc);
        }
        else {
            this.runFncDic.SetDicValue(tag, Fnc);
        }
    }



    /** 储存 */
    private save() {
        GameLocalStorage.Instance.gameData.totalTimeDic = this.totalTimeDic;
        GameLocalStorage.Instance.gameData.addTimeDic = this.addTimeDic;
        GameLocalStorage.Instance.save();
    }
}