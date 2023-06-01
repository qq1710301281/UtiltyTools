
import JQX_Tools, { numberFormatter } from "../../../jqx/other/JQX_Tools";
import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import Bar from "../../../ll/other/Bar";
import UI_ctrl from "../../core/UI/UI_ctrl";
import assetLocalStorage from "../../localStorage/assetLocalStorage";
/**
 * 资源条界面
 */
export default class Res_wnd extends UI_ctrl {

    /**
     * 是否有充值接口 false 无 true有
     * @param isMoney
     */
    private isMoney: boolean = false;
    /**
     * 
     */
    private bar: Bar = null;




    constructor() { super(); }

    onAwake(): void {
        super.onAwake();
    }
    /**
     * 上方资源面板 show方法默认全部的  null false 特殊建筑 普通建筑显示
     * @param fnc null
     * @param isShow 
     */
    Show(fnc: Function = null, isShow: boolean = true): void {
        let _parent = ((this.owner).parent);
        _parent.setChildIndex(this.owner, _parent.numChildren - 1);
        if (isShow == true) {
            //其他的不显示
            this.M_Image("show1_panel").visible = false;
            this.M_Image("show2_panel").visible = true;
        }
        else {
            //全部显示资源
            this.M_Image("show1_panel").visible = true;
            this.M_Image("show2_panel").visible = false;

        }
        this.initResUI();
        super.Show()
    }

    /**
     * 刷新资源UI
     * @param initResUI
     * @param levelData 玩家当前等级数据
     * @param levelUpgradeData 玩家下一等级数据
     */
    public initResUI(): void {
        let levelData = LLDataSheetManager.ins.levelDataSheet.getLevelData(assetLocalStorage.Instance.playerLevel);
        let levelUpgradeData = LLDataSheetManager.ins.levelDataSheet.getLevelData(assetLocalStorage.Instance.playerLevel + 1);
        this.isMoneyData();
        if (levelUpgradeData) {
            //show1全部的
            this.M_Image("headBg/playerHead").skin = "res/image/public/res_wnd/2.png";
            this.M_Text("headBg/planerName").text = "小猪佩奇";
            this.M_Text("stars/stars_value").text = (assetLocalStorage.Instance.star).toString();
            this.M_Text("icons2_bar/icon2_txt").text = numberFormatter((assetLocalStorage.Instance.gem)).toString();
            this.M_Text("icons3_bar/icon3_txt").text = numberFormatter((assetLocalStorage.Instance.coin).toString());
            this.M_Text("level_exp/player_level").text = (assetLocalStorage.Instance.playerLevel).toString();
            //进度条
            this.bar = this.M_Image("level_exp/bar").getComponent(Bar) as Bar;
            this.bar.txtEnding = "%";
            this.bar.textName = "txtProgress";
            this.M_Image("bar/txtProgress").visible = false;
            this.bar.init();

            this.M_Text("level_exp/player_exp").text = (assetLocalStorage.Instance.exp - levelData.exp) + " / " + (levelUpgradeData.exp - levelData.exp);
            let num = ((assetLocalStorage.Instance.exp - levelData.exp) / (levelUpgradeData.exp - levelData.exp));
            this.bar.value = Number(num.toFixed(2));
            //show2部分
            this.M_Text("icons3_2_bar/icon3_txt").text = numberFormatter((assetLocalStorage.Instance.coin).toString());
            this.M_Text("icons2_2_bar/icon2_txt").text = numberFormatter((assetLocalStorage.Instance.gem).toString());
            this.M_Text("stars_2/stars_value").text = (assetLocalStorage.Instance.star).toString();


        }
        else {
            // 玩家等级最大
        }


    }

    /**
     * 是否有充值接口 false 无 true有
     *  @param isMoneyData
     */
    private isMoneyData(): void {
        for (let i = 1; i < 4; i++) {
            if (this.isMoney == false) {
                this.M_Image(`res1_panel/jias${i}_btn`).visible = false;
            }
            else {
                this.M_Image(`res1_panel/jias${i}_btn`).visible = true;
            }
        }
    }

    onEnable(): void {
    }

    onDisable(): void {
    }
}