import LB_LocalData from "../../../lb/localStorage/LB_LocalData";
import LBDataSheetManager from "../../../lb/manager/LBDataSheetManager";
import SoundBolTime, { SoundName } from "../../../lb/manager/SoundBolTime";
import LL_Data from "../../../ll/dataSheet/LL_Data";
import BackpackLocalStorage from "../../../ll/localStorage/BackpackLocalStorage";
import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import { Table } from "../../../public/core/Data/DataManager";
import Clock from "../../../public/core/Game/Clock";
import M_Tool from "../../../public/core/Toos/M_Tool";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import FishData from "../../../public/dataSheet/FishData";
import M_Data from "../../../public/dataSheet/M_Data";
import { Util } from "../../../public/game/Util";
import GameLocalStorage from "../../../public/localStorage/GameLocalStorage";
import res_mrg from "../../../public/manager/res_mrg";
import ui_mrg from "../../../public/manager/ui_mrg";
import Will_Data from "../../dataSheet/Will_Data";
import Will_LocalData from "../../localStorage/Will_LocalData";
import Will_DataManager from "../../manager/Will_DataManager";
import game_wnd from "../wnd/game_wnd";

/**
 * 调试窗口用来做鱼的感受的编辑器
 */
export default class result_panel extends UI_ctrl {

    constructor() { super(); }

    private gameWnd: game_wnd;

    private rewardList: Laya.List;


    onAwake(): void {
        super.onAwake();
        // this.Show();

        this.M_ButtonCtrl("failCentor/back_btn").setOnClick(() => {
            ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd).Show();
            this.gameWnd.BackToPlace();
            // this.gameWnd.Scene3DCtrl.FishGear.CtrlRoot.active = false;
        });

