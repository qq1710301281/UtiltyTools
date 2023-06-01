import BuildingsLocalStorage from "../../jqx/localStorage/BuildingsLocalStorage";
import BuildingStorageData from "../../jqx/localStorage/BuildingStorageData";
import EventCenter from "../../public/core/Game/EventCenter";
import OfflineTimerCtrl from "../../public/core/Toos/OfflineTimerCtrl";
import AnglerData from "../../public/dataSheet/AnglerData";
import IslandData from "../../public/dataSheet/IslandData";
import LLDataSheetManager from "../manager/LLDataSheetManager";
import GameConstants from "../other/GameConstants";
import AnglerStorageData from "./AnglerStorageData";
import IslandLocalStorage from "./IslandLocalStorage";
import IslandLocalStorageData from "./IslandLocalStorageData";

import LocalStorage = Laya.LocalStorage;

/**
 * 钓手 数据存取
 */
export default class AnglerLocalStorage
{
    /**
     * 
     */
    private static instance: AnglerLocalStorage = null;
    /**
     * @ id 钓手 ID
     * @ emotion_reduce_rate 心情值减少总时间 4 * 5 每4小时掉一个心情值 一共五个心情值 总时间为 72000
     * @ emotion 心情值 5
     */
    private anglers:Array<{id:number, emotion_reduce_rate:number, emotion:number, lock:number}> = [];
    /**
     * 唯一的名字
     */
    private LOCAL_STORAGE_NAME: string = "1f9bf1a2-aab0-5ed3-b6f4-b731d06cbbda_will"; // -V2.0-DEMO-Angler



    constructor() {}

    public static get ins(): AnglerLocalStorage
    {
        if (!this.instance)
        {
            this.instance = new AnglerLocalStorage();
            let anglers: any = LocalStorage.getJSON(this.instance.LOCAL_STORAGE_NAME);
            if (!anglers)
            {
                let anglerDatas:Array<AnglerData> = LLDataSheetManager.ins.anglerDataSheet.getAnglerDatas();
                for (let i: number = 0; i < anglerDatas.length; i++)
                {
                    let anglerData:AnglerData = anglerDatas[i];
                    this.instance.anglers.push(
                        {
                            id: anglerData.id,
                            emotion_reduce_rate: 0,
                            emotion: anglerData.emotion,
                            lock: anglerData.lock
                        }
                    );
                }
                this.instance.unLockAnglers(false);
                this.instance.save();
            }
            else
            {
                this.instance.anglers = anglers;
            }
            EventCenter.rigestEvent(GameConstants.SPECIAL_BUILDING_UPDATE, this.instance.specialBuildingUpdate, this.instance);
        }
        return this.instance;
    }

    public beginCountDown():void
    {
        let offlineTime:number = OfflineTimerCtrl.Instance.GetOfflineTime(0);
        for(let i:number=0; i<this.anglers.length; i++)
        {
            if(this.anglers[i].lock == 0)
            {
                if(this.anglers[i].emotion_reduce_rate)
                {
                    let building_id:number = LLDataSheetManager.ins.anglerClubsDataSheet.getBuildingID(this.anglers[i].id);
                    let island_id:number = LLDataSheetManager.ins.buildingDataSheet.getIsland(building_id);
                    let islandIsSelf:boolean = IslandLocalStorage.ins.getIslandsIsSelf(island_id);
                    let anglerData:AnglerData = LLDataSheetManager.ins.anglerDataSheet.getAnglerData(this.anglers[i].id);
                    if(islandIsSelf)
                    {
                        if(anglerData)
                        {
                            let temp:number = this.anglers[i].emotion_reduce_rate - offlineTime;
                            this.anglers[i].emotion_reduce_rate = temp<0? 0 : temp;
                            this.anglers[i].emotion = Math.ceil(this.anglers[i].emotion_reduce_rate / anglerData.emotion_reduce_rate);
                        }
                    }
                }
            }
        }
        this.save();
        Laya.timer.loop(1000, this, this.loops);
    }

    private loops():void
    {
        let isSave:boolean = false;
        this.unLockAnglers(false);
        for(let i:number=0; i<this.anglers.length; i++)
        {
            if(this.anglers[i].lock == 0)
            {
                if(this.anglers[i].emotion_reduce_rate)
                {
                    let building_id:number = LLDataSheetManager.ins.anglerClubsDataSheet.getBuildingID(this.anglers[i].id);
                    let island_id:number = LLDataSheetManager.ins.buildingDataSheet.getIsland(building_id);
                    let islandIsSelf:boolean = IslandLocalStorage.ins.getIslandsIsSelf(island_id);
                    let anglerData:AnglerData = LLDataSheetManager.ins.anglerDataSheet.getAnglerData(this.anglers[i].id);
                    if(islandIsSelf)
                    {
                        if(anglerData)
                        {
                            isSave = true;
                            let temp:number = this.anglers[i].emotion_reduce_rate - 1;
                            this.anglers[i].emotion_reduce_rate = temp<0? 0 : temp;
                            this.anglers[i].emotion = Math.ceil(this.anglers[i].emotion_reduce_rate / anglerData.emotion_reduce_rate);
                            if((this.anglers[i].emotion_reduce_rate % anglerData.emotion_reduce_rate) == 0)
                            {
                                this.dispatcherUpdateAnglerEvent();
                            }
                        }
                    }
                }
            }
        }
        if(isSave)
        {
            this.save();
        }
    }

