import JQX_Data from "../../jqx/dataSheet/JQX_Data";
import BuildingsLocalStorage from "../../jqx/localStorage/BuildingsLocalStorage";
import BuildingStorageData from "../../jqx/localStorage/BuildingStorageData";
import BuildingUpdateResult from "../../jqx/localStorage/BuildingUpdateResult";
import { createrFlight } from "../../lb/canvas/wnd/flight";
import LBData from "../../lb/dataSheet/LB_Data";
import LB_UtilData from "../../lb/dataSheet/LB_UtilData";
import LB_LocalData from "../../lb/localStorage/LB_LocalData";
import SoundBolTime, { SoundName } from "../../lb/manager/SoundBolTime";
import EventCenter from "../../public/core/Game/EventCenter";
import Button_ctrl from "../../public/core/UI/Button_ctrl";
import UI_ctrl from "../../public/core/UI/UI_ctrl";
import BuildingData from "../../public/dataSheet/BuildingData";
import assetLocalStorage from "../../public/localStorage/assetLocalStorage";
import ui_mrg from "../../public/manager/ui_mrg";
import goToSea_wnd from "../../will/canvas/wnd/goToSea_wnd";
import restuarant_wnd from "../../will/canvas/wnd/restuarant_wnd";
import Will_Data from "../../will/dataSheet/Will_Data";
import Will_UtilData from "../../will/dataSheet/Will_UtilData";
import LL_Data from "../dataSheet/LL_Data";
import NormalBuildingProductionLocalStorage from "../localStorage/NormalBuildingProductionLocalStorage";
import LLDataSheetManager from "../manager/LLDataSheetManager";
import Bar from "./Bar";
import GameConstants from "./GameConstants";
import GameUtils from "./GameUtils";
import MoveBar from "./MoveBar";
import Image = Laya.Image;
import Text = Laya.Text;
import Animation=Laya.Animation;
import Event=Laya.Event;
import Point=Laya.Point;

/**
 * 建筑
 */
export default class Building extends UI_ctrl {
    /**
     * 货币图片
     */
    private currency_btn: Image;
    /**
     * 建筑 图标
     */
    private building_btn: Image;
    /**
     * 解锁所需等级说明文字
     */
    private txtUnlockLevel: Text = null;
    /**
     * 搭建消耗说明文字
     */
    private txtConsumption: Text = null;
    /**
     * 搭建按钮图标
     */
    private construction_btn: Image = null;
    /**
     * 建筑升级数据
     */
    public _buildingStorageData: BuildingStorageData = null;
    /**
     * 
     */
    private txtLevel:Text = null;
    /**
     * 
     */
    private txtName:Text = null;
    /**
     * 
     */
    private resources:Image = null;
    /**
     * 
     */
    private bar:Bar = null;
    /**
     * 
     */
    private txtBuildingName:Text = null;
    /**
     * 
     */
    private animation:Animation = null;
    /**
     * 
     */
    private moveBar:MoveBar = null;
    /**
     * 
     */
    private moveBarImage:Image = null;



    constructor() { super(); }

    onAwake(): void {
        super.onAwake();
        this.resources = this.M_Image("resources");
        this.currency_btn = this.M_Image("resources/currency_btn");
        this.building_btn = this.M_Image("building_btn");
        this.txtUnlockLevel = this.M_Text("txtUnlockLevel");
        this.txtConsumption = this.M_Text("txtConsumption");
        this.construction_btn = this.M_Image("construction_btn");
        this.txtLevel = this.M_Text("resources/txtLevel");
        this.txtName = this.M_Text("resources/txtName");
        this.txtBuildingName = this.M_Text("building_btn/txtBuildingName");
        this.animation = new Animation();
        this.animation.loadAtlas("res/atlas/res/image/ll/Building/ui.atlas");
        this.moveBarImage = this.M_Image("resources/moveBar");
        this.moveBar = this.moveBarImage.addComponent(MoveBar);
        EventCenter.rigestEvent(GameConstants.NORMAL_BUILDING_UPDATE, this.normalBuildingUpdate, this);
        EventCenter.rigestEvent(GameConstants.SPECIAL_BUILDING_UPDATE, this.specialBuildingUpdate, this);
        EventCenter.rigestEvent(GameConstants.BUILDING_PRODUCTION_PERCENT_TIME_UPDATE, this.buildingProductionPercentTimeUpdate, this);
        super.Show();
        this.initUI();
    }

