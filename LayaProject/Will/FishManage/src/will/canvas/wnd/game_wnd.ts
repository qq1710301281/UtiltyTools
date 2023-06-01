import SoundBolTime, { SoundName } from "../../../lb/manager/SoundBolTime";
import { Table } from "../../../public/core/Data/DataManager";
import EventCenter from "../../../public/core/Game/EventCenter";
import M_Tool from "../../../public/core/Toos/M_Tool";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import GameLocalStorage from "../../../public/localStorage/GameLocalStorage";
import Will_UtilData from "../../dataSheet/Will_UtilData";
import { fishGearState } from "../../game/fishGear";
import scene3DCtrl from "../../game/scene3DCtrl";
import { SecondStage } from "../../NoviceGuide";
import debug_panel from "../panel/debug_panel";
import result_panel from "../panel/result_panel";


/**
 * 游戏阶段
 */
export enum gameStage {
    准备阶段,
    第一阶段,
    第二阶段,
}
/**
 * 游戏窗口
 */
export default class game_wnd extends UI_ctrl {

    constructor() { super(); }

    public Scene3DCtrl: scene3DCtrl;

    private gameStage: gameStage;//游戏阶段

    public ResultPanel: result_panel;//结果面板

    private debugPanel: debug_panel;//调试面板


    onAwake(): void {
        super.onAwake();
        this.debugPanel = this.M_Image("debug_panel").addComponent(debug_panel);
        this.debugPanel.Init(this);

        this.ResultPanel = this.M_Image("result_panel").addComponent(result_panel);
        this.ResultPanel.Init(this);

        // this.GamePanel = this.M_Image("game_panel").addComponent(game_panel);
        // this.GamePanel.Init(this);

        //初始化
        this.Init();
        //初始化吐司
        this.InitToast();
    }



    private Init() {
        this.gameStage = gameStage.准备阶段;
        this.M_Image("bottomArr/pull_btn").visible = false;
        this.M_Image("forceRoot/forceBar").scaleX = 0.5;
        this.M_Image("fishDurabilityRoot/fishDurabilityBar").scaleX = 1;
        this.M_Image("durabilityRoot/durabilityBar").scaleX = 1;
        this.M_Image("bottomArr/fishCircle").visible = false;//关闭钓鱼的转盘
    }

    //鱼最低速率   鱼最高速率  玩家操作速率  玩家耐力下降  鱼耐力下降  力度检测区比例
    private dataArr = [
        [80, 150, 200, 10, 13, 0.35],//体型较大
        [50, 80, 240, 10, 20, 0.3],//体型正常
        [50, 80, 300, 14, 30, 0.25],//体型较小
        [50, 80, 450, 12, 20, 0.2],//攻击性较高
        [50, 80, 300, 10, 15, 0.3],//攻击性较低
        [50, 250, 400, 5, 8, 0.3],//BOSS
        [50, 50, 200, 0, 20, 0.5],//新手
    ]

    public Fishing() {
        if (GameLocalStorage.Instance.beginnerStep == 1) {
            this.Scene3DCtrl.FishGear.fish.LoadRes(0);
        }
        this.Scene3DCtrl.Rubbish.RestartRubbish(false);
        this.PullFish();
        SoundBolTime.getInstance().playSound(SoundName.MANUALSOUND);
        SoundBolTime.getInstance().playMusicBg(SoundName.D3MUSIC);
        this.Scene3DCtrl.CameraCtrl.ShowCamera(2);
        this.Show();
    }

