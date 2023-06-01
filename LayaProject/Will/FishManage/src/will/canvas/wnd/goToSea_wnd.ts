import Res_wnd from "../../../public/canvas/wnd/Res_wnd";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import M_Data from "../../../public/dataSheet/M_Data";
import GameLocalStorage from "../../../public/localStorage/GameLocalStorage";
import res_mrg from "../../../public/manager/res_mrg";
import ui_mrg from "../../../public/manager/ui_mrg";
import Will_Data from "../../dataSheet/Will_Data";
import scene3DCtrl from "../../game/scene3DCtrl";

import fishPoint_panel from "../panel/fishPoint_panel";
import main_panel from "../panel/main_panel";
import game_wnd, { gameStage } from "./game_wnd";

export default class goToSea_wnd extends UI_ctrl {
    constructor() { super(); }

    public Scene3DCtrl: scene3DCtrl;



    /** 主面板 */
    public MainPanel: main_panel;
    /** 鱼点面板 */
    public FishPointPanel: fishPoint_panel;


    onAwake() {
        super.onAwake();

        this.setPanel();

        // this.setPath();

        this.setBtn();

        this.initCloud();

    }

    /**
     * 设置面板
     */
    private setPanel() {
        this.MainPanel = this.M_Image("main_panel").addComponent(main_panel);
        this.MainPanel.Init(this);
        this.FishPointPanel = this.M_Image("fishPoint_panel").addComponent(fishPoint_panel);
        this.FishPointPanel.Init(this);
    }

    /**
     * 设置按钮
     */
    private setBtn() {
        // console.log(Will_DataManager.Instance.FishPointDataSheet.GetFishpointDataByLevel(1));
        // this.M_ButtonCtrl("")
    }

    /**
     * 设置路径
     */
    private setPath() {
        this.resCount = 1;

        let unityCount0Res: Array<string> = new Array;
        this.unityResPath = {
            count_0: unityCount0Res,
        }

        // for (let i = 0; i < Will_Data.Instance.fishArr.length; i++) {
        //     unityCount0Res.push(Will_Data.Instance.fishArr[i].path);
        // }

        // unityCount0Res.push(Will_Data.Instance.MainScene);

    }


    // public BeginnerCtrl(isShow: boolean) {
    //     // console.log(this.owner, this.M_Image("beginner_panel"));
    //     if (isShow) {
    //         this.M_Image("beginner_panel").visible = true;
    //     }
    //     else {
    //         this.M_Image("beginner_panel").visible = false;
    //         GameLocalStorage.Instance.beginnerStep += 1;
    //     }
    // }

    public IsLoadScene: boolean = false;

    public ShowFishing() {
        // this.MainPanel.Show();
        
        super.Show();
        this.owner.parent.setChildIndex(this.M_Image(), this.owner.parent.numChildren - 1);//设置到倒数最后一位
        
        let scene3D = res_mrg.Instance.GetUnityRes(Will_Data.Instance.MainScene) as Laya.Scene3D;
        Laya.stage.addChild(scene3D);
        this.Scene3DCtrl = scene3D.addComponent(scene3DCtrl);
        (<game_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.game_wnd)).Scene3DCtrl = this.Scene3DCtrl;
        scene3D.zOrder = -1;

