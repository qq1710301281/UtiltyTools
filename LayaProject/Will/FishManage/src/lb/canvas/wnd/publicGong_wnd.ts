import JQX_Data from "../../../jqx/dataSheet/JQX_Data";
import BuildingsLocalStorage from "../../../jqx/localStorage/BuildingsLocalStorage";
import BuildingStorageData from "../../../jqx/localStorage/BuildingStorageData";
import { numberFormatter } from "../../../jqx/other/JQX_Tools";
import BackpackLocalStorage from "../../../ll/localStorage/BackpackLocalStorage";
import BuildingProductionStorageData from "../../../ll/localStorage/BuildingProductionStorageData";
import NormalBuildingProductionLocalStorage from "../../../ll/localStorage/NormalBuildingProductionLocalStorage";
import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import GameConstants from "../../../ll/other/GameConstants";
import toast_wnd from "../../../public/canvas/wnd/toast_wnd";
import EventCenter from "../../../public/core/Game/EventCenter";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import assetLocalStorage from "../../../public/localStorage/assetLocalStorage";
import ui_mrg from "../../../public/manager/ui_mrg";
import LBData from "../../dataSheet/LB_Data";
import LB_UtilData from "../../dataSheet/LB_UtilData";
import entertainment_wnd from "./entertainment_wnd";
import FerrisWheel_wnd from "./FerrisWheel_wnd";

export enum TYPE_STATUS {
    ENTERTAINMENT, //娱乐城
}

export default class publicGong_wnd extends UI_ctrl {

    constructor(){
        super();
    }
             
    status:TYPE_STATUS = null; //类型

    private list:Laya.List = null;

    public ui:UI_ctrl = null;

    public num:number = 1;

    onAwake() {
        super.onAwake();
        //注册事件
        EventCenter.rigestEvent(GameConstants.BUILDING_PRODUCTION, this.buildingProduction, this);
    }

    Show() {
        super.Show();
        //注册升级按钮
        this.M_ButtonCtrl("upgrade_btn").setOnClick(this.upgrade.bind(this));

        //注册领取收益按钮
        this.M_ButtonCtrl("upgrade_panel/receive_btn").setOnClick(this.receive.bind(this));

        this.list = this.M_List("science_panel/scoll");
        this.M_Text("neededBox/text_lime").visible = false;
    }


    /**
     * 升级建筑
     */
    upgrade():void {
        let dataItem = this.getConfig();
        let result = BuildingsLocalStorage.ins.upgradeBuilding(dataItem);
        if(result.errorCode == 0 ) {
            LB_UtilData.Instance.SetEntertainmentCity(dataItem.building_id,dataItem.level+1);
            //刷新等级
            // console.log("刷新UI");
            if(this.num == 2) {
                (this.ui as FerrisWheel_wnd).initUI();
            }else if(this.num == 1) {
                (this.ui as entertainment_wnd).initUI();
            }
        }
    }



    /**
     * 刷新所需材料
     */
    refreshLevel():void {
        let data  = LB_UtilData.Instance.GetEntertainmentCity();
        //获取升级材料
        let cityData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(data.building_id,data.level+1);
        let countData = [];
        this.M_Text("neededBox/text_lime").visible = cityData.level_limit > assetLocalStorage.Instance.playerLevel;
        this.M_Text("neededBox/text_lime").text = `玩家${cityData.level_limit}级可以升级建筑`;
        if(cityData) {
            for (let i = 0; i < 4; i++) {
                if(cityData[`item_count${i+1}`] !== "0") {
                    let obj = {
                        type:cityData[`item_${i+1}`],
                        num:cityData[`item_count${i+1}`]
                    }
                    countData.push(obj);
                }
            }

            //检测一下是否存在
            this.list.width = 165 * countData.length;
            //隐藏滚动条
            this.list.array = countData;
            this.list.hScrollBarSkin = null;
            this.list.renderHandler = new Laya.Handler(this,this.onListRender);
            this.list.scrollBar.touchScrollEnable = false;
            this.M_Image("neededBox/gold1").visible = true;
            this.M_Image("neededBox/gold2").visible = true;
            this.list.visible = true;
            this.M_Image("upgrade_btn").disabled = false;
            //金币
            this.M_Text("gold1/desc").text = `${cityData.update_gold_coins}`;
            //钻石
            this.M_Text("gold2/desc").text = `${cityData.diamonds}`;
        }else {
            this.list.visible = false;
            this.M_Image("neededBox/gold1").visible = false;
            this.M_Image("neededBox/gold2").visible = false;
            this.M_Image("upgrade_btn").disabled = true;
        }
        
    }

    /**
    * 刷新数据
    */
   onListRender(cell:Laya.Box,index:number):void {
        //读取数据渲染
        let numText = cell.getChildByName("materialNum_text") as Laya.Text;
        let num = BackpackLocalStorage.ins.getItemCount(this.list.array[index].type);
        //所需数量 总数
        // Calculator.calcExpression(this.nextLevelBuildingData.item_count1)});
        numText.text = `${numberFormatter(num,2)}/${numberFormatter( this.list.array[index].num,2)}`;
        
        //图片
        let imgSkin  = cell.getChildByName("science") as Laya.Image;
        let skin     = LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(this.list.array[index].type);
        imgSkin.skin = skin;
   }


   /**
    * 刷新收益
    */
   public countGold1 = 0;
   buildingProduction(buildingProductionStorageDatas:Array<BuildingProductionStorageData>):void {
        let dataItem = this.getConfig();
        for (let i = 0; i < buildingProductionStorageDatas.length; i++) {
            if (buildingProductionStorageDatas[i].building_id == dataItem.building_id) {
                //盈利
                this.M_Text("item1/desc1").text =  `${LLDataSheetManager.ins.buildingDataSheet.getBuildingData(dataItem.building_id,dataItem.level).production_gold_coins}/1分钟`;
                //总额
                this.M_Text("item1/desc2").text = `${(buildingProductionStorageDatas[i].production_gold_coins)}`;
                this.countGold1 = (buildingProductionStorageDatas[i].production_gold_coins);
                break;
            }
        }
   }

    /**
     * 领取
     */
    receive():void {
        if(this.countGold1 > 0) {
            toast_wnd.Instance.ShowText(`领取成功金币+${this.countGold1}`);
            let dataItem = this.getConfig();
            this.M_Text("item1/desc2").text = `0`;
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
}