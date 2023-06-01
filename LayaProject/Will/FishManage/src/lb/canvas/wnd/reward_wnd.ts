import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import assetLocalStorage from "../../../public/localStorage/assetLocalStorage";
import LB_UtilData from "../../dataSheet/LB_UtilData";
import LB_LocalData from "../../localStorage/LB_LocalData";

export default class reward_wnd extends UI_ctrl {

    constructor() {super()};


    onAwake() {
        super.onAwake();
        this.M_ButtonCtrl("bg_btn").setOnClick(()=>{
            this.Close();
        },false);
    }


    Show() {
        super.Show();
        this.M_Image("box1/type_img1").visible = false;
        this.M_Image("box1/type_img2").visible = false;
        this.M_Image("box1/type_img3").visible = false;
        //调用发放奖励
        this.award();
    }

    /**
     * 发放奖励
     */
    award():void {
        let data = LB_UtilData.Instance.getReward();

        if(Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                this.initUI(i+1,data[i]);
            }
        }else {
            this.initUI(1,data);
        }
    }

    //刷新UI
    initUI(i:number,data:any):void {

        this.M_Image(`box1/type_img${i}`).visible = true;

        //金币
        if(data.reward_type1 == 1) {
            this.M_Image(`box1/type_img${i}`).skin    = `res/image/public/itms/cion.png`;
            assetLocalStorage.Instance.coin += data.reward1;
        }

        //钻石
        if(data.reward_type1 == 2) {
            this.M_Image(`box1/type_img${i}`).skin    = `res/image/public/itms/dim.png`;
            assetLocalStorage.Instance.gem += data.reward1;
        }
        
        (this.M_Image(`box1/type_img${i}`).getChildByName("desc") as Laya.Text).text = `x `+ data.reward1;

    }
}