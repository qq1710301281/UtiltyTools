import LB_LocalData from "./LB_LocalData";

var BaseDataAdvanced = {
    Advanced:[], //减少心情
}

export class LB_TIME {

    static _instancec: LB_TIME = null;

    private userName: string = "wheel_20210202";

    private _UserData: any = null; //存储集合

    private num:number = 14400;  //默认时间

    private constructor() { };

    static getInstance(): LB_TIME {
        if (LB_TIME._instancec == null) {
            LB_TIME._instancec = new LB_TIME();
        }
        return LB_TIME._instancec;
    }

    SvaveUserData() {
        Laya.LocalStorage.setItem(this.userName, JSON.stringify(this._UserData));
    }

     /**
    * 初始化存档
    */
    LoadUserData() {
        /**获取 */
        let userdata = Laya.LocalStorage.getItem(this.userName);
        if (!userdata) {
            this._UserData = BaseDataAdvanced;
            this._UserData.Advanced = BaseDataAdvanced.Advanced;
            //存储
            this.SvaveUserData();
        }else {
            this._UserData = JSON.parse(userdata);
        }

        //开启计时器
        Laya.timer.loop(1000, this,this.countDown);
    }

    /**添加进阶 */
    addJinjie(id:number):void {
        this._UserData.Advanced.push({id:id,num:this.num});
        this.SvaveUserData();
    }


    /**时间进行 */
    countDown():void {
        for (let i = 0; i < this._UserData.Advanced.length; i++) {
            if (this._UserData.Advanced[i].num >= 0) {
                // let minutes = Math.floor(this._UserData.Advanced[i].num / 60);
                // let seconds = Math.floor(this._UserData.Advanced[i].num % 60);
                // let text  = `${minutes>9?minutes:"0"+minutes}:${seconds>9?seconds:"0"+seconds}`;
                this.SvaveUserData();
                --this._UserData.Advanced[i].num;
            } else{
                console.log("时间到",this._UserData.Advanced[i])
                //心情较少1
                // LB_LocalData.Instance.deleTemood(this._UserData.Advanced[i].id);
                this._UserData.Advanced.splice(i,1);
                this.SvaveUserData();
                return;
            }
        }
    }
}