import { Input, KeyCode } from "../../public/core/Game/InputManager";
import { MainCameraCtrl } from "../../public/core/Game/MainCameraCtrl";
import scene3DCtrl from "./scene3DCtrl";
import scene3DObj from "./scene3DObj";

/**
 * 摄像机的控制脚本
 */
export default class cameraCtrl extends scene3DObj {
    constructor() { super(); }

    public MainCamera: Laya.Camera;//主摄像机  游戏中的摄像机
    public UICamera: Laya.Camera;//UI摄像机
    public PlaceCamera: Laya.Camera;//放置摄像机


    private targetPoint = [{ pos: { x: 16.74, y: 4.31, z: -12.17 }, rot: { x: -9.43, y: -39.60, z: 0 } },
    { pos: { x: 19.14, y: 6.18, z: -72.58 }, rot: { x: -5.98, y: -140.08, z: 0 } },]
    // fishing: { pos: { x: -5.99, y: 0.94, z: -37.39 }, rot: { x: -17.8, y: 180, z: -2.14 } },


    // }

    public Init(scene3DCtrl: scene3DCtrl) {
        super.Init(scene3DCtrl);

        this.MainCamera = this.owner.getChildByName("MainCamera") as Laya.Camera;
        this.UICamera = this.owner.getChildByName("UICamera") as Laya.Camera;
        this.PlaceCamera = this.owner.getChildByName("PlaceCamera") as Laya.Camera;

        this.PlaceCamera.addComponent(MainCameraCtrl);
        this.ShowCamera(1);
        this.MoveToCamera(0);


    }


    onUpdate() {

        if (Input.getKeyDown(KeyCode.P)) {
            console.log(`x:${(this.PlaceCamera.transform.localPosition.x).toFixed(2)},y:${(this.PlaceCamera.transform.localPosition.y).toFixed(2)},z:${(this.PlaceCamera.transform.localPosition.z).toFixed(2)}`, `x:${(this.PlaceCamera.transform.localRotationEuler.x).toFixed(2)},y:${(this.PlaceCamera.transform.localRotationEuler.y).toFixed(2)},z:${(this.PlaceCamera.transform.localRotationEuler.z).toFixed(2)}`);
        }

        // if (Input.getKeyDown(KeyCode.L)) {
        //     this.MoveToCamera(0);
        // }
        // if (Input.getKeyDown(KeyCode.R)) {
        //     this.MoveToCamera(1);
        // }


        if (this.isMove) {
            this.PlaceCamera.transform.localPosition = new Laya.Vector3(this.posSp.x, this.posSp.y, this.posSp.rotation);
            this.PlaceCamera.transform.localRotationEuler = new Laya.Vector3(this.roteSp.x, this.roteSp.y, this.roteSp.rotation);
            // console.log(this.roteSp.x,this.roteSp.y,this.roteSp.rotation);
        }

    }


    private posSp: Laya.Sprite = new Laya.Sprite;
    private roteSp: Laya.Sprite = new Laya.Sprite;

    public CurrentPosIndex: number = 0;
    private isMove: boolean = false;
    /**
     * 移动到摄像机
     * @param index 
     */
    public MoveToCamera(index: number, fnc: Function = null) {
        this.isMove = true;
        this.CurrentPosIndex = index;
        this.posSp.x = this.PlaceCamera.transform.localPositionX;
        this.posSp.y = this.PlaceCamera.transform.localPositionY;
        this.posSp.rotation = this.PlaceCamera.transform.localPositionZ;

        this.roteSp.x = this.PlaceCamera.transform.localRotationEulerX;
        this.roteSp.y = this.PlaceCamera.transform.localRotationEulerY;
        this.roteSp.rotation = this.PlaceCamera.transform.localRotationEulerZ;

        Laya.Tween.clearAll(this.posSp);
        Laya.Tween.clearAll(this.roteSp);

        Laya.Tween.to(this.roteSp, { x: this.targetPoint[index].rot.x, y: this.targetPoint[index].rot.y, rotation: this.targetPoint[index].rot.z }, 5000, Laya.Ease.cubicInOut, Laya.Handler.create(this, () => {
            // this.isMove = false;
            // console.log(this.roteSp.x, this.roteSp.y, this.roteSp.rotation);
            if (fnc) {
                fnc();
            }
        }));

        Laya.Tween.to(this.posSp, { x: this.targetPoint[index].pos.x, y: this.targetPoint[index].pos.y, rotation: this.targetPoint[index].pos.z }, 5000, Laya.Ease.cubicInOut, Laya.Handler.create(this, () => {
            this.isMove = false;
        }));

    }


    /**
     * 发出一条射线从屏幕 在鼠标的位置
     */
    public ShootRayOnScreen(): Laya.Vector4 {

        //创建一个射线返回的储存数组
        var outs: Array<Laya.HitResult> = new Array<Laya.HitResult>();

        //创建一个射线
        var ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));

        //创建一个点 为鼠标在屏幕的坐标哦
        var point = new Laya.Vector2(Laya.stage.mouseX, Laya.stage.mouseY);

        //计算一个从屏幕空间生成的射线
        this.PlaceCamera.viewportPointToRay(point, ray);

        //使用3D场景的物理模拟器，检测所碰撞的物体
        this.Scene3DCtrl.MainScene.physicsSimulation.rayCastAll(ray, outs);

        //遍历 这个返回对象的数组 如果射到了地面或者某一个可操作物体 就在射到的位置生成探测器  用来探测周围的物体 
        if (outs.length != 0) {
            for (let i = 0; i < outs.length; i++) {
                if (outs[i].collider.owner.name == "RubishObj") {
                    let rubishObj = outs[i].collider.owner as Laya.Sprite3D;
                    rubishObj.active = false;

                    let pos = new Laya.Vector4();
                    this.PlaceCamera.worldToViewportPoint(rubishObj.transform.position, pos);
                    // console.log(pos);
                    return pos;//在射到第一个位置结束这个射击检测
                }
            }
        }
        return null;
    }


    /**
     * 展示对应的相机
     * @param index 相机对应的索引
     */
    public ShowCamera(index: number) {
        for (let i = 0; i < this.owner.numChildren; i++) {
            this.owner.getChildAt(i).active = false;
        }
        this.owner.getChildAt(index).active = true;
    }
}