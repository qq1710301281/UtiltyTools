import LBData from "../../../lb/dataSheet/LB_Data";
import Map_wnd from "../../../ll/canvas/wnd/Map_wnd";
import LL_Data from "../../../ll/dataSheet/LL_Data";
import BackpackLocalStorage from "../../../ll/localStorage/BackpackLocalStorage";
import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import Res_wnd from "../../../public/canvas/wnd/Res_wnd";
import M_Tool from "../../../public/core/Toos/M_Tool";
import Button_ctrl from "../../../public/core/UI/Button_ctrl";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import M_Data from "../../../public/dataSheet/M_Data";
import OrderData from "../../../public/dataSheet/OrderData";
import assetLocalStorage from "../../../public/localStorage/assetLocalStorage";
import ui_mrg from "../../../public/manager/ui_mrg";
import Will_Data from "../../dataSheet/Will_Data";
import Will_LocalData from "../../localStorage/Will_LocalData";
import Will_DataManager from "../../manager/Will_DataManager";
import game_wnd from "../wnd/game_wnd";
import goToSea_wnd from "../wnd/goToSea_wnd";
import restuarant_wnd from "../wnd/restuarant_wnd";

/**
 * 调试窗口用来做鱼的感受的编辑器
 */
export default class order_panel extends UI_ctrl {

    constructor() { super(); }

    private _restuarantWnd: restuarant_wnd;

    private orderList: Laya.List;
    onAwake(): void {
        super.onAwake();

        this.orderList = this.M_List("orderCenter_area/orderList");

        this.M_ButtonCtrl("orderCenter_area/close_btn").setOnClick(() => {
            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, true);
            this.Close();
        });