    onEnable(): void {
    }

    private initUI(): void {
        let buildingData: BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this._buildingStorageData.building_id, this._buildingStorageData.level);
        this.building_btn.skin = LLDataSheetManager.ins.buildingDataSheet.getBuildingSkin(buildingData);
        (this.owner as any).x = buildingData.x;
        (this.owner as any).y = buildingData.y;
        this.currency_btn.visible = false;
        this.txtUnlockLevel.visible = false;
        this.txtConsumption.visible = false;
        this.construction_btn.visible = false;
        this.txtBuildingName.visible = false;

        console.log("添加建筑 == " + buildingData.name + "   等级 == " + this._buildingStorageData.level);

        if(buildingData.type != GameConstants.BUILDING_TYPE_1)
        {
            this.txtLevel.text = this._buildingStorageData.level + "";
            this.txtName.text = buildingData.name;
            this.bar = this.M_Image("resources/bar").addComponent(Bar) as Bar;
            this.bar.txtEnding = "%";
            this.bar.textName = "txtProgress";
            this.bar.init();
            this.bar.text.visible = false;
        }
        else
        {
            this.resources.visible = false;
        }

        if (buildingData.type != GameConstants.BUILDING_TYPE_1) { // 如果建筑 不是功能建筑
            if (assetLocalStorage.Instance.playerLevel < buildingData.unlock_level) {
                this.txtUnlockLevel.text = "解锁所需玩家等级" + buildingData.unlock_level + "级!";
                this.txtUnlockLevel.visible = true;
            }
            else {
                if (this._buildingStorageData.level == 0) {
                    if(buildingData.type == GameConstants.BUILDING_TYPE_2)
                    {
                        this.resources.visible = false;
                        this.txtBuildingName.text = buildingData.name;
                        this.txtBuildingName.visible = true;
                        this.M_ButtonCtrl("building_btn").setOnClick(this.btnClick.bind(this));
                    }
                    else if(buildingData.type == GameConstants.BUILDING_TYPE_3)
                    {
                        this.resources.visible = true;
                        this.construction_btn.visible = true;
                        this.M_ButtonCtrl("construction_btn").setOnClick(this.btnClick.bind(this));
                        let update_gold_coins: number = buildingData.update_gold_coins == "0" ? 0 : parseFloat(buildingData.update_gold_coins);
                        if (update_gold_coins) {
                            this.txtConsumption.visible = true;
                            this.txtConsumption.text = update_gold_coins + "";
                        }
                    }
                }
                else {
                    this.txtBuildingName.visible = false;
                    this.resources.visible = true;
                    this.M_ButtonCtrl("building_btn").setOnClick(this.btnClick.bind(this));
                }
            }
        }
        else {
            this.M_ButtonCtrl("building_btn").setOnClick(this.btnClick.bind(this));
        }
    }

    private btnClick(button_ctrl: Button_ctrl): void {
        let buildingData: BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this._buildingStorageData.building_id, this._buildingStorageData.level);
        switch (button_ctrl) {
            case this.M_ButtonCtrl("construction_btn"):
                //搭建建筑音效
                SoundBolTime.getInstance().playSound(SoundName.BUILDSOUND);
                if (buildingData.building_type == GameConstants.SPECIAL_BUILDING_TYPE_3) {
                    LB_LocalData.Instance.unlockingWord(this._buildingStorageData.building_id);
                }

                let buildingUpdateResult: BuildingUpdateResult = BuildingsLocalStorage.ins.upgradeBuilding(this._buildingStorageData);
                if (buildingUpdateResult.errorCode == 0) {
                    this._buildingStorageData = buildingUpdateResult.buildingStorageData;
                    this.initUI();
                }
                break;
            case this.M_ButtonCtrl("resources/currency_btn"):
                //领取金币
                SoundBolTime.getInstance().playSound(SoundName.RESOURCESSOUND);
                NormalBuildingProductionLocalStorage.ins.getBuildingProductionCoin(this._buildingStorageData.building_id);
                this.bar.value = 0.01;
                let point:Point = (this.owner as Image).localToGlobal(new Point(this.currency_btn.x, this.currency_btn.y));
                createrFlight(1,point);
                break;
            case this.M_ButtonCtrl("building_btn"):
                //点击建筑音效
                SoundBolTime.getInstance().playSound(SoundName.BUILDSOUND);
                if(this._buildingStorageData.level == 0)
                {
                    if(buildingData.type == GameConstants.BUILDING_TYPE_2)
                    {
                        if(!ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd)["isConstruction"])
                        {
                            ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd)["isConstruction"] = true;
                            this.owner.addChild(this.animation);
                            this.building_btn.visible = false;
                            this.animation.interval = 150;
                            this.animation.on(Event.COMPLETE, this, this.constructionComplete);
                            this.animation.play();
                        }
                        else
                        {
                            GameUtils.showFlyText("正在建造中,请稍后!", "#ff0000", 36);
                        }
                    }
                }
                else
                {
                    if (buildingData.target == GameConstants.BUILDING_TARGET_1) {
                        if(!ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd)["isConstruction"])
                        {
                            ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Close();
                            ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Island_wnd).Show();
                        }
                        else
                        {
                            GameUtils.showFlyText("正在建造中,请稍后!", "#ff0000", 36);
                        }
                    }
                    else if (buildingData.target == GameConstants.BUILDING_TARGET_2) {
                        if (buildingData.type == GameConstants.BUILDING_TYPE_2) {
                            JQX_Data.Instance.buildingStorageData = this._buildingStorageData;
                            ui_mrg.Instance.ShowUI(JQX_Data.Instance.WndName.PlainBuildings_wnd);
                        }
                        else if (buildingData.type == GameConstants.BUILDING_TYPE_3) {
                            this.showSpecialBuildingUI();
                        }
                    }
                    else if (buildingData.target == GameConstants.BUILDING_TARGET_3) {
                        if(!ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd)["isConstruction"])
                        {
                            ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Close();
                            (<goToSea_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd)).Show(null, { area: LL_Data.Instance.currentIsLandID, fishPoint: 0 });
                        }
                        else
                        {
                            GameUtils.showFlyText("正在建造中,请稍后!", "#ff0000", 36);
                        }
                    }
                }
                break;
            default:
                break;
        }
    }

    private constructionComplete():void
    {
        BuildingsLocalStorage.ins.upgradeBuilding(this._buildingStorageData);
        this.building_btn.visible = true;
        this.resources.visible = true;
        this.txtBuildingName.visible = false;
        this.owner.removeChild(this.animation);
        ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd)["isConstruction"] = false;
    }

    private showSpecialBuildingUI(): void {
        let buildingData: BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this._buildingStorageData.building_id, this._buildingStorageData.level);
        // ui_mrg.Instance.ShowUI(Will_Data.Instance.WndName.restuarant_wnd);
        // return;
        switch (buildingData.building_type) {
            case GameConstants.SPECIAL_BUILDING_TYPE_1:
                LL_Data.Instance.buildingStorageData = this._buildingStorageData;
                ui_mrg.Instance.ShowUI(LL_Data.Instance.WndName.AnglerClubs_wnd);
                break;
            case GameConstants.SPECIAL_BUILDING_TYPE_2:
                LB_UtilData.Instance.SetEntertainmentCity(this._buildingStorageData.building_id, this._buildingStorageData.level);
                ui_mrg.Instance.ShowUI(LBData.Instance.WndName.entertainment_wnd);
                break;
            case GameConstants.SPECIAL_BUILDING_TYPE_3:
                LB_UtilData.Instance.SetEntertainmentCity(this._buildingStorageData.building_id, this._buildingStorageData.level);
                ui_mrg.Instance.ShowUI(LBData.Instance.WndName.underwater_wnd);
                break;
            case GameConstants.SPECIAL_BUILDING_TYPE_4:

                Will_UtilData.Instance.BuildingData = this._buildingStorageData;
                let index: number = 0;
                switch (Will_UtilData.Instance.BuildingData.building_id) {
                    case 5:
                        index = 0
                        break;
                    case 25:
                        index = 1
                        break;
                }
                // ui_mrg.Instance.ShowUI(Will_Data.Instance.WndName.restuarant_wnd);
                (<restuarant_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.restuarant_wnd)).Show(null, index);
                break;
            case GameConstants.SPECIAL_BUILDING_TYPE_5:
                LB_UtilData.Instance.SetEntertainmentCity(this._buildingStorageData.building_id, this._buildingStorageData.level);
                ui_mrg.Instance.ShowUI(LBData.Instance.WndName.FerrisWheel_wnd);
                break;
            case GameConstants.SPECIAL_BUILDING_TYPE_6:
                JQX_Data.Instance.buildingStorageData = this._buildingStorageData;
                ui_mrg.Instance.ShowUI(JQX_Data.Instance.WndName.SpecialMovie_wnd);
                break;
            default:
                break;
        }
    }

    /**
     * 显示金币图标
     */
    public showProductionCoin(): void {
        this.currency_btn.skin = LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(1);
        this.currency_btn.visible = true;
        this.M_ButtonCtrl("resources/currency_btn").setOnClick(this.btnClick.bind(this));
    }

    /**
     * 隐藏金币图标
     */
    public hideProductionCoin(): void {
        this.M_ButtonCtrl("resources/currency_btn").setOnClick(null);
        this.currency_btn.visible = false;
    }

    /**
     * 建筑的升级数据
     */
    public set buildingStorageData(data: BuildingStorageData) {
        this._buildingStorageData = data;
    }

    /**
     * 
     */
    public get buildingStorageData(): BuildingStorageData {
        return this._buildingStorageData;
    }

    private specialBuildingUpdate(data: BuildingStorageData): void {
        if (this._buildingStorageData.building_id == data.building_id) {
            this._buildingStorageData = data;
            let buildingData: BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this._buildingStorageData.building_id, this._buildingStorageData.level);
            if(buildingData)
            {
                this.txtLevel.text = this._buildingStorageData.level + "";
                this.building_btn.skin = LLDataSheetManager.ins.buildingDataSheet.getBuildingSkin(buildingData);
            }
        }
    }

    private normalBuildingUpdate(data: BuildingStorageData): void {
        if (this._buildingStorageData.building_id == data.building_id){
            this._buildingStorageData = data;
            let buildingData: BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this._buildingStorageData.building_id, this._buildingStorageData.level);
            if(buildingData)
            {
                this.txtLevel.text = this._buildingStorageData.level + "";
                this.building_btn.skin = LLDataSheetManager.ins.buildingDataSheet.getBuildingSkin(buildingData);
            }
        }
    }

    public buildingProductionPercentTimeUpdate(array:Array<number>):void
    {
        if(this._buildingStorageData)
        {
            if(this.bar)
            {
                let buildingData: BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this._buildingStorageData.building_id, this._buildingStorageData.level);
                if(buildingData.building_type != GameConstants.SPECIAL_BUILDING_TYPE_1)
                {
                    if(this._buildingStorageData.building_id == array[0])
                    {
                        this.bar.value = array[1] > 1? 1 : array[1];
                        if(this.moveBar)
                        {
                            if(this.bar.value < 1)
                            {
                                this.moveBarImage.visible = true;
                                this.moveBar.beginMove();
                            }
                            else
                            {
                                this.moveBarImage.visible = false;
                                this.moveBar.stop();
                            }
                        }
                    }
                }
                else
                {
                    if(this.bar)
                    {
                        this.bar.value = 1;
                    }
                    if(this.moveBar)
                    {
                        this.moveBarImage.visible = false;
                        this.moveBar.stop();
                    }
                }
            }
        }
    }

    onDisable(): void {
    }

    destroy()
    {
        EventCenter.removeEvent(GameConstants.NORMAL_BUILDING_UPDATE, this.normalBuildingUpdate, this);
        EventCenter.removeEvent(GameConstants.SPECIAL_BUILDING_UPDATE, this.specialBuildingUpdate, this);
        EventCenter.removeEvent(GameConstants.BUILDING_PRODUCTION_PERCENT_TIME_UPDATE, this.buildingProductionPercentTimeUpdate, this);
        super.destroy();
    }

}