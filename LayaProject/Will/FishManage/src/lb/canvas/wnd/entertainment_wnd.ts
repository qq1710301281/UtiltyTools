import GameConstants from "../../../ll/other/GameConstants";
import Res_wnd from "../../../public/canvas/wnd/Res_wnd";
import EventCenter from "../../../public/core/Game/EventCenter";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import M_Data from "../../../public/dataSheet/M_Data";
import TigerData from "../../../public/dataSheet/TigerData";
import ui_mrg from "../../../public/manager/ui_mrg";
import LBData from "../../dataSheet/LB_Data";
import LB_UtilData from "../../dataSheet/LB_UtilData";
import LB_LocalData from "../../localStorage/LB_LocalData";
import LBDataSheetManager from "../../manager/LBDataSheetManager";
import SoundBolTime, { SoundName } from "../../manager/SoundBolTime";
import publicGong_wnd from "./publicGong_wnd";

export enum REWARD  {
    None,
    Seven, //777
    Six,   //666
    Apple, //苹果
    Lemon, //柠檬
    Banana, //香蕉
    Admission, //免费
}

//定义奖励类型
export enum GOLDTYPE {
    None,     //无
    GOLD,    //金币
    DIAMOND, //钻石
}

//奖励概率
export function probability(list:number[]){


    //读取老虎机表
    let dataList:TigerData[] = [];
    for (let i = 0; i < list.length; i++) {
        let datas = LBDataSheetManager.ins.TigerDataSheet.getTigerData(list[i]);
        dataList.push(datas);
    }
    console.log("概率",dataList)
    return dataList;
    // id 表示   type: 类型   奖励类型  奖励数量  概率
    //                       1是金币     100
    let json = [
        {type:3,rewardType:1,rewardNum:100,weight:10,name:"777"},
        {type:4,rewardType:1,rewardNum:100,weight:10,name:"666"},
        {type:0,rewardType:1,rewardNum:100,weight:30,name:"香蕉"},
        {type:1,rewardType:1,rewardNum:100,weight:30,name:"苹果"},
        {type:2,rewardType:1,rewardNum:100,weight:10,name:"柠檬"},
        {type:5,rewardType:1,rewardNum:0,weight:10,name:"免费"}
    ];
    return json
}

export default class entertainment_wnd extends UI_ctrl {

    //定义免费旋转次数
    private admission:number = 3;

    //当前使用的免费次数
    private currentAdmission:number = 0;

    //防止重复点击
    private startBool:boolean = true;

    //默认总数据
    private numCount:number = 3;

    //读取缓存数据默认
    private currentNum:number = 3;

    //定义滚动的列
    private scollNum:number = 3;

    //是否启动
    private scollItemBoolean:boolean = false;

    //默认都不停止 
    private scollScollBool:number[] = [0,0,0];
    
    //衰减速度
    private scollSpeed:number[] = [0,0,0];

    //滚动速度
    private speed:number = 30;

    //定义时间
    private scollTime:number[]  = [1,1.5,2];

    //定义最后一个节点
    private lastList:Laya.Image[] = [];

    //统计是否全部停止
    private count:number  = 0;

    //定义指定区域中心位置坐标
    private endNum:number = 142;

    //定义指定奖励
    private reward:number = 0; //默认奖励香蕉

    //速度加成
    private moveSpeed:number[] = [1,1,1];

    //获取老虎机集合
    private gameScoll:Laya.Box[] = [];

    //定义概率集合
    private data:any = null;

    //定义单条数据
    private rewardList1:any = null;

    //定义奖励数据集合
    private rewardList2:any[] = [];

    constructor() {
        super();
    }

    onAwake() {
        super.onAwake();
    }

    Show() {
        super.Show();
        //加载底部
        this.addBottomPublic();
        EventCenter.postEvent(GameConstants.BUILDING_UI_OPEN);
        //关闭返回
        this.M_ButtonCtrl("close_btn").setOnClick(this.closePanel.bind(this));

        //启动老虎机
        this.M_ButtonCtrl("tigerMachine/startUp_btn").setOnClick(()=>{
            this.startUp();
        });

        this.initUI();
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show();
        //播放音效
        SoundBolTime.getInstance().playMusicBg(SoundName.ENTERTAINMENTMUSIC)
    }


    /**
     * 刷新建筑
     */
    initUI():void {
        this.admission = LB_LocalData.Instance.getadmission();
        this.refreshLevel();
        //初始化数据
        this.initDataGame();
        //刷新次数
        this.refreshFrequency();
    }


