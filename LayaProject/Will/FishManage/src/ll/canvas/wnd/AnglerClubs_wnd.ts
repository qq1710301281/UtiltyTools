
import BuildingsLocalStorage from "../../../jqx/localStorage/BuildingsLocalStorage";
import BuildingStorageData from "../../../jqx/localStorage/BuildingStorageData";
import BuildingUpdateResult from "../../../jqx/localStorage/BuildingUpdateResult";
import SoundBolTime, { SoundName } from "../../../lb/manager/SoundBolTime";
import Res_wnd from "../../../public/canvas/wnd/Res_wnd";
import EventCenter from "../../../public/core/Game/EventCenter";
import M_Tool from "../../../public/core/Toos/M_Tool";
import Button_ctrl from "../../../public/core/UI/Button_ctrl";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import AnglerData from "../../../public/dataSheet/AnglerData";
import BuildingData from "../../../public/dataSheet/BuildingData";
import M_Data from "../../../public/dataSheet/M_Data";
import ui_mrg from "../../../public/manager/ui_mrg";
import LL_Data from "../../dataSheet/LL_Data";
import AnglerClubsLocalStorage from "../../localStorage/AnglerClubsLocalStorage";
import AnglerClubsStorageData from "../../localStorage/AnglerClubsStorageData";
import AnglerLocalStorage from "../../localStorage/AnglerLocalStorage";
import AnglerStorageData from "../../localStorage/AnglerStorageData";
import LLDataSheetManager from "../../manager/LLDataSheetManager";
import Calculator from "../../other/Calculator";
import GameConstants from "../../other/GameConstants";
import GameUtils from "../../other/GameUtils";
import List = Laya.List;
import Image = Laya.Image;
import Handler = Laya.Handler;
import Box = Laya.Box;
import Text = Laya.Text;
import Sprite = Laya.Sprite;
import Tween = Laya.Tween;
import Ease = Laya.Ease

export default class AnglerClubs_wnd extends UI_ctrl {
    /**
     * 
     */
    private close_btn: Button_ctrl = null;
    /**
     * 
     */
    private update_btn: Button_ctrl = null;
    /**
     * 
     */
    private anglerList: List = null;
    /**
     * 
     */
    private items: Array<Image> = [];
    /**
     * 
     */
    private buildingStorageData: BuildingStorageData = null;
    /**
     * 
     */
    private nextLevelBuildingData: BuildingData = null;
    /**
     * 
     */
    private isAddEvent: boolean = true;
    /**
     * 
     */
    private container: Image = null;
    /**
     * 
     */
    private txtLevel:Text = null;
    /**
     * 
     */
    private txtLevelTips:Text = null;



    constructor() { super(); }

    /**
     * 
     */
    onAwake(): void {
        super.onAwake();
        this.container = this.M_Image("container");
        this.close_btn = this.M_Image("container/close_btn").getComponent(Button_ctrl);
        this.close_btn.setOnClick(this.btnClick.bind(this));
        this.update_btn = this.M_Image("container/update_btn").getComponent(Button_ctrl);
        this.update_btn.setOnClick(this.btnClick.bind(this));
        this.anglerList = this.M_List("container/anglerList");
        this.txtLevel = this.M_Text("container/txtLevel");
        this.txtLevelTips = this.M_Text("container/txtLevelTips");
        this.anglerList.renderHandler = new Handler(this, this.renderListHandler);
        this.anglerList.mouseHandler = new Handler(this, this.mouseHandler);
        this.anglerList.vScrollBarSkin = "";
        for (let i: number = 0; i < 4; i++) {
            this.items.push(this.M_Image("itemContainer/item" + i));
        }
    }

    onEnable(): void {
    }

    private btnClick(button_ctrl: Button_ctrl): void {
        switch (button_ctrl) {
            case this.close_btn:
                //海钓手俱乐部背景音乐关闭
                SoundBolTime.getInstance().closeMusic();
                (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, false);
                this.Close();
                // ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();
                break;
            case this.update_btn:
                if (this.nextLevelBuildingData) {
                    let buildingUpdateResult: BuildingUpdateResult = BuildingsLocalStorage.ins.upgradeBuilding(this.buildingStorageData);
                    if (buildingUpdateResult.errorCode == 0) {
                        LL_Data.Instance.buildingStorageData = buildingUpdateResult.buildingStorageData;
                        this.buildingStorageData = buildingUpdateResult.buildingStorageData;
                        this.txtLevel.text = this.buildingStorageData.level + "";
                        this.updateItem();
                    }
                }
                else {
                    GameUtils.showFlyText("建已达到最大等级!", "#ff0000", 36);
                }
                break;
            default:
                break;
        }
    }

