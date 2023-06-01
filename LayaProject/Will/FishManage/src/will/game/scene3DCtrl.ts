import { Input, KeyCode } from "../../public/core/Game/InputManager";
import blue from "./blue";
import boat from "./boat";
import cameraCtrl from "./cameraCtrl";
import cloud from "./cloud";
import fishGear from "./fishGear";
import rubbish from "./rubbish";

/**
 * 添加到3D场景上的脚本用来控制整个游戏的3D物体
 */
export default class scene3DCtrl extends Laya.Script {

    constructor() { super(); }

    public CameraCtrl: cameraCtrl;//摄像机控制

    public Cloud: cloud;//云

    public Blue: blue;//大海

    public FishGear: fishGear;//渔具

    public Rubbish: rubbish;//l垃圾

    public boat: boat;//船

    //主场景
    public MainScene: Laya.Scene3D;

    onAwake() {
        //执行到这里就说明3D场景已经加载了
        this.MainScene = this.owner as Laya.Scene3D;

        // Laya.stage.addChild(this.MainScene);
        // this.MainScene.zOrder = -1;


        //给摄像机添加控制脚本
        this.CameraCtrl = this.MainScene.getChildByName("CameraRoot").addComponent(cameraCtrl);
        this.CameraCtrl.Init(this);

        this.Cloud = this.MainScene.getChildByName("Cloud").addComponent(cloud);//给云添加脚本
        this.Cloud.Init(this);

        this.Blue = this.MainScene.getChildByName("Blue").addComponent(blue);//给大海添加脚本
        this.Blue.Init(this);

        this.FishGear = this.MainScene.getChildByName("FishGear").addComponent(fishGear);//给渔具添加脚本
        this.FishGear.Init(this);
        // this.FishGear.CtrlRoot.active = false;

        this.boat = this.MainScene.getChildByName("Boat").addComponent(boat);
        this.boat.Init(this);

        this.Rubbish = this.MainScene.getChildByName("Rubbish").addComponent(rubbish);
        this.Rubbish.Init(this);

        // for (let i = 0; i < this.MainScene.getChildByName("Rubbish").numChildren; i++) {
        //     this.MainScene.getChildByName("Rubbish").getChildAt(i).name = "RubishObj";
        // }
        // this.owner.addComponent(InputManager);
    }


    /**
     * 钓鱼的2D坐标
     */
    public get FishPos(): Laya.Vector2 {
        let pos: Laya.Vector4 = new Laya.Vector4;
        this.CameraCtrl.MainCamera.worldToViewportPoint(this.FishGear.fishWire.FishingPoint.transform.position, pos);
        return new Laya.Vector2(pos.x, pos.y);
    }

    // public get RolePos

    onUpdate() {

        let timer = Laya.timer.delta / 1000;

        // if (Input.getKey(KeyCode.LeftArrow)) {
        //     // console.log(this.fishWire.FishingRod.transform.position.x);
        //     // this.fishWire.FishingRod.transform.localPositionX=3
        //     // this.fishRod.FishingRod.transform.translate(new Laya.Vector3(timer * 5, 0, 0));

        //     this.fishWire.FishingPoint.transform.localPositionX += timer * 5;
        //     console.log(this.fishWire.FishingPoint.transform.localRotationEulerY);
        //     this.fishWire.FishingPoint.transform.localRotationEulerY = 90;
        //     this.fishRod.FishingRod.transform.translate(new Laya.Vector3(timer * 5, 0, 0));
        // }
        // if (Input.getKey(KeyCode.RightArrow)) {
        //     // this.fishRod.FishingRod.transform.translate(new Laya.Vector3(-timer * 5, 0, 0));
        //     this.fishWire.FishingPoint.transform.localRotationEulerY = -90;
        //     this.fishWire.FishingPoint.transform.localPositionX -= timer * 5;
        // }
        // if (Input.getKey(KeyCode.UpArrow)) {
        //     // this.fishRod.FishingRod.transform.translate(new Laya.Vector3(0, timer * 5, 0));
        //     // this.fishWire.FishingPoint.transform.localPositionX -= timer * 5;
        //     this.fishWire.FishingPoint.transform.localRotationEulerY = 0;
        //     this.fishWire.FishingPoint.transform.localPositionZ += timer * 5;
        //     if (this.fishRod.FishingRod.transform.localPositionY <= 2.5) {
        //         // htis.fishRod.FishingRod.transform.localPositionY = -1;
        //         return;
        //     }
        //     this.fishRod.FishingRod.transform.translate(new Laya.Vector3(0, -timer * 5, 0));
        // }
        // if (Input.getKey(KeyCode.DownArrow)) {
        //     this.fishWire.FishingPoint.transform.localRotationEulerY = 180;
        //     // console.log(this.fishRod.FishingRod.transform.localPositionY);
        //     // this.fishRod.FishingRod.transform.localPositionY -= timer * 5;
        //     this.fishWire.FishingPoint.transform.localPositionZ -= timer * 5;


        // }

        // if (this.fishWire.FishingRod) {
        //     this.fishWire.FishingRod.transform.position = this.fishRod.FishingRod.transform.position;
        //     let pos: Laya.Vector3 = this.fishWire.FishingPoint.transform.position;
        //     let foward: Laya.Vector3 = new Laya.Vector3;
        //     this.fishWire.FishingPoint.transform.getForward(foward);
        //     this.blueWaterMove.transform.position = new Laya.Vector3(pos.x + foward.x * 5, pos.y + foward.y * 5, pos.z + foward.z * 5);
        // }


        // if (Input.getKeyDown(KeyCode.R)) {
        //     // console.log(":失活");
        //     // console.log( this.FishGear.fishWire.Water);
        //     this.FishGear.fishWire.Water.destroy();
        // }
    }
}