    public FishID: number = 0;
    /**
     * 进入拉鱼的状态 start ———————————————————————————————————————————————————
     */
    public PullFish() {
        // Laya.SoundManager.playMusic(Table.Sound.fishing,0);
        this.ResultPanel.Start();
        this.M_Text("pull_btn/content").text = "拉线";
        this.gameStage = gameStage.第一阶段;
        this.Scene3DCtrl.FishGear.Reset(true);
        // console.log("进入腊鱼的状态");
        this.M_Image("forceRoot/forceBar").scaleX = 0.5;
        this.isPull = false;;

        let randomCount: number = M_Tool.GetRandomNum(0, 5);
        // console.log("++++++++++++++" + GameLocalStorage.Instance.beginnerStep);
        this.Scene3DCtrl.FishGear.fishState = fishGearState.松线;

        if (GameLocalStorage.Instance.beginnerStep == 1) {
            randomCount = 6;
            this.Scene3DCtrl.FishGear.fishState = fishGearState.静置;
            this.gameStage = gameStage.准备阶段;
            this.M_Image("coord").pos(this.Scene3DCtrl.FishPos.x, this.Scene3DCtrl.FishPos.y);
            this.M_Text("coord/content").text = this.Scene3DCtrl.FishGear.FishToPlayerDis.toFixed(1) + "m";

        }

        let data: Array<number> = this.dataArr[randomCount];


        this.M_Image("bottomArr/pull_btn").visible = true;
        this.M_ButtonCtrl("bottomArr/pull_btn").SetMouseDown(() => {
            EventCenter.postEvent("nextStep");
            SoundBolTime.getInstance().playSound(SoundName.PRESSSOUND, true);
            this.Scene3DCtrl.FishGear.fishState = fishGearState.拉线;
            this.gameStage = gameStage.第一阶段;
            this.isPull = true;;
        });
        this.M_ButtonCtrl("bottomArr/pull_btn").SetMouseUp(() => {
            SoundBolTime.getInstance().playSound(SoundName.PRESSSOUND, true);
            this.Scene3DCtrl.FishGear.fishState = fishGearState.松线;
            this.isPull = false;;
        });

        if (!data) {
            return;
        }
        // new Laya.Point().distance
        //鱼逃跑的随机速率  最低 和最高
        this.randomForceRateArr = [data[0], data[1]];
        this.PullForceRate = data[2];//玩家的力量
        this.durabilityReduceRodRate = data[3];//耐久减少速率
        this.durabilityReduceFishRate = data[4];
        // this.roteRate = data[5];
        this.M_Image("forceRoot/tip").scaleX = data[5];
        // console.log(this.randomForceRateArr);
    }

    public BackMap() {
        Laya.SoundManager.stopAllSound();
        this.Scene3DCtrl.FishGear.fish.LayUpFish();
        this.Scene3DCtrl.FishGear.Reset(false);
        this.Close();
    }

    public BackToPlace() {
        this.Scene3DCtrl.Rubbish.RestartRubbish();
        Laya.SoundManager.stopAllSound();
        this.Close();
        //让鱼上去
        // Laya.SoundManager.playMusic(Table.Sound.place,0);
        this.Scene3DCtrl.FishGear.fish.LayUpFish();
        this.Scene3DCtrl.FishGear.Reset(false);
        // this.Scene3DCtrl.FishGear.SetFish(false);
    }

    //用来切换随机减少力的事件
    private chanceTimer: number = 0;
    private reduceForceRate: number = 50;
    //随机速率
    public randomForceRateArr = [50, 80];

    private isPull: boolean = false;

    /**
     * 玩家的力度
     */
    public PullForceRate: number = 200;
    /**
     * 减少力度
     */
    private reduceForce(timer: number) {
        this.chanceTimer += timer;
        //暂定两秒切换一次
        if (this.chanceTimer > 2) {
            this.reduceForceRate = M_Tool.GetRandomNum(this.randomForceRateArr[0], this.randomForceRateArr[1]);//每两秒随机一个数字
            this.chanceTimer = 0;
        }

        let count = this.isPull ? this.reduceForceRate - this.PullForceRate : this.reduceForceRate;
        // console.log(count);
        if (this.M_Image("forceRoot/forceBar").scaleX <= 0) {
            this.M_Image("forceRoot/forceBar").scaleX = 0;
        }
        if (this.M_Image("forceRoot/forceBar").scaleX >= 1) {
            this.M_Image("forceRoot/forceBar").scaleX = 1;
        }
        this.M_Image("forceRoot/forceBar").scaleX -= count * timer / 300;//让力度减少
        // console.log(this.M_Image("forceRoot/forceBar").scaleX);
    }

    //鱼竿耐久减少速率
    private durabilityReduceRodRate: number = 10;
    /**
     * 是否降低耐久
     */
    private get reduceDurability(): number {
        let scale: number = this.M_Image("forceRoot/tip").scaleX;
        let up = (1 - scale) / 2;
        let down = 1 - up;
        // console.log(up, down);
        if (this.M_Image("forceRoot/forceBar").scaleX < up) {
            return 1;
        }
        else if (this.M_Image("forceRoot/forceBar").scaleX > down) {
            return 2;
        }

        return 0;
    }


    //鱼的耐力
    private durabilityReduceFishRate: number = 10;


    //拉鱼相关 end ————————————————————————————————————————————————————————


