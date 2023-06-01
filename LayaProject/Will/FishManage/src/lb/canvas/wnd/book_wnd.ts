import LL_Data from "../../../ll/dataSheet/LL_Data";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import ui_mrg from "../../../public/manager/ui_mrg";
import Will_UtilData from "../../../will/dataSheet/Will_UtilData";
import LBData from "../../dataSheet/LB_Data";
import LB_UtilData from "../../dataSheet/LB_UtilData";
import LB_LocalData from "../../localStorage/LB_LocalData";
import LBDataSheetManager from "../../manager/LBDataSheetManager";

export default class book_wnd extends UI_ctrl {

    constructor() { super() }


    private list: Laya.List = null;


    onAwake() {
        super.onAwake();


        //注册关闭按钮
        this.M_ButtonCtrl("bookPanel/close_btn").setOnClick(this.closeInt.bind(this));

        this.list = this.M_List("bookPanel/scoll");
    }


    Show() {
        this.M_Box("bookPanel").scale(0.6, 0.6);
        super.Show();
        this.refreshUI();
        this.effect(this.M_Box("bookPanel"));
    }

    effect(img: any): void {
        Laya.Tween.to(img, { scaleX: 1, scaleY: 1 }, 1500, Laya.Ease.elasticOut, Laya.Handler.create(this, () => {
        }))
    }

    refreshUI(): void {
        //读取鱼表
        let data = LBDataSheetManager.ins.Fish.getFishDatas();
        this.list.array = data;
        this.list.vScrollBarSkin = null;
        this.list.repeatY = Math.floor(this.list.array.length / 3);
        this.list.renderHandler = new Laya.Handler(this, this.onListRender);
        this.list.mouseHandler = new Laya.Handler(this, this.mouseHandler);

        //渲染数量
        this.M_Text("bookPanel/desc_cont").text = `${LB_LocalData.Instance.GetFishCount()}/${this.list.array.length}`
    }


    /**
     * 渲染UI
     */
    onListRender(cell: Laya.Box, index: number): void {

        let parent = cell.getChildByName("yu_par") as Laya.Image;
        let name = parent.getChildByName("yu_name") as Laya.Text;
        let img = parent.getChildByName("yu_item") as Laya.Image;


        let luck = LB_LocalData.Instance.GetFishID(this.list.array[index].id);
        name.text = this.list.array[index].name;

        if (!luck) {
            img.gray = true;
            // parent.skin = "res/image/common/white.png";
            img.width = 145;
            img.height = 78;
            img.skin = `res/image/lb/books/yu.png`;
        } else {
            img.gray = false;
            // parent.skin = "res/image/common/red.png";
            img.width = 150;
            img.height = 150;
            img.skin = `res/image/public/Fishs/${this.list.array[index].icon_name}`;
        }
    }


    /**
     * 点击
     */
    mouseHandler(name: any, index): void {
        if (name.type == "click") {
            LB_UtilData.Instance.setDetailed(index);
        
            ui_mrg.Instance.ShowUI(LBData.Instance.WndName.detailed_wnd);
        }
    }


    /**
     * 关闭
     */
    closeInt(): void {
        this.Close();
        Laya.Tween.clearAll(this.M_Box("bookPanel"))
        this.M_Box("bookPanel").scale(0.6, 0.6);
    }
}