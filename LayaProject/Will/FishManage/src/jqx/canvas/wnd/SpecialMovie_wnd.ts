import SoundBolTime, { SoundName } from "../../../lb/manager/SoundBolTime";
import BackpackLocalStorage from "../../../ll/localStorage/BackpackLocalStorage";
import BuildingProductionStorageData from "../../../ll/localStorage/BuildingProductionStorageData";
import NormalBuildingProductionLocalStorage from "../../../ll/localStorage/NormalBuildingProductionLocalStorage";
import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import Calculator from "../../../ll/other/Calculator";
import GameConstants from "../../../ll/other/GameConstants";
import GameUtils from "../../../ll/other/GameUtils";
import Res_wnd from "../../../public/canvas/wnd/Res_wnd";
import EventCenter from "../../../public/core/Game/EventCenter";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import CinemaData from "../../../public/dataSheet/CinemaData";
import M_Data from "../../../public/dataSheet/M_Data";
import assetLocalStorage from "../../../public/localStorage/assetLocalStorage";
import ui_mrg from "../../../public/manager/ui_mrg";
import JQX_Data from "../../dataSheet/JQX_Data";
import BuildingsLocalStorage from "../../localStorage/BuildingsLocalStorage";
import BuildingUpdateResult from "../../localStorage/BuildingUpdateResult";
import CinemaLocalStorageData from "../../localStorage/CinemaLocalStorageData";
import CinemaStorageData from "../../localStorage/CinemaStorageData";
import CinemaConstants from "../../other/CinemaConstants";
import JQX_Tools, { numberFormatter } from "../../other/JQX_Tools";
import Tween = Laya.Tween;
import Ease = Laya.Ease;
import Handler = Laya.Handler;
import Animation = Laya.Animation;
import Event = Laya.Event;
/**
 * 特殊建筑 海岛影城界面
 */
export default class SpecialMovie_wnd extends UI_ctrl {

    //产出事件是否存在
    private isAddEvent: boolean = false;
    //海岛影城倒计时
    private cinemaMyTimer;
    private cinemaLv: number = 1;

    //数据
    private numList: number[] = [];

    //是否启动
    private isTureBool: boolean[] = [];
    private buildingUpdateResult: BuildingUpdateResult = null;

    private cinemaLocalStorageDatas: Array<CinemaLocalStorageData> = [];


    private isSkin: string = "res/image/public/cinema/false_play.png";

    /**
* 
*/
    private mc1: Animation = null;
    private mc2: Animation = null;
    private mc3: Animation = null;
    private mc4: Animation = null;


    constructor() { super(); }

    onAwake(): void {
        this.mc1 = new Animation();
        this.mc2 = new Animation();
        this.mc3 = new Animation();
        this.mc4 = new Animation();
        this.mc1.loadAtlas("res/atlas/res/image/public/cinema/cinema01.atlas");
        this.mc2.loadAtlas("res/atlas/res/image/public/cinema/cinema02.atlas");
        this.mc3.loadAtlas("res/atlas/res/image/public/cinema/cinema01.atlas");
        this.mc4.loadAtlas("res/atlas/res/image/public/cinema/cinema02.atlas");
        super.onAwake();
    }

