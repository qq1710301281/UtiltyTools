
import fishWire from "./fishWire";
import fishRod from "./fishRod";
import scene3DCtrl from "./scene3DCtrl";
import scene3DObj from "./scene3DObj";
import fish from "./fish";
import { Input, KeyCode } from "../../public/core/Game/InputManager";
import SoundBolTime, { SoundName } from "../../lb/manager/SoundBolTime";

/**
 * 渔具的状态枚举
 */
export enum fishGearState {
    静置,
    松线,
    拉线,
}
/**
 * 鱼具脚本 用来挂在3D场景中的
 */
export default class fishGear extends scene3DObj {

    constructor() {
        super();
    }

    //主3D场景控制器
    public Scene3DCtrl: scene3DCtrl;

    public fishRod: fishRod;

    public fishWire: fishWire;

    public fish: fish;

    public ropePoint: Laya.Sprite3D;

    public fishState: fishGearState;

    public modelFish: Laya.Sprite3D;

    public Init(scene3DCtrl: scene3DCtrl) {
        super.Init(scene3DCtrl);
        //鱼线及鱼竿的克隆点
        this.ropePoint = this.owner.getChildByName("ropePoint") as Laya.Sprite3D;
        // this.ropePoint.active=false;
        // console.log(this.ropePoint);
        //鱼竿
        this.fishRod = this.owner.getChildByName("fishRod").addComponent(fishRod);
        //鱼线
        this.fishWire = this.owner.getChildByName("fishWire").addComponent(fishWire);
        //鱼
        this.modelFish = this.owner.getChildByName("ciba") as Laya.Sprite3D;
        this.fish = this.owner.getChildByName("fish").addComponent(fish);

        //初始化之后进行鱼竿与鱼线合体
        this.isFit = true;

        this.fishState = fishGearState.静置;
    }

    public FishGearCtrl(isShow: boolean) {
        // if (isShow) {
        //     this.CtrlRoot.active = true;
        // }
        // else{
        //     this.CtrlRoot.active = false;
        // }
    }

    private isFit: boolean = false;//合体
    onUpdate() {
        if (Input.getKeyDown(KeyCode.Q)) {
            this.FishGearCtrl(true)
        }
        else if (Input.getKeyDown(KeyCode.E)) {
            this.FishGearCtrl(false)
        }

        if (this.isFit) {
            // this.fishWire.FishingRod.transform.position = new Laya.Vector3(this.fishRod.FishingRod.transform.position.x + 0.1, this.fishRod.FishingRod.transform.position.y - 0.1, this.fishRod.FishingRod.transform.position.z - 0.2);
            this.fishWire.FishingRod.transform.position = this.fishRod.FishingRodLine.transform.position;
            switch (this.fishState) {
                case fishGearState.松线:
                    this.FishRun(true);
                    this.RandomHorizontal();
                    break;
                case fishGearState.拉线:
                    this.FishRun(false);
                    this.ToCenter();
                    this.fishRod.DontKeep();
                    break;
                case fishGearState.静置:

                    break;

            }
        }
    }

    public Reset(isShow: boolean) {
        this.fishState = fishGearState.静置;
        this.fishRod.ResetRod();
        this.fishWire.ResetFishPoint();

        //让鱼下次可以正常跑
        // this.FishRunStop = false;


        this.FishRunStop = !isShow;
        this.fishWire.Water.active = isShow;

     
        isShow ? this.fishWire.GoWater() : this.fishWire.Jump(false);
        // console.log( this.fishWire.Water.active);
    }

    // public CountZ: number = 0;

    // /**
    //  * 让鱼消失
    //  */
    // public SetFish(isShow: boolean) {
    //     this.FishRunStop = !isShow;
    //     this.fishWire.Water.active = isShow;
    // }

    public FishRunStop: boolean = false;
    //鱼逃跑
    public FishRun(isFoward: boolean) {


        //鱼往垂直
        let dirZ = Laya.timer.delta / 1000 * (isFoward ? 1 : -1) * 5;
        dirZ *= 1;
        this.fishRod.CurveVertical(-dirZ);//鱼竿向下弯曲


        if (this.FishRunStop) {
            return;
        }
        // this.CountZ += dirZ;
        this.fishWire.Run(dirZ);

        // //鱼往随机水平跑
        // this.RandomHorizontal();
    }


    /**
     * 随机水平走
     */
    public RandomHorizontal() {


        let dirX = Laya.timer.delta / 1000 * 5;

        dirX *= 1;
        this.fishRod.CurveHorizontal(dirX);//鱼竿向左

        if (this.FishRunStop) {
            return;
        }
        this.fishWire.RandomLeftRight(dirX);


    }

    //来中间
    public ToCenter() {
        // console.log("区中心");
        // console.log(this.FishToPlayerDis);
        let dirX = Laya.timer.delta / 1000 * 7;
        this.fishWire.ToCenter(dirX);

        dirX *= 1;
        this.fishRod.CurveVertical(-dirX);//鱼竿向下弯曲
    }

    /**
     * 获取鱼到玩家的距离
     */
    public get FishToPlayerDis(): number {
        return Laya.Vector3.distance(this.fishWire.FishingPoint.transform.position, this.fishRod.FishingRod.transform.position) - 8;
    }
}