        this.isLoad = true;
        (<game_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.game_wnd)).Fishing();
        this.CloudCtrl(false, () => {

            Laya.timer.once(500, this, () => {
                (<game_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.game_wnd)).PullFish();

                //云彩关闭后
                this.CloudCtrl(true, () => {
                    console.log("回调");
                    this.Close();
                });
            })

        }, 10);
    }

    public Show(fnc: Function = null, when: { area, fishPoint } = null) {
        //此处为新手引导的首站
        // done:！！！新手引导绿色标识

        (<Res_wnd>ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd)).Close();
        if (fnc) {
            this.MainPanel.SetBackBtnFnc(fnc);
        }


        // Will_UtilData.Instance.IslandCount = IslandLocalStorage.ins.selfIslands().length;
        // Will_UtilData.Instance.PlayerGrade = assetLocalStorage.Instance.playerLevel;


        // if (GameLocalStorage.Instance.beginnerStep == 2) {
        //     GameLocalStorage.Instance.beginnerStep = 3;
        //     super.Show();
        //     this.Scene3DCtrl.CameraCtrl.ShowCamera(1);
        //     this.MainPanel.Show(null, when);
        //     return;
        // }

        if (this.isLoad) {
            super.Show();
            this.Scene3DCtrl.CameraCtrl.ShowCamera(1);
            this.MainPanel.Show(null, when);
            return;
        }

        super.Show(() => {
            let scene3D = res_mrg.Instance.GetUnityRes(Will_Data.Instance.MainScene) as Laya.Scene3D;
            Laya.stage.addChild(scene3D);
            scene3D.zOrder = -1;
            this.Scene3DCtrl = scene3D.addComponent(scene3DCtrl);
            (<game_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.game_wnd)).Scene3DCtrl = this.Scene3DCtrl;
            this.MainPanel.Show(null, when);
        })
    }


    onUpdate() {

    }



    private openFnc: Function;
    private closeFnc: Function;
    private isCloudBack: boolean = false;
    /**
     * 云彩回调执行函数
     */
    private cloudBackFnc(isOpen: boolean) {
        if (!isOpen) {
            // console.log("云彩打开");
            this.openFnc();
        }
        else {
            // console.log("云彩关闭");
            this.closeFnc();
        }
    }

    /**
     * 初始化云彩
     */
    private initCloud() {
        for (let i = 0; i < this.M_Image("cloud_panel").numChildren; i++) {
            let cloud: Laya.Image = <Laya.Image>this.M_Image("cloud_panel").getChildAt(i);
            cloud.pivotX = cloud.width / 2;
            cloud.x = Laya.stage.width / 2;
        }
        this.cloudX = this.M_Image("cloud_panel/cloud").x;
        for (let i = 0; i < this.M_Image("cloud_panel").numChildren; i++) {
            let cloud: Laya.Image = <Laya.Image>this.M_Image("cloud_panel").getChildAt(i);
            i % 2 == 0 ? cloud.x = this.cloudX + this.addCount : cloud.x = this.cloudX - this.addCount;
        }
    }
    private addCount: number = 1500;
    private cloudX: number = 0;
    public CloudCtrl(isOpen: boolean, cloudFnc: Function, timer: number = 2000) {
        this.isCloudBack = false;
        for (let i = 0; i < this.M_Image("cloud_panel").numChildren; i++) {
            Laya.Tween.clearAll(this.M_Image("cloud_panel").getChildAt(i));
        }
        for (let i = 0; i < this.M_Image("cloud_panel").numChildren; i++) {
            if (!isOpen) {
                this.closeFnc = cloudFnc;
                Laya.Tween.to(this.M_Image("cloud_panel").getChildAt(i), { x: this.cloudX }, timer, Laya.Ease.cubicOut, Laya.Handler.create(this, () => {
                    if (!this.isCloudBack) {
                        this.isCloudBack = true;
                        this.cloudBackFnc(true);
                    }
                }))
            }
            else {
                this.openFnc = cloudFnc;
                if (i % 2 == 0) {
                    Laya.Tween.to(this.M_Image("cloud_panel").getChildAt(i), { x: this.cloudX + this.addCount }, timer, Laya.Ease.cubicOut, Laya.Handler.create(this, () => {
                        if (!this.isCloudBack) {
                            this.isCloudBack = true;
                            this.cloudBackFnc(false);
                        }
                    }))
                }
                else {
                    Laya.Tween.to(this.M_Image("cloud_panel").getChildAt(i), { x: this.cloudX - this.addCount }, timer, Laya.Ease.cubicOut, Laya.Handler.create(this, () => {
                        if (!this.isCloudBack) {
                            this.isCloudBack = true;
                            this.cloudBackFnc(false);
                        }
                    }))
                }
            }
        }

    }



}