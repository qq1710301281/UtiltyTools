import UI_ctrl from "../../../public/core/UI/UI_ctrl";

export default class tipBox_wnd extends UI_ctrl {


    constructor() {
        super();
    }

    onAwake() {
        super.onAwake();

        //注册关闭
        this.M_ButtonCtrl("contBox/bg_btn").setOnClick(this.closeInt.bind(this),false);

    }


    Show() {
        this.M_Box("contBox").scale(0.6,0.6);
        super.Show();
        this.effect(this.M_Box("contBox"));
    }

    effect(img:any):void {
        Laya.Tween.to(img, { scaleX: 1, scaleY: 1 }, 1500, Laya.Ease.elasticOut, Laya.Handler.create(this, () => {
        }))
    }


    /**关闭 */
    closeInt():void {
        this.Close();
        Laya.Tween.clearAll(this.M_Box("contBox"))
        this.M_Box("contBox").scale(0.6,0.6);
    }
}