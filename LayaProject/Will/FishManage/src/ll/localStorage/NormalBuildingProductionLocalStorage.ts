import BuildingsLocalStorage from "../../jqx/localStorage/BuildingsLocalStorage";
import BuildingStorageData from "../../jqx/localStorage/BuildingStorageData";
import Res_wnd from "../../public/canvas/wnd/Res_wnd";
import EventCenter from "../../public/core/Game/EventCenter";
import OfflineTimerCtrl from "../../public/core/Toos/OfflineTimerCtrl";
import BuildingData from "../../public/dataSheet/BuildingData";
import M_Data from "../../public/dataSheet/M_Data";
import assetLocalStorage from "../../public/localStorage/assetLocalStorage";
import ui_mrg from "../../public/manager/ui_mrg";
import LL_Data from "../dataSheet/LL_Data";
import LLDataSheetManager from "../manager/LLDataSheetManager";
import Calculator from "../other/Calculator";
import GameConstants from "../other/GameConstants";
import BuildingProductionStorageData from "./BuildingProductionStorageData";
import LocalStorage = Laya.LocalStorage;

/**
 * 建筑产出存取
 */
export default class NormalBuildingProductionLocalStorage
{
    /**
     * 时间间隔 60 秒
     */
    private static readonly OFFSET_TIME:number = 60;

    private static instance: NormalBuildingProductionLocalStorage = null;

    /**
     * 唯一的名字
     */
    private LOCAL_STORAGE_NAME: string = "30c16605-0038-503c-b5ce-e8b2e257e5aa_will"; // -V2.0-DEMO-BuildingProduction
    
    /**
     * 建筑产出数据
     * @param productionAllTime:number 产出总时间
     * @param oldProductionTime:number 上一次产出时间点
     * @param stopProductionTime:number 停止生产时长 2 小时 4 小时 6 小时
     * @param production_gold_coins:number 产出
     * @param stopProduction:number 是否停止生产 1 停止生产   0 继续生产
     */
    private buildingProductionLocalStorage: Array<{isLand_id:number, building_id: number, productionAllTime:number, oldProductionTime:number, stopProductionTime:number, production_gold_coins:number, stopProduction:number}> = [];

    /**
     * 是否输出调试信息
     */
    private isLog:boolean = false;



    constructor() {}

    public static get ins(): NormalBuildingProductionLocalStorage
    {
        if (!this.instance)
        {
            this.instance = new NormalBuildingProductionLocalStorage();
            let tempNormalBuildingProductionLocalStorage: any = LocalStorage.getJSON(this.instance.LOCAL_STORAGE_NAME);
            if (!tempNormalBuildingProductionLocalStorage)
            {
                let buildingsDatas:Array<BuildingData> = LLDataSheetManager.ins.buildingDataSheet.getIsLandBuildings([GameConstants.BUILDING_TYPE_2,GameConstants.BUILDING_TYPE_3]);
                for (let i: number = 0; i < buildingsDatas.length; i++)
                {
                    let buildingsData: BuildingData = buildingsDatas[i];
                    this.instance.buildingProductionLocalStorage.push(
                        {
                            isLand_id: buildingsData.island_id, //LLDataSheetManager.ins.regionDataSheet.getRegionData(buildingsData.region_id).island_id,
                            building_id: buildingsData.building_id,
                            productionAllTime: 0,
                            oldProductionTime: 0,
                            stopProductionTime: GameConstants.BUILDING_STOP_PRODUCTION_TIME_120 * 60,
                            production_gold_coins: 0,
                            stopProduction: 0
                        }
                    );
                }
                this.instance.save();
            }
            else
            {
                this.instance.buildingProductionLocalStorage = tempNormalBuildingProductionLocalStorage;
            }
            EventCenter.rigestEvent(GameConstants.BUILDING_UI_OPEN, this.instance.onBuildingUIOpen, this.instance);
        }
        return this.instance;
    }

