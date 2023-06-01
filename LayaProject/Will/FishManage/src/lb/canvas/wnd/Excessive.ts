import LL_Data from "../../../ll/dataSheet/LL_Data";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import assetLocalStorage from "../../../public/localStorage/assetLocalStorage";
import ui_mrg from "../../../public/manager/ui_mrg";
import game_wnd from "../../../will/canvas/wnd/game_wnd";
import goToSea_wnd from "../../../will/canvas/wnd/goToSea_wnd";
import Will_Data from "../../../will/dataSheet/Will_Data";
import { NoviceGuide, SEAWEEDGuide } from "../../../will/NoviceGuide";
import LBData from "../../dataSheet/LB_Data";
import SoundBolTime, { SoundName } from "../../manager/SoundBolTime";

export default class Excessive extends UI_ctrl {

    textNum:number = 0;
    //过度文字
    private textList:string[] = [
        "听着海上的风，海鸟的叫声，海浪的节拍.....真的是太舒服了建立一个自己的海钓王国乐园真的是太令人期待了....",
        "。。。。。这是什么声音好像有大鱼上钩了！！！",
    ]

    private index:number = 0;

    constructor() {
        super();
    }


    onAwake() {
        super.onAwake();
    }


    Show() {
        super.Show();
        //1秒循环一个
        SoundBolTime.getInstance().playSound(SoundName.DAZISOUND)
        this.bofang();
        //  (<goToSea_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd)).ShowFishing();
        // new SEAWEEDGuide();
        // // ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();
        // this.Close();
        // ui_mrg.Instance.ShowUI(LBData.Instance.WndName.guide_wnd);
    }


    //播放
    bofang():void {
        Laya.timer.loop(100,this,()=>{
            this.textShow();
        })
    }

    //文字出现
    textShow():void {
        let str = this.textList[this.index].substring(0,this.textNum);
        this.M_Text("text_level").text = str;
        if(this.textNum == this.textList[this.index].length){
            if(this.index < 1) {
                this.textNum = 0;
                this.index += 1;
                this.M_Text("text_level").text = "";
                this.bofang();
            }else {
                Laya.SoundManager.stopAll();
                 (<goToSea_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.goToSea_wnd)).ShowFishing();
                new SEAWEEDGuide();
                // ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();
                this.Close();
                // ui_mrg.Instance.ShowUI(LBData.Instance.WndName.guide_wnd);
                Laya.timer.clearAll(this);
            }
            return;
        }

        this.textNum += 1;
    }
}