    /**
     * 进入钓鱼 start ———————————————————————————————————————————————————
     */
    public GoFish() {
        //让拉线的按钮失活
        this.M_Image("bottomArr/pull_btn").visible = false;
        this.M_Image("bottomArr/fishCircle").visible = true;//打开钓鱼的转盘
        this.M_Image("triangleParent/triangle").visible = false;

        this.M_Text("pull_btn/content").text = "钓鱼";
        this.M_ButtonCtrl("bottomArr/pull_btn").SetMouseUp(null)
        this.M_ButtonCtrl("bottomArr/pull_btn").SetMouseDown(null)
        this.angle = 180;
        this.roteRate = 200;

        //先让鱼不走了
        this.Scene3DCtrl.FishGear.FishRunStop = true;

        console.log("++++++++++++++++"+GameLocalStorage.Instance.beginnerStep);
        if (GameLocalStorage.Instance.beginnerStep == 1) {
            console.log("56435453435435465465465");
            new SecondStage();
        }

        Laya.timer.once(1000, this, () => {
            //让拉线的按钮激活
            this.M_Image("bottomArr/pull_btn").visible = true;
            this.gameStage = gameStage.第二阶段;
            //激活轮盘
            this.M_Image("triangleParent/triangle").visible = true;
            this.M_ButtonCtrl("bottomArr/pull_btn").setOnClick(() => {
                this.gameStage = gameStage.准备阶段;
                this.Scene3DCtrl.FishGear.fishState = fishGearState.静置;
                // this.Scene3DCtrl.ResetFish();
                this.Init();
                this.Scene3DCtrl.FishGear.fishWire.Jump();

                SoundBolTime.getInstance().playSound(SoundName.MANUALSOUND);
                this.M_ButtonCtrl("bottomArr/pull_btn").setOnClick(null);
                if (this.fishResult) {
                    this.ShowText("大师收杆！！！")
                    SoundBolTime.getInstance().playSound(SoundName.ADDMOODSOUND);
                }
                else {
                    this.ShowText("普通收杆~·")
                    SoundBolTime.getInstance().playSound(SoundName.MANUALSOUND);
                }
                SoundBolTime.getInstance().playMusicBg(SoundName.CLOUDMUSIC)
                Laya.timer.once(1000, this, () => {
                    SoundBolTime.getInstance().playSound(SoundName.D3STRUGGLE, true);
                })

                // Laya.timer.once(1500, this, () => {
                //     this.ResultPanel.ShowResult(true);
                // })
            })
        })
    }

    //距离中心的偏移量
    private dirToCenter = 30;
    /**
     * 获取钓鱼的结果
     */
    public get fishResult(): boolean {
        //在这个区间是返回完美
        if (this.angle > (270 - this.dirToCenter) && this.angle < (270 + this.dirToCenter)) {
            return true;
        }
        else {
            return false;
        }
    }

    private angle = 180;//角度
    private long = 350;//箭头距离

    /**
     * 表盘转动的速率
     */
    private roteRate = 200;

    private setPos() {
        this.M_Image("triangleParent/triangle").rotation = this.angle + 90;
        this.M_Image("triangleParent/triangle").pos(Math.cos(2 * Math.PI / 360 * this.angle) * this.long, Math.sin(2 * Math.PI / 360 * this.angle) * this.long);
    }

    //钓鱼相关 end ————————————————————————————————————————————————————————