        this.M_ButtonCtrl("reward/back_btn").setOnClick(() => {
            ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd).Show();
            this.gameWnd.BackToPlace();
            // this.gameWnd.Scene3DCtrl.FishGear.CtrlRoot.active = false;

        });

        this.M_ButtonCtrl("failCentor/again_btn").setOnClick(() => {
            this.gameWnd.Show();
            this.gameWnd.PullFish();
            this.Close();
        });

        this.rewardList = this.M_List("reward/rewardList");
    }

    onUpdate() {

    }


    public Init(gameWnd: game_wnd) {
        this.gameWnd = gameWnd;
    }

    /**
     * 初始化数据  比如时间开始计时
     */
    public Start() {
        // this.
        this.timerStart();
        this.Close();
    }

    private resultTimerStr: string;
    private resultS: string;//用时的秒

    private rewardArr: any[];
    private renderHandlerFunc(cell: Laya.Image, index: number): void {

        // for (let i = 0; i < this.rewardArr.length; i++) {

        // }

        let itemID = this.rewardArr[index][0];
        let count: number = this.rewardArr[index][1];
        (<Laya.Image>cell.getChildByName("icon")).skin = LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(itemID);
        (<Laya.Text>cell.getChildByName("count")).text = count.toString();
        (<Laya.Text>cell.getChildByName("describe")).text = LLDataSheetManager.ins.itemDataSheet.getItemData(itemID).name;
        // BackpackLocalStorage.ins.changeItemCount()

    }


    /**
     * 展示结果
     * @param number 
     */
    public ShowResult(isWin: boolean, fishID: number = 0) {
        super.Show();

        Laya.SoundManager.stopAllSound();

        if (isWin) {
            SoundBolTime.getInstance().playSound(SoundName.VICTORYSOUND);

            // //初始化粒子
            // Laya.loader.load(Will_Data.Instance.PanelPath.test, Laya.Handler.create(this, (res) => {

            //     // console.log(partIns.x);
            // }))

            if (GameLocalStorage.Instance.beginnerStep == 1) {
                this.Close();
                // Laya.timer.once(3000,this,()=> {
                //     (<game_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.game_wnd)).BackMap();
                //     ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();
                // })
                return;
            }


            this.M_Image("succeed").visible = true;
            this.M_Image("fail").visible = false;

            let fishData: FishData = LBDataSheetManager.ins.Fish.getFishData(fishID);
            // console.log("当前鱼的ID"+fishID);
            this.rewardArr = LBDataSheetManager.ins.Fish.GetRewardListByFishID(fishID);
            // console.log("鱼的奖励",this.rewardArr);

            this.M_Text("nameRoot/content").text = fishData.name;
            this.M_Image("fishDiffRoot/fishDiffBar").scaleX = fishData.diffcuilty_lv / 6;
            this.M_Image("fishRarityRoot/fishRarityBar").scaleX = fishData.rarity / 100;
            this.M_Text("fishTimer/content").text = this.resultTimerStr + "s";
            this.M_Image("succeed/best").scale(3, 3);

            if (LB_LocalData.Instance.UnlockFish(fishData.id, +this.resultS)) {
                this.M_Image("succeed/best").visible = true;
                Laya.Tween.to(this.M_Image("succeed/best"), { scaleX: 1, scaleY: 1 }, 1000, Laya.Ease.expoInOut);
            }
            else {
                this.M_Image("succeed/best").visible = false;
            }


            let orderIDArr = {};
            for (let i = 0; i < 3; i++) {
                let orderArr = Will_LocalData.Instance.GetOrderArr(i);
                if (orderArr[0] == 0) {
                    continue;
                }
                for (let l = 0; l < orderArr.length; l++) {
                    let taskRewardArr = Will_DataManager.Instance.OrderDataSheet.GetRewardArr(orderArr[l]);
                    for (let j = 0; j < taskRewardArr.length; j++) {
                        console.log("当前材料的数量" + BackpackLocalStorage.ins.GetTaskItemArr(i)[taskRewardArr[j][0]]);
                        //如果储存的对象小于 需要的数量 就储存到Key
                        if (BackpackLocalStorage.ins.GetTaskItemArr(i)[taskRewardArr[j][0]] < taskRewardArr[j][1]) {
                            orderIDArr[taskRewardArr[j][0]] = 0;
                        }
                    }
                }

            }

            // note:当前的奖励获得是
            let taskIDArr = []
            for (const key in orderIDArr) {
                taskIDArr.push(+key);
            }

            if (taskIDArr.length != 0) {
                for (let i = 0; i < 2; i++) {
                    let rewardItemID: number = taskIDArr[M_Tool.GetRandomNum(0, taskIDArr.length - 1)];
                    let rewardItemCount: number = M_Tool.GetRandomNum(1, 3);
                    for (let i = 0; i < 3; i++) {
                        let orderArr = Will_LocalData.Instance.GetOrderArr(i);
                        if (orderArr[0] != 0) {
                            console.log(rewardItemID);
                            BackpackLocalStorage.ins.SetTaskItem(i, rewardItemID, BackpackLocalStorage.ins.GetTaskItemArr(i)[rewardItemID] + rewardItemCount);
                        }
                    }
                    this.rewardArr.push([rewardItemID, rewardItemCount]);
                }
            }

            // console.log("订单的东西", taskIDArr, orderIDArr);


            this.rewardList.array = this.rewardArr;
            this.rewardList.hScrollBarSkin = "";
            this.rewardList.renderHandler = new Laya.Handler(this, this.renderHandlerFunc);


            // let taskRewardArr = Will_DataManager.Instance.OrderDataSheet.GetRewardArr(8);

            // for (let i = 0; i < 3; i++) {
            //     let localTaskItemArr = BackpackLocalStorage.ins.GetTaskItemArr(i);
            // }
            // console.log("合并前", this.rewardArr,taskRewardArr);
            // this.rewardArr.concat(taskRewardArr);
            // console.log("合并后", this.rewardArr);
            //合并过程中
            // for (let i = 0; i < taskRewardArr.length; i++) {
            //     this.rewardArr.push(taskRewardArr[i]);
            // }
            console.log("合并后", this.rewardArr);


        }
        else {
            SoundBolTime.getInstance().playSound(SoundName.FAILSOUND);
            this.M_Image("fail").visible = true;
            this.M_Image("succeed").visible = false;
        }
        return;
        // this.gameWnd.Close();
        this.clock.Stop();
        this.M_Text("timerRoot/content").text = this.resultTimerStr + "s";

        this.M_Text("fishTimer/content").text = this.resultTimerStr + "s";

        this.M_Text("nameRoot/content").text = Will_Data.Instance.fishArr[0].name;

        this.M_Sprite("btnRoot/succedBtn").visible = false;
        this.M_Sprite("btnRoot/failBtn").visible = false;

        if (isWin) {
            this.M_Sprite("btnRoot/succedBtn").visible = true;
        }
        else {
            this.M_Sprite("btnRoot/failBtn").visible = true;
        }
    }

    public ShoFishName(index: number) {
        // this.M_Text("nameRoot/content").text = DataSheetManager.ins.fishDataSheet.getFish() ;
    }

    private clock: Clock = new Clock();
    private timer: number = 0;
    //开始计时
    private timerStart() {
        console.log("开始计时");
        // note:后续读表的数据 每条鱼的计时都不一样
        this.timer = 180;
        // this.timer++;
        this.clock.hms = 2;
        this.clock.increse = 1;
        this.clock.timeLength = this.timer;
        this.clock.Stop();
        this.clock.Reset();
        this.clock.Play((s, m, h, str, t) => {
            // console.log(str);
            this.resultTimerStr = str;
            this.resultS = s;
            // this.timer--;
        });
    }



}