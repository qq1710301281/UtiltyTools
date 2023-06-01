import Res_wnd from "../../../public/canvas/wnd/Res_wnd";
import toast_wnd from "../../../public/canvas/wnd/toast_wnd";
import M_Tool from "../../../public/core/Toos/M_Tool";
import Button_ctrl from "../../../public/core/UI/Button_ctrl";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import M_Data from "../../../public/dataSheet/M_Data";
import ui_mrg from "../../../public/manager/ui_mrg";
import LBData from "../../dataSheet/LB_Data";
import LB_UtilData from "../../dataSheet/LB_UtilData";
import LB_LocalData from "../../localStorage/LB_LocalData";
import SoundBolTime, { SoundName } from "../../manager/SoundBolTime";
import publicGong_wnd from "./publicGong_wnd";


export enum Color {
    BULE,  //蓝色
    ORANGE, //橙色
    GREEN   //绿色
}

export enum Gender {
    MALE, //男
    GIRL  //女
}

export default class FerrisWheel_wnd extends UI_ctrl {

    private resetPos:number[] = [119,278,440,602,764];

    private moodNum:number = 0; //默认心情

    private gameList:number[] = [0,0,1,2,0]; //初始化

    private exchange:number[] = []; //交换列表

    private bool:boolean = true; //交换

    private data:any = null;

    private seaweed:string[] = [
        "res/image/lb/wheel/wheel1.png",
        "res/image/lb/wheel/wheel2.png",
        "res/image/lb/wheel/wheel3.png",
        "res/image/lb/wheel/wheel4.png",
    ]

    constructor() {
        super();
    }


    onAwake() {
        super.onAwake();

        this.M_ButtonCtrl("close_btn").setOnClick(this.closePanel.bind(this));
        // this.M_ButtonCtrl("box/title_btn").setOnClick(this.orderFunc.bind(this));
        this.M_ButtonCtrl("img_bot/con_btn").setOnClick(this.tipFunc.bind(this));


        //注册点击事件
        for (let i = 0; i < this.M_Box("item/smallGame").numChildren; i++) {
            let el = this.M_Box("item/smallGame").getChildAt(i) as Laya.Image;  
            if(el.getComponent(Button_ctrl) == null) {
                el.addComponent(Button_ctrl);
            }
            (el.getComponent(Button_ctrl) as Button_ctrl).setOnClick(()=>{
                this.seleItem(i);
            })
        }
    }


    Show() {
        super.Show();
        //播放背景音效
        SoundBolTime.getInstance().playMusicBg(SoundName.FERRISWHELLMUSIC);
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show();
        this.addBottomPublic();
        this.initUI();

        this.seaweed = [
            "res/image/lb/wheel/wheel1.png",
            "res/image/lb/wheel/wheel2.png",
            "res/image/lb/wheel/wheel3.png",
            "res/image/lb/wheel/wheel4.png",
        ]

        this.tweenFunc(this.M_Image("bg/skin_img"));
    }

    initUI() {
        this.rufreshUI();
    }


    //刷新UI
    rufreshUI():void {
        //初始化缓存 放在解锁中
        //接收参数
        //加载底部
        this.data  = LB_UtilData.Instance.GetEntertainmentCity();
        LB_LocalData.Instance.unlockingWheel(this.data.building_id);

        //读取摩天轮信息
        let motianlun = LB_LocalData.Instance.getWheel(this.data.building_id);
        //初始化心情
        this.moodNum = motianlun.mood;
        this.exchange = [];
        this.bool = true;
        this.selectInt();
        this.refreshmallGame();
        this.refreshLevel();
    }

    /**隐藏选中效果 */
    selectInt():void {
        for (let i = 0; i < this.M_Box("item/smallGame1").numChildren; i++) {
            let el = this.M_Box("item/smallGame1").getChildAt(i) as Laya.Image;
            el.visible = false;
        }
    }

    /**维持秩序 */
    // orderFunc():void {
    //     this.refreshmallGame();
    // }

    /**
     * 刷新等级
     */
    refreshLevel():void {
        (this.M_Image("box/title").getChildByName("desc") as Laya.Text).text = `等级 ${this.data.level}`;
        (ui_mrg.Instance.GetUI(LBData.Instance.WndName.publicGong_wnd) as publicGong_wnd).refreshLevel()
    }

    /**加载底部 */
    addBottomPublic():void {
        (ui_mrg.Instance.GetUI(LBData.Instance.WndName.publicGong_wnd) as publicGong_wnd).ui = this;
        (ui_mrg.Instance.GetUI(LBData.Instance.WndName.publicGong_wnd) as publicGong_wnd).num = 2;
        ui_mrg.Instance.ShowUI(LBData.Instance.WndName.publicGong_wnd)
    }


    /**小提示 */
    tipFunc():void {
        ui_mrg.Instance.ShowUI(LBData.Instance.WndName.tipBox_wnd);
    }

    /**关闭 */
    closePanel():void {
        //关闭自身
        SoundBolTime.getInstance().closeMusic();
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, false);
        this.Close();
        //关闭预制体脚本
        this.seaweed = [];
        ui_mrg.Instance.GetUI(LBData.Instance.WndName.publicGong_wnd).Close();
    }


    /**刷新小游戏 */
    refreshmallGame():void {
        this.refreShBox();
        this.refreshMood(this.moodNum);
    }


    refreShBox():void {
        //重置位置
        for (let i = 0; i < this.M_Box("item/smallGame").numChildren; i++) {
            let el = this.M_Box("item/smallGame").getChildAt(i) as Laya.Image;  
            el.pos(this.resetPos[i],el.y);
            if(this.gameList[i] == Color.BULE) {
                el.skin = "res/image/lb/wheel/n0.png";
            }else if(this.gameList[i] == Color.GREEN) {
                el.skin = "res/image/lb/wheel/n2.png";
            }else if(this.gameList[i] == Color.ORANGE) {
                el.skin = "res/image/lb/wheel/n1.png";
            }
        }
    }


    /**刷新心情 */
    refreshMood(num:number = 5):void {
        let parent = this.M_Image("img_bot/mood");

        for (let i = 0; i < parent.numChildren; i++) {
            let el  = parent.getChildAt(i) as Laya.Image;
            if(num <= i) {
                el.skin = `res/image/lb/wheel/hui1.png`;             
            }else {
                el.skin = `res/image/lb/wheel/hui2.png`;             
            }
        }

        //检测心情满不满
        if(num !== 5) {
            this.upsetOrder();
        }else {
            //刷新ui
            this.gameList = [0,0,0,0,0];
            this.refreShBox();
        }
    }

    
    //打乱顺序
    upsetOrder():void {
        //随机一个颜色
        this.randFunc();
        this.refreShBox();
    }


    //随机
    randFunc():void {
        let motianlun = LB_LocalData.Instance.getWheel(this.data.building_id);
        let rand = null;
        if(motianlun['customer'].length) {
            this.gameList = motianlun['customer'];
        }else {
            let zongColor = [0,1,2]; //总颜色
            let color = M_Tool.GetRandomNum(0,2);
            let colorIndex = zongColor.indexOf(color);
            zongColor.splice(colorIndex,1);
            rand = [-1,-1,-1,-1,-1];
            let frequency = M_Tool.GetRandomNum(0,1);
            if(frequency == 0) {
                //直接取2个
                let nu = M_Tool.GetRandomNum(0,zongColor.length-1);
                rand[3] = zongColor[nu];
                rand[4] = zongColor[nu]; 
            }else {
                //一样取一个
                let last = zongColor[0];
                let next = zongColor[1];
                rand[3] = last;
                rand[4] = next; 
            }
            rand[0] = color; //第一个位置
            rand[1] = color; //第一个位置
            rand[2] = color; //第一个位置
            //打乱一下顺序
            rand.sort(()=>{
                return 0.5 - Math.random()
            })
            if(rand[1] == rand[0] && rand[1] == rand[2]) {
                let obj = M_Tool.GetRandomNum(0,2);
                let other = M_Tool.GetRandomNum(3,4);
                if(other == 3) {
                    obj = 1;
                }
                let item  = rand[other];
                rand[other] = rand[obj];
                rand[obj]   = item;
            }else if(rand[2] == rand[1] && rand[2] == rand[3]) {
                let obj = M_Tool.GetRandomNum(1,3);
                let other = M_Tool.GetRandomNum(0,1);
                let otherNum = 0;
    
                if(other == 0) {
                    otherNum = 0;
                }else if(other == 1) {
                    otherNum = 4;
                }
    
    
                if(obj == 1) {
                    otherNum = 0;
                }
    
                if(obj == 3) {
                    otherNum = 4;
                }
                let item  = rand[otherNum];
                rand[otherNum] = rand[obj];
                rand[obj]   = item;
    
            }else if(rand[3] == rand[2] && rand[3] == rand[4]) {
                  let obj = M_Tool.GetRandomNum(2,4);
                  let other = M_Tool.GetRandomNum(0,1);
                  if(obj == 4) {
                    other = 0;
                  }
                  let item  = rand[other];
                  rand[other] = rand[obj];
                  rand[obj]   = item;
            }
            this.gameList = rand;
            LB_LocalData.Instance.setWheelCustomer(this.data.building_id,this.gameList);
        }
    }


    /**选中 */
    seleItem(i:number):void {
        if(this.moodNum == 5) {return};
        if(!this.bool){return};
        if(this.exchange.indexOf(i) == -1) {
            this.M_Image(`smallGame1/seleItem${i+1}`).visible = true;
            this.exchange.push(i);
        }
        if(this.exchange.length == 2) {
            this.implement();
            this.bool = false;
        }
    }


    //执行交换
    implement():void {
        let obj = [];
        let o1X = this.M_Image(`smallGame/item${this.exchange[0]+1}`).x;
        let o2X = this.M_Image(`smallGame/item${this.exchange[1]+1}`).x;

        obj[0] = o1X;
        obj[1] = o2X;

        //修改数据
        let other = this.gameList[this.exchange[1]];
        this.gameList[this.exchange[1]] = this.gameList[this.exchange[0]];
        this.gameList[this.exchange[0]] = other;
        //执行动作
        Laya.Tween.to(this.M_Image(`smallGame/item${this.exchange[1]+1}`),{x:obj[0]},300,Laya.Ease.linearIn);
        Laya.Tween.to(this.M_Image(`smallGame/item${this.exchange[0]+1}`),{x:obj[1]},300,Laya.Ease.linearIn,Laya.Handler.create(this,()=>{
            if(this.satisfy()) {

                //交换成功
                SoundBolTime.getInstance().playSound(SoundName.GARBAGESOUND)

                Laya.timer.once(100,this,()=>{
                    //修改缓存
                    LB_LocalData.Instance.addmood(this.data.building_id);
                    this.moodNum += 1;
                    toast_wnd.Instance.ShowText("心情+1");
                    this.refreshmallGame();
                    this.bool = true;
                    this.selectInt();
                })
            }else {
                //假设交换 交换完毕后 在换回来
                LB_LocalData.Instance.setWheel(this.data.building_id,this.gameList);
                this.refreShBox();
                this.bool = true;
                this.selectInt();
            }
            this.exchange = [];
        }))
    }

    //检测是否满足消除
    satisfy():boolean {
        
        if(this.gameList[2] == this.gameList[1] && this.gameList[2] == this.gameList[3]) {
            return true;
        }

        if(this.gameList[1] == this.gameList[0] && this.gameList[1] == this.gameList[2]) {
            return true;
        }

        if(this.gameList[3] == this.gameList[2] && this.gameList[3] == this.gameList[4]) {
            return true
        }

        return false;
    }



        /**循环播放 */ //首次调用一次
    tweenFunc(img:Laya.Image):void {
        for (let i = 0; i < this.seaweed.length; i++) {
            Laya.timer.once(3000*(i+1),this,()=>{
                img.skin = this.seaweed[i];
                if(i == this.seaweed.length-1) {
                    this.tweenFunc(img);
                }
            })            
        }
    }
}