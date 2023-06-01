import BuildingsLocalStorage from "../../../jqx/localStorage/BuildingsLocalStorage";
import BuildingStorageData from "../../../jqx/localStorage/BuildingStorageData";
import BuildingUpdateResult from "../../../jqx/localStorage/BuildingUpdateResult";
import CinemaConstants from "../../../jqx/other/CinemaConstants";
import { numberFormatter } from "../../../jqx/other/JQX_Tools";
import SoundBolTime, { SoundName } from "../../../lb/manager/SoundBolTime";
import LL_Data from "../../../ll/dataSheet/LL_Data";
import BackpackLocalStorage from "../../../ll/localStorage/BackpackLocalStorage";
import BuildingProductionStorageData from "../../../ll/localStorage/BuildingProductionStorageData";
import NormalBuildingProductionLocalStorage from "../../../ll/localStorage/NormalBuildingProductionLocalStorage";
import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import Calculator from "../../../ll/other/Calculator";
import GameConstants from "../../../ll/other/GameConstants";
import Res_wnd from "../../../public/canvas/wnd/Res_wnd";
import toast_wnd from "../../../public/canvas/wnd/toast_wnd";
import EventCenter from "../../../public/core/Game/EventCenter";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import BuildingData from "../../../public/dataSheet/BuildingData";
import M_Data from "../../../public/dataSheet/M_Data";
import TigerData from "../../../public/dataSheet/TigerData";
import assetLocalStorage from "../../../public/localStorage/assetLocalStorage";
import ui_mrg from "../../../public/manager/ui_mrg";
import Will_UtilData from "../../dataSheet/Will_UtilData";
import Will_LocalData from "../../localStorage/Will_LocalData";
import order_panel from "../panel/order_panel";


/**
 * 放置的窗口
 */
export default class restuarant_wnd extends UI_ctrl {

    constructor() { super(); }

    private orderPanel: order_panel;


    onAwake(): void {
        super.onAwake();

        this.orderPanel = this.M_Image("order_panel").addComponent(order_panel);
        this.orderPanel.Init(this);
        this.SetBtn();
        this.M_Text("reward_bar/reward_1").text = "0";

        Laya.timer.loop(3000, this, () => {
            this.rotaFood();
        });

    }

    private rotaFood() {
        let foodRota = this.M_Image("foodRoot/foodRota");
        // console.log(foodRota.rotation + 90);
        Laya.Tween.to(foodRota, { rotation: foodRota.rotation + 90 }, 1000, Laya.Ease.cubicOut);
        for (let i = 0; i < foodRota.numChildren; i++) {
            Laya.Tween.to(foodRota.getChildAt(i), { rotation: (<Laya.Image>foodRota.getChildAt(i)).rotation - 90 }, 1000, Laya.Ease.cubicOut);
        }
    }

    private onBuildingUIOpen(buildingProductionStorageDatas: Array<BuildingProductionStorageData>) {
        for (let i = 0; i < buildingProductionStorageDatas.length; i++) {
            if (buildingProductionStorageDatas[i].building_id == Will_UtilData.Instance.BuildingData.building_id) {
                let rewardCount: number = buildingProductionStorageDatas[i].production_gold_coins;
                this.M_Text("reward_bar/reward_1").text = rewardCount + "";
                break;
            }
        }


    }

    private SetBtn() {
        this.M_ButtonCtrl("order_bar/order_btn").setOnClick(() => {
            this.orderPanel.Show(null, this.currentIndex);
            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, true);
        })

