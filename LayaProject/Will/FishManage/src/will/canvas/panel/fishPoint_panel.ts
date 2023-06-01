import BackpackLocalStorage from "../../../ll/localStorage/BackpackLocalStorage";
import OfflineTimerCtrl from "../../../public/core/Toos/OfflineTimerCtrl";
import Button_ctrl from "../../../public/core/UI/Button_ctrl";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import FishpointData from "../../../public/dataSheet/FishpointData";
import offlineTime_mrg from "../../../public/manager/offlineTime_mrg";
import Will_UtilData from "../../dataSheet/Will_UtilData";
import Will_LocalData from "../../localStorage/Will_LocalData";
import Will_DataManager from "../../manager/Will_DataManager";
import goToSea_wnd from "../wnd/goToSea_wnd";

/**
 * 调试窗口用来做鱼的感受的编辑器
 */
export default class fishPoint_panel extends UI_ctrl {

    constructor() { super(); }

    private _goToSeaWnd: goToSea_wnd;

    onAwake(): void {
        super.onAwake();

        this.setBtn();
    }

    onUpdate() {
    }


    public Init(goToSeaWnd: goToSea_wnd) {
        this._goToSeaWnd = goToSeaWnd;

        // console.log(Will_DataManager.Instance.FishPointDataSheet.GetFishpointDataByFishID(1));
    }

    /**
     * 设置按钮
     */
    private setBtn() {
        this.M_ButtonCtrl("close_btn").setOnClick(() => {
            this.Close();
        })
    }

    public Show() {


        super.Show();
    }


    /**
     * 初始化鱼点Btn
     */
    public InitFishPointBtnArr(regionID: number) {

        // note:更换背景逻辑：

        //展示对应小岛的鱼点集合
        for (let i = 0; i < this.M_Image("fishBtnArrRoot").numChildren; i++) {
            (<Laya.Image>this.M_Image("fishBtnArrRoot").getChildAt(i)).visible = false;
        }
        let currentFishBtnArr: Laya.Image = this.M_Image("fishBtnArrRoot").getChildAt(regionID - 1) as Laya.Image;
        currentFishBtnArr.visible = true;

        //鱼点集合
        let fishPointArr: Array<FishpointData> = Will_DataManager.Instance.FishPointDataSheet.GetFishPointArrByRegionID(regionID);

        for (let i = 0; i < fishPointArr.length; i++) {

            let fishPointRoot: Laya.Image = currentFishBtnArr.getChildAt(i + 1) as Laya.Image;
            let fishPointBtnCtrl: Button_ctrl = fishPointRoot.getChildByName("fishPoint_btn").getComponent(Button_ctrl);
            let btnName: Laya.Text = fishPointBtnCtrl.BtnText("content");
            let lock: Laya.Image = fishPointBtnCtrl.image.getChildByName("lock") as Laya.Image;
            let geting: Laya.Text = fishPointBtnCtrl.image.getChildByName("getIng") as Laya.Text;

            let rewardBar: Laya.Image = fishPointRoot.getChildByName("reward_bar") as Laya.Image;
            let getRewardBtn: Button_ctrl = rewardBar.getChildByName("reward_btn").getComponent(Button_ctrl);
            let rewardProgBar: Laya.Image = rewardBar.getChildByName("rewardProg").getChildByName("rewardProg_bar") as Laya.Image;

            geting.visible = true;
            if (fishPointArr[i].player_grade > Will_UtilData.Instance.PlayerGrade) {
                btnName.text = `等级${fishPointArr[i].player_grade}解锁`;
                fishPointRoot.disabled = true;
                rewardBar.visible = false;
                lock.visible = true;
                geting.visible = false;
            }
            else {
                btnName.text = fishPointArr[i].name;
                fishPointRoot.disabled = false;
                lock.visible = false;

                //鱼点按钮
                fishPointBtnCtrl.setOnClick(() => {
                    this.Close();
                    Will_LocalData.Instance.SetFishPointID(regionID, fishPointArr[i].id);
                    this.resetAnchor(regionID);
                    this._goToSeaWnd.MainPanel.InitFishPointIcon(fishPointArr[i]);
                });

                let fishPointName = fishPointArr[i].name;
                // let rewardDic = { fishPointName: { reward: {} } };
                let rewardDic = {};
                rewardDic[fishPointName] = {};
                rewardDic[fishPointName]["reward"] = {};

                for (let i = 0; i < fishPointArr[i].profitTypeArr.length; i++) {
                    if (fishPointArr[i].profitTypeArr[i] == 0 || fishPointArr[i].profitCountArr[i] == 0) {
                        continue;
                    }

                    rewardDic[fishPointName]["reward"]["profitType" + fishPointArr[i].profitTypeArr[i]] = fishPointArr[i].profitCountArr[i];
                }
                // console.log("当前鱼点的收益字典", rewardDic);

                this.updateFishPointInfo(rewardDic, rewardProgBar, rewardBar, getRewardBtn, fishPointName, geting);
                offlineTime_mrg.Instance.AddFncToDic(fishPointName, () => {
                    this.updateFishPointInfo(rewardDic, rewardProgBar, rewardBar, getRewardBtn, fishPointName, geting);
                })

            }

            this.resetAnchor(regionID);
        }

    }


