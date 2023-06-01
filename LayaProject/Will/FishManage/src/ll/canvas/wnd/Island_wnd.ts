import BuildingsLocalStorage from "../../../jqx/localStorage/BuildingsLocalStorage";
import Button_ctrl from "../../../public/core/UI/Button_ctrl";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import IslandData from "../../../public/dataSheet/IslandData";
import assetLocalStorage from "../../../public/localStorage/assetLocalStorage";
import ui_mrg from "../../../public/manager/ui_mrg";
import LL_Data from "../../dataSheet/LL_Data";
import IslandLocalStorage from "../../localStorage/IslandLocalStorage";
import IslandLocalStorageData from "../../localStorage/IslandLocalStorageData";
import LLDataSheetManager from "../../manager/LLDataSheetManager";
import Bar from "../../other/Bar";
import GameConstants from "../../other/GameConstants";
import GameUtils from "../../other/GameUtils";
import Image=Laya.Image;
import Text=Laya.Text;

export default class Island_wnd extends UI_ctrl
{
    /**
     * 
     */
    private isLands:Array<Image> = [];
    /**
     * 
     */
    private buyButtons:Array<Button_ctrl> = [];
    /**
     * 
     */
    private clickBtn:boolean = true;
    /**
     * 
     */
    private bars:Array<Bar> = [];



    constructor() { super(); }

    onAwake():void
    {
        super.onAwake();
        this.isLands.push(this.M_Image("islandContainer/isLand1_btn"));
        this.isLands.push(this.M_Image("islandContainer/isLand2_btn"));
        this.isLands.push(this.M_Image("islandContainer/isLand3_btn"));
        this.isLands.push(this.M_Image("islandContainer/isLand4_btn"));
        this.isLands.push(this.M_Image("islandContainer/isLand5_btn"));
        for(let i:number=0; i<this.isLands.length; i++)
        {
            let button_ctrl:Button_ctrl = (this.isLands[i].getChildByName("buyContainer") as Image).getChildByName("buy_btn").getComponent(Button_ctrl);
            this.buyButtons.push(button_ctrl);
            let bar:Bar = this.isLands[i].getChildByName("bar").addComponent(Bar) as Bar;
            bar.txtEnding = "%";
            bar.textName = "txtProgress";
            bar.init();
            this.bars.push(bar);
        }
    }
    
    onEnable(): void {
    }

    private btnClick(button_ctrl:Button_ctrl):void
    {
        let buyType:number = 0;
        switch (button_ctrl)
        {
            case this.M_ButtonCtrl("islandContainer/isLand1_btn"):
                if(this.clickBtn)
                {
                    this.showMap_wnd(GameConstants.ISLAND_ID_1);
                }
                this.clickBtn = true;
                break;
            case this.M_ButtonCtrl("islandContainer/isLand2_btn"):
                if(this.clickBtn)
                {
                    this.showMap_wnd(GameConstants.ISLAND_ID_2);
                }
                this.clickBtn = true;
                break;
            case this.M_ButtonCtrl("islandContainer/isLand3_btn"):
                if(this.clickBtn)
                {
                    this.showMap_wnd(GameConstants.ISLAND_ID_3);
                }
                this.clickBtn = true;
                break;
            case this.M_ButtonCtrl("islandContainer/isLand4_btn"):
                if(this.clickBtn)
                {
                    this.showMap_wnd(GameConstants.ISLAND_ID_4);
                }
                this.clickBtn = true;
                break;
            case this.M_ButtonCtrl("islandContainer/isLand5_btn"):
                if(this.clickBtn)
                {
                    this.showMap_wnd(GameConstants.ISLAND_ID_5);
                }
                this.clickBtn = true;
                break;
            case this.buyButtons[0]:
                // console.log("购买第1个岛屿");
                break;
            case this.buyButtons[1]:
                buyType = IslandLocalStorage.ins.buyIsland(GameConstants.ISLAND_ID_2);
                if(buyType)
                {
                    this.clickBtn = false;
                    (this.isLands[1].getChildByName("buyContainer") as Image).visible = false;
                    this.M_ButtonCtrl("islandContainer/isLand"+2+"_btn").setOnClick(this.btnClick.bind(this));
                }
                break;
            case this.buyButtons[2]:
                buyType = IslandLocalStorage.ins.buyIsland(GameConstants.ISLAND_ID_3);
                if(buyType)
                {
                    this.clickBtn = false;
                    (this.isLands[2].getChildByName("buyContainer") as Image).visible = false;
                    this.M_ButtonCtrl("islandContainer/isLand"+3+"_btn").setOnClick(this.btnClick.bind(this));
                }
                break;
            case this.buyButtons[3]:
                buyType = IslandLocalStorage.ins.buyIsland(GameConstants.ISLAND_ID_4);
                if(buyType)
                {
                    this.clickBtn = false;
                    (this.isLands[3].getChildByName("buyContainer") as Image).visible = false;
                    this.M_ButtonCtrl("islandContainer/isLand"+4+"_btn").setOnClick(this.btnClick.bind(this));
                }
                break;
            case this.buyButtons[4]:
                buyType = IslandLocalStorage.ins.buyIsland(GameConstants.ISLAND_ID_5);
                if(buyType)
                {
                    this.clickBtn = false;
                    (this.isLands[4].getChildByName("buyContainer") as Image).visible = false;
                    this.M_ButtonCtrl("islandContainer/isLand"+5+"_btn").setOnClick(this.btnClick.bind(this));
                }
                break;
            default:
                break;
        }
    }

