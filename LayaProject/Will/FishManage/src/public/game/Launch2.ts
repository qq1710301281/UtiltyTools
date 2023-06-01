import JQX_Data from "../../jqx/dataSheet/JQX_Data";
import LL_Data from "../../ll/dataSheet/LL_Data";
import game_wnd from "../../will/canvas/wnd/game_wnd";
import goToSea_wnd from "../../will/canvas/wnd/goToSea_wnd";
import Will_Data from "../../will/dataSheet/Will_Data";
import Will_OfflineTimeMrg from "../manager/offlineTime_mrg";
import loading_wnd from "../canvas/wnd/loading_wnd";
import toast_wnd from "../canvas/wnd/toast_wnd";
import InputManager from "../core/Game/InputManager";
import M_Data from "../dataSheet/M_Data";
import res_mrg from "../manager/res_mrg";
import ui_mrg from "../manager/ui_mrg";
import PlainBuildings_wnd from "../../jqx/canvas/wnd/PlainBuildings_wnd";
import BuildingsLocalStorage from "../../jqx/localStorage/BuildingsLocalStorage";
import Island_wnd from "../../ll/canvas/wnd/Island_wnd";
import Map_wnd from "../../ll/canvas/wnd/Map_wnd";
import Res_wnd from "../canvas/wnd/Res_wnd";
import Player_Up_wnd from "../canvas/wnd/Player_Up_wnd";
import NormalBuildingProductionLocalStorage from "../../ll/localStorage/NormalBuildingProductionLocalStorage";
import SpecialMovie_wnd from "../../jqx/canvas/wnd/SpecialMovie_wnd";
import Upgrade_wnd from "../../jqx/canvas/wnd/Upgrade_wnd";
import CinemaStorageData from "../../jqx/localStorage/CinemaStorageData";
import AnglerClubsLocalStorage from "../../ll/localStorage/AnglerClubsLocalStorage";
import AnglerLocalStorage from "../../ll/localStorage/AnglerLocalStorage";
import AnglerClubs_wnd from "../../ll/canvas/wnd/AnglerClubs_wnd";


export default class Launch extends Laya.Script {

    constructor() {
        super();
    }
    //游戏运行前
    onAwake() {
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

        // this.count += Laya.timer.delta;
        // console.log(this.count);
    }
    // private count = 0;

    /**
     * 执行加载后的主要逻辑写在这里
     */
    private InitGame() {
        NormalBuildingProductionLocalStorage.ins.beginProduction();
        AnglerClubsLocalStorage.ins.beginCountDown();
        AnglerLocalStorage.ins.beginCountDown();
        ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();
        Will_OfflineTimeMrg.Instance.Init();
        // Laya.timer.once(500, this, () => {
        //     ui_mrg.Instance.ShowUI(Will_Data.Instance.WndName.goToSea_wnd);
        // })
    }

    /**
     * 加载初始资源
     */
    private loadStartRes() {
        let layaPathArr: Array<string> = new Array;
        let unityPathArr: Array<string> = new Array;

        res_mrg.Instance.PreloadResPkg([], [], () => {
            this.setPathArr(layaPathArr, unityPathArr);

            //加载完成后执行的逻辑
            res_mrg.Instance.PreloadResPkg(layaPathArr, unityPathArr, () => {
                ui_mrg.Instance.Register(M_Data.Instance.WndName.toast_wnd, M_Data.Instance.WndPath.toast_wnd, toast_wnd);
                ui_mrg.Instance.Register(Will_Data.Instance.WndName.goToSea_wnd, Will_Data.Instance.WndPath.goToSea_wnd, goToSea_wnd);
                ui_mrg.Instance.Register(Will_Data.Instance.WndName.game_wnd, Will_Data.Instance.WndPath.game_wnd, game_wnd);
                ui_mrg.Instance.Register(JQX_Data.Instance.WndName.PlainBuildings_wnd, JQX_Data.Instance.WndPath.PlainBuildings_wnd, PlainBuildings_wnd);
                ui_mrg.Instance.Register(JQX_Data.Instance.WndName.Upgrade_wnd, JQX_Data.Instance.WndPath.Upgrade_wnd, Upgrade_wnd);
                ui_mrg.Instance.Register(JQX_Data.Instance.WndName.SpecialMovie_wnd, JQX_Data.Instance.WndPath.SpecialMovie_wnd, SpecialMovie_wnd);
                ui_mrg.Instance.Register(M_Data.Instance.WndName.Res_wnd, M_Data.Instance.WndPath.Res_wnd, Res_wnd);
                ui_mrg.Instance.Register(M_Data.Instance.WndName.Player_Up_wnd, M_Data.Instance.WndPath.Player_Up_wnd, Player_Up_wnd);
                ui_mrg.Instance.Register(LL_Data.Instance.WndName.Map_wnd, LL_Data.Instance.WndPath.Map_wnd, Map_wnd);
                ui_mrg.Instance.Register(LL_Data.Instance.WndName.Island_wnd, LL_Data.Instance.WndPath.Island_wnd, Island_wnd);
                ui_mrg.Instance.Register(LL_Data.Instance.WndName.AnglerClubs_wnd, LL_Data.Instance.WndPath.AnglerClubs_wnd, AnglerClubs_wnd);
                this.InitGame();
            });
        });
    }

    //设置路径的集合
    private setPathArr(layaPathArr: Array<string>, unityPathArr: Array<string>) {
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

