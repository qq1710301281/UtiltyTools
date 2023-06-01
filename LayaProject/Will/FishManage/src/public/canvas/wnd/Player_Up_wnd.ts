import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import EventCenter from "../../core/Game/EventCenter";
import UI_ctrl from "../../core/UI/UI_ctrl";
import assetLocalStorage from "../../localStorage/assetLocalStorage";
import Tween = Laya.Tween;
import Ease = Laya.Ease;
import Handler = Laya.Handler;
/**
 * 玩家升级界面
 */
export default class Player_Up_wnd extends UI_ctrl {

    /**
     * 倒计时 变量
     * @param timer_value
     */
    private timer_value: number = 10;

    constructor() { super(); }

    onAwake(): void {
        super.onAwake();
    }

    Show() {
        console.log("展示");
        let _parent = ((this.owner).parent);
        _parent.setChildIndex(this.owner, _parent.numChildren - 1);
        // console.log(Laya.stage.numChildren)
        //关闭
        this.M_ButtonCtrl("player_Up_panel/close_btn").setOnClick(() => {
            this.Close();
        });
        this.timer_value = 10;
        //倒计时
        this.M_Text("player_Up_panel/nextTimer_value").text = (this.timer_value).toString();
        //////////////////////////////////////////////////////////////////////
        this.initPlayer_LevelUI();
        //////////////////////////////////////////////////////////////////////
        this.effect(this.M_Image("player_Up_panel"));
        super.Show();
    }
    public initPlayer_LevelUI() {
        let levelData = LLDataSheetManager.ins.levelDataSheet.getLevelData(assetLocalStorage.Instance.playerLevel);
        //达到等级描述
        this.M_Text("player_Up_panel/upLevel_text").text = `${assetLocalStorage.Instance.playerLevel}`;
        //建筑升级金币收益百分比
        this.M_Text("player_Up_panel/buildingIcon_profit_per").text = "建筑升级金币收益" + (levelData.coin_percent) + "%";
        //建筑升级物品收益百分比
        this.M_Text("player_Up_panel/buildingGood_profit_per").text = "建筑升级物品收益" + (levelData.item_percent) + "%";
        Laya.timer.resume();
        this.nextTimer_value();
    }
    private nextTimer_value() {
        Laya.timer.loop(900, this, this.animateTimeBased);
    }
    private animateTimeBased() {
        this.timer_value--;
        //倒计时
        this.M_Text("player_Up_panel/nextTimer_value").text = (this.timer_value).toString();
        if (this.timer_value == 0) {
            Laya.timer.clear;
            EventCenter.postEvent("nextStep");
            this.Close();
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * 展开特效
     * @param img 当前IMg
     */
    private effect(img: any): void {
        img.scale(0.6, 0.6);
        Tween.to(img, { scaleX: 1, scaleY: 1 }, 1500, Ease.elasticOut, Handler.create(this, () => { }))
    }
    onEnable(): void {
    }

    onDisable(): void {
    }

    Close() {
        super.Close();
        Laya.timer.clearAll(this);
    }
}