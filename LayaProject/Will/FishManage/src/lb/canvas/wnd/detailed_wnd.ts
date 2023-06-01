import LL_Data from "../../../ll/dataSheet/LL_Data";
import IslandLocalStorage from "../../../ll/localStorage/IslandLocalStorage";
import toast_wnd from "../../../public/canvas/wnd/toast_wnd";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import ui_mrg from "../../../public/manager/ui_mrg";
import goToSea_wnd from "../../../will/canvas/wnd/goToSea_wnd";
import Will_Data from "../../../will/dataSheet/Will_Data";
import Will_UtilData from "../../../will/dataSheet/Will_UtilData";
import Will_DataManager from "../../../will/manager/Will_DataManager";
import LBData from "../../dataSheet/LB_Data";
import LB_UtilData from "../../dataSheet/LB_UtilData";
import LB_LocalData from "../../localStorage/LB_LocalData";
import LBDataSheetManager from "../../manager/LBDataSheetManager";
import book_wnd from "./book_wnd";
import underwater_wnd from "./underwater_wnd";

export default class detailed_wnd extends UI_ctrl {

    constructor() {
        super();
    }


    onAwake() {
        super.onAwake();

        this.M_ButtonCtrl("panel/close_btn").setOnClick(this.closeInt.bind(this));

        //前往
        this.M_ButtonCtrl("panel/ok_btn").setOnClick(this.okBtn.bind(this));
    }


    // private _isGoToSea: boolean = false;//从海洋馆来的
    Show(): void {
        this.M_Box("panel").scale(0.6, 0.6);
        super.Show();
        this.refreshUI();
        this.effect(this.M_Image("panel"));
        // this._isGoToSea = isGotoSea;

        // if(ui_mrg.Instance.GetUI(LBData.Instance.WndName.))

        // console.log("背包显示 是否是出海过来的" + this._isGoToSea + isGotoSea);
    }

    effect(img: any): void {
        Laya.Tween.to(img, { scaleX: 1, scaleY: 1 }, 1500, Laya.Ease.elasticOut, Laya.Handler.create(this, () => {
        }))
    }


    /**
     * 刷新信息
     */
    refreshUI(): void {
        let index = LB_UtilData.Instance.getDetailed();

        //获取鱼
        let itemData = LBDataSheetManager.ins.Fish.getFishData(index + 1);

        console.log("鱼的ID" + itemData.id);
        this.currentAreaID = Will_DataManager.Instance.FishPointDataSheet.GetAreaIDByFishID(itemData.id);

        console.log("区域" + this.currentAreaID);
        // console.log(itemData.weight);

        this.M_Text("panel/name_text").text = itemData.name;
        //检测是否已经解锁
        let luck = LB_LocalData.Instance.GetFishID(index + 1);
        let img = this.M_Image("imgSkin/img");
        if (luck) {
            img.width = 150;
            img.height = 150;
            img.skin = `res/image/public/Fishs/${itemData.icon_name}`;
        } else {
            img.width = 145;
            img.height = 78;
            img.skin = `res/image/lb/books/yu.png`;
        }
        this.M_Text("panel/desc").text = `${itemData.description}`
    }


    private currentAreaID: number = 1;


    /**
     * 前往
     */
    okBtn(): void {
        console.log("前往");

        if (this.currentAreaID > IslandLocalStorage.ins.selfIslands().length) {
            toast_wnd.Instance.ShowText("当前小岛未开放!");
            return;
        }


        this.closeInt();
        (ui_mrg.Instance.GetUI(LBData.Instance.WndName.book_wnd) as book_wnd).closeInt();
        (ui_mrg.Instance.GetUI(LBData.Instance.WndName.underwater_wnd) as underwater_wnd).closeInt();

        console.log(Will_UtilData.Instance.IsGoToSeaOfBook);
        ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Close();
        (<goToSea_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd)).Show(null, { area: this.currentAreaID, fishPoint: 0 });
        // if (!Will_UtilData.Instance.IsGoToSeaOfBook) {
        //     (<goToSea_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd)).Show(null, { area: this.currentAreaID, fishPoint: 0 });
        // }
        // else {
        //     (<goToSea_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd)).Show(null, { area: this.currentAreaID, fishPoint: 0 });
        // }

    }


    /**
     * 关闭
     */
    closeInt(): void {
        this.Close();
        Laya.Tween.clearAll(this.M_Box("panel"))
        this.M_Box("panel").scale(0.6, 0.6);
    }
}