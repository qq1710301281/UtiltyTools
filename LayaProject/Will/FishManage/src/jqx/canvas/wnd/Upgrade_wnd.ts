import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import Calculator from "../../../ll/other/Calculator";
import GameConstants from "../../../ll/other/GameConstants";
import Res_wnd from "../../../public/canvas/wnd/Res_wnd";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import BuildingData from "../../../public/dataSheet/BuildingData";
import M_Data from "../../../public/dataSheet/M_Data";
import assetLocalStorage from "../../../public/localStorage/assetLocalStorage";
import ui_mrg from "../../../public/manager/ui_mrg";
import BuildingStorageData from "../../localStorage/BuildingStorageData";
import JQX_Tools, { numberFormatter } from "../../other/JQX_Tools";
import Tween = Laya.Tween;
import Ease = Laya.Ease;
import Handler = Laya.Handler;

/**
 * 建筑升级界面
 */
export default class Upgrade_wnd extends UI_ctrl {

    private IsTotion: boolean = false;
    /**
     * 建筑升级数据
     */
    public buildingStorageData: BuildingStorageData = null;

    constructor() { super(); }

    onAwake(): void {
        super.onAwake();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Show() {
        let _parent = ((this.owner).parent);
        _parent.setChildIndex(this.owner, _parent.numChildren - 1);

        //刷新资源显示
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).initResUI();

        this.initUp_panelUI();
        //确定
        this.M_ButtonCtrl("show_panel/Yes_btn").setOnClick(() => {
            this.IsTotion = true;
            this.Close();
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.effect(this.M_Image("show_panel"));
        super.Show();
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     *刷新升级成功 UI
     * @param initUp_panelUI 
     */
    public initUp_panelUI(): void {
        // Laya.loader.load("res/prefabs/jqx/awnd/IconAin_wnd.prefab",Laya.Handler.create(this,IconAin_wnd =>{
        //     var cionRoot=IconAin_wnd.create() as Laya.Image;
        //     (cionRoot.getChildAt(0) as Laya.Animation).play();
            
        //     this.M_Image("IconAin_wnd").addChild(cionRoot);
        //     //处理
        // }))
        this.IsTotion = false;
        //升级成功面板+数据
        //当前等级数据
        let buildsData: BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this.buildingStorageData.building_id, this.buildingStorageData.level);
        //下一条数据
        let buildingUpgradeData: BuildingData = LLDataSheetManager.ins.buildingDataSheet.getBuildingData(this.buildingStorageData.building_id, this.buildingStorageData.level + 1);
        if (buildingUpgradeData) {
            if (buildsData.building_type == GameConstants.SPECIAL_BUILDING_TYPE_3) {
                this.M_Text("buildBG2/build_level").visible = false;
            }
            else {
                this.M_Text("buildBG2/build_level").visible = true;
            }
            //建筑icon的动态的效果
            this.buildMovieClip(this.M_Image("buildBG2/buildingsIcon"));
            this.M_Image("buildBG2/buildingsIcon").skin = LLDataSheetManager.ins.buildingDataSheet.getBuildingSkin(buildsData);//升级后建筑icon
            this.M_Text("profit_expBG/exp_Num").text = "EXPx" + (buildsData.update_reward_exp);//添加的经验  
            this.M_Text("profit_expBG/stars_Num").text = "x" + (buildsData.update_reward_star);//添加的星星
            this.M_Text("profit_expBG/profit_Value").text = "盈利添加：" + Calculator.calcExpression((buildingUpgradeData.production_gold_coins), this.buildingStorageData.level-1) + "   →   " + Calculator.calcExpression((buildingUpgradeData.production_gold_coins), this.buildingStorageData.level) + "/分钟";//升级后显示的产出
            this.M_Text("buildBG2/build_level").text = "LV" + (this.buildingStorageData.level - 1) + "   →   " + "LV" + (this.buildingStorageData.level);//现在等级>下一等级
            this.M_FontClip("paiBG/clip_num").value = (this.buildingStorageData.level).toString();

            this.upBuildingMovieClip(this.M_Image("show_panel/paiBG"));
        }
        else {
            JQX_Tools.log("满级", this.buildingStorageData.level)
            //建筑icon的动态的效果
            this.buildMovieClip(this.M_Image("buildBG2/buildingsIcon"));
            this.M_Image("buildBG2/buildingsIcon").skin = LLDataSheetManager.ins.buildingDataSheet.getBuildingSkin(buildsData);//升级后建筑icon
            this.M_Text("profit_expBG/exp_Num").text = "EXPx" + (buildsData.update_reward_exp);//添加的经验
            this.M_Text("profit_expBG/stars_Num").text = "x" + (buildsData.update_reward_star);//添加的星星
            this.M_Text("profit_expBG/profit_Value").text = "盈利添加：" + Calculator.calcExpression((buildsData.production_gold_coins), this.buildingStorageData.level) + "/分钟";//升级后显示的产出
            this.M_Text("buildBG2/build_level").text = "LV" + ((this.buildingStorageData.level - 1)) + "   →   " + + "LV" + buildsData.level;//现在等级>下一等级
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
    onUpdate(): void {
        if (this.IsTotion == false) {
            this.M_Image("BG/sun_spin").rotation += 1.3;
        }
    }
    /**
     * 建筑升级成功的动效
     * @param img 图片
     */
    private buildMovieClip(img: any): any {
        img.scale(0.5, 0.5);
        Tween.to(img, { scaleX: 1, scaleY: 1 }, 2000, Ease.elasticOut, Handler.create(this, () => { }))
    }
    /**
     * 建筑升级的 等级特效
     */
    private upBuildingMovieClip(img:any):any
    {
        img.scale(1.6, 1.6);
        Tween.to(img, { scaleX: 1, scaleY: 1 }, 1000, Ease.elasticOut, Handler.create(this, () => { }))
    }
    onEnable(): void {
    }

    onDisable(): void {
    }
}