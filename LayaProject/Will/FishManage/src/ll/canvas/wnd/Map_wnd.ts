import BuildingsLocalStorage from "../../../jqx/localStorage/BuildingsLocalStorage";
import BuildingStorageData from "../../../jqx/localStorage/BuildingStorageData";
import JQX_Tools from "../../../jqx/other/JQX_Tools";
import SoundBolTime, { SoundName } from "../../../lb/manager/SoundBolTime";
import Res_wnd from "../../../public/canvas/wnd/Res_wnd";
import EventCenter from "../../../public/core/Game/EventCenter";
import Button_ctrl from "../../../public/core/UI/Button_ctrl";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import M_Data from "../../../public/dataSheet/M_Data";
import RegionData from "../../../public/dataSheet/RegionData";
import { Util } from "../../../public/game/Util";
import assetLocalStorage from "../../../public/localStorage/assetLocalStorage";
import ui_mrg from "../../../public/manager/ui_mrg";
import LL_Data from "../../dataSheet/LL_Data";
import BuildingProductionStorageData from "../../localStorage/BuildingProductionStorageData";
import LLDataSheetManager from "../../manager/LLDataSheetManager";
import AdaptorUtilsScript from "../../other/AdaptorUtilsScript";
import Building from "../../other/Building";
import GameConstants from "../../other/GameConstants";
import Image = Laya.Image;
import Point = Laya.Point;
import Tween = Laya.Tween;
import Ease = Laya.Ease;
import Handler = Laya.Handler;

export default class Map_wnd extends UI_ctrl {
    /**
     * 建筑是否正在建设中
     */
    public isConstruction:boolean = false;

    private isAddEvent: boolean = false;
    private container: Image = null;
    private bgContainer: Image = null;
    private bgs: Array<Image> = [];
    private buildingContainer: Image = null;
    private playerContainer: Image = null;
    private buildings: Array<Image> = [];
    private navigationBtns: Array<Image> = [];
    private flags: Image = null;

    private pageMax: number = 0;
    private downX: number = 0;
    private dowTime: number = 0;
    private offsetX: number = 0;
    private scrollCount: number = 0;
    private stopUp: boolean = false;



    constructor() { super(); }

    onAwake(): void {
        super.onAwake();
        AdaptorUtilsScript.ins.init(1080, 1920);
        this.container = this.M_Image("container");
        this.bgContainer = this.M_Image("container/bgContainer");
        this.buildingContainer = this.M_Image("container/buildingContainer");
        this.playerContainer = this.M_Image("container/playerContainer");
        for (let i: number = 0; i < 3; i++) {
            this.navigationBtns.push(this.M_Image("navigationContainer/navigation" + i + "_btn"));
        }
        this.flags = this.M_Image("navigationContainer/flags");
    }

    onEnable(): void {
    }

    onDisable(): void {
    }

    onMouseDown(e: laya.events.Event): void {
        if(assetLocalStorage.Instance.tutorialFinished)
        {
            if (e.touches) {
                if (e.touches.length <= 1) {
                    Tween.clearAll(this.container);
                    this.downX = Laya.stage.mouseX;
                    this.dowTime = Laya.timer.currTimer;
                    this.offsetX = Laya.stage.mouseX - this.container.x;
                    this.stopUp = true;
                }
            }
        }
    }

    onMouseUp(e: laya.events.Event): void {
        if(assetLocalStorage.Instance.tutorialFinished)
        {
            if (e.touches) {
                if (e.touches.length == 0) {
                    if (this.stopUp) {
                        this.stopUp = false;
                        let upX: number = Laya.stage.mouseX;
                        let upTime: number = Laya.timer.currTimer;
                        let scrollDistance: number = upX - this.downX;
                        let scrollTime: number = upTime - this.dowTime;
                        let targetX: number = 0;
                        if (scrollDistance != 0 && Math.abs(scrollDistance) > 1) {
                            if (scrollTime < 200) {
                                if (scrollDistance < 0) {
                                    this.scrollCount += 1;
                                    this.scrollCount = this.scrollCount >= this.pageMax ? this.pageMax - 1 : this.scrollCount;
                                    targetX = 0 - AdaptorUtilsScript.ins.designWidth * this.scrollCount;
                                }
                                else {
                                    this.scrollCount -= 1;
                                    this.scrollCount = this.scrollCount <= 0 ? 0 : this.scrollCount;
                                    targetX = 0 - AdaptorUtilsScript.ins.designWidth * this.scrollCount;
                                }
                                Tween.to(this.container, { x: targetX, ease: Ease.quintOut, complete: Handler.create(this, this.onComplete) }, 300);
                            }
                            else {
                                targetX = this.getTargetX();
                                Tween.to(this.container, { x: targetX, ease: Ease.quintOut, complete: Handler.create(this, this.onComplete) }, 300);
                            }
                        }
                    }
                }
            }
        }
    }

