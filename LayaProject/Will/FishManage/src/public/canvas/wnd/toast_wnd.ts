import { Table } from "../../core/Data/DataManager";
import UI_ctrl from "../../core/UI/UI_ctrl";
import M_Data from "../../dataSheet/M_Data";
import ui_mrg from "../../manager/ui_mrg";

/**
 * 全局吐司窗口
 */
export default class toast_wnd extends UI_ctrl {
    constructor() { super(); }

    public static Instance: toast_wnd;

    onAwake() {
        super.onAwake();
        this.startY = this.M_Text("toast").y;

        toast_wnd.Instance = this;
    }


    private startY: number = 0;

    public ShowText(str: string) {
        ui_mrg.Instance.ShowUI(M_Data.Instance.WndName.toast_wnd);

        Laya.Tween.clearAll(this.M_Text("toast"));
        this.M_Text("toast").y = this.startY;
        this.M_Text("toast").text = str;
        Laya.Tween.to(this.M_Text("toast"), { y: this.startY - 150 }, 1500, Laya.Ease.strongOut, Laya.Handler.create(this, () => {
            this.Close();
        }))

    }
}