    onDisable(): void {
    }

    private renderListHandler(cell: Box, index: number): void {
        (cell.getChildByName("emotionContainer") as Sprite).visible = false;
        (cell.getChildByName("lockContainer") as Sprite).visible = false;
        (cell.getChildByName("lockIcon") as Image).visible = false;
        let anglerStorageData: AnglerStorageData = cell.dataSource as AnglerStorageData;
        let anglerData: AnglerData = LLDataSheetManager.ins.anglerDataSheet.getAnglerData(anglerStorageData.id);
        for (let i: number = 0; i < anglerData.emotion; i++) {
            ((cell.getChildByName("emotionContainer") as Sprite).getChildByName("state" + i) as Image).visible = false;
        }
        (cell.getChildByName("anglerIcon") as Image).skin = LLDataSheetManager.ins.anglerDataSheet.getAnglerSkin(anglerData);
        (cell.getChildByName("txtName") as Text).text = anglerData.name;
        (cell.getChildByName("txtDescription") as Text).text = anglerData.skill_description;
        let button_ctrl: Button_ctrl = (cell.getChildByName("goForIt_btn") as Image).getComponent(Button_ctrl);
        if (!button_ctrl) {
            button_ctrl = ((cell.getChildByName("goForIt_btn") as Image).addComponent(Button_ctrl) as Button_ctrl);
            button_ctrl.setOnClick(null);
        }
        if (anglerStorageData.lock == 0) {
            (cell.getChildByName("lockIcon") as Image).visible = false;
            (cell.getChildByName("lockContainer") as Sprite).visible = false;
            (cell.getChildByName("emotionContainer") as Sprite).visible = true;
            button_ctrl.setOnClick(this.goForItBtnClick.bind(this, [anglerStorageData]));
            cell.filters = null;
        }
        else {
            (cell.getChildByName("lockIcon") as Image).visible = true;
            ((cell.getChildByName("lockContainer") as Sprite).getChildByName("unlockTxt") as Text).text = LLDataSheetManager.ins.anglerClubsDataSheet.getUnlockLevel(this.buildingStorageData.building_id, anglerStorageData.id) + "";
            (cell.getChildByName("lockContainer") as Sprite).visible = true;
            (cell.getChildByName("emotionContainer") as Sprite).visible = false;
            GameUtils.graying(cell);
        }
        for (let i: number = 0; i < anglerStorageData.emotion; i++) {
            ((cell.getChildByName("emotionContainer") as Sprite).getChildByName("state" + i) as Image).visible = true;
        }
    }

    private goForItBtnClick(array: Array<any>): void {
        let anglerStorageData: AnglerStorageData = array[0];
        let anglerData: AnglerData = LLDataSheetManager.ins.anglerDataSheet.getAnglerData(anglerStorageData.id);
        if (anglerData) {
            if (anglerStorageData.emotion < anglerData.emotion) {
                let coolingTime: number = AnglerClubsLocalStorage.ins.goForIt(this.buildingStorageData.building_id);
                if (coolingTime == 0) {
                    AnglerLocalStorage.ins.goForIt(anglerStorageData.id);
                    GameUtils.showFlyText(anglerData.name + "受到了鼓舞!", "#ff0000", 36);
                }
                else {
                    let times: Array<number> = M_Tool.GetHourBySecond(coolingTime);
                    let timeStr: string = "离下次可鼓舞 " + Math.floor(times[1]) + ":" + Math.floor(times[2]);
                    GameUtils.showFlyText(timeStr, "#ff0000", 36);
                }
            }
            else {
                GameUtils.showFlyText("心情已满无需鼓舞!", "#ff0000", 36);
            }
        }
    }

    private mouseHandler(): void {

    }

    private initAngler(): void {
        let anglersID: Array<number> = LLDataSheetManager.ins.anglerClubsDataSheet.getAnglersID(this.buildingStorageData.building_id);
        let tempAnglerStorageDatas: Array<AnglerStorageData> = AnglerLocalStorage.ins.getAnglerStorageDatas();
        let anglerStorageDatas: Array<AnglerStorageData> = [];
        for (let i: number = 0; i < tempAnglerStorageDatas.length; i++) {
            for (let j: number = 0; j < anglersID.length; j++) {
                if (tempAnglerStorageDatas[i].id == anglersID[j]) {
                    anglerStorageDatas.push(tempAnglerStorageDatas[i]);
                }
            }
        }
        this.anglerList.array = anglerStorageDatas;
        this.anglerList.refresh();
    }