        this.M_ButtonCtrl("infoCenter_area/close_btn").setOnClick(() => {
            this.M_Image("info_panel").visible = false;
            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, true);
        })
    }

    onUpdate() {

    }

    public Init(restuarantWnd: restuarant_wnd) {
        this._restuarantWnd = restuarantWnd;
    }

    private arr = [1, 2, 3, 4, 5];

    /**
     * 随机订单的ID返回
     */
    private GetRandomOrder() {
        let orderIDArr = [];
        assetLocalStorage.Instance.sayGood = 5;

        let hightID: number = Will_DataManager.Instance.OrderDataSheet.GetCanMadeOrderID(assetLocalStorage.Instance.sayGood);
        for (let i = 0; i < 5; i++) {
            orderIDArr.push(M_Tool.GetRandomNum(1, hightID));
        }

        return orderIDArr;
    }

    public Close() {
        this.M_Image("info_panel").visible = false;
        super.Close();
    }

    /** s随机的五个订单ID集合 */
    private randomOrderIDArr = [];

    /** 本地是否做过的集合 */
    private localIsMadeArr = [];

    /** 订单材料集合  0为ID 1 为数量 */
    private taskItemInfoArr = [];

    /** 任务物品的集合  */
    private localTaskItemArr = {};

    private currentIndex: number = 0;

    public Show(fnc = null, index: number = 0) {


        this.currentIndex = index;
        // console.log(`第${index}个餐厅`);
        // console.log(this.ran);
        this.localTaskItemArr = BackpackLocalStorage.ins.GetTaskItemArr(index);
        console.log(this.localTaskItemArr);
        // BackpackLocalStorage.ins.SetTaskItem(index, 9, 5);

        // console.log(taskItemArr[0][1]);
        //如果第一个任务物品为 -1 就是还没下单
        if (this.localTaskItemArr["9"] == -1) {
            //订单开始营业了  将所有任务物品设置为已经下单的状态
            for (const key in this.localTaskItemArr) {
                BackpackLocalStorage.ins.SetTaskItem(index, +key, 0);
            }
            this.localTaskItemArr = BackpackLocalStorage.ins.GetTaskItemArr(index);

            this.randomOrderIDArr = this.GetRandomOrder();
            this.localIsMadeArr = [0, 0, 0, 0, 0];

            //将当前的订单设置为当日随机出来的订单
            Will_LocalData.Instance.ChangeOrderArr(index, this.randomOrderIDArr);
            Will_LocalData.Instance.ChangeOrderIsMadeArr(index, this.localIsMadeArr);
        }
        else {
            this.randomOrderIDArr = Will_LocalData.Instance.GetOrderArr(index);
            this.localIsMadeArr = Will_LocalData.Instance.GetOrderrIsMadeArr(index);
        }

        //每次展示都重置一下这个任务对象的集合
        this.taskItemInfoArr = [];
        //统一获得订单材料的集合
        for (let i = 0; i < this.randomOrderIDArr.length; i++) {
            // let orderData: OrderData = Will_DataManager.Instance.OrderDataSheet.getOrderData(this.randomOrderIDArr[i]);
            // let taskItemArr = orderData.mission_id.split("_");
            // let itemCountArr = orderData.number.split("_");
            // let taskItemInfo = [];
            // for (let l = 0; l < taskItemArr.length; l++) {
            //     taskItemInfo.push([taskItemArr[l], +itemCountArr[l]]);
            // }

            let orderID = this.randomOrderIDArr[i];//订单的ID
            // console.log(orderID);
            let taskItemInfo = Will_DataManager.Instance.OrderDataSheet.GetRewardArr(orderID);
            this.taskItemInfoArr.push(taskItemInfo);
        }

        // console.log(this.taskItemInfoArr);
        // console.log(Will_DataManager.Instance.TowerRestaurantDataSheet.getTowerRestaurantData());
        this.orderList.vScrollBarSkin = "";
        this.orderList.renderHandler = new Laya.Handler(this, this.renderHandlerFunc);
        this.orderList.array = this.randomOrderIDArr;

        super.Show();
    }



    private renderHandlerFunc(cell: Laya.Image, index: number): void {
        let orderData: OrderData = Will_DataManager.Instance.OrderDataSheet.getOrderData(this.randomOrderIDArr[index]);

        let rewardArr = orderData.order_reward.split("_");
        let sayGoodCount: number = +rewardArr[0];
        let gemCount: number = +rewardArr[1];
        (<Laya.Text>cell.getChildByName("rewardArr").getChildAt(0).getChildAt(0)).text = rewardArr[0];//好评
        (<Laya.Text>cell.getChildByName("rewardArr").getChildAt(1).getChildAt(0)).text = rewardArr[1];//钻石

        //表中的数据
        let orderList: Laya.List = cell.getChildByName("itemArrList") as Laya.List;
        orderList.array = this.taskItemInfoArr[index];
        orderList.renderHandler = new Laya.Handler(this, (taskItem: Laya.Image, itemIndex: number) => {
            let item = this.taskItemInfoArr[index][itemIndex];
            (<Laya.Image>taskItem.getChildByName("icon")).skin = LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(item[0]);

            //如果本地数据为-2就是当天已经全部制作完成了  或者本地的数据比要求的要大
            if (this.localTaskItemArr[item[0]] == -2 || this.localTaskItemArr[item[0]] >= item[1]) {
                (<Laya.Text>taskItem.getChildByName("itemCount").getChildByName("content")).text = "充足";
            }
            else {
                (<Laya.Text>taskItem.getChildByName("itemCount").getChildByName("content")).text = this.localTaskItemArr[item[0]] + "/" + item[1].toString();
            }

            let btnCtrl: Button_ctrl = taskItem.getComponent(Button_ctrl);
            if (!btnCtrl) {
                btnCtrl = taskItem.addComponent(Button_ctrl);
            }
            btnCtrl.setOnClick(() => {
                this.M_Image("infoCenter_area/icon").skin = LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(item[0]);

                this.M_Text("infoCenter_area/countent").text = orderData.description;
                this.M_Text("infoCenter_area/title").text = LLDataSheetManager.ins.itemDataSheet.getItemData(item[0]).name;

                let areaID = orderData.order_region;
                this.M_ButtonCtrl("infoCenter_area/goFish_btn").setOnClick(() => {
                    (<goToSea_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd)).Show(null, { area: areaID, fishPoint: 0 });
                    this._restuarantWnd.Close();
                    (<Map_wnd>ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd)).Close();
                })
                this.M_Image("info_panel").visible = true;

            })
        });


        //制作按钮
        let madeBtn: Button_ctrl = cell.getChildByName("made_btn").getComponent(Button_ctrl);
        if (!madeBtn) {
            madeBtn = cell.getChildByName("made_btn").addComponent(Button_ctrl);
        }

        let isFissh: Laya.Image = cell.getChildByName("isFinish") as Laya.Image;
        isFissh.visible = false;
        //如果本地做过了
        if (this.localIsMadeArr[index] == 1) {
            madeBtn.image.disabled = true;
            // cell.disabled = true;
            isFissh.visible = true;
        }
        else {
            //按钮逻辑
            let isCanMade: boolean = true;

            // cell.disabled = false;


            for (let i = 0; i < this.taskItemInfoArr[index].length; i++) {
                let item = this.taskItemInfoArr[index][i];
                //如果本地有一个比材料小 就不能制作
                if (this.localTaskItemArr[item[0]] < item[1]) {
                    isCanMade = false;
                }
            }

            if (isCanMade) {
                madeBtn.image.disabled = false;
                madeBtn.setOnClick(() => {
                    Will_LocalData.Instance.ChangeOrderIsMade(this.currentIndex, index);
                    madeBtn.image.disabled = true;
                    // cell.disabled = true;
                    isFissh.visible = true;
                    //好评加上奖励
                    assetLocalStorage.Instance.sayGood += sayGoodCount;
                    assetLocalStorage.Instance.gem += gemCount;
                    console.log("制作" + Will_LocalData.Instance.GetMadeCout(this.currentIndex));
                    this._restuarantWnd.SetOrderCount();
                })
            }
            else {
                madeBtn.image.disabled = true;
            }
        }

        this._restuarantWnd.SetOrderCount();
    }
}