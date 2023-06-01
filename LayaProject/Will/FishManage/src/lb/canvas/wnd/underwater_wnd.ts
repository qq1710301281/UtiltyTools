import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import LB_UtilData from "../../dataSheet/LB_UtilData";
import LBDataSheetManager from "../../manager/LBDataSheetManager";
import assetLocalStorage from "../../../public/localStorage/assetLocalStorage";
import M_Tool from "../../../public/core/Toos/M_Tool";
import LB_LocalData from "../../localStorage/LB_LocalData";
import ui_mrg from "../../../public/manager/ui_mrg";
import LBData from "../../dataSheet/LB_Data";
import Button_ctrl from "../../../public/core/UI/Button_ctrl";
import EventCenter from "../../../public/core/Game/EventCenter";
import GameConstants from "../../../ll/other/GameConstants";
import BuildingProductionStorageData from "../../../ll/localStorage/BuildingProductionStorageData";
import BuildingStorageData from "../../../jqx/localStorage/BuildingStorageData";
import NormalBuildingProductionLocalStorage from "../../../ll/localStorage/NormalBuildingProductionLocalStorage";
import SoundBolTime, { SoundName } from "../../manager/SoundBolTime";
import Will_UtilData from "../../../will/dataSheet/Will_UtilData";
import BuildingsLocalStorage from "../../../jqx/localStorage/BuildingsLocalStorage";
import toast_wnd from "../../../public/canvas/wnd/toast_wnd";
import M_Data from "../../../public/dataSheet/M_Data";
import Res_wnd from "../../../public/canvas/wnd/Res_wnd";


export default class underwater_wnd extends UI_ctrl {

    private list:Laya.List = null;

    private data:any = null;

    //假设
    private unlock:number[] = [1,0,0,0,0,0,0,0,0,0];

    private scollNum:number = 0; //默认是0;

    private countGold:number = 0; //总门票
    private statistic:number[] = [0,0,0,0,0,0,0,0,0,0]; //统计 防止list多次统计

    constructor(){
        super();
    }


    onAwake() {
        super.onAwake();
        
        this.list = this.M_List("panel_block/scoll");
        //注册图鉴
        this.M_ButtonCtrl("itembox/book_btn").setOnClick(this.bookBtn.bind(this));
        //返回关闭
        this.M_ButtonCtrl("itembox/close_btn").setOnClick(this.closeInt.bind(this));
        //领取
        this.M_ButtonCtrl("bottom/collect_btn").setOnClick(this.receive.bind(this));
        EventCenter.rigestEvent(GameConstants.BUILDING_PRODUCTION, this.buildingProduction, this);
    }



    Show() {
        super.Show();
        this.seaweed = [
            "res/image/lb/seaweed/seaweed1.png",
            "res/image/lb/seaweed/seaweed2.png",
            "res/image/lb/seaweed/seaweed3.png",
            "res/image/lb/seaweed/seaweed4.png",
        ];
        EventCenter.postEvent(GameConstants.BUILDING_UI_OPEN);
        this.scollNum = 0;
        //接收参数
        this.data  = LB_UtilData.Instance.GetEntertainmentCity();
        //初始化缓存 放在解锁中
        // LB_LocalData.Instance.unlockingWord(this.data.building_id);
        this.unlock = LB_LocalData.Instance.getWord(this.data.building_id);
        this.refreshUI();

        //播放背景音乐
        SoundBolTime.getInstance().playMusicBg(SoundName.UNDERWATERWORLDMUSIC);


        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show();
    }

    
    /**
     * 刷新界面
     */
    refreshUI():void {

        let dataSent = [];
        for (let i = 0; i < 10; i++) {
            let dataItemCity = LBDataSheetManager.ins.underwater.gethappyCityDataItemDatas(this.data.building_id,i+1);
            dataSent.push(dataItemCity);
        }
        //隐藏滚动条
        this.list.array = dataSent;
        this.list.vScrollBarSkin = null;
        this.list.repeatY = this.list.array.length;
        this.list.renderHandler = new Laya.Handler(this,this.onListRender);
    }