    public Show() {

        //海岛影城背景音乐
        SoundBolTime.getInstance().playMusicBg(SoundName.STUDIOMUSIC);
        ///////////////////////////////////////////////////////////////////
        //显示部分
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show();
        /////////////////////////////////////////////////////////////
        this.resetUI();
        this.M_Text("moneyShow/Icon_profitNum").text = "0";
        //关闭按钮
        this.M_ButtonCtrl("show_panel/close_btn").setOnClick(() => {
            //海岛影城背景音乐关闭
            SoundBolTime.getInstance().closeMusic();
            //返回显示全部的
            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, false);
            this.Close();
        });
        //////////////////////////////////////////////////////////////////////////////////
        //领取
        this.M_ButtonCtrl("show_panel/receive_btn").setOnClick(() => {
            JQX_Tools.log("领取");
            NormalBuildingProductionLocalStorage.ins.getBuildingProductionCoin(JQX_Data.Instance.buildingStorageData.building_id);
            EventCenter.postEvent(GameConstants.BUILDING_UI_OPEN);
            this.M_Text("moneyShow/Icon_profitNum").text = "0";
            this.resetUI();
        });
        //////////////////////////////////////////////////////////////////////////////////
        //升级建筑
        this.M_ButtonCtrl("show_panel/upgrade_btn").setOnClick(() => {
            //当前数据
            this.buildingUpdateResult = BuildingsLocalStorage.ins.upgradeBuilding(JQX_Data.Instance.buildingStorageData);
            //下一等级数据
            let buildingUpgradeData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(JQX_Data.Instance.buildingStorageData.building_id, JQX_Data.Instance.buildingStorageData.level + 1);
            JQX_Data.Instance.buildingStorageData = this.buildingUpdateResult.buildingStorageData;

            if (this.buildingUpdateResult.errorCode == 0) {
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
                this.resetUI();
            }
            //玩家等级不够 不能升级建筑
            else if (this.buildingUpdateResult.errorCode == 1) {
                JQX_Tools.log("玩家等级不够");

                // this.M_Text("buildingBG1/up_lose").text = `玩家等级不够您需要达到${buildingUpgradeData.level_limit}`;
                //GameUtils.showFlyText("您的等级不够,不能升级当前建筑!", "#ff0000", 36);
            }
        });
        /////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //侦听到建筑产出
        if (!this.isAddEvent) {
            this.isAddEvent = true;
            EventCenter.rigestEvent(GameConstants.BUILDING_PRODUCTION, this.buildingProduction, this);
        }
        EventCenter.postEvent(GameConstants.BUILDING_UI_OPEN);
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.effect(this.M_Image("show_panel"));
        super.Show();
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //刷新建筑总产出
    buildingProduction(buildingProductionStorageDatas: Array<BuildingProductionStorageData>) {
        for (let i = 0; i < buildingProductionStorageDatas.length; i++) {
            if (buildingProductionStorageDatas[i].building_id == JQX_Data.Instance.buildingStorageData.building_id) {
                this.M_Text("moneyShow/Icon_profitNum").text = (buildingProductionStorageDatas[i].production_gold_coins).toString();
                break;
            }
        }
    }
    /**
     * 刷新ui
     * @param resetUI
     */
    public resetUI() {
        //建筑的当前数据
        let buildsData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(JQX_Data.Instance.buildingStorageData.building_id, JQX_Data.Instance.buildingStorageData.level);
        //建筑的下一条数据
        let buildingUpgradeData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(JQX_Data.Instance.buildingStorageData.building_id, JQX_Data.Instance.buildingStorageData.level + 1);
        this.M_Text("show_panel/titleName").text = (buildsData.name).toString();
        this.M_Text("show_panel/buildsing_level").text = "LV  " + (JQX_Data.Instance.buildingStorageData.level).toString()//建筑等级
        this.M_Text("moneyShow/Icon_minute").text = (buildsData.production_gold_coins) + "/分钟";

        this.M_Image("show_panel/maxLevel").visible = false;
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        let i: number = 0;
        if (buildingUpgradeData) {
            if (JQX_Data.Instance.buildingStorageData.level < 4) {
                this.M_Image("items/levelTishi").visible = true;
                this.M_Text("items/levelTishi").text = `玩家${buildingUpgradeData.level_limit}级可升级建筑`;
            }
            this.M_Text("icon/icon_Value").text = (buildingUpgradeData.update_gold_coins).toString();//建筑升级需金币
            this.M_Text("gem/gen_Value").text = (buildingUpgradeData.diamonds).toString();//建筑升级需钻石
            this.M_Text("BG2/describe").text = `影厅放映结束后可获得额外收入`;//描述

            for (i = 1; i < 5; i++) {
                if ((buildingUpgradeData['item_' + i]) != 0 && buildsData.type == GameConstants.BUILDING_TYPE_3) {
                    this.M_Image(`items/itemIcon${i}`).visible = true;
                    this.M_Image(`items/item_bg${i}`).visible = true;
                    this.M_Image(`items/itemIcon${i}`).skin = (LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(buildingUpgradeData['item_' + i]));
                    if (BackpackLocalStorage.ins.getItemCount(buildingUpgradeData['item_' + i]) >= Calculator.calcExpression(buildingUpgradeData['item_count' + i], buildingUpgradeData.level)) {
                        this.M_Text(`itemIcon${i}/itemValue`).text = "##0b0b0b";
                        this.M_Text(`itemIcon${i}/itemValue`).text = numberFormatter(BackpackLocalStorage.ins.getItemCount(buildingUpgradeData['item_' + i])) + "/" + numberFormatter((Calculator.calcExpression(buildingUpgradeData['item_count' + i], buildingUpgradeData.level)));
                    }
                    else if (BackpackLocalStorage.ins.getItemCount(buildingUpgradeData['item_' + i]) < buildingUpgradeData['item_count' + i]) {
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
            JQX_Tools.log("建筑满级");
            this.M_Image("show_panel/maxLevel").visible = true;
            this.M_Image("show_panel/items").visible = false;
            this.M_Image("show_panel/upgrade_btn").visible = false;
            this.M_Image("show_panel/upgrade_btn").visible = false;
            this.M_Image("show_panel/icon").visible = false;
            this.M_Image("show_panel/gem").visible = false;
            this.M_Image("items/levelTishi").visible = false;
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //初始化数据
        this.numList = [];
        this.isTureBool = [];
        this.cinemaLocalStorageDatas = CinemaStorageData.ins.getCinemaTimerByBuildingsID();
        for (i = 0; i < this.cinemaLocalStorageDatas.length; i++) {
            this.numList[i] = this.cinemaLocalStorageDatas[i].film_length;
            this.isTureBool[i] = this.cinemaLocalStorageDatas[i].isTurue;
        }


        let starIndex: number = CinemaStorageData.ins.getStarIndex(JQX_Data.Instance.buildingStorageData.building_id);
        let reward1: boolean = (this.numList[starIndex] == 0) && (this.isTureBool[starIndex] == true);
        let reward2: boolean = (this.numList[starIndex + 1] == 0) && (this.isTureBool[starIndex] == true);
        let reward3: boolean = (this.numList[starIndex + 2] == 0) && (this.isTureBool[starIndex] == true);
        let reward4: boolean = (this.numList[starIndex + 3] == 0) && (this.isTureBool[starIndex] == true);
        let rewards: Array<boolean> = [reward1, reward2, reward3, reward4];
        for (i = 1; i < 5; i++) {
            if (this.isTureBool[i - 1] == true) {
                this.M_Image(`mc${i}/playZhong_btn`).visible = true; // 放映中按钮
            }
            else {
                this.M_Image(`mc${i}/showTimersBG`).visible = false; // 时间底框
                this.M_Image(`mc${i}/show_btn`).visible = false; // 放映按钮
                this.M_Image(`mc${i}/playZhong_btn`).visible = false; // 放映中按钮
                this.M_Image(`mc${i}/receive_btn`).visible = false; // 领取按钮
                this.M_Image(`mc${i}/showTimers_text`).visible = false; // 时间文本
            }
            this.M_Image(`mc${i}/suoBG`).visible = true; // 锁
            this.M_Image(`mc${i}/movieIcon`).skin = this.isSkin;//默认Icon
            this.M_Text(`mc${i}/showTimers_text`).text = "00:00:00";
        }

        //根据等级判断影厅解锁
        let building_level: number = JQX_Data.Instance.buildingStorageData.level;
        for (i = 1; i <= building_level; i++) {
            this.M_Image(`mc${i}/showTimersBG`).visible = true; // 时间底框
            this.M_Image(`mc${i}/show_btn`).visible = rewards[i - 1] == false; // 放映按钮
            this.M_Image(`mc${i}/receive_btn`).visible = rewards[i - 1]; // 领取按钮
            this.M_Image(`mc${i}/showTimers_text`).visible = true; // 时间文本
            this.M_Image(`mc${i}/suoBG`).visible = false; // 锁
        }

        if (this.numList[starIndex] != 0 && this.isTureBool[starIndex] == true) {
            let cinemaData: CinemaData = LLDataSheetManager.ins.cinemaDataSheet.getCinemaData(starIndex + 1);
            if (cinemaData) {
                // this.M_Image(`mc${1}/movieIcon`).skin = LLDataSheetManager.ins.cinemaDataSheet.getBuildingSkin(cinemaData);
                this.cinamaMovie1(`mc${1}/movieIcon`);
            }
        }
        if (this.numList[starIndex + 1] != 0 && this.isTureBool[starIndex + 1] == true) {
            let cinemaData: CinemaData = LLDataSheetManager.ins.cinemaDataSheet.getCinemaData(starIndex + 2);
            if (cinemaData) {
                // this.M_Image(`mc${2}/movieIcon`).skin = LLDataSheetManager.ins.cinemaDataSheet.getBuildingSkin(cinemaData);
                this.cinamaMovie2(`mc${2}/movieIcon`);
            }
        }
        if (this.numList[starIndex + 2] != 0 && this.isTureBool[starIndex + 2] == true) {
            let cinemaData: CinemaData = LLDataSheetManager.ins.cinemaDataSheet.getCinemaData(starIndex + 3);
            if (cinemaData) {
                // this.M_Image(`mc${3}/movieIcon`).skin = LLDataSheetManager.ins.cinemaDataSheet.getBuildingSkin(cinemaData);
                this.cinamaMovie3(`mc${3}/movieIcon`);
            }
        }
        if (this.numList[starIndex + 3] != 0 && this.isTureBool[starIndex + 3] == true) {
            let cinemaData: CinemaData = LLDataSheetManager.ins.cinemaDataSheet.getCinemaData(starIndex + 4);
            if (cinemaData) {
                //this.M_Image(`mc${4}/movieIcon`).skin = LLDataSheetManager.ins.cinemaDataSheet.getBuildingSkin(cinemaData);
                this.cinamaMovie4(`mc${4}/movieIcon`);
            }
        }

        this.M_ButtonCtrl(`mc1/show_btn`).setOnClick(() => {
            let finalIndex: number = CinemaStorageData.ins.setStatus(0, JQX_Data.Instance.buildingStorageData.building_id);
            if (this.isTureBool[finalIndex] == false) {
                JQX_Tools.log("点击了");
                let cinemaData: CinemaData = LLDataSheetManager.ins.cinemaDataSheet.getCinemaData(finalIndex + 1);
                this.numList[finalIndex] = cinemaData.film_length * CinemaConstants.CINEMA_FILM_TIME_SECOND;
                this.isTureBool[finalIndex] = true;
                // this.M_Image(`mc${1}/movieIcon`).skin = LLDataSheetManager.ins.cinemaDataSheet.getBuildingSkin(cinemaData);
                this.cinamaMovie1("mc1/movieIcon")
                this.M_Image(`mc${1}/playZhong_btn`).visible = true; // 放映中按钮
            }


        });

        this.M_ButtonCtrl(`mc2/show_btn`).setOnClick(() => {

            let finalIndex: number = CinemaStorageData.ins.setStatus(1, JQX_Data.Instance.buildingStorageData.building_id);
            if (this.isTureBool[finalIndex] == false) {
                JQX_Tools.log("点击了");
                let cinemaData: CinemaData = LLDataSheetManager.ins.cinemaDataSheet.getCinemaData(finalIndex + 1);
                this.numList[finalIndex] = cinemaData.film_length * CinemaConstants.CINEMA_FILM_TIME_SECOND;
                this.isTureBool[finalIndex] = true;
                // this.M_Image(`mc${2}/movieIcon`).skin = LLDataSheetManager.ins.cinemaDataSheet.getBuildingSkin(cinemaData);
                this.cinamaMovie2("mc2/movieIcon")
                this.M_Image(`mc${2}/playZhong_btn`).visible = true; // 放映中按钮
            }

        });

        this.M_ButtonCtrl(`mc3/show_btn`).setOnClick(() => {
            let finalIndex: number = CinemaStorageData.ins.setStatus(2, JQX_Data.Instance.buildingStorageData.building_id);
            if (this.isTureBool[finalIndex] == false) {
                JQX_Tools.log("点击了");
                let cinemaData: CinemaData = LLDataSheetManager.ins.cinemaDataSheet.getCinemaData(finalIndex + 1);
                this.numList[finalIndex] = cinemaData.film_length * CinemaConstants.CINEMA_FILM_TIME_SECOND;
                this.isTureBool[finalIndex] = true;
                // this.M_Image(`mc${3}/movieIcon`).skin = LLDataSheetManager.ins.cinemaDataSheet.getBuildingSkin(cinemaData);
                this.cinamaMovie3("mc3/movieIcon")
                this.M_Image(`mc${3}/playZhong_btn`).visible = true; // 放映中按钮
            }

        });

        this.M_ButtonCtrl(`mc4/show_btn`).setOnClick(() => {
            let finalIndex: number = CinemaStorageData.ins.setStatus(3, JQX_Data.Instance.buildingStorageData.building_id);
            if (this.isTureBool[finalIndex] == false) {
                JQX_Tools.log("点击了");
                let cinemaData: CinemaData = LLDataSheetManager.ins.cinemaDataSheet.getCinemaData(finalIndex + 1);
                this.numList[finalIndex] = cinemaData.film_length * CinemaConstants.CINEMA_FILM_TIME_SECOND;
                this.isTureBool[finalIndex] = true;
                // this.M_Image(`mc${4}/movieIcon`).skin = LLDataSheetManager.ins.cinemaDataSheet.getBuildingSkin(cinemaData);
                this.cinamaMovie4("mc4/movieIcon")
                this.M_Image(`mc${4}/playZhong_btn`).visible = true; // 放映中按钮
            }

        });
        //刷新资源显示
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
        this.getStartTimer();

    }
    private getStartTimer() {
        this.cinemaTimer();
        Laya.timer.loop(1000, this, this.cinemaTimer);
    }
    /**
     * 时间 秒
     */
    cinemaTimer(): void {
        for (let i = 0; i < this.numList.length; i++) {
            if (this.numList[i] <= 0) {
                ///////////////////////////////////////////////////////////////////////////////
                this.onTimerOver(i);
                //////////////////////////////////////////////////////////////////////////////
                //this.isTureBool[i] = false;
                //CinemaStorageData.ins.setStatus(i, false);
                //更新一下缓存
            } else {
                if (this.isTureBool[i]) {
                    let index: number = (i + 1) % 4;
                    index = index == 0 ? 4 : index;
                    let temp: number = this.numList[i] - 1;
                    this.numList[i] = temp < 0 ? 0 : temp;
                    let inBuilding: boolean = CinemaStorageData.ins.inBuilding(JQX_Data.Instance.buildingStorageData.building_id, i);
                    if (inBuilding) {
                        this.M_Text(`mc${index}/showTimers_text`).text = JQX_Tools.formToTimeString(this.numList[i]);
                        this.M_Image(`mc${index}/show_btn`).visible = true;
                        if (this.numList[i] == 0) {
                            this.M_Image(`mc${index}/movieIcon`).skin = this.isSkin;
                            this.M_Image(`mc${index}/movieIcon`).removeChild(this[`mc${index}`])
                        }
                    }
                }
            }
        }
        //更新缓存
        CinemaStorageData.ins.saveitemById(this.numList);
    }
    /**
     * 时间到了可以领取了 金币钻石了
     * @param timer_over 时间到了变量用于控制
     */
    onTimerOver(timer_over: number) {
        let cinemaData1 = LLDataSheetManager.ins.cinemaDataSheet.getCinemaDataByLv(1);
        let cinemaData2 = LLDataSheetManager.ins.cinemaDataSheet.getCinemaDataByLv(2);
        let cinemaData3 = LLDataSheetManager.ins.cinemaDataSheet.getCinemaDataByLv(3);
        let cinemaData4 = LLDataSheetManager.ins.cinemaDataSheet.getCinemaDataByLv(4);
        let inBuilding: boolean = CinemaStorageData.ins.inBuilding(JQX_Data.Instance.buildingStorageData.building_id, timer_over);
        if (inBuilding) {
            let index: number = timer_over % 4;
            let reward: boolean = (this.isTureBool[timer_over] == true) && (this.numList[timer_over] == 0);
            let movieIndex: number = 1;
            switch (index) {
                case 0:
                    movieIndex = 1;
                    if (reward) {
                        this.M_Image(`mc${1}/show_btn`).visible = false;
                        this.M_Image(`mc${1}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${1}/receive_btn`).visible = true;
                    }
                    else {
                        this.M_Image(`mc${1}/show_btn`).visible = true;
                        this.M_Image(`mc${1}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${1}/receive_btn`).visible = false;
                    }
                    this.M_ButtonCtrl(`mc${1}/receive_btn`).setOnClick(() => {
                        if (this.isTureBool[timer_over] == true) {
                            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
                            GameUtils.showFlyText(`恭喜你获取了${cinemaData1.cinema1_buff}金币 ${cinemaData1.cinema2_buff}钻石`, "#fffdfd", 36);
                            this.isTureBool[timer_over] = false;
                            CinemaStorageData.ins.setStatus(0, JQX_Data.Instance.buildingStorageData.building_id, false);
                            assetLocalStorage.Instance.coin += cinemaData1.cinema1_buff;
                            assetLocalStorage.Instance.gem += cinemaData1.cinema2_buff;
                            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
                        }
                        this.M_Image(`mc${1}/show_btn`).visible = true;
                        this.M_Image(`mc${1}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${1}/receive_btn`).visible = false;
                    });
                    break;
                case 1:
                    movieIndex = 2;
                    if (reward) {
                        this.M_Image(`mc${2}/show_btn`).visible = false;
                        this.M_Image(`mc${2}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${2}/receive_btn`).visible = true;
                    }
                    else {
                        this.M_Image(`mc${2}/show_btn`).visible = true;
                        this.M_Image(`mc${2}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${2}/receive_btn`).visible = false;
                    }
                    this.M_ButtonCtrl(`mc${2}/receive_btn`).setOnClick(() => {
                        if (this.isTureBool[timer_over] == true) {
                            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
                            GameUtils.showFlyText(`恭喜你获取了${cinemaData2.cinema1_buff}金币 ${cinemaData2.cinema2_buff}钻石`, "#fffdfd", 36);
                            this.isTureBool[timer_over] = false;
                            CinemaStorageData.ins.setStatus(1, JQX_Data.Instance.buildingStorageData.building_id, false);
                            assetLocalStorage.Instance.coin += cinemaData2.cinema1_buff;
                            assetLocalStorage.Instance.gem += cinemaData2.cinema2_buff;
                            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
                        };
                        this.M_Image(`mc${2}/show_btn`).visible = true;
                        this.M_Image(`mc${2}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${2}/receive_btn`).visible = false;
                    });
                    break;
                case 2:
                    movieIndex = 3;
                    if (reward) {
                        this.M_Image(`mc${3}/show_btn`).visible = false;
                        this.M_Image(`mc${3}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${3}/receive_btn`).visible = true;
                    }
                    else {
                        this.M_Image(`mc${3}/show_btn`).visible = true;
                        this.M_Image(`mc${3}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${3}/receive_btn`).visible = false;
                    }
                    this.M_ButtonCtrl(`mc${3}/receive_btn`).setOnClick(() => {
                        if (this.isTureBool[timer_over] == true) {
                            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
                            GameUtils.showFlyText(`恭喜你获取了${cinemaData3.cinema1_buff}金币 ${cinemaData3.cinema2_buff}钻石`, "#fffdfd", 36);
                            this.isTureBool[timer_over] = false;
                            CinemaStorageData.ins.setStatus(2, JQX_Data.Instance.buildingStorageData.building_id, false);
                            assetLocalStorage.Instance.coin += cinemaData3.cinema1_buff;
                            assetLocalStorage.Instance.gem += cinemaData3.cinema2_buff;
                            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
                        };
                        this.M_Image(`mc${3}/show_btn`).visible = true;
                        this.M_Image(`mc${3}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${3}/receive_btn`).visible = false;
                    });
                    break;
                case 3:
                    movieIndex = 4;
                    if (reward) {
                        this.M_Image(`mc${4}/show_btn`).visible = false;
                        this.M_Image(`mc${4}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${4}/receive_btn`).visible = true;
                    }
                    else {
                        this.M_Image(`mc${4}/show_btn`).visible = true;
                        this.M_Image(`mc${4}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${4}/receive_btn`).visible = false;
                    }
                    this.M_ButtonCtrl(`mc${4}/receive_btn`).setOnClick(() => {
                        if (this.isTureBool[timer_over] == true) {
                            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
                            GameUtils.showFlyText(`恭喜你获取了${cinemaData4.cinema1_buff}金币 ${cinemaData4.cinema2_buff}钻石`, "#fffdfd", 36);
                            this.isTureBool[timer_over] = false;
                            CinemaStorageData.ins.setStatus(3, JQX_Data.Instance.buildingStorageData.building_id, false);
                            assetLocalStorage.Instance.coin += cinemaData4.cinema1_buff;
                            assetLocalStorage.Instance.gem += cinemaData4.cinema2_buff;
                            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();
                        };
                        this.M_Image(`mc${4}/show_btn`).visible = true;
                        this.M_Image(`mc${4}/playZhong_btn`).visible = false;
                        this.M_Image(`mc${4}/receive_btn`).visible = false;
                    });
                    break;
                default:
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * 展开特效
     * @param img 当前IMg
     */
    private effect(img: any): void {
        img.scale(0.8, 0.8);
        Tween.to(img, { scaleX: 1, scaleY: 1 }, 1500, Ease.elasticOut, Handler.create(this, () => { }))
    }

    private cinamaMovie1(imguri: string): void {
        this.M_Image(imguri).addChild(this.mc1)
        this.mc1.interval = 800;
        this.mc1.play();
    }
    private cinamaMovie2(imguri: string): void {
        this.M_Image(imguri).addChild(this.mc2)
        this.mc2.interval = 800;
        //this.mc.on(Event.COMPLETE, this, this.constructionComplete2);
        this.mc2.play();
    }
    private cinamaMovie3(imguri: string): void {
        this.M_Image(imguri).addChild(this.mc3)
        this.mc3.interval = 800;
        this.mc3.play();
    }
    private cinamaMovie4(imguri: string): void {
        this.M_Image(imguri).addChild(this.mc4)
        this.mc4.interval = 800;
        //this.mc.on(Event.COMPLETE, this, this.constructionComplete2);
        this.mc4.play();
    }

    onEnable(): void {
    }

    onDisable(): void {
    }
}