    /**
     * 解锁相应岛屿 钓手俱乐部的的 钓手
     * @param island_id 
     */
    public unLockAnglers(isSave:boolean):void
    {
        let islandLocalStorageDatas:Array<IslandLocalStorageData> = IslandLocalStorage.ins.islandLocalStorage();
        let island_id:number = 0;
        let buy:number = 0;
        for(let j:number=0; j<islandLocalStorageDatas.length; j++)
        {
            island_id = islandLocalStorageDatas[j].id;
            buy = islandLocalStorageDatas[j].buy;
            for(let i:number=0; i<this.anglers.length; i++)
            {
                if(this.anglers[i].lock)
                {
                    let building_id:number = LLDataSheetManager.ins.anglerClubsDataSheet.getBuildingID(this.anglers[i].id);
                    let building_level:number = BuildingsLocalStorage.ins.getBuildingMaxLevel(building_id);
                    let anglerIsland_id:number = LLDataSheetManager.ins.buildingDataSheet.getIsland(building_id);
                    if(anglerIsland_id == island_id)
                    {
                        if(buy)
                        {
                            let isUnlock:boolean = LLDataSheetManager.ins.anglerClubsDataSheet.isUnlock(building_id, building_level, this.anglers[i].id);
                            if(isUnlock)
                            {
                                let anglerData:AnglerData = LLDataSheetManager.ins.anglerDataSheet.getAnglerData(this.anglers[i].id);
                                if(anglerData)
                                {
                                    isSave = true;
                                    this.anglers[i].emotion_reduce_rate = anglerData.emotion_reduce_rate * 5;
                                    this.anglers[i].emotion = anglerData.emotion;
                                    this.anglers[i].lock = 0;
                                }
                            }
                        }
                    }
                }
            }
        }
        if(isSave)
        {
            this.save();
        }
    }

    /**
     * 获得所有钓手当前数据
     */
    public getAnglerStorageDatas():Array<AnglerStorageData>
    {
        let anglerStorageDatas:Array<AnglerStorageData> = [];
        for(let i:number=0; i<this.anglers.length; i++)
        {
            let anglerStorageData:AnglerStorageData = new AnglerStorageData();
            anglerStorageData.emotion = this.anglers[i].emotion;
            anglerStorageData.emotion_reduce_rate = this.anglers[i].emotion_reduce_rate;
            anglerStorageData.id = this.anglers[i].id;
            anglerStorageData.lock = this.anglers[i].lock;
            anglerStorageDatas.push(anglerStorageData);
        }
        return anglerStorageDatas;
    }

    private specialBuildingUpdate(buildingStorageData: BuildingStorageData):void
    {
        let buildingUpgradeData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(buildingStorageData.building_id, buildingStorageData.level);
        if(buildingUpgradeData.building_type == GameConstants.SPECIAL_BUILDING_TYPE_1)
        {
            this.unLockAnglers(true);
            this.dispatcherUpdateAnglerEvent();
        }
    }

    public dispatcherUpdateAnglerEvent():void
    {
        let anglerStorageDatas:Array<AnglerStorageData> = this.getAnglerStorageDatas();
        EventCenter.postEvent(GameConstants.UPDATE_ANGLER, anglerStorageDatas);
    }

    /**
     * 鼓舞
     * @param angler_id 
     */
    public goForIt(angler_id:number):void
    {
        let isSave:boolean = false;
        for(let i:number=0; i<this.anglers.length; i++)
        {
            if(this.anglers[i].id == angler_id)
            {
                let anglerData:AnglerData = LLDataSheetManager.ins.anglerDataSheet.getAnglerData(angler_id);
                if(anglerData)
                {
                    this.anglers[i].emotion_reduce_rate = anglerData.emotion_reduce_rate * 5;
                    this.anglers[i].emotion = anglerData.emotion;
                    isSave = true;
                    break;
                }
            }
        }
        if(isSave)
        {
            this.save();
            this.dispatcherUpdateAnglerEvent();
        }
    }

    private save():void
    {
        LocalStorage.setJSON(this.LOCAL_STORAGE_NAME, this.anglers);
    }

}