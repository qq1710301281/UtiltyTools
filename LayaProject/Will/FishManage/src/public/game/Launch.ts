import JQX_Data from "../../jqx/dataSheet/JQX_Data";
import LL_Data from "../../ll/dataSheet/LL_Data";
import game_wnd from "../../will/canvas/wnd/game_wnd";
import goToSea_wnd from "../../will/canvas/wnd/goToSea_wnd";
import Will_Data from "../../will/dataSheet/Will_Data";
import Will_OfflineTimeMrg from "../manager/offlineTime_mrg";
import loading_wnd from "../canvas/wnd/loading_wnd";
import toast_wnd from "../canvas/wnd/toast_wnd";
import InputManager, { Input, KeyCode } from "../core/Game/InputManager";
import M_Data from "../dataSheet/M_Data";
import res_mrg from "../manager/res_mrg";
import ui_mrg from "../manager/ui_mrg";
import PlainBuildings_wnd from "../../jqx/canvas/wnd/PlainBuildings_wnd";
import BuildingsLocalStorage from "../../jqx/localStorage/BuildingsLocalStorage";
import Island_wnd from "../../ll/canvas/wnd/Island_wnd";
import Map_wnd from "../../ll/canvas/wnd/Map_wnd";
import Res_wnd from "../canvas/wnd/Res_wnd";
import GameLocalStorage from "../localStorage/GameLocalStorage";
import NormalBuildingProductionLocalStorage from "../../ll/localStorage/NormalBuildingProductionLocalStorage";
import AnglerClubsLocalStorage from "../../ll/localStorage/AnglerClubsLocalStorage";
import AnglerLocalStorage from "../../ll/localStorage/AnglerLocalStorage";
import restuarant_wnd from "../../will/canvas/wnd/restuarant_wnd";
import book_wnd from "../../lb/canvas/wnd/book_wnd";
import detailed_wnd from "../../lb/canvas/wnd/detailed_wnd";
import entertainment_wnd from "../../lb/canvas/wnd/entertainment_wnd";
import FerrisWheel_wnd from "../../lb/canvas/wnd/FerrisWheel_wnd";
import publicGong_wnd from "../../lb/canvas/wnd/publicGong_wnd";
import reward_wnd from "../../lb/canvas/wnd/reward_wnd";
import tipBox_wnd from "../../lb/canvas/wnd/tipBox_wnd";
import underwater_wnd from "../../lb/canvas/wnd/underwater_wnd";
import LBData from "../../lb/dataSheet/LB_Data";
import SpecialMovie_wnd from "../../jqx/canvas/wnd/SpecialMovie_wnd";
import Upgrade_wnd from "../../jqx/canvas/wnd/Upgrade_wnd";
import AnglerClubs_wnd from "../../ll/canvas/wnd/AnglerClubs_wnd";
import Player_Up_wnd from "../canvas/wnd/Player_Up_wnd";
import { LB_TIME } from "../../lb/localStorage/LB_TIME";
import LB_LocalData from "../../lb/localStorage/LB_LocalData";
import Excessive from "../../lb/canvas/wnd/Excessive";
import guide_wnd from "../../lb/canvas/wnd/guide_wnd";
import assetLocalStorage from "../localStorage/assetLocalStorage";


export default class Launch extends Laya.Script {