    private onComplete(): void {
        for (let i: number = 0; i < this.bgs.length; i++) {
            let point: Point = this.bgContainer.localToGlobal(new Point(this.bgs[i].x, this.bgs[i].y));
            if (point.x == 0) {
                this.scrollCount = i;
                if (this.scrollCount == 0) {
                    if (this.pageMax == 2) {
                        this.flags.x = 270;
                    }
                    else if (this.pageMax == 3) {
                        this.flags.x = 127;
                    }
                }
                else if (this.scrollCount == 1) {
                    if (this.pageMax == 2) {
                        this.flags.x = 522;
                    }
                    else if (this.pageMax == 3) {
                        this.flags.x = 383.5;
                    }

                }
                else if (this.scrollCount == 2) {
                    if (this.pageMax == 2) {
                        this.flags.x = 522;
                    }
                    else if (this.pageMax == 3) {
                        this.flags.x = 650.5;
                    }
                }
                break;
            }
        }
    }

    onMouseMove(e: laya.events.Event): void {
        if(assetLocalStorage.Instance.tutorialFinished)
        {
            if (e.touches) {
                let tx: number = e.touches[0].stageX - this.offsetX;
                let designWidth: number = AdaptorUtilsScript.ins.designWidth;
                tx = tx < -((this.pageMax - 1) * designWidth) ? -((this.pageMax - 1) * designWidth) : tx;
                tx = tx > 0 ? 0 : tx;
                this.container.x = tx;
            }
        }
    }

    private getTargetX(): number {
        let targetX: number = 0;
        for (let i: number = this.bgs.length - 1; i > 0; i--) {
            let point: Point = this.bgContainer.localToGlobal(new Point(this.bgs[i].x, this.bgs[i].y));
            if (point.x <= (AdaptorUtilsScript.ins.realGameWidth / 2)) {
                targetX = 0 - AdaptorUtilsScript.ins.designWidth * i;
                this.scrollCount = (i + 1);
                break;
            }
        }
        return targetX;
    }

    private initUI(): void {
        this.container.x = 0;
        this.scrollCount = 0;
        let regionDatas: Array<RegionData> = LLDataSheetManager.ins.regionDataSheet.getIsLandRegionDatas(LL_Data.Instance.currentIsLandID);
        this.pageMax = regionDatas.length;
        this.container.width = AdaptorUtilsScript.ins.designWidth * this.pageMax;
        this.bgContainer.width = this.container.width;
        this.buildingContainer.width = this.container.width;
        this.playerContainer.width = this.container.width;
        while (this.bgs.length) {
            let image: Image = this.bgs.shift();
            if (image.parent) {
                image.parent.removeChild(image);
                image.destroy(true);
                image = null;
            }
        }
        let i: number = 0;
        for (i = 0; i < this.pageMax; i++) {
            this.bgs.push(new Image());
        }
        for (i = 0; i < this.pageMax; i++) {
            this.bgs[i].skin = LLDataSheetManager.ins.regionDataSheet.getRegionSkin(regionDatas[i].id);
            this.bgs[i].x = AdaptorUtilsScript.ins.designWidth * i;
            this.bgContainer.addChild(this.bgs[i]);
        }
        for (i = 0; i < this.navigationBtns.length; i++) {
            let button_ctrl: Button_ctrl = this.navigationBtns[i].getComponent(Button_ctrl);
            button_ctrl.setOnClick(null);
        }
        if (this.pageMax == 2) {
            this.flags.x = 270;
            this.navigationBtns[0].x = 284;
            this.navigationBtns[1].visible = false;
            this.navigationBtns[2].x = 557;
            this.navigationBtns[0].getComponent(Button_ctrl).setOnClick(this.btnClick.bind(this));
            this.navigationBtns[2].getComponent(Button_ctrl).setOnClick(this.btnClick.bind(this));
        }
        else if (this.pageMax == 3) {
            this.flags.x = 127;
            this.navigationBtns[0].x = 142;
            this.navigationBtns[1].visible = true;
            this.navigationBtns[2].x = 687;
            this.navigationBtns[0].getComponent(Button_ctrl).setOnClick(this.btnClick.bind(this));
            this.navigationBtns[1].getComponent(Button_ctrl).setOnClick(this.btnClick.bind(this));
            this.navigationBtns[2].getComponent(Button_ctrl).setOnClick(this.btnClick.bind(this));
        }
    }