    /**
     * 初始化数据
     */
    initDataGame():void {
        this.gameScoll[0] = this.M_Box("coll1/scoll_1");
        this.gameScoll[1] = this.M_Box("coll2/scoll_1");
        this.gameScoll[2] = this.M_Box("coll3/scoll_1");

        //获取最后一个节点
        this.lastList[0]  = this.gameScoll[0].getChildByName("game5") as Laya.Image;
        this.lastList[1]  = this.gameScoll[1].getChildByName("game5") as Laya.Image;
        this.lastList[2]  = this.gameScoll[2].getChildByName("game5") as Laya.Image;


        //定义头等奖金
        this.M_Text("reward_panel/desc").text = `头等奖励${this.data[0].reward1} ${this.getNameRewad(this.data[0].reward_type1)}`
        //文字描述
        // this.M_Text("desc_panel/descBottom").text = `${this.data[0].name} = 头奖 ${this.data[1].name} = ${this.data[1].reward1} ${this.getNameRewad(this.data[1].reward_type1)}`;
        // this.M_Text("desc_panel/descTop").text = `${this.data[2].name}*3 = ${this.data[2].reward1}${this.getNameRewad(this.data[2].reward_type1)} ${this.data[3].name}*3 = ${this.data[3].reward1}${this.getNameRewad(this.data[3].reward_type1)} ${this.data[4].name}*3 = ${this.data[4].reward1}${this.getNameRewad(this.data[4].reward_type1)}`;

        //刷新
        for (let i = 0; i < this.M_Image("desc_panel").numChildren; i++) {
                let el = this.M_Image("desc_panel").getChildAt(i) as Laya.Image;
                (el.getChildAt(0) as Laya.Text).text = ` = ${this.data[1].reward1} ${this.getNameRewad(this.data[1].reward_type1)}`
        }
    }
    

    /**
     * 获取名称
     * @param type 奖励类型
     */
    getNameRewad(type:number):string {
        let name = "";
        if(type == GOLDTYPE.GOLD) {
            name = "金币"
        } else if(type == GOLDTYPE.DIAMOND) {
            name = "钻石"
        }

        return name;
    }

    /**
     * 启动老虎机
     * admission 是否免费启动老虎机
     */
    startUp(admission:boolean = false):void {

        if(!this.startBool){return}
        //是否刷新次数
        if(!admission) {

            if(this.currentNum <= 0) {
                console.log("次数不足");
                this.startBool = true;
                return
            }

            this.currentNum -= 1;
            LB_LocalData.Instance.setadmission(this.currentNum);
            this.refreshFrequency();
        }

        this.M_Text("tigerMachine/de_le").visible = admission;
        this.M_Text("tigerMachine/de_le").text    = `免费次数：${3-this.currentAdmission}`
        SoundBolTime.getInstance().playSound(SoundName.ROTATESOUND)
        this.scollItemBoolean = true;
        this.scollScollBool = [0,0,0];
        this.scollSpeed = [0,0,0];
        //如果是免费
        this.weightNum(this.data,(index)=>{
            this.reward = index;
            if(admission) {
                this.rewardList2.push(this.data[index]);
            }else {
                this.rewardList1 = this.data[index];
            }
        })
        //定时停止
        for (let i = 0; i < 3; i++) {
            Laya.timer.once(this.scollTime[i]*1000,this,()=>{
                //执行衰减速度
                for (let j = 0; j < (this.speed-4); j++) {
                    //延迟执行递减
                    Laya.timer.once(j * 100,this,()=>{
                        this.scollSpeed[i] -= 1; //衰减速度
                        if(this.scollSpeed[i] == -(this.speed-4)) {
                            this.scollScollBool[i] = 1;
                        }
                    })
                }
            });
        }

        this.startBool = false;
    }

    /**
     * 刷新次数
     */
    refreshFrequency():void {

        this.M_Text("frequency/desc").text = `${this.currentNum}/${this.numCount}次数`
    }


    /**
     * 刷新等级
     */
    refreshLevel():void {
        //接收调用参数
        let data  = LB_UtilData.Instance.GetEntertainmentCity();
        //获取表
        let dataItemCity = LBDataSheetManager.ins.happyCityDataSheet.gethappyCityDataItemDatas(data.building_id,data.level);
        //获取老虎机数据
        let probabilityList  = dataItemCity.possible_reward.split(",").map(Number);
        this.data         = probability(probabilityList);
        this.M_Text("level_panel/desc").text = `等级：${data.level}`;
        this.M_Text("title/desc").text       = `${dataItemCity.name}`;
        (ui_mrg.Instance.GetUI(LBData.Instance.WndName.publicGong_wnd) as publicGong_wnd).refreshLevel()
    }

