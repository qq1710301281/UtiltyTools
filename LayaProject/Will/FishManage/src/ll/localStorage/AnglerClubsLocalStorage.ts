import EventCenter from "../../public/core/Game/EventCenter";
import OfflineTimerCtrl from "../../public/core/Toos/OfflineTimerCtrl";
import BuildingData from "../../public/dataSheet/BuildingData";
import LLDataSheetManager from "../manager/LLDataSheetManager";
import GameConstants from "../other/GameConstants";
import AnglerClubsStorageData from "./AnglerClubsStorageData";
import LocalStorage = Laya.LocalStorage;

/**
 * 钓手俱乐部 数据存取
 */
export default class AnglerClubsLocalStorage
{
    /**
     * 时间间隔 5 分钟
     * 单位 秒
     */
    private static readonly OFFSET_TIME:number = 300;
    /**
     * 
     */
    private static instance: AnglerClubsLocalStorage = null;
    /**
     * 
     */
    private anglerClubs:Array<{island_id:number, building_id:number, coolingTime:number}> = [];
    /**
     * 唯一的名字
     */
    private LOCAL_STORAGE_NAME: string = "a29fba5c-ad61-54d1-a4e8-32557a72c229_will"; // -V2.0-DEMO-AnglerClubs



    constructor() {}
    
    public static get ins(): AnglerClubsLocalStorage
    {
        if (!this.instance)
        {
            this.instance = new AnglerClubsLocalStorage();
            let anglerClubs: any = LocalStorage.getJSON(this.instance.LOCAL_STORAGE_NAME);
            if (!anglerClubs)
            {
                let buildingsDatas:Array<BuildingData> = LLDataSheetManager.ins.buildingDataSheet.getSpecialBuildings(GameConstants.SPECIAL_BUILDING_TYPE_1);
                for (let i:number = 0; i<buildingsDatas.length; i++)
                {
                    let buildingsData: BuildingData = buildingsDatas[i];
                    this.instance.anglerClubs.push(
                        {
                            island_id: buildingsData.island_id,
                            building_id: buildingsData.building_id,
                            coolingTime: 0
                        }
                    );
                }
                this.instance.save();
            }
            else
            {
                this.instance.anglerClubs = anglerClubs;
            }
        }
        return this.instance;
    }

    public beginCountDown():void
    {
        let isSave:boolean = false;
        let offlineTime:number = OfflineTimerCtrl.Instance.GetOfflineTime(0);
        for(let i:number=0; i<this.anglerClubs.length; i++)
        {
            if(this.anglerClubs[i].coolingTime)
            {
                isSave = true;
                let temp:number = this.anglerClubs[i].coolingTime - offlineTime;
                this.anglerClubs[i].coolingTime = temp<0? 0 : temp;
            }
        }
        if(isSave)
        {
            this.save();
        }
        Laya.timer.loop(1000, this, this.loops);
    }

    private loops():void
    {
        let isSave:boolean = false;
        for(let i:number=0; i<this.anglerClubs.length; i++)
        {
            if(this.anglerClubs[i].coolingTime)
            {
                isSave = true;
                let temp:number = this.anglerClubs[i].coolingTime - 1;
                this.anglerClubs[i].coolingTime = temp<0? 0 : temp;
            }
        }
        if(isSave)
        {
            this.save();
        }
    }

    /**
     * 鼓舞
     * @param building_id 
     * @returns number 冷却剩余时间 如果大于 0 则不能鼓舞 如果等于 0 则可以鼓舞
     */
    public goForIt(building_id:number):number
    {
        let isSave:boolean = false;
        let coolingTime:number = 0;
        for(let i:number=0; i<this.anglerClubs.length; i++)
        {
            if(this.anglerClubs[i].building_id == building_id)
            {
                coolingTime = this.anglerClubs[i].coolingTime;
                if(coolingTime == 0)
                {
                    isSave = true;
                    this.anglerClubs[i].coolingTime = AnglerClubsLocalStorage.OFFSET_TIME;
                }
                break;
            }
        }
        if(isSave)
        {
            this.save();
        }
        return coolingTime;
    }

    private save():void
    {
        LocalStorage.setJSON(this.LOCAL_STORAGE_NAME, this.anglerClubs);
    }

}