    constructor() {
        super();
    }
    //游戏运行前
    onAwake() {

        // Laya.URL.basePath = "http://xinchentech.shadougan.cn/will/";
        // Laya.URL.getAdptedFilePath(Laya.URL.basePath);

        this.owner.addComponent(InputManager);
        this.owner.addComponent(ui_mrg);
        this.owner.addComponent(res_mrg);

        //loading需要提前手动注册
        if (this.owner.getChildByName(M_Data.Instance.WndName.loading_wnd)) {
            ui_mrg.Instance.Register(M_Data.Instance.WndName.loading_wnd, M_Data.Instance.WndPath.loading_wnd, loading_wnd);
            res_mrg.Instance.loadingWnd = ui_mrg.Instance.GetUI(M_Data.Instance.WndName.loading_wnd) as loading_wnd;
            this.loadStartRes();
        }
        else {
            Laya.loader.load(M_Data.Instance.WndPath.loading_wnd, Laya.Handler.create(this, (prefab: Laya.Prefab) => {
                this.owner.addChild((prefab.create() as Laya.Sprite));
                ui_mrg.Instance.Register(M_Data.Instance.WndName.loading_wnd, M_Data.Instance.WndPath.loading_wnd, loading_wnd);
                res_mrg.Instance.loadingWnd = ui_mrg.Instance.GetUI(M_Data.Instance.WndName.loading_wnd) as loading_wnd;
                this.loadStartRes();
            }))
        }
    }

    private isOnceInGame: boolean = false;
    onUpdate() {
        if (!Laya.stage.isVisibility) {
            this.isOnceInGame = false;
            Laya.timer.scale = 0;
        }
        else {
            if (!this.isOnceInGame) {
                Laya.timer.scale = 1;
                this.isOnceInGame = true;
            }
        }

        // if (Input.getKeyDown(KeyCode.D)) {
        //     (<game_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.game_wnd)).BackMap();
        //     ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();
        // }

        // if (Input.getKeyDown(KeyCode.P)) {
        //     Laya.timer.scale = 0;
        // }

        // if (Input.getKeyDown(KeyCode.O)) {
        //     Laya.timer.scale = 1;
        // }
        // this.count += Laya.timer.delta;
        // console.log(this.count);
    }
    // private count = 0;