    /**
     * 关闭返回
     */
    closePanel():void {
        if(!this.startBool) {return};
        //关闭自身
        SoundBolTime.getInstance().closeMusic();
        (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Res_wnd) as Res_wnd).Show(null, false);
        this.Close();
        //关闭预制体脚本
        ui_mrg.Instance.GetUI(LBData.Instance.WndName.publicGong_wnd).Close();
    }

    /**
     * 加载底部
     */
    addBottomPublic():void {
        (ui_mrg.Instance.GetUI(LBData.Instance.WndName.publicGong_wnd) as publicGong_wnd).ui = this;
        (ui_mrg.Instance.GetUI(LBData.Instance.WndName.publicGong_wnd) as publicGong_wnd).num = 1;
        ui_mrg.Instance.ShowUI(LBData.Instance.WndName.publicGong_wnd)
    }

    /**
     * 移动操作
     */
    onUpdate():void {

        if(this.scollItemBoolean) {
            
            for (let i = 0; i < this.scollNum; i++) {

                for (let j = 0; j < this.gameScoll[i].numChildren-1; j++) {
                    let img = this.gameScoll[i].getChildAt(j) as Laya.Image;
                    //首次滚动
                    if(this.scollScollBool[i] == 0) {

                        img.y += (this.speed + this.scollSpeed[i]);
    
                        if(img.y > 430) {
    
                            img.y = this.lastList[i].y - 120;
    
                            this.lastList[i] = img;
                        }
                    }else if(this.scollScollBool[i] == 1){
                        //衰减速度后 计算位置
                        if(this.reward == j) {
                            //检测上下
                            if(img.y > this.endNum) {
                                this.moveSpeed[i] = 4;
                            }else {
                                if(Math.abs(img.y - this.endNum) < 100) {
                                    this.moveSpeed[i] = 1;
                                }
                                if(Math.abs(img.y - this.endNum) > 100) {
                                    this.moveSpeed[i] = 4;
                                }
                            }

                            //检测距离
                            if(Math.abs(img.y - this.endNum) < 1) {
                                //直接停止
                                this.scollScollBool[i] = 2;
                                this.count += 1;
                                console.log("停止")
                                SoundBolTime.getInstance().playSound(SoundName.REWARDSOUND)
                                if(this.count >= this.scollNum) {
                                    SoundBolTime.getInstance().playSound(SoundName.STOPITSOUND)
                                    //显示奖励
                                    this.count = 0;
                                    this.scollItemBoolean = false;
                                    this.startBool = true; //可以继续抽奖
                                    if(this.rewardList1.id_type == REWARD.Admission) {
                                        //免费在随机3次  
                                        //修改概率
                                        this.data[5].weight = 0;
                                        this.currentAdmission += 1;
                                        if(this.currentAdmission > 3) {
                                            this.M_Text("tigerMachine/de_le").visible = false;
                                            this.rewardPage(this.rewardList2);
                                            return;
                                        }
                                        this.startUp(true);
                                    }else {
                                        this.rewardPage(this.rewardList1);
                                    }
                                }
                            }
                        }
                        img.y += this.moveSpeed[i];
                        if(img.y > 430) {
                            img.y = this.lastList[i].y - 120;
                            this.lastList[i] = img;
                        }
                    } 
                }
            }
        }
    }

    /**
     * 计算概率
     */
    private frequency:number = 0;
    weightNum(str:any[],func:Function):any {
        let count = 0;
        for (let i = 0; i < str.length; i++) {
            count += str[i].weight;            
        }

        let rand = Math.random() * count;
        this.frequency = 0;
        this.calculation(str,rand,func);
    }

    calculation(lit,rand,func:Function):void {
        let cont = 0;
        for (let i = 0; i < lit.length; i++) {
            if( i <= this.frequency){
                cont += lit[i].weight;
            }    
        }

        if(rand <= cont) {
            func(this.frequency);
        }else {
            this.frequency += 1;
            this.calculation(lit,rand,func);
        }
    }
    
    /**
     * 显示奖励界面
     */
    rewardPage(item:any):void {
        LB_UtilData.Instance.setReward(item);
        ui_mrg.Instance.ShowUI(LBData.Instance.WndName.reward_wnd);
    }
}