    /**
     * 开始生产
     */
    public beginProduction():void
    {
        let allBuildingStopProduction:boolean = true;
        let offlineTime:number = OfflineTimerCtrl.Instance.GetOfflineTime(0);
        let normalProductionBuildings:Array<BuildingStorageData> = BuildingsLocalStorage.ins.getProductionBuilding();
        if(offlineTime != 0)
        {
            for(let i:number=0; i<normalProductionBuildings.length; i++)
            {
                for(let j:number=0; j<this.buildingProductionLocalStorage.length; j++)
                {
                    if(this.buildingProductionLocalStorage[j].building_id == normalProductionBuildings[i].building_id)
                    {
                        let offlineRevenueTRime:number = 0; // 离线收益时间
                        let productionAllTime:number = this.buildingProductionLocalStorage[j].productionAllTime + offlineTime; // 总的生产时间
                        this.buildingProductionLocalStorage[j].productionAllTime = productionAllTime;
                        if(this.buildingProductionLocalStorage[j].stopProduction == 0)
                        {
                            allBuildingStopProduction = false;
                            if(productionAllTime >= this.buildingProductionLocalStorage[j].stopProductionTime)
                            {
                                this.buildingProductionLocalStorage[j].stopProduction = 1;
                                offlineRevenueTRime = this.buildingProductionLocalStorage[j].stopProductionTime - this.buildingProductionLocalStorage[j].oldProductionTime;
                            }
                            else
                            {
                                offlineRevenueTRime = productionAllTime - this.buildingProductionLocalStorage[j].oldProductionTime;
                            }
                            if(this.isLog)
                            {
                                console.log("离线时长 == "+offlineTime+" 上一次产出时间点 == "+this.buildingProductionLocalStorage[j].oldProductionTime+" 总产出时长 == " + this.buildingProductionLocalStorage[j].productionAllTime + " 产出时长 == " + offlineRevenueTRime);
                            }
                            if(offlineRevenueTRime >= NormalBuildingProductionLocalStorage.OFFSET_TIME)
                            {
                                let buildingData:BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(normalProductionBuildings[i].building_id, normalProductionBuildings[i].level);
                                if(buildingData)
                                {
                                    let coin_percent:number = LLDataSheetManager.ins.levelDataSheet.getLevelData(assetLocalStorage.Instance.playerLevel).coin_percent/100;
                                    let minutes:number = Math.ceil(offlineRevenueTRime / NormalBuildingProductionLocalStorage.OFFSET_TIME);
                                    let production_gold_coins:number = 0;
                                    if(buildingData.type == GameConstants.BUILDING_TYPE_2)
                                    {
                                        if(buildingData.production_gold_coins != "0")
                                        {
                                            production_gold_coins = Calculator.calcExpression(buildingData.production_gold_coins, normalProductionBuildings[i].level);
                                        }
                                    }
                                    else if(buildingData.type == GameConstants.BUILDING_TYPE_3)
                                    {
                                        production_gold_coins = parseFloat(buildingData.production_gold_coins);
                                    }
                                    let offlineProductionCoin:number = (production_gold_coins * minutes + Math.ceil((production_gold_coins * coin_percent)) * minutes);
                                    this.buildingProductionLocalStorage[j].production_gold_coins += offlineProductionCoin;
                                    this.buildingProductionLocalStorage[j].oldProductionTime = productionAllTime;
                                    this.dispatcherProductionEvent();
                                    EventCenter.postEvent(GameConstants.BUILDING_PRODUCTION_PERCENT_TIME_UPDATE, [normalProductionBuildings[i].building_id, productionAllTime / this.buildingProductionLocalStorage[j].stopProductionTime]);
                                    if(this.isLog)              
                                    {
                                        console.log("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 建筑 ID == " + buildingData.building_id + " 离线产出 == " + offlineProductionCoin + " 总产出 == " + this.buildingProductionLocalStorage[j].production_gold_coins);
                                    }
                                }
                                else
                                {
                                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 没有这个ID为 " + normalProductionBuildings[i].building_id + "的 等级为 "+normalProductionBuildings[i].level+" 的建筑");
                                }
                            }
                        }
                        break;
                    }
                }
            }
            this.save();
            if(allBuildingStopProduction)
            {
                this.dispatcherProductionEvent();
                if(this.isLog)
                {
                    console.log("离线登录,所有建筑停止产出!");
                }
            }
        }
        Laya.timer.loop(1000, this, this.loops);
    }

