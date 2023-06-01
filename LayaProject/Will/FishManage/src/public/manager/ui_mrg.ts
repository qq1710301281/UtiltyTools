import { Table } from "../core/Data/DataManager";
import { Dictionary } from "../core/Data/Dictionary";
import UI_ctrl from "../core/UI/UI_ctrl";
import M_Data from "../dataSheet/M_Data";
import { Util } from "../game/Util";

export default class ui_mrg extends Laya.Script {

    constructor() { super(); }

    public static Instance: ui_mrg;

    private uiCtrlDic: Dictionary<string, UI_ctrl> = new Dictionary;

    onAwake() {
        ui_mrg.Instance = this;
    }

    public Register(uiName: string, uiPath: string, uiCtrl: typeof UI_ctrl) {
        let ui: UI_ctrl;
        if (this.owner.getChildByName(uiName)) {
            ui = this.owner.getChildByName(uiName).addComponent(uiCtrl);
            this.uiCtrlDic.Add(uiName, ui);
        }
        else {
            ui = this.owner.addChild(Util.GetPrefab(uiPath)).addComponent(uiCtrl);
            this.uiCtrlDic.Add(uiName, ui);
        }

    }

    /**
     * 获得UI
     */
    public GetUI(uiName: string): UI_ctrl {
        return this.uiCtrlDic.GetValue(uiName);
    }

    /**
     * 关闭所有的窗口
     */
    public CloseAllWnd() {
        for (let i = 0; i < this.uiCtrlDic.count; i++) {
            this.uiCtrlDic.GetValueByIndex(i).Close();
        }
    }

    /**
     * 普通的展示UI
     */
    public ShowUIByName(uiName: string) {
        this.GetUI(uiName).Show();
    }

    /**
     *  在最上层展示
     */
    public ShowUI(uiName: string) {
        this.owner.setChildIndex(this.GetUI(uiName).M_Image(), this.owner.numChildren - 1);//设置到倒数最后一位
        this.GetUI(uiName).Show();
    }

    
}