    /**
     * 执行加载后的主要逻辑写在这里
     */
    private InitGame() {
        BuildingsLocalStorage.ins;
        Will_OfflineTimeMrg.Instance.Init();
        NormalBuildingProductionLocalStorage.ins.beginProduction();
        AnglerClubsLocalStorage.ins.beginCountDown();
        AnglerLocalStorage.ins.beginCountDown();
        LB_TIME.getInstance().LoadUserData();
        LB_LocalData.Instance;

        //游戏中的预制体 必加的
        ui_mrg.Instance.Register(M_Data.Instance.WndName.toast_wnd, M_Data.Instance.WndPath.toast_wnd, toast_wnd);
        ui_mrg.Instance.Register(Will_Data.Instance.WndName.goToSea_wnd, Will_Data.Instance.WndPath.goToSea_wnd, goToSea_wnd);
        ui_mrg.Instance.Register(Will_Data.Instance.WndName.game_wnd, Will_Data.Instance.WndPath.game_wnd, game_wnd);


        //主界面的场景
        ui_mrg.Instance.Register(JQX_Data.Instance.WndName.PlainBuildings_wnd, JQX_Data.Instance.WndPath.PlainBuildings_wnd, PlainBuildings_wnd);


        //建筑的窗口
        ui_mrg.Instance.Register(Will_Data.Instance.WndName.restuarant_wnd, Will_Data.Instance.WndPath.restuarant_wnd, restuarant_wnd);

        ui_mrg.Instance.Register(LBData.Instance.WndName.entertainment_wnd, LBData.Instance.WndPath.entertainment_wnd, entertainment_wnd);
        ui_mrg.Instance.Register(LBData.Instance.WndName.publicGong_wnd, LBData.Instance.WndPath.publicGong_wnd, publicGong_wnd);
        ui_mrg.Instance.Register(LBData.Instance.WndName.reward_wnd, LBData.Instance.WndPath.reward_wnd, reward_wnd);
        ui_mrg.Instance.Register(LBData.Instance.WndName.underwater_wnd, LBData.Instance.WndPath.underwater_wnd, underwater_wnd);
        ui_mrg.Instance.Register(LBData.Instance.WndName.book_wnd, LBData.Instance.WndPath.book_wnd, book_wnd);
        ui_mrg.Instance.Register(LBData.Instance.WndName.detailed_wnd, LBData.Instance.WndPath.detailed_wnd, detailed_wnd);
        ui_mrg.Instance.Register(LBData.Instance.WndName.FerrisWheel_wnd, LBData.Instance.WndPath.FerrisWheel_wnd, FerrisWheel_wnd);
        ui_mrg.Instance.Register(LBData.Instance.WndName.tipBox_wnd, LBData.Instance.WndPath.tipBox_wnd, tipBox_wnd);

        ui_mrg.Instance.Register(JQX_Data.Instance.WndName.Upgrade_wnd, JQX_Data.Instance.WndPath.Upgrade_wnd, Upgrade_wnd);
        ui_mrg.Instance.Register(JQX_Data.Instance.WndName.SpecialMovie_wnd, JQX_Data.Instance.WndPath.SpecialMovie_wnd, SpecialMovie_wnd);
        ui_mrg.Instance.Register(M_Data.Instance.WndName.Res_wnd, M_Data.Instance.WndPath.Res_wnd, Res_wnd);
        ui_mrg.Instance.Register(M_Data.Instance.WndName.Player_Up_wnd, M_Data.Instance.WndPath.Player_Up_wnd, Player_Up_wnd);
        ui_mrg.Instance.Register(LL_Data.Instance.WndName.Map_wnd, LL_Data.Instance.WndPath.Map_wnd, Map_wnd);
        ui_mrg.Instance.Register(LL_Data.Instance.WndName.Island_wnd, LL_Data.Instance.WndPath.Island_wnd, Island_wnd);
        ui_mrg.Instance.Register(LL_Data.Instance.WndName.AnglerClubs_wnd, LL_Data.Instance.WndPath.AnglerClubs_wnd, AnglerClubs_wnd);


        ui_mrg.Instance.Register(LBData.Instance.WndName.Excessive, LBData.Instance.WndPath.Excessive, Excessive);
        ui_mrg.Instance.Register(LBData.Instance.WndName.guide_wnd, LBData.Instance.WndPath.guide_wnd, guide_wnd);

        

        if (!assetLocalStorage.Instance.tutorialFinished) {
            // (<goToSea_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd)).ShowFishing();
            ui_mrg.Instance.ShowUI(LBData.Instance.WndName.Excessive);
        }
        else{
            ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();
        }

        // ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();

        // ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();
        // (<game_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.game_wnd)).Fishing();

        //如果不是新手引导就直接注册 并进入主界面
        // if (GameLocalStorage.Instance.beginnerStep != 1) {

        //     // (<restuarant_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.restuarant_wnd)).Show(null,1);
        //     // (<goToSea_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd)).Show(null, { area: 0, fishPoint: 5 });
        //     return;
        // }

        // ui_mrg.Instance.ShowUI(Will_Data.Instance.WndName.goToSea_wnd);

        // //进入分布加载
        // let layaPathArr: Array<string> = new Array;
        // let unityPathArr: Array<string> = new Array;
        // this.setMainPathArr(layaPathArr, unityPathArr);
        // res_mrg.Instance.PreloadResPkg(layaPathArr, unityPathArr, () => {
        //     ui_mrg.Instance.Register(JQX_Data.Instance.WndName.PlainBuildings_wnd, JQX_Data.Instance.WndPath.PlainBuildings_wnd, PlainBuildings_wnd);
        //     ui_mrg.Instance.Register(M_Data.Instance.WndName.Res_wnd, M_Data.Instance.WndPath.Res_wnd, Res_wnd);
        //     ui_mrg.Instance.Register(LL_Data.Instance.WndName.Map_wnd, LL_Data.Instance.WndPath.Map_wnd, Map_wnd);
        //     ui_mrg.Instance.Register(LL_Data.Instance.WndName.Island_wnd, LL_Data.Instance.WndPath.Island_wnd, Island_wnd);
        //     // (<goToSea_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd)).BeginnerCtrl(false);
        // }, false);



    }