    private loops():void
    {
        let saveData:boolean = false;
        let normalProductionBuildings:Array<BuildingStorageData> = BuildingsLocalStorage.ins.getProductionBuilding();
        for(let i:number=0; i<normalProductionBuildings.length; i++)
        {
            for(let j:number=0; j<this.buildingProductionLocalStorage.length; j++)
            {
                if(this.buildingProductionLocalStorage[j].building_id == normalProductionBuildings[i].building_id)
                {
                    let productionAllTime:number = this.buildingProductionLocalStorage[j].productionAllTime + 1;
                    this.buildingProductionLocalStorage[j].productionAllTime = productionAllTime;
                    if(this.buildingProductionLocalStorage[j].stopProduction == 0)
                    {
                        saveData = true;
                        if(this.buildingProductionLocalStorage[j].productionAllTime >= this.buildingProductionLocalStorage[j].stopProductionTime)
                        {
                            this.buildingProductionLocalStorage[j].stopProduction = 1;
                        }
                        let offsetTime:number = productionAllTime - this.buildingProductionLocalStorage[j].oldProductionTime;
                        if(this.isLog)
                        {
                            console.log("在线 上一次产出时间点 == "+this.buildingProductionLocalStorage[j].oldProductionTime+" 在线 总产出时长 == " + this.buildingProductionLocalStorage[j].productionAllTime + " 在线产出时长 == " + offsetTime);
                        }
                        if(offsetTime >= NormalBuildingProductionLocalStorage.OFFSET_TIME)
                        {
                            let buildingData:BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(normalProductionBuildings[i].building_id, normalProductionBuildings[i].level);
                            if(buildingData)
                            {
                                let coin_percent:number = LLDataSheetManager.ins.levelDataSheet.getLevelData(assetLocalStorage.Instance.playerLevel).coin_percent/100;
                                let production_gold_coins:number = 0;
                                if(buildingData.type == GameConstants.BUILDING_TYPE_2)
                                {
                                    if(buildingData.production_gold_coins != "0")
                                    {
                                        production_gold_coins = Calculator.calcExpression(buildingData.production_gold_coins, normalProductionBuildings[i].level);
                                    }
                                }
                                else if(buildingData.type == GameConstants.BUILDING_TYPE_3)
                                {
                                    production_gold_coins = parseFloat(buildingData.production_gold_coins);
                                }
                                let onlineProductionCoin:number = (production_gold_coins + Math.ceil(production_gold_coins * coin_percent));
                                this.buildingProductionLocalStorage[j].production_gold_coins += onlineProductionCoin;
                                this.buildingProductionLocalStorage[j].oldProductionTime = productionAllTime;
                                this.dispatcherProductionEvent();
                                if(this.isLog)
                                {
                                    console.log("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 建筑 ID == "+ buildingData.building_id +" 在线产出 = " + onlineProductionCoin + " 总产出 == " + this.buildingProductionLocalStorage[j].production_gold_coins);
                                }
                            }
                            else
                            {
                                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 没有这个ID为 " + normalProductionBuildings[i].building_id + "的 等级为 "+normalProductionBuildings[i].level+" 的建筑");
                            }
                        }
                        EventCenter.postEvent(GameConstants.BUILDING_PRODUCTION_PERCENT_TIME_UPDATE, [normalProductionBuildings[i].building_id, productionAllTime / this.buildingProductionLocalStorage[j].stopProductionTime]);
                    }
                    else
                    {
                        if(this.isLog)
                        {
                            console.log("在线 建筑ID == " + this.buildingProductionLocalStorage[j].isLand_id + " 停止产出!");
                        }
                    }
                    break;
                }
            }
        }
        if(saveData)
        {
            this.save();
            
            if(this.isLog)
            {
                console.log("在线 有建筑产出,保存数据!");
            }
        }
        else
        {
            if(this.isLog)
            {
                console.log("在线 所有建筑停止产出,停止保存!");
            }
        }
    }

