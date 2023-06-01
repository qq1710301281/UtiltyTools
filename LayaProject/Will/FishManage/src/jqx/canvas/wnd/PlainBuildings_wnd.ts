import SoundBolTime, { SoundName } from "../../../lb/manager/SoundBolTime";
import LL_Data from "../../../ll/dataSheet/LL_Data";
import BackpackLocalStorage from "../../../ll/localStorage/BackpackLocalStorage";
import BuildingProductionStorageData from "../../../ll/localStorage/BuildingProductionStorageData";
import NormalBuildingProductionLocalStorage from "../../../ll/localStorage/NormalBuildingProductionLocalStorage";
import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import Calculator from "../../../ll/other/Calculator";
import GameConstants from "../../../ll/other/GameConstants";
import Res_wnd from "../../../public/canvas/wnd/Res_wnd";
import EventCenter from "../../../public/core/Game/EventCenter";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import BuildingData from "../../../public/dataSheet/BuildingData";
import M_Data from "../../../public/dataSheet/M_Data";
import ui_mrg from "../../../public/manager/ui_mrg";
import JQX_Data from "../../dataSheet/JQX_Data";
import BuildingsLocalStorage from "../../localStorage/BuildingsLocalStorage";
import BuildingUpdateResult from "../../localStorage/BuildingUpdateResult";
import JQX_Tools, { numberFormatter } from "../../other/JQX_Tools";
import Tween = Laya.Tween;
import Ease = Laya.Ease;
import Handler = Laya.Handler;

/**
 * 普通建筑界面
 */
export default class PlainBuildings_wnd extends UI_ctrl {

    public buildsData: BuildingData;

    //建筑升级 数据返回
    public upgradeBuilding: BuildingsLocalStorage;
    //产出事件是否存在
    private isAddEvent: boolean = false;