    private updateItem(): void {
        this.M_Image("container/maxLevel").visible = false;
        let i: number = 0;
        this.nextLevelBuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this.buildingStorageData.building_id, this.buildingStorageData.level + 1);
        if (this.nextLevelBuildingData) {
            this.M_Image("container/itemContainer").visible = true;
            let itemsID: Array<{ id: number, num: number }> = [];
            if (this.nextLevelBuildingData.item_1) {
                itemsID.push({ id: this.nextLevelBuildingData.item_1, num: Calculator.calcExpression(this.nextLevelBuildingData.item_count1, this.nextLevelBuildingData.level) });
            }
            if (this.nextLevelBuildingData.item_2) {
                itemsID.push({ id: this.nextLevelBuildingData.item_2, num: Calculator.calcExpression(this.nextLevelBuildingData.item_count2, this.nextLevelBuildingData.level) });
            }
            if (this.nextLevelBuildingData.item_3) {
                itemsID.push({ id: this.nextLevelBuildingData.item_3, num: Calculator.calcExpression(this.nextLevelBuildingData.item_count3, this.nextLevelBuildingData.level) });
            }
            if (this.nextLevelBuildingData.item_4) {
                itemsID.push({ id: this.nextLevelBuildingData.item_4, num: Calculator.calcExpression(this.nextLevelBuildingData.item_count4, this.nextLevelBuildingData.level) });
            }
            for (i = 0; i < this.items.length; i++) {
                this.items[i].visible = false;
            }
            let tw: number = 180; // 计算宽度
            let hw: number = tw / 2;
            let w: number = 150; // ui 实际宽度
            let offsetX: number = (tw - w) / 2;
            let centerX: number = 363;
            for (i = 0; i < itemsID.length; i++) {
                (this.items[i].getChildByName("itemIcon") as Image).skin = LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(itemsID[i].id);
                (this.items[i].getChildByName("txtNum") as Text).text = itemsID[i].num + "";
                let tx: number = 0;
                if (i == 0) {
                    tx = offsetX + centerX - (itemsID.length - i) * hw;
                }
                else {
                    tx = this.items[i - 1].x + w + offsetX + offsetX;
                }
                this.items[i].x = tx;
                this.items[i].visible = true;
            }
            this.M_Text("container/txtCoin").text = this.nextLevelBuildingData.update_gold_coins + "";
            this.M_Text("container/txtDiamond").text = this.nextLevelBuildingData.diamonds + "";
        }
        else {
            this.M_Image("container/maxLevel").visible = true;
            this.M_Image("container/itemContainer").visible = false;
            this.M_Text("container/txtCoin").text = "0";
            this.M_Text("container/txtDiamond").text = "0";
            this.update_btn.setOnClick(null);
        }
    }

    /**
     * 钓手心情减少事件处理
     * @param tempAnglerStorageDatas 
     */
    private anglerEmotionReduce(tempAnglerStorageDatas: Array<AnglerStorageData>): void {
        let anglersID: Array<number> = LLDataSheetManager.ins.anglerClubsDataSheet.getAnglersID(this.buildingStorageData.building_id);
        let anglerStorageDatas: Array<AnglerStorageData> = [];
        for (let i: number = 0; i < tempAnglerStorageDatas.length; i++) {
            for (let j: number = 0; j < anglersID.length; j++) {
                if (tempAnglerStorageDatas[i].id == anglersID[j]) {
                    anglerStorageDatas.push(tempAnglerStorageDatas[i]);
                }
            }
        }
        this.anglerList.array = anglerStorageDatas;
        this.anglerList.refresh();
    }

    private effect(img: any): void {
        img.scale(0.6, 0.6);
        Tween.to(img, { scaleX: 1, scaleY: 1 }, 1500, Ease.elasticOut, Handler.create(this, () => { }));
    }

    public Show() {
        //钓手俱乐部背景音乐
        SoundBolTime.getInstance().playMusicBg(SoundName.CLUBMUSIC);
        this.buildingStorageData = LL_Data.Instance.buildingStorageData;
        this.txtLevel.text = this.buildingStorageData.level + "";
        this.initAngler();
        this.updateItem();
        if (this.isAddEvent) {
            this.isAddEvent = false;
            EventCenter.rigestEvent(GameConstants.UPDATE_ANGLER, this.anglerEmotionReduce, this);
        }
        this.effect(this.container);
        let nextBuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this.buildingStorageData.building_id, this.buildingStorageData.level + 1);
        if(nextBuildingData)
        {
            this.txtLevelTips.text = "玩家"+ nextBuildingData.level_limit +"级可升级建筑";
        }
        else
        {
            this.txtLevelTips.text = "建筑已满级";
        }
        super.Show();
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show();
    }

}