    /**
     * 显示岛屿地图
     */
    private showMap_wnd(islandID:number):void
    {
        LL_Data.Instance.currentIsLandID = islandID;
        LL_Data.Instance.resetIslandUI = true;
        this.Close();
        ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();
    }

    onDisable(): void {
    }

    public Show()
    {
        let i:number = 0;
        let islandsData:Array<IslandData> = LLDataSheetManager.ins.islandDataSheet.getIslandDatas();
        for(i=0; i<islandsData.length; i++)
        {
            GameUtils.graying(this.isLands[i].getChildByName("bg"));
            (this.isLands[i].getChildByName("lockContainer") as Image).visible = false;
            (this.isLands[i].getChildByName("buyContainer") as Image).visible = false;
            (this.isLands[i].getChildByName("roadmarkers") as Image).visible = false;
            (this.isLands[i].getChildByName("barBg") as Image).visible = false;
            (this.isLands[i].getChildByName("bar") as Image).visible = false;
            (this.isLands[i].getChildByName("bar").getComponent(Bar) as Bar).text.visible = false;
            this.M_ButtonCtrl("islandContainer/isLand"+(i+1)+"_btn").setOnClick(null);
        }
        for(i=0;i<this.buyButtons.length; i++)
        {
            this.buyButtons[i].setOnClick(null);
        }
        let selfIslands:Array<IslandLocalStorageData> = IslandLocalStorage.ins.selfIslands();
        for(i=0; i<selfIslands.length; i++)
        {
            (this.isLands[i].getChildByName("bg") as Image).filters = null;
            this.M_ButtonCtrl("islandContainer/isLand"+(i+1)+"_btn").setOnClick(this.btnClick.bind(this));
        }
        (this.isLands[LL_Data.Instance.currentIsLandID-1].getChildByName("roadmarkers") as Image).visible = true;
        let islandLocalStorageDatas:Array<IslandLocalStorageData> = IslandLocalStorage.ins.islandLocalStorage();
        for(i=0; i<islandLocalStorageDatas.length; i++)
        {
            let islandData:IslandData = LLDataSheetManager.ins.islandDataSheet.getIslandData(islandLocalStorageDatas[i].id);
            if(assetLocalStorage.Instance.playerLevel < islandData.level_limit || assetLocalStorage.Instance.star < islandData.star_limit)
            {
                ((this.isLands[i].getChildByName("lockContainer") as Image).getChildByName("txtStar") as Text).text = islandData.star_limit + "";
                (this.isLands[i].getChildByName("lockContainer") as Image).visible = true;
            }
            else
            {
                (this.isLands[i].getChildByName("bg") as Image).filters = null;
                let islandLocalStorageData:IslandLocalStorageData = IslandLocalStorage.ins.getIslandLocalStorageData(islandLocalStorageDatas[i].id);
                if(islandLocalStorageData.buy != 1)
                {
                    this.buyButtons[i].setOnClick(this.btnClick.bind(this));
                    (this.isLands[i].getChildByName("buyContainer") as Image).visible = true;
                }
                else
                {
                    let currentAllLevel:number = BuildingsLocalStorage.ins.getIslandBuildingsAllLevel(islandData.id);
                    let maxLevel:number = LLDataSheetManager.ins.buildingDataSheet.getIsLandBuildingLevelMax(islandData.id);
                    let percent:number = currentAllLevel / maxLevel;
                    this.bars[i].value = percent;
                    (this.isLands[i].getChildByName("barBg") as Image).visible = true;
                    (this.isLands[i].getChildByName("bar") as Image).visible = true;
                    (this.isLands[i].getChildByName("bar").getComponent(Bar) as Bar).text.visible = true;
                }
            }

        }
        this.test();
        super.Show();
    }

    private test():void
    {
        (this.isLands[3].getChildByName("lockContainer") as Image).visible = false;
        (this.isLands[3].getChildByName("buyContainer") as Image).visible = false;
        (this.isLands[3].getChildByName("roadmarkers") as Image).visible = false;
        (this.isLands[3].getChildByName("barBg") as Image).visible = false;
        (this.isLands[3].getChildByName("bar") as Image).visible = false;
        GameUtils.graying((this.isLands[3].getChildByName("bg") as Image));
        (this.isLands[3].getChildByName("bar").getComponent(Bar) as Bar).text.visible = false;

        (this.isLands[4].getChildByName("lockContainer") as Image).visible = false;
        (this.isLands[4].getChildByName("buyContainer") as Image).visible = false;
        (this.isLands[4].getChildByName("roadmarkers") as Image).visible = false;
        (this.isLands[4].getChildByName("barBg") as Image).visible = false;
        (this.isLands[4].getChildByName("bar") as Image).visible = false;
        GameUtils.graying((this.isLands[4].getChildByName("bg") as Image));
        (this.isLands[4].getChildByName("bar").getComponent(Bar) as Bar).text.visible = false;
    }

}