        this.M_ButtonCtrl("center_area/close_btn").setOnClick(() => {
            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, false);
            this.Close();
        })

    }

    private currentIndex: number = 0;

    private isRigest: boolean = false;
    public Show(fnc = null, index: number = 0) {
        if (!this.isRigest) {
            EventCenter.rigestEvent(GameConstants.BUILDING_PRODUCTION, this.onBuildingUIOpen, this);
            this.isRigest = true;
        }
        SoundBolTime.getInstance().playMusicBg(SoundName.RESTAURANTMUSIC);


        // for (let i = 0; i < 3; i++) {
        //     Will_LocalData.Instance.ChangeOrderIsMadeArr(i, [0, 0, 0, 0, 0]);
        //     Will_LocalData.Instance.ChangeOrderArr(i, [0, 0, 0, 0, 0]);
        //     BackpackLocalStorage.ins.ResetTaskItem();
        // }

        this.currentIndex = index;

        if (Will_LocalData.Instance.GetMadeCout(this.currentIndex) == 5) {
            this.M_Image("order_btn/tip").visible = false;
        }
        else {
            this.M_Image("order_btn/tip").visible = true;
        }

        this.M_Text("sayGood/content").text = "x " + assetLocalStorage.Instance.sayGood;

        // this.setOrderBtn(index);// 设置订单按钮
        // console.log("当前的餐厅索引+++" + this.currentIndex);


        EventCenter.postEvent(GameConstants.BUILDING_UI_OPEN);

        // 获得奖励函数
        this.M_ButtonCtrl("reward_bar/getReward_btn").setOnClick(() => {
            NormalBuildingProductionLocalStorage.ins.getBuildingProductionCoin(Will_UtilData.Instance.BuildingData.building_id);
            this.M_Text("reward_bar/reward_1").text = "0";
            toast_wnd.Instance.ShowText("领取收益成功！");
        })

        //刷新餐厅界面
        this.refreshUp();

        this.owner.parent.setChildIndex(this.M_Image(), this.owner.parent.numChildren - 1);//设置到倒数最后一位
        // note:等级需要接上
        super.Show();
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, true);
    }


    /**
     * 刷新
     */
    private refreshUp() {

        // assetLocalStorage.Instance.playerLevel = 5;

        this.M_Text("level_bar/content").text = "等级 " + Will_UtilData.Instance.BuildingData.level;

        //当前建筑的
        let buildingData: BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(Will_UtilData.Instance.BuildingData.building_id, Will_UtilData.Instance.BuildingData.level);

        this.M_Text("reward_bar/reward_0").text = buildingData.production_gold_coins == "0" ? "0" : buildingData.production_gold_coins + "/分钟";

        //可升级建筑的
        let buildingDataUp: BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(Will_UtilData.Instance.BuildingData.building_id, Will_UtilData.Instance.BuildingData.level + 1);

        if (!buildingDataUp) {
            this.M_Image("upgrade_area/fullGrade").visible = true;
            return;
        }

        let rewardItemArr = [];
        for (let i = 0; i < 4; i++) {
            if (buildingDataUp[`item_${i + 1}`] != 0) {
                rewardItemArr.push([buildingDataUp[`item_${i + 1}`], +buildingDataUp[`item_count${i + 1}`]]);
            }
        }
        // console.log("++++++++", rewardItemArr);

        this.M_Text("gold1/desc").text = buildingDataUp.update_gold_coins.toString();
        this.M_Text("gold2/desc").text = buildingDataUp.diamonds.toString();

        if (assetLocalStorage.Instance.playerLevel < buildingDataUp.level_limit) {
            this.M_Text("neededBox/needLevel").text = `玩家${buildingDataUp.level_limit}级可升级建筑`;
            this.M_Text("neededBox/needLevel").visible = true;
            this.M_ButtonCtrl("upgrade_area/upgrade_btn").image.disabled = true;
        }
        else {
            this.M_Text("neededBox/needLevel").visible = false;
            this.M_ButtonCtrl("upgrade_area/upgrade_btn").image.disabled = false;
        }


        this.M_List("upGrade/upGradeList").renderHandler = new Laya.Handler(this, (item: Laya.Image, index: number) => {
            (<Laya.Image>item.getChildByName("science")).skin = LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(rewardItemArr[index][0]);
            (<Laya.Text>item.getChildByName("materialNum_text")).text = numberFormatter(BackpackLocalStorage.ins.getItemCount(rewardItemArr[index][0]), 2) + "/" + numberFormatter(rewardItemArr[index][1], 2);
        });
        this.M_List("upGrade/upGradeList").array = rewardItemArr;

        // this.M_Image("restMap/map").skin = LLDataSheetManager.ins.buildingDataSheet.getBuildingSkin(buildingDataUp);

        this.M_ButtonCtrl("upgrade_area/upgrade_btn").setOnClick(() => {
            let buildingUpdateResult: BuildingUpdateResult = BuildingsLocalStorage.ins.upgradeBuilding(Will_UtilData.Instance.BuildingData);
            Will_UtilData.Instance.BuildingData = buildingUpdateResult.buildingStorageData;
            if (buildingUpdateResult.errorCode == 0) {
                // this.Show(null, index);
                this.refreshUp();
            }
        })

    }


    /**
     * 设置订单按钮
     */
    private setOrderBtn(index: number) {
        let table = BackpackLocalStorage.ins.GetTaskItemArr(index);
        let isFinish: boolean = true;
        for (const key in table) {
            if (table[key][index] != -2) {
                isFinish = false;
                break;
            }
        }

        if (isFinish) {
            this.M_Image("order_btn/tip").visible = false;
        }
        else {
            this.M_Image("order_btn/tip").visible = true;
        }
    }

    /**
     * 设置订单数量
     */
    public SetOrderCount() {
        this.M_Text("totalOrder_bar/content").text = Will_LocalData.Instance.GetMadeCout(this.currentIndex) + "/" + 5;
    }

    public Close() {
        SoundBolTime.getInstance().closeMusic();
        if (this.orderPanel) {
            this.orderPanel.Close();
        }
        super.Close();
    }

}