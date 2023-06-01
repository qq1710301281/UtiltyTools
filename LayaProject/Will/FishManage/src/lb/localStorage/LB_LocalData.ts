import GameLocalStorage from "../../public/localStorage/GameLocalStorage";
import ui_mrg from "../../public/manager/ui_mrg";
import FerrisWheel_wnd from "../canvas/wnd/FerrisWheel_wnd";
import LBData from "../dataSheet/LB_Data";
import LBDataSheetManager from "../manager/LBDataSheetManager";
import { LB_TIME } from "./LB_TIME";

/**
 * 本地数据
 */
export default class LB_LocalData {

    private static instance: LB_LocalData;

    public static get Instance(): LB_LocalData {
        if (!this.instance) {
            this.instance = new LB_LocalData;
            this.instance.initData();
        }
        return this.instance;
    }

    private _aquarium = {};//海底世界数据

    private _knapsack = []; //背包鱼数据

    private _ferriswheel = {}; //摩天轮数据

    private _numci = 3;       //次数

    private initData() {
        let _aquarium: any = GameLocalStorage.Instance.gameData._aquarium;
        let _knapsack:any = GameLocalStorage.Instance.gameData._knapsack;
        let _ferriswheel:any = GameLocalStorage.Instance.gameData._ferriswheel;
        let _numci:number  = GameLocalStorage.Instance.gameData._numci;
        if (!_aquarium) {
            this._aquarium = {}; //默认是空
            this._knapsack = this.initbooks();
            this._ferriswheel = {};
            this._numci = 3;
            this.save()
        }
        else {
            this._aquarium = _aquarium;
            this._knapsack = _knapsack;
            this._ferriswheel = _ferriswheel;
            this._numci = _numci;
        }
    }

    //初始化图鉴数据
    initbooks():any[] {
        let obj = LBDataSheetManager.ins.Fish.getFishDatas();
        let data = [];
        for (let i = 0; i < obj.length; i++) {
            let item = {
                id:obj[i].id,
                isShow:false,
                time:-1,
            }
            data.push(item);
        }
        return data;
    }

    /**
     * 解锁了添加海底数据表
     */
    unlockingWord(building_id:number):void {
        //默认是10个 0是没解锁  1是解锁了
        if(!this._aquarium[`${building_id}`]) {
            this._aquarium[`${building_id}`] = [1,0,0,0,0,0,0,0,0,0];
            //默认第一层解锁 加入背包中去 鱼
            let dataItemCity = LBDataSheetManager.ins.underwater.gethappyCityDataItemDatas(building_id,1);
            this.UnlockFish(dataItemCity.fish1_id);
            this.UnlockFish(dataItemCity.fish2_id);
            this.UnlockFish(dataItemCity.fish3_id);
            this.UnlockFish(dataItemCity.fish4_id);
            this.save();
        }
    }


    /**获取次数 */
    getadmission():number {
        return this._numci;
    }

    /**修改次数 */
    setadmission(num:number):void {
        this._numci = num;
        this.save();
    }

    /**
     * 解锁了摩天轮
     */
    unlockingWheel(building_id:number):void {
        //默认是10个 0是没解锁  1是解锁了
        if(!this._ferriswheel[`${building_id}`]) {
            this._ferriswheel[`${building_id}`] = {
                mood:3, //默认给3个心情
                customer:[]
            };
            this.save();

            //初始化时间
            LB_TIME.getInstance().addJinjie(building_id);
        }
    }

    /** 
     * 更新交换位置
    */
    setWheel(building_id:number,data:any):void {
        this._ferriswheel[`${building_id}`]['customer'] = data;
    }
    /**
     * 存储摩天轮客户数据
     * @param building_id 
     */
    setWheelCustomer(building_id:number,data:any):void {
        this._ferriswheel[`${building_id}`]['customer'] = data;
        this.save();
    }

    /**
     * 获取摩天轮信息
     * @param building_id 
     */
    getWheel(building_id:number):any {
        return this._ferriswheel[`${building_id}`];
    }

    /**
     * 增加心情
     * @param building_id 
     */
    addmood(building_id:number):void {
        this._ferriswheel[`${building_id}`]['mood'] += 1;
        this._ferriswheel[`${building_id}`]['customer'] = [];
        this.save();
    }

    /**
     * 
     * 减少心情
     */
    deleTemood(building_id:number):void {

        if(this._ferriswheel[`${building_id}`]['mood'] > 0) {
            this._ferriswheel[`${building_id}`]['mood'] -= 1;
            //刷新UI
            if((ui_mrg.Instance.GetUI(LBData.Instance.WndName.FerrisWheel_wnd).owner as Laya.Image).visible == true) {
                (ui_mrg.Instance.GetUI(LBData.Instance.WndName.FerrisWheel_wnd) as FerrisWheel_wnd).rufreshUI();
            }
        }
        this.save();
    }


    /**获取海底数据表 */
    getWord(building_id:number):any[] {
        return this._aquarium[`${building_id}`];
    }

    /**解锁海底世界层 */
    unlocklayer(building_id:number,i:number):void {
        this._aquarium[building_id][i] = 1; //解锁了
        this.save();
    }

    /**
     * 添加鱼
     * @param 鱼的id
     * @param 时间 
     */
    UnlockFish(id:number,time:number = 0):boolean {
        let item:boolean = false;
        for (let i = 0; i < this._knapsack.length; i++) {
            if(this._knapsack[i].id == id) {
                this._knapsack[i].isShow = true;
                //检测是否要更新事件
                if(time !== 0) {
                    if(this._knapsack[i].time < time) {
                        //更新时间
                        this._knapsack[i].time = time;
                        item = true;
                    }
                }
            }            
        }
        this.save();
        return item;
    }


    /**
     * 获取鱼是否解锁
     */
    GetFishID(id:number):boolean {
        for (let i = 0; i < this._knapsack.length; i++) {
            if(this._knapsack[i].id == id) {
                if(this._knapsack[i].isShow) {
                    return true;
                }
            }            
        }
        return false;
    }


    /**
     * 获取已解锁鱼的数量
     */
    GetFishCount():number {
        let count = 0;
        for (let i = 0; i < this._knapsack.length; i++) {
            if(this._knapsack[i].isShow) {
                count += 1;
            }
        }

        return count;
    }


    private save() {
        GameLocalStorage.Instance.gameData._aquarium = this._aquarium;
        GameLocalStorage.Instance.gameData._knapsack = this._knapsack;
        GameLocalStorage.Instance.gameData._ferriswheel = this._ferriswheel;
        GameLocalStorage.Instance.gameData._numci       = this._numci;
        GameLocalStorage.Instance.save();
    }

}