    private updateFishPointInfo(rewardDic, rewardProgBar: Laya.Image, rewardBar: Laya.Image, getRewardBtn: Button_ctrl, fishPointName: string, geting: Laya.Text) {
        let rewardBackDic = offlineTime_mrg.Instance.GetReward(rewardDic);
        rewardBar.visible = true;
        getRewardBtn.image.visible = false;

        // console.log(rewardDic);
        // console.log(rewardBackDic);
        //如果字典中不存在
        if (!rewardBackDic) {
            offlineTime_mrg.Instance.AddReward(rewardDic, true);//添加当前的奖励
            this.updateFishPointInfo(rewardDic, rewardProgBar, rewardBar, getRewardBtn, fishPointName, geting);
            offlineTime_mrg.Instance.AddFncToDic(fishPointName, () => {
                this.updateFishPointInfo(rewardDic, rewardProgBar, rewardBar, getRewardBtn, fishPointName, geting);
            })


            return;
        }

        //如果满了
        if (rewardBackDic["time"] == 0) {
            geting.visible = false;
            //奖励相关
            getRewardBtn.image.visible = true;
            rewardProgBar.scaleX = 1;
            getRewardBtn.setOnClick(() => {
                geting.visible = true;
                getRewardBtn.image.visible = false;
                rewardProgBar.scaleX = 0;
                console.log(rewardBackDic);
                let rewardItemDic = rewardBackDic["reward"];
                for (const key in rewardItemDic) {
                    BackpackLocalStorage.ins.changeItemCount(+key.charAt(key.length - 1), +(+rewardItemDic[key]).toFixed(0));
                }

                offlineTime_mrg.Instance.AddReward(rewardDic, true);//重置当前的奖励
            }, false);

            return;
        }

      
        let otherTime = offlineTime_mrg.Instance.totalTime - rewardBackDic["time"];//剩余的时间
        let backReward: number = 0; //总共能够获得的奖励
        for (const key in rewardDic[fishPointName]["reward"]) {
            backReward += rewardDic[fishPointName]["reward"][key] * otherTime;
        }

        let fowardReward: number = 0;//前期能获得奖励
        for (const key in rewardBackDic["reward"]) {
            fowardReward += rewardBackDic["reward"][key];
        }

        // console.log("当前的奖励",fowardReward,backReward);
        rewardProgBar.scaleX = fowardReward / (fowardReward + backReward);//百分比
    }


    /**
     * 重置小岛中选中的鱼点
     * @param regionID 小岛ID
     */
    private resetAnchor(regionID: number) {
        // console.log("选择鱼点"+regionID,this.M_Image("fishBtnArrRoot").getChildAt(regionID - 1));

        let currentFishBtnArr: Laya.Image = this.M_Image("fishBtnArrRoot").getChildAt(regionID - 1) as Laya.Image;

        // console.log(currentFishBtnArr.getChildAt(6));
        // console.log(currentFishBtnArr);
        for (let i = 0; i < currentFishBtnArr.numChildren - 1; i++) {
            // console.log(i);
            let anchor: Laya.Image = currentFishBtnArr.getChildAt(i + 1).getChildByName("fishPoint_btn").getChildByName("anchor") as Laya.Image;
            // console.log(anchor);
            let select: Laya.Image = currentFishBtnArr.getChildAt(i + 1).getChildByName("fishPoint_btn").getChildByName("select") as Laya.Image;

            anchor.visible = false;
            select.visible = false;
        }
        let fishPointID = Will_LocalData.Instance.GetFishPointID(regionID);
        // console.log("鱼点ID" + fishPointID);

        let index: number = fishPointID % 5 - 1;
        // console.log(index);
        if (index < 0) {
            index = 4
        }
        // console.log("啊啊啊"+index);
        let anchor: Laya.Image = currentFishBtnArr.getChildAt(index + 1).getChildByName("fishPoint_btn").getChildByName("anchor") as Laya.Image;
        let select: Laya.Image = currentFishBtnArr.getChildAt(index + 1).getChildByName("fishPoint_btn").getChildByName("select") as Laya.Image;
        anchor.visible = true;
        select.visible = true;
    }


}