    /**
     * 获得建筑产出
     * @param building_id 
     */
    public getBuildingProductionCoin(building_id:number):void
    {
        let coin:number = 0;
        for(let i:number=0; i<this.buildingProductionLocalStorage.length; i++)
        {
            if(this.buildingProductionLocalStorage[i].building_id == building_id)
            {
                this.buildingProductionLocalStorage[i].stopProduction = 1;
                this.buildingProductionLocalStorage[i].oldProductionTime = 0;
                this.buildingProductionLocalStorage[i].productionAllTime = 0;
                coin = this.buildingProductionLocalStorage[i].production_gold_coins;
                this.buildingProductionLocalStorage[i].production_gold_coins = 0;
                this.buildingProductionLocalStorage[i].stopProduction = 0;
                break;
            }
        }
        EventCenter.postEvent(GameConstants.BUILDING_HIDE_COIN, building_id);
        assetLocalStorage.Instance.coin += coin;
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
    }


    private onBuildingUIOpen():void
    {
        this.dispatcherProductionEvent();
        for(let i:number=0; i<this.buildingProductionLocalStorage.length; i++)
        {
            if(this.buildingProductionLocalStorage[i].stopProduction)
            {
                EventCenter.postEvent(GameConstants.BUILDING_PRODUCTION_PERCENT_TIME_UPDATE, [this.buildingProductionLocalStorage[i].building_id, 1]);
            }
        }
    }

    /**
     * 发出建筑产出事件
     */
    private dispatcherProductionEvent():void
    {
        let buildingProductionStorageDatas:Array<BuildingProductionStorageData> = [];
        for(let i:number=0; i<this.buildingProductionLocalStorage.length; i++)
        {
            if(this.buildingProductionLocalStorage[i].isLand_id == LL_Data.Instance.currentIsLandID)
            {
                if(this.buildingProductionLocalStorage[i].production_gold_coins)
                {
                    let buildingProductionStorageData:BuildingProductionStorageData = new BuildingProductionStorageData();
                    buildingProductionStorageData.building_id = this.buildingProductionLocalStorage[i].building_id;
                    buildingProductionStorageData.isLand_id = this.buildingProductionLocalStorage[i].isLand_id;
                    buildingProductionStorageData.oldProductionTime = this.buildingProductionLocalStorage[i].oldProductionTime;
                    buildingProductionStorageData.productionAllTime = this.buildingProductionLocalStorage[i].productionAllTime;
                    buildingProductionStorageData.production_gold_coins = this.buildingProductionLocalStorage[i].production_gold_coins;
                    buildingProductionStorageData.stopProduction = this.buildingProductionLocalStorage[i].stopProduction;
                    buildingProductionStorageData.stopProductionTime = this.buildingProductionLocalStorage[i].stopProductionTime;
                    buildingProductionStorageDatas.push(buildingProductionStorageData);
                }
            }
        }
        EventCenter.postEvent(GameConstants.BUILDING_PRODUCTION, buildingProductionStorageDatas);
    }

    /**
     * 更新建筑停止生产总时长
     * @param island_id:number 岛屿 ID
     * @param stopProductionTime:number 停止生产总时长
     */
    public updateBuildingStopProductionTime(island_id:number, stopProductionTime:number):void
    {
        let update:boolean = true;
        for(let j:number=0; j<this.buildingProductionLocalStorage.length; j++)
        {
            if(this.buildingProductionLocalStorage[j].isLand_id == island_id)
            {
                let tempStopProductionTime:number = stopProductionTime * 60;
                if(this.buildingProductionLocalStorage[j].stopProductionTime != tempStopProductionTime)
                {
                    this.buildingProductionLocalStorage[j].stopProductionTime = tempStopProductionTime;
                }
                else
                {
                    update = false;
                    break;
                }
            }
        }
        if(update)
        {
            this.save();
        }
    }

    private save():void
    {
        LocalStorage.setJSON(this.LOCAL_STORAGE_NAME, this.buildingProductionLocalStorage);
    }

}