    /**
     * 渲染list
     */
    onListRender(cell:Laya.Box,index:number):void {
        
        let parent = cell.getChildByName("ocean");

        let ceng   = parent.getChildByName("sign").getChildByName("desc") as Laya.Text;
        //获取等级检测是否满足条件
        let luckLevel = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this.data.building_id,this.list.array[index]['building_lv']);
        //获取玩家等级
        let level = assetLocalStorage.Instance.playerLevel;
        let view1 = parent.getChildByName("view1") as Laya.Image;
        let view2 = parent.getChildByName("view2") as Laya.Image;
        let view3 = parent.getChildByName("view3") as Laya.Image;
        //检测是否达到等级
        // console.log("等级",luckLevel.level_limit,level);
        view3.visible = luckLevel.level_limit > level;
        //默认隐藏
        view2.visible = false;
        view1.visible = false;

        if(view3.visible) {
            let levelDesc = view3.getChildByName("progress2").getChildByName("desc") as Laya.Text;
            levelDesc.text = `需要达到${luckLevel.level_limit}级 可建设`;
        }else {
            //检测是否已经开启过了
            view1.visible = this.unlock[index] == 1;
            view2.visible = this.unlock[index] == 0;
        }


        //待升级 需要升级条件
        if(view2.visible) {

            let gold1  = view2.getChildByName("progress3").getChildByName("gold1").getChildByName("desc") as Laya.Text;
            let gold2  = view2.getChildByName("progress3").getChildByName("gold2").getChildByName("desc") as Laya.Text;
            gold1.text = `${luckLevel.update_gold_coins}`;
            gold2.text = `${luckLevel.diamonds}`;

            let fishParent = view2.getChildByName("sea").getChildByName("sea") as Laya.Image;
            let lis = [
                this.list.array[index].fish1_id,
                this.list.array[index].fish2_id,
                this.list.array[index].fish3_id,
                this.list.array[index].fish4_id
            ];
            let list = [];
            for (let i = 0; i < lis.length; i++) {
                if(lis[i] !== 0) {
                    list.push(lis[i]);
                }else {
                    (fishParent.getChildAt(i) as Laya.Image).visible = false;
                }
            }
            this.resule(list,fishParent);
            /**注册点击事件 */
            let btn = view2.getChildByName("progress3").getChildByName("open_btn");
            if(btn.getComponent(Button_ctrl)) {
            }else {
                btn.addComponent(Button_ctrl);
            }
            (btn.getComponent(Button_ctrl) as Button_ctrl).setOnClick(()=>{
                this.event(index);
            })
        }


        //显示小鱼
        if(view1.visible) {
            let priceText  = view1.getChildByName("sea").getChildByName("admission").getChildByName("desc") as Laya.Text;
            priceText.text = `+${this.list.array[index].ticket}`;
            
            //防止多次统计
            if(this.statistic[index] == 0) {
                this.statistic[index] = 1;
                this.countGold += parseInt(this.list.array[index].ticket);
            }

            //获取小鱼id
            let fishParent = view1.getChildByName("sea").getChildByName("fish") as Laya.Box;
            let lis = [
                this.list.array[index].fish1_id,
                this.list.array[index].fish2_id,
                this.list.array[index].fish3_id,
                this.list.array[index].fish4_id
            ];

            for (let i = 0; i < lis.length; i++) {
                let dataItem = LBDataSheetManager.ins.Fish.getFishData(lis[i]);
                if(dataItem) {
                    (fishParent.getChildAt(i) as Laya.Image).skin = `res/image/public/Fishs/${dataItem.icon_name}`;
                    let rankX = M_Tool.GetRandomNum(71,540);
                    let rankY = M_Tool.GetRandomNum(62,248);
                    (fishParent.getChildAt(i) as Laya.Image).pos(rankX,rankY);
                }
            }

            //播放
            if(this.onlyNum[index] == 0) {
                this.tweenFunc(view1.getChildByName("sea").getChildByName("seaweed") as Laya.Image,index);
            }
        }

        //层显示数量
        ceng.text  = `${this.list.array[index].name}`;

        //重置滚动条
        if(index == this.list.array.length-1) {
            this.list.scrollBar.value = this.scollNum;
        }
    }

    /**自适应 */
    resule(itemsID,list:Laya.Image){
        let tw:number  = 0;
        if(itemsID.length == 4) {
            tw = 130;
        }else  {
            tw = 180;
        }
        let hw:number = tw / 2;
        let w:number = 120; // ui 实际宽度
        let offsetX:number = (tw - w) / 2;
            for(let i=0;i<itemsID.length; i++)
            {
                let tx:number = 0;
                if(i == 0)
                {
                    tx = offsetX + 298 - (itemsID.length-i) * hw;
                }
                else
                {
                    tx = (list.getChildAt(i-1) as Laya.Image).x + w + offsetX + offsetX;
                }
                (list.getChildAt(i) as Laya.Image).x = tx;
                (list.getChildAt(i) as Laya.Image).visible = true;
                let dataItem = LBDataSheetManager.ins.Fish.getFishData(itemsID[i]);
                let luck     = LB_LocalData.Instance.GetFishID(itemsID[i]);
                (list.getChildAt(i) as Laya.Image).gray = !luck;
                if(dataItem) {
                    (list.getChildAt(i).getChildByName("f1") as Laya.Image).skin = `res/image/public/Fishs/${dataItem.icon_name}`;
                }

            }
    }

    /**
     * 图鉴
     */
    bookBtn():void {
        console.log("图鉴")
        ui_mrg.Instance.ShowUI(LBData.Instance.WndName.book_wnd);
        Will_UtilData.Instance.IsGoToSeaOfBook = false;

    }


    /**
     * 解锁
     */
    event(index:number):void {
        let dataItem = this.getConfig();
        // dataItem;
        let result = BuildingsLocalStorage.ins.upgradeBuilding(dataItem);
        if(result.errorCode == 0) {
            let id1 = this.list.array[index].fish1_id;
            let id2 = this.list.array[index].fish2_id;
            let id3 = this.list.array[index].fish3_id;
            let id4 = this.list.array[index].fish4_id;
    
            LB_LocalData.Instance.UnlockFish(id1);
            LB_LocalData.Instance.UnlockFish(id2);
            LB_LocalData.Instance.UnlockFish(id3);
            LB_LocalData.Instance.UnlockFish(id4);
            LB_LocalData.Instance.unlocklayer(this.data.building_id,index);
            this.scollNum = this.list.scrollBar.value;
            this.refreshUI();
        }
    }

    private countGold1:number  = 0;

    buildingProduction(buildingProductionStorageDatas:Array<BuildingProductionStorageData>):void {
        let dataItem = this.getConfig();
        for (let i = 0; i < buildingProductionStorageDatas.length; i++) {
            if (buildingProductionStorageDatas[i].building_id == dataItem.building_id) {
                //盈利
                this.M_Text("item1/desc").text =  `${LLDataSheetManager.ins.buildingDataSheet.getBuildingData(dataItem.building_id,dataItem.level).production_gold_coins}门票/1分钟`;
                //总额
                this.M_Text("item2/desc").text = `${(buildingProductionStorageDatas[i].production_gold_coins)} 金币`;
                this.countGold1 = (buildingProductionStorageDatas[i].production_gold_coins);
                break;
            }
        }
    }

    /**
     * 返回关闭
     */
    closeInt():void {
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, false);
        //关闭自身
        this.Close();
        SoundBolTime.getInstance().closeMusic();

        //清楚递归
        this.seaweed = [];
        this.onlyNum = [0,0,0,0,0,0,0,0,0,0];
    }

    /**
     * 领取
     */
    receive():void {
        if(this.countGold1 > 0) {
            toast_wnd.Instance.ShowText(`领取成功金币+${this.countGold1}`);
            let dataItem = this.getConfig();
            this.M_Text("item2/desc").text = `0 金币`;
            NormalBuildingProductionLocalStorage.ins.getBuildingProductionCoin(dataItem.building_id);
        }
    }


        /**
     * 获取配置
     */
    getConfig():BuildingStorageData {
        let data  = LB_UtilData.Instance.GetEntertainmentCity();
        let dataItem = new BuildingStorageData();
        dataItem.building_id = data.building_id;
        dataItem.level       = data.level;
        return dataItem;
    }


    private seaweed:string[] = [
        "res/image/lb/seaweed/seaweed1.png",
        "res/image/lb/seaweed/seaweed2.png",
        "res/image/lb/seaweed/seaweed3.png",
        "res/image/lb/seaweed/seaweed4.png",
    ]

    onlyNum:number[] = [0,0,0,0,0,0,0,0,0,0];

    /**循环播放 */ //首次调用一次
    tweenFunc(img:Laya.Image,i:number):void {
        this.onlyNum[i] = 1;
        for (let i = 0; i < this.seaweed.length; i++) {
            Laya.timer.once(500*i,this,()=>{
                img.skin = this.seaweed[i];
                if(i == this.seaweed.length-1) {
                    this.tweenFunc(img,i);
                }
            })            
        }
    }
}