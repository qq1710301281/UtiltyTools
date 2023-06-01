import BuildingData from "../../public/dataSheet/BuildingData";
import LLDataSheetManager from "../../ll/manager/LLDataSheetManager";
import GameConstants from "../../ll/other/GameConstants";
import assetLocalStorage from "../../public/localStorage/assetLocalStorage";
import GameLocalStorage from "../../public/localStorage/GameLocalStorage";
import BuildingStorageData from "./BuildingStorageData";
import BackpackLocalStorage from "../../ll/localStorage/BackpackLocalStorage";
import BuildingUpdateResult from "./BuildingUpdateResult";
import GameUtils from "../../ll/other/GameUtils";
import IslandLocalStorageData from "../../ll/localStorage/IslandLocalStorageData";
import IslandLocalStorage from "../../ll/localStorage/IslandLocalStorage";
import ui_mrg from "../../public/manager/ui_mrg";
import JQX_Data from "../dataSheet/JQX_Data";
import Upgrade_wnd from "../canvas/wnd/Upgrade_wnd";
import EventCenter from "../../public/core/Game/EventCenter";
import LBDataSheetManager from "../../lb/manager/LBDataSheetManager";
import underwaterData from "../../public/dataSheet/underwaterData";
import LB_LocalData from "../../lb/localStorage/LB_LocalData";
import Calculator from "../../ll/other/Calculator";
import SoundBolTime, { SoundName } from "../../lb/manager/SoundBolTime";
import M_Data from "../../public/dataSheet/M_Data";
import Res_wnd from "../../public/canvas/wnd/Res_wnd";


export default class BuildingsLocalStorage {

    private static instance: BuildingsLocalStorage = null;

    private buildingsStorageData: Array<{ isLand_id: number, building_id: number, type: number, level: number }> = [];



    constructor() { }

    public static get ins(): BuildingsLocalStorage {
        if (!this.instance) {
            this.instance = new BuildingsLocalStorage;
            let tempBuildingsData: any = GameLocalStorage.Instance.gameData.buildingsStorageData;
            if (!tempBuildingsData) {
                let buildingsDatas: Array<BuildingData> = LLDataSheetManager.ins.buildingDataSheet.getIsLandBuildings([GameConstants.BUILDING_TYPE_1, GameConstants.BUILDING_TYPE_2, GameConstants.BUILDING_TYPE_3]);
                for (let i: number = 0; i < buildingsDatas.length; i++) {
                    let buildingsData: BuildingData = buildingsDatas[i];
                    this.instance.buildingsStorageData.push(
                        {
                            isLand_id: buildingsData.island_id, //LLDataSheetManager.ins.regionDataSheet.getRegionData(buildingsData.region_id).island_id,
                            building_id: buildingsData.building_id,
                            type: buildingsData.type,
                            level: buildingsData.level
                        }
                    );
                }
                this.instance.save();
            }
            else {
                this.instance.buildingsStorageData = tempBuildingsData;
            }
        }
        return this.instance;
    }

    /**
     * 获得所有建筑升级数据
     */
    public getBuildingStorageData(isLandID: number): Array<BuildingStorageData> {
        let array: Array<BuildingStorageData> = [];
        for (let i: number = 0; i < this.buildingsStorageData.length; i++) {
            if (this.buildingsStorageData[i].isLand_id == isLandID) {
                let buildingStorageData: BuildingStorageData = new BuildingStorageData();
                buildingStorageData.isLand_id = this.buildingsStorageData[i].isLand_id;
                buildingStorageData.building_id = this.buildingsStorageData[i].building_id;
                buildingStorageData.level = this.buildingsStorageData[i].level;
                buildingStorageData.type = this.buildingsStorageData[i].type;
                array.push(buildingStorageData);
            }
        }
        return array;
    }

    /**
     * 获得指定建筑当前等级
     * @param building_id:number 建筑 ID
     */
    public getBuildingMaxLevel(building_id: number): number {
        let maxLevel: number = 0;
        for (let i: number = 0; i < this.buildingsStorageData.length; i++) {
            if (this.buildingsStorageData[i].building_id == building_id) {
                maxLevel = this.buildingsStorageData[i].level;
                break;
            }
        }
        return maxLevel;
    }

    /**
     * 获得所有已购买岛屿能产出金币的建筑
     */
    public getProductionBuilding(): Array<BuildingStorageData> {
        let array: Array<BuildingStorageData> = [];
        for (let i: number = 0; i < this.buildingsStorageData.length; i++) {
            let islandLocalStorageData: IslandLocalStorageData = IslandLocalStorage.ins.getIslandLocalStorageData(this.buildingsStorageData[i].isLand_id);
            if (islandLocalStorageData.buy) {
                if (this.buildingsStorageData[i].level > 0) {
                    let buildingUpgradeData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this.buildingsStorageData[i].building_id, this.buildingsStorageData[i].level);
                    if (buildingUpgradeData.production_gold_coins) {
                        if (this.buildingsStorageData[i].type == GameConstants.BUILDING_TYPE_2 || this.buildingsStorageData[i].type == GameConstants.BUILDING_TYPE_3) {
                            let buildingStorageData: BuildingStorageData = new BuildingStorageData();
                            buildingStorageData.isLand_id = this.buildingsStorageData[i].isLand_id;
                            buildingStorageData.building_id = this.buildingsStorageData[i].building_id;
                            buildingStorageData.level = this.buildingsStorageData[i].level;
                            buildingStorageData.type = this.buildingsStorageData[i].type;
                            array.push(buildingStorageData);
                        }
                    }
                }
            }
        }
        return array;
    }

    /**
     * 建筑升级
     */
    public upgradeBuilding(buildingStorageData: BuildingStorageData): BuildingUpdateResult {
        let buildingUpdateResult: BuildingUpdateResult = null;
        let buildingUpgradeData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(buildingStorageData.building_id, buildingStorageData.level + 1);
        let skip:boolean = false;
        if(buildingUpgradeData.type == GameConstants.BUILDING_TYPE_2 && (buildingStorageData.level + 1 == 1))
        {
            skip = true;
        }
        if (buildingUpgradeData) {

            let update_gold_coins: number = 0;
            let update_diamonds:number = 0;
            let item_count1: number = 0;
            let item_count2: number = 0;
            let item_count3: number = 0;
            let item_count4: number = 0;
            let update_reward_exp:number = 0;
            let update_reward_star:number = 0;

            let conditions1Complete: boolean = false;
            let conditions2Complete: boolean = false;
            let conditions3Complete: boolean = false;
            let conditions4Complete: boolean = false;
            let conditions5Complete: boolean = false;
            let conditions6Complete: boolean = false;
            let conditions7Complete: boolean = false;

            if (buildingUpgradeData.type == GameConstants.BUILDING_TYPE_2) {
                if (buildingUpgradeData.update_gold_coins != "0") {
                    update_gold_coins = Calculator.calcExpression(buildingUpgradeData.update_gold_coins, buildingStorageData.level + 1);
                }
                if (buildingUpgradeData.item_count1 != "0") {
                    item_count1 = Calculator.calcExpression(buildingUpgradeData.item_count1, buildingStorageData.level + 1);
                }
                if (buildingUpgradeData.item_count2 != "0") {
                    item_count2 = Calculator.calcExpression(buildingUpgradeData.item_count2, buildingStorageData.level + 1);
                }
                if (buildingUpgradeData.item_count3 != "0") {
                    item_count3 = Calculator.calcExpression(buildingUpgradeData.item_count3, buildingStorageData.level + 1);
                }
                if (buildingUpgradeData.item_count4 != "0") {
                    item_count4 = Calculator.calcExpression(buildingUpgradeData.item_count4, buildingStorageData.level + 1);
                }
                update_diamonds = buildingUpgradeData.diamonds;
                update_reward_exp = buildingUpgradeData.update_reward_exp;
                update_reward_star = buildingUpgradeData.update_reward_star;

            }
            else if (buildingUpgradeData.type == GameConstants.BUILDING_TYPE_3) {
                update_gold_coins = parseFloat(buildingUpgradeData.update_gold_coins);
                item_count1 = parseFloat(buildingUpgradeData.item_count1);
                item_count2 = parseFloat(buildingUpgradeData.item_count2);
                item_count3 = parseFloat(buildingUpgradeData.item_count3);
                item_count4 = parseFloat(buildingUpgradeData.item_count4);
                update_diamonds = buildingUpgradeData.diamonds;
                update_reward_exp = buildingUpgradeData.update_reward_exp;
                update_reward_star = buildingUpgradeData.update_reward_star;
            }

            conditions1Complete = assetLocalStorage.Instance.playerLevel >= buildingUpgradeData.level_limit;
            conditions2Complete = assetLocalStorage.Instance.coin >= update_gold_coins;
            conditions3Complete = assetLocalStorage.Instance.gem >= buildingUpgradeData.diamonds;
            conditions4Complete = BackpackLocalStorage.ins.getItemCount(buildingUpgradeData.item_1) >= item_count1;
            conditions5Complete = BackpackLocalStorage.ins.getItemCount(buildingUpgradeData.item_2) >= item_count2;
            conditions6Complete = BackpackLocalStorage.ins.getItemCount(buildingUpgradeData.item_3) >= item_count3;
            conditions7Complete = BackpackLocalStorage.ins.getItemCount(buildingUpgradeData.item_4) >= item_count4;

            let fish1: boolean = true;
            let fish2: boolean = true;
            let fish3: boolean = true;
            let fish4: boolean = true;
            if (buildingUpgradeData.building_type == GameConstants.SPECIAL_BUILDING_TYPE_3) {
                let tempUnderwaterData: underwaterData = LBDataSheetManager.ins.underwater.gethappyCityDataItemDatas(buildingStorageData.building_id, buildingStorageData.level + 1);
                if (tempUnderwaterData.fish1_id != 0) {
                    fish1 = LB_LocalData.Instance.GetFishID(tempUnderwaterData.fish1_id);
                }
                if (tempUnderwaterData.fish2_id != 0) {
                    fish2 = LB_LocalData.Instance.GetFishID(tempUnderwaterData.fish2_id);
                }
                if (tempUnderwaterData.fish3_id != 0) {
                    fish3 = LB_LocalData.Instance.GetFishID(tempUnderwaterData.fish3_id);
                }
                if (tempUnderwaterData.fish4_id != 0) {
                    fish4 = LB_LocalData.Instance.GetFishID(tempUnderwaterData.fish4_id);
                }
            }
            if(skip)
            {
                update_gold_coins = 0;
                update_diamonds = 0;
                item_count1 = 0;
                item_count2 = 0;
                item_count3 = 0;
                item_count4 = 0;
                update_reward_exp = 0;
                update_reward_star = 0;
                conditions1Complete = true;
                conditions2Complete = true;
                conditions3Complete = true;
                conditions4Complete = true;
                conditions5Complete = true;
                conditions6Complete = true;
                conditions7Complete = true;
            }
            if (conditions1Complete && conditions2Complete && conditions3Complete && conditions4Complete && conditions5Complete && conditions6Complete && conditions7Complete && fish1 && fish2 && fish3 && fish4) {
                // 扣除消耗
                assetLocalStorage.Instance.coin -= update_gold_coins;
                assetLocalStorage.Instance.gem -= update_diamonds;
                BackpackLocalStorage.ins.changeItemCount(buildingUpgradeData.item_1, -item_count1);
                BackpackLocalStorage.ins.changeItemCount(buildingUpgradeData.item_2, -item_count2);
                BackpackLocalStorage.ins.changeItemCount(buildingUpgradeData.item_3, -item_count3);
                BackpackLocalStorage.ins.changeItemCount(buildingUpgradeData.item_4, -item_count4);

                let tempBuildingStorageData: BuildingStorageData = new BuildingStorageData();

                // 增加建筑等级
                for (let i: number = 0; i < this.buildingsStorageData.length; i++) {
                    if (this.buildingsStorageData[i].building_id == buildingStorageData.building_id) {
                        this.buildingsStorageData[i].level += 1;
                        tempBuildingStorageData.building_id = this.buildingsStorageData[i].building_id;
                        tempBuildingStorageData.isLand_id = this.buildingsStorageData[i].isLand_id;
                        tempBuildingStorageData.level = this.buildingsStorageData[i].level;
                        tempBuildingStorageData.type = this.buildingsStorageData[i].type;
                        break;
                    }
                }
                this.save();

                buildingUpdateResult = new BuildingUpdateResult();
                buildingUpdateResult.buildingStorageData = tempBuildingStorageData;

                if (buildingUpgradeData.type == GameConstants.BUILDING_TYPE_2) {
                    EventCenter.postEvent(GameConstants.NORMAL_BUILDING_UPDATE, tempBuildingStorageData);
                }
                if (buildingUpgradeData.type == GameConstants.BUILDING_TYPE_3) {
                    EventCenter.postEvent(GameConstants.SPECIAL_BUILDING_UPDATE, tempBuildingStorageData);
                }

                if (tempBuildingStorageData.level > 1) {
                    //音效用法
                    SoundBolTime.getInstance().playSound(SoundName.UPGRADESOUND);
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
                    (ui_mrg.Instance.GetUI(JQX_Data.Instance.WndName.Upgrade_wnd) as Upgrade_wnd).buildingStorageData = tempBuildingStorageData;
                    ui_mrg.Instance.ShowUI(JQX_Data.Instance.WndName.Upgrade_wnd);


                }

                // 升级奖励
                assetLocalStorage.Instance.exp += update_reward_exp;
                assetLocalStorage.Instance.star += update_reward_star;
                (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
            }
            else {
                buildingUpdateResult = new BuildingUpdateResult();
                buildingUpdateResult.buildingStorageData = buildingStorageData;
                if (!conditions1Complete) {
                    buildingUpdateResult.errorCode = GameConstants.UPDATE_BUILDING_ERROR_CODE_1;
                    GameUtils.showFlyText("您的等级不够,不能升级当前建筑!", "#fffdfd", 36);
                }
                else if (!conditions2Complete || !conditions3Complete) {
                    buildingUpdateResult.errorCode = GameConstants.UPDATE_BUILDING_ERROR_CODE_2;
                    GameUtils.showFlyText("您的货币不够,不能升级当前建筑!", "#fffdfd", 36);
                }
                else if (!conditions4Complete || !conditions5Complete || !conditions6Complete || !conditions7Complete) {
                    buildingUpdateResult.errorCode = GameConstants.UPDATE_BUILDING_ERROR_CODE_3;
                    GameUtils.showFlyText("您的资源不够,不能升级当前建筑!", "#fffdfd", 36);
                }
                else if (!fish1 || !fish2 || !fish3 || !fish4) {
                    buildingUpdateResult.errorCode = GameConstants.UPDATE_BUILDING_ERROR_CODE_5;
                    GameUtils.showFlyText("您的鱼不够,不能升级当前建筑!", "#fffdfd", 36);
                }
            }
        }
        else {
            buildingUpdateResult = new BuildingUpdateResult();
            buildingUpdateResult.buildingStorageData = buildingStorageData;
            buildingUpdateResult.errorCode = GameConstants.UPDATE_BUILDING_ERROR_CODE_4;
            GameUtils.showFlyText("当前建筑已经达到最大等级!", "#fffdfd", 36);
        }
        return buildingUpdateResult;
    }

    /**
     * 获得指定岛屿所有建筑当前等级之和
     */
    public getIslandBuildingsAllLevel(island_id: number): number {
        let allLevel: number = 0;
        for (let i: number = 0; i < this.buildingsStorageData.length; i++) {
            if (this.buildingsStorageData[i].isLand_id == island_id) {
                allLevel += this.buildingsStorageData[i].level;
            }
        }
        return allLevel;
    }

    private save(): void {
        GameLocalStorage.Instance.gameData.buildingsStorageData = this.buildingsStorageData;
        GameLocalStorage.Instance.save();//存储数据
    }
}