    private isSuo: any;
    constructor() { super(); }
    onAwake(): void {
        super.onAwake();
        // this.Show();

    }
    ///////////////////////////////////////////////////////////////////////////////////
    Show() {
      
        //显示部分
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show();
        ///////////////////////////////////////////////////////////////////////////////////
        //初始化
        this.initShow_panelUI();
        this.M_Text("playerPng/Icon_profitNum").text = "0";
        this.M_Image("buildingBG1/suoBG").visible = false;
        this.M_Text("buildingBG1/up_lose").text = "";
        //关闭
        this.M_ButtonCtrl("Show_panel/close_btn").setOnClick(() => {
            //返回显示全部的
            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, false);
            this.Close();
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //领取
        this.M_ButtonCtrl("Show_panel/receive_btn").setOnClick(() => {
            ////////////////////////////////////////////////////////////
            NormalBuildingProductionLocalStorage.ins.getBuildingProductionCoin(JQX_Data.Instance.buildingStorageData.building_id);
            EventCenter.postEvent(GameConstants.BUILDING_UI_OPEN);
            this.M_Text("playerPng/Icon_profitNum").text = "0";

            this.initShow_panelUI();
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //升级按钮
        this.M_ButtonCtrl("Show_panel/upgrade_btn").setOnClick(() => {
            //当前数据
            let buildingUpdateResult: BuildingUpdateResult = BuildingsLocalStorage.ins.upgradeBuilding(JQX_Data.Instance.buildingStorageData);
            //下一等级数据
            let buildingUpgradeData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(JQX_Data.Instance.buildingStorageData.building_id, JQX_Data.Instance.buildingStorageData.level + 1);

            JQX_Data.Instance.buildingStorageData = buildingUpdateResult.buildingStorageData;
            //建筑升级成功
            if (buildingUpdateResult.errorCode == 0) {
                this.initShow_panelUI();
                //建筑是否可以升级 不够就锁
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // 更新建筑 停止生产时长
                let currentAllLevel: number = BuildingsLocalStorage.ins.getIslandBuildingsAllLevel(JQX_Data.Instance.buildingStorageData.isLand_id);
                let maxLevel: number = LLDataSheetManager.ins.buildingDataSheet.getIsLandBuildingLevelMax(JQX_Data.Instance.buildingStorageData.isLand_id);
                let percent: number = Math.round(currentAllLevel / maxLevel) * 100;
                if (percent >= 50 && percent < 100) {
                    NormalBuildingProductionLocalStorage.ins.updateBuildingStopProductionTime(JQX_Data.Instance.buildingStorageData.isLand_id, GameConstants.BUILDING_STOP_PRODUCTION_TIME_240);
                }
                else if (percent >= 100) {
                    NormalBuildingProductionLocalStorage.ins.updateBuildingStopProductionTime(JQX_Data.Instance.buildingStorageData.isLand_id, GameConstants.BUILDING_STOP_PRODUCTION_TIME_360);
                }
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // this.M_Image("Upgrade_panel").visible = true;

            }
            //玩家等级不够 不能升级建筑
            else if (buildingUpdateResult.errorCode == 1) {
                this.M_Image("buildingBG1/suoBG").visible = true;
                this.M_Text("buildingBG1/up_lose").text = `玩家等级不够您需要达到${buildingUpgradeData.level_limit}级`;
            }
        });
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //侦听到建筑产出
        if (!this.isAddEvent) {
            this.isAddEvent = true;
            EventCenter.rigestEvent(GameConstants.BUILDING_PRODUCTION, this.buildingProduction, this);
        }
        EventCenter.postEvent(GameConstants.BUILDING_UI_OPEN);
        //升级建筑

        this.effect(this.M_Image("Show_panel"));
        super.Show();
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //刷新建筑总产出
    buildingProduction(buildingProductionStorageDatas: Array<BuildingProductionStorageData>) {
        for (let i = 0; i < buildingProductionStorageDatas.length; i++) {
            if (buildingProductionStorageDatas[i].building_id == JQX_Data.Instance.buildingStorageData.building_id) {
                this.M_Text("playerPng/Icon_profitNum").text = (buildingProductionStorageDatas[i].production_gold_coins).toString();
                break;
            }
        }
    }

    /**
     * 普通建筑展示界面
     * @param initShow_panel
     */
    private initShow_panelUI(): void {
        //当前等级数据
        this.buildsData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(JQX_Data.Instance.buildingStorageData.building_id, JQX_Data.Instance.buildingStorageData.level);
        //下一条数据
        let buildingUpgradeData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(JQX_Data.Instance.buildingStorageData.building_id, JQX_Data.Instance.buildingStorageData.level + 1);
        //获取存储的数据的里面进行升级
        this.M_Text("playerPng/player_level").text = "LV  " + (JQX_Data.Instance.buildingStorageData.level).toString();//当前等级
        // this.M_FontClip("buildingBG1/clip_num").value=(JQX_Data.Instance.buildingStorageData.level).toString();//当前等级
        this.M_Text("titlePng/titleName").text = this.buildsData.name;//当前建筑名字
        this.M_Image("buildingBG1/buildingsIcon").skin = LLDataSheetManager.ins.buildingDataSheet.getBuildingSkin(this.buildsData);//当前显示建筑icon

        if (this.buildsData.production_gold_coins != "0" && this.buildsData.type == GameConstants.BUILDING_TYPE_2) {
            this.M_Text("playerPng/Icon_minute").text = (Calculator.calcExpression((this.buildsData.production_gold_coins), JQX_Data.Instance.buildingStorageData.level)) + "/分钟";
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (buildingUpgradeData) {
            this.M_Image("Show_panel/maxLevel").visible = false;
            this.M_Image("Show_panel/items").visible = true;
            this.M_Image("Show_panel/upgrade_btn").visible = true;
            this.M_Image("Show_panel/icon").visible = true;
            this.M_Image("Show_panel/gem").visible = true;
            if (this.buildsData.update_gold_coins != "0" && this.buildsData.type == GameConstants.BUILDING_TYPE_2) {
                this.M_Text("icon/icon_Value").text = (Calculator.calcExpression(this.buildsData.update_gold_coins, buildingUpgradeData.level)).toString()//升级所需金币
            }
            this.M_Text("gem/gen_Value").text = (buildingUpgradeData.diamonds).toString();//升级所需钻石
            //取建筑表
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //道具
            for (var i: number = 1; i < 5; i++) {
                //道具icon
                if ((buildingUpgradeData['item_' + i]) != 0 && this.buildsData.type == GameConstants.BUILDING_TYPE_2) {
                    this.M_Image(`items/itemIcon${i}`).visible = true;
                    this.M_Image(`items/item_bg${i}`).visible = true;
                    this.M_Image(`items/itemIcon${i}`).skin = (LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(buildingUpgradeData['item_' + i]));
                    if (BackpackLocalStorage.ins.getItemCount(buildingUpgradeData['item_' + i]) >= Calculator.calcExpression(buildingUpgradeData['item_count' + i], buildingUpgradeData.level)) {
                        this.M_Text(`itemIcon${i}/itemValue`).color = "##0b0b0b";
                        this.M_Text(`itemIcon${i}/itemValue`).text = numberFormatter(BackpackLocalStorage.ins.getItemCount(buildingUpgradeData['item_' + i])) + "/" + numberFormatter((Calculator.calcExpression(buildingUpgradeData['item_count' + i], buildingUpgradeData.level)));
                    }
                    else if (BackpackLocalStorage.ins.getItemCount(buildingUpgradeData['item_' + i]) < Calculator.calcExpression(buildingUpgradeData['item_count' + i], buildingUpgradeData.level)) {
                        this.M_Text(`itemIcon${i}/itemValue`).color = "#f9260b";
                        this.M_Text(`itemIcon${i}/itemValue`).text = numberFormatter(BackpackLocalStorage.ins.getItemCount(buildingUpgradeData['item_' + i])) + "/" + numberFormatter((Calculator.calcExpression(buildingUpgradeData['item_count' + i], buildingUpgradeData.level)));
                    }
                }
                else {
                    this.M_Image(`items/itemIcon${i}`).visible = false;
                    this.M_Image(`items/item_bg${i}`).visible = false;
                }
            }
        }
        else {
            // 建筑满级该怎么处理怎么处理
            // isUpgrode_panel = false;
            //this.M_Image("Show_panel/items").visible = false;
            this.M_Image("Show_panel/maxLevel").visible = true;
            this.M_Image("Show_panel/items").visible = false;
            this.M_Image("Show_panel/upgrade_btn").visible = false;
            this.M_Image("Show_panel/icon").visible = false;
            this.M_Image("Show_panel/gem").visible = false;
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * 展开特效
     * @param img 当前IMg
     */
    private effect(img: any): void {
        img.scale(0.6, 0.6);
        Tween.to(img, { scaleX: 1, scaleY: 1 }, 1500, Ease.elasticOut, Handler.create(this, () => { }))
    }
    onEnable(): void {
    }

    onDisable(): void {
    }
}