    private btnClick(button_ctrl: Button_ctrl): void {
        switch (button_ctrl) {
            case this.navigationBtns[0].getComponent(Button_ctrl):
                if (this.pageMax == 2) {
                    this.flags.x = 270;
                }
                else if (this.pageMax == 3) {
                    this.flags.x = 127;
                }
                Tween.to(this.container, { x: 0, ease: Ease.quintOut, complete: Handler.create(this, this.onComplete) }, 300);
                break;
            case this.navigationBtns[1].getComponent(Button_ctrl):
                this.flags.x = 383.5;
                Tween.to(this.container, { x: -1080, ease: Ease.quintOut, complete: Handler.create(this, this.onComplete) }, 300);
                break;
            case this.navigationBtns[2].getComponent(Button_ctrl):
                if (this.pageMax == 2) {
                    this.flags.x = 522;
                    Tween.to(this.container, { x: -1080, ease: Ease.quintOut, complete: Handler.create(this, this.onComplete) }, 300);
                }
                else if (this.pageMax == 3) {
                    this.flags.x = 650.5;
                    Tween.to(this.container, { x: -2160, ease: Ease.quintOut, complete: Handler.create(this, this.onComplete) }, 300);
                }
                break;
            default:
                break;
        }
    }

    private initBuilding(): void {
        while (this.buildings.length) {
            let buildingIcon: Image = this.buildings.shift();
            if (buildingIcon.parent) {
                buildingIcon.parent.removeChild(buildingIcon);
            }
            let building: Building = buildingIcon.getComponent(Building);
            building.destroy();
            building = null;
            buildingIcon.destroy(true);
            buildingIcon = null;
        }
        let buildingStorageData: Array<BuildingStorageData> = BuildingsLocalStorage.ins.getBuildingStorageData(LL_Data.Instance.currentIsLandID);
        for (let i: number = 0; i < buildingStorageData.length; i++) {
            let buildingUI: Image = Util.GetPrefab(LL_Data.Instance.otherPath.building) as Image;
            let building: Building = buildingUI.addComponent(Building);
            building.buildingStorageData = buildingStorageData[i];
            this.buildings.push(buildingUI);
            this.buildingContainer.addChild(buildingUI);
        }
    }

    /**
     * 显示建筑产出
     * @param buildingProductionStorageDatas 
     */
    private buildingProduction(buildingProductionStorageDatas: Array<BuildingProductionStorageData>): void {
        for (let i: number = 0; i < buildingProductionStorageDatas.length; i++) {
            for (let j: number = 0; j < this.buildings.length; j++) {
                let building: Building = this.buildings[j].getComponent(Building);
                if (building.buildingStorageData.building_id == buildingProductionStorageDatas[i].building_id) {
                    building.showProductionCoin();
                }
            }
        }
    }

    /**
     * 隐藏建筑产出金币图标
     */
    public buildingHideCoin(building_id: number): void {
        for (let j: number = 0; j < this.buildings.length; j++) {
            let building: Building = this.buildings[j].getComponent(Building);
            if (building.buildingStorageData.building_id == building_id) {
                building.hideProductionCoin();
                break;
            }
        }
    }

    Show() {
        // this.resCount=1;
        // this.layaResPath={
        //     count1:[
        //         "res/atlas/res/image/ll/Map_wnd/map/isLand1.atlas",
        //         LL_Data.Instance.otherPath.building,
        //     ],
        // }
        // this.layaResPath["count1"]={""};
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        //世界地图 背景音乐
        SoundBolTime.getInstance().playMusicBg(SoundName.ISLEMUSIC);
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        this.isLoad = false;
        super.Show(() => {
            if (LL_Data.Instance.resetIslandUI) {
                LL_Data.Instance.resetIslandUI = false;
                this.initUI();
            }
            this.initBuilding();
            if (!this.isAddEvent) {
                this.isAddEvent = true;
                EventCenter.rigestEvent(GameConstants.BUILDING_PRODUCTION, this.buildingProduction, this);
                EventCenter.rigestEvent(GameConstants.BUILDING_HIDE_COIN, this.buildingHideCoin, this);
            }
            EventCenter.postEvent(GameConstants.BUILDING_UI_OPEN);
            (<Res_wnd>ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd)).Show(null, false);
        });


    }
}