    /**
     * 加载初始资源
     */
    private loadStartRes() {
        let layaPathArr: Array<string> = new Array;
        let unityPathArr: Array<string> = new Array;
        res_mrg.Instance.PreloadResPkg([], [], () => {
            this.setGamePathArr(layaPathArr, unityPathArr);

            // //如果不是新手引导就先加载
            // if (GameLocalStorage.Instance.beginnerStep != 1) {
            //     this.setMainPathArr(layaPathArr, unityPathArr);
            // }

            this.setMainPathArr(layaPathArr, unityPathArr);

            //加载完成后执行的逻辑
            res_mrg.Instance.PreloadResPkg(layaPathArr, unityPathArr, () => {
                this.InitGame();
            });
        });


    }


    //设置主界面的集合
    private setMainPathArr(layaPathArr: Array<string>, unityPathArr: Array<string>) {
        //JQX开的集合
        for (let i = 0; i < JQX_Data.Instance.AllLayaPath.length; i++) {
            for (const key in JQX_Data.Instance.AllLayaPath[i]) {
                layaPathArr.push(JQX_Data.Instance.AllLayaPath[i][key]);
            }
        }

        for (let i = 0; i < JQX_Data.Instance.AllUnityPath.length; i++) {
            for (const key in JQX_Data.Instance.AllUnityPath[i]) {
                unityPathArr.push(JQX_Data.Instance.AllUnityPath[i][key]);
            }
        }

        //LL的集合
        for (let i = 0; i < LL_Data.Instance.AllLayaPath.length; i++) {
            for (const key in LL_Data.Instance.AllLayaPath[i]) {
                layaPathArr.push(LL_Data.Instance.AllLayaPath[i][key]);
            }
        }

        for (let i = 0; i < LL_Data.Instance.AllUnityPath.length; i++) {
            for (const key in LL_Data.Instance.AllUnityPath[i]) {
                unityPathArr.push(LL_Data.Instance.AllUnityPath[i][key]);
            }
        }

        //LB的集合
        for (let i = 0; i < LBData.Instance.AllLayaPath.length; i++) {
            for (const key in LBData.Instance.AllLayaPath[i]) {
                layaPathArr.push(LBData.Instance.AllLayaPath[i][key]);
            }
        }

        for (let i = 0; i < LBData.Instance.AllUnityPath.length; i++) {
            for (const key in LBData.Instance.AllUnityPath[i]) {
                unityPathArr.push(LBData.Instance.AllUnityPath[i][key]);
            }
        }
    }


    //设置路径的集合
    private setGamePathArr(layaPathArr: Array<string>, unityPathArr: Array<string>) {
        //公开的集合
        for (let i = 0; i < M_Data.Instance.AllLayaPath.length; i++) {
            for (const key in M_Data.Instance.AllLayaPath[i]) {
                layaPathArr.push(M_Data.Instance.AllLayaPath[i][key]);
            }
        }

        for (let i = 0; i < M_Data.Instance.AllUnityPath.length; i++) {
            for (const key in M_Data.Instance.AllUnityPath[i]) {
                unityPathArr.push(M_Data.Instance.AllUnityPath[i][key]);
            }
        }


        //Will的集合
        for (let i = 0; i < Will_Data.Instance.AllLayaPath.length; i++) {
            for (const key in Will_Data.Instance.AllLayaPath[i]) {
                layaPathArr.push(Will_Data.Instance.AllLayaPath[i][key]);
            }
            // console.log("++++",layaPathArr);
        }

        for (let i = 0; i < Will_Data.Instance.AllUnityPath.length; i++) {
            for (const key in Will_Data.Instance.AllUnityPath[i]) {
                unityPathArr.push(Will_Data.Instance.AllUnityPath[i][key]);
            }
        }

    }
}