    onUpdate() {
        let timer: number = Laya.timer.delta / 1000;


        switch (this.gameStage) {
            case gameStage.准备阶段:

                break;
            case gameStage.第一阶段:
                //更新坐标
                this.M_Image("coord").pos(this.Scene3DCtrl.FishPos.x, this.Scene3DCtrl.FishPos.y);
                this.M_Text("coord/content").text = this.Scene3DCtrl.FishGear.FishToPlayerDis.toFixed(1) + "m";

                //力度随机减少 鱼要逃跑
                this.reduceForce(timer);

                // console.log("Dangq当前状态" + this.reduceDurability);
                //检测鱼是否停留在力度的中心  减少耐久的操作
                if (this.reduceDurability == 0) {
                    if (this.M_Image("fishDurabilityRoot/fishDurabilityBar").scaleX <= 0) {
                        this.M_Image("fishDurabilityRoot/fishDurabilityBar").scaleX = 0;
                        this.M_Image("durabilityRoot/durabilityBar").scaleX = 0;
                        this.ShowText("进入第二阶段")
                        this.GoFish();
                        this.gameStage = gameStage.准备阶段;
                        // this.Scene3DCtrl.FishGear.currentState = fishGearState.静置;
                        // this.Scene3DCtrl.ResetFish();
                        this.M_Image("coord").pos(-1000, -1000);
                        Laya.SoundManager.stopAllSound();
                        // this.ResultPanel.ShowResult(false);
                        return;
                    }
                    else if (this.M_Image("durabilityRoot/durabilityBar").scaleX <= 0) {
                        this.M_Image("fishDurabilityRoot/fishDurabilityBar").scaleX = 0;
                        this.M_Image("durabilityRoot/durabilityBar").scaleX = 0;
                        this.Init();
                        // this.ShowText("游戏失败，重新启动")
                        this.Scene3DCtrl.FishGear.Reset(false);
                        this.M_ButtonCtrl("bottomArr/pull_btn").SetMouseUp(null)
                        this.M_ButtonCtrl("bottomArr/pull_btn").SetMouseDown(null)
                        this.gameStage = gameStage.准备阶段;
                        // this.Scene3DCtrl.ResetFish();
                        this.M_Image("coord").pos(-1000, -1000);

                        this.ResultPanel.ShowResult(false);
                    }

                    this.M_Image("fishDurabilityRoot/fishDurabilityBar").scaleX -= timer * this.durabilityReduceFishRate / 100;
                    //没拉杆
                    this.M_Image("durabilityRoot/durabilityBar").scaleX -= timer * this.durabilityReduceRodRate / 100;
                }
                else if (this.reduceDurability == 1) {
                    //没拉杆
                    if (this.M_Image("durabilityRoot/durabilityBar").scaleX <= 0) {
                        this.M_Image("durabilityRoot/durabilityBar").scaleX = 0;
                        this.Init();
                        // console.log("玩家输了");
                        // this.ShowText("游戏失败，重新启动")
                        this.Scene3DCtrl.FishGear.Reset(false);
                        this.M_ButtonCtrl("bottomArr/pull_btn").SetMouseUp(null)
                        this.M_ButtonCtrl("bottomArr/pull_btn").SetMouseDown(null)
                        this.gameStage = gameStage.准备阶段;
                        // this.Scene3DCtrl.ResetFish();
                        this.M_Image("coord").pos(-1000, -1000);

                        this.ResultPanel.ShowResult(false);
                        return;
                    }
                    //没拉杆
                    this.M_Image("durabilityRoot/durabilityBar").scaleX -= timer * this.durabilityReduceRodRate / 100 * 2;
                }
                else {
                    //拉杆了
                    if (this.M_Image("durabilityRoot/durabilityBar").scaleX <= 0) {
                        this.M_Image("durabilityRoot/durabilityBar").scaleX = 0;
                        this.Init();
                        // console.log("玩家输了");
                        // this.ShowText("游戏失败，重新启动")
                        this.Scene3DCtrl.FishGear.Reset(false);
                        this.M_ButtonCtrl("bottomArr/pull_btn").SetMouseUp(null)
                        this.M_ButtonCtrl("bottomArr/pull_btn").SetMouseDown(null)
                        this.gameStage = gameStage.准备阶段;
                        this.ResultPanel.ShowResult(false);
                        // this.Scene3DCtrl.ResetFish();
                        this.M_Image("coord").pos(-1000, -1000);
                        return;
                    }

                    this.M_Image("durabilityRoot/durabilityBar").scaleX -= timer * this.durabilityReduceRodRate / 100 * 3;
                }

                break;
            case gameStage.第二阶段:

                this.angle += timer * this.roteRate;
                // console.log(this.angle, this.roteRate);
                if (this.angle > 360) {
                    this.angle = 359;
                    this.roteRate = -this.roteRate;
                }
                else if (this.angle < 180) {
                    this.angle = 181;
                    this.roteRate = -this.roteRate;
                }

                this.setPos();

                break;
        }





    }




    private startY: number = 0;
    public InitToast() {
        this.startY = this.M_Text("toast").y;
    }

    public ShowText(str: string) {
        this.M_Text("toast").visible = true;
        Laya.Tween.clearAll(this.M_Text("toast"));
        this.M_Text("toast").y = this.startY;
        this.M_Text("toast").text = str;
        Laya.Tween.to(this.M_Text("toast"), { y: this.startY - 150 }, 1500, Laya.Ease.strongOut, Laya.Handler.create(this, () => {
            this.M_Text("toast").visible = false;
        }))

    }

}