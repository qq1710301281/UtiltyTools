import BezierUtils from "../../public/core/Toos/BezierUtils";
import fishGear from "./fishGear";
import scene3DObj from "./scene3DObj";

export default class fishRod extends Laya.Script {

    //绳子的节点
    private ropePointArr: Array<Laya.Sprite3D> = new Array<Laya.Sprite3D>();
    //绳子的刚体
    private ropePointRigArr: Array<Laya.Rigidbody3D> = new Array<Laya.Rigidbody3D>();
    //约束点集合
    private configurableConstraintArr: Array<Laya.ConfigurableConstraint> = new Array;

    private ropePoint_Arr: Array<Laya.Sprite3D> = new Array<Laya.Sprite3D>();


    public FishGear: fishGear;//渔具

    constructor() { super(); }

    onAwake() {
        this.FishGear = this.owner.parent.getComponent(scene3DObj) as fishGear;//获取父节点的脚本

        //绳子的点
        for (let i = 0; i < this.owner.numChildren; i++) {
            this.ropePointArr.push(this.owner.getChildAt(i) as Laya.Sprite3D);
            this.ropePointRigArr.push(this.ropePointArr[i].getComponent(Laya.Rigidbody3D));
        }
        //设置一个约束节点
        this.setConfigurableConstraint(this.ropePointRigArr[0], this.ropePointRigArr[1]);
        this.setConfigurableConstraint(this.ropePointRigArr[1], this.ropePointRigArr[2]);
        // this.setConfigurableConstraint(this.ropePointRigArr[2], this.ropePointRigArr[3]);
        // this.setConfigurableConstraint(this.ropePointRigArr[3], this.ropePointRigArr[4]);

        for (let i = 0; i < 50; i++) {
            this.ropePoint_Arr.push(Laya.Sprite3D.instantiate(this.FishGear.ropePoint, this.FishGear.MainScene, true));
        }
        this.ropePoint_Arr[this.ropePoint_Arr.length - 3].active = false;
        this.ropePoint_Arr[this.ropePoint_Arr.length - 2].active = false;
        this.ropePoint_Arr[this.ropePoint_Arr.length - 1].active = false;
        this.ropePoint_Arr[this.ropePoint_Arr.length - 4].active = false;



        let up: Laya.Vector3 = new Laya.Vector3;
        (<Laya.Sprite3D>this.ropePointArr[0].getChildAt(0)).transform.getUp(up);

        let dir: Laya.Vector3 = new Laya.Vector3(up.x * 0.5, up.y * 0.5, up.z * 0.5);
        this.ropePointArr[1].transform.localPosition = dir;
        // this.ropePointRigArr[1].gravity = new Laya.Vector3(-dir.x, -dir.y, -dir.z);
        this.configurableConstraintArr[0].anchor = dir;
        // console.log(this.ropePointRigArr[1].gravity);


        this.ropePointArr[2].transform.localPosition = new Laya.Vector3(up.x, up.y, up.z);
        // this.ropePointRigArr[2].gravity = new Laya.Vector3(up.x, up.y, up.z);
        this.ropePointRigArr[2].gravity = new Laya.Vector3(0, -1, 0);
        // console.log(this.ropePointArr[2].transform.localPositionY, this.ropePointArr[2].transform.position.y);
        this.configurableConstraintArr[1].anchor = new Laya.Vector3(up.x * 0.8, up.y * 0.8, up.z * 0.8);

        // console.log(this.FishingRod.transform.localPositionY);
        // let lineY = this.ropePointArr[2].transform.position.y;
        // let lineY = this.ropePointArr[2].transform.localPositionY;
        // this.configurableConstraintArr[0].minLinearLimit = new Laya.Vector3(0, lineY + 3, 0)
        // this.configurableConstraintArr[0].maxLinearLimit  = new Laya.Vector3(0, lineY - 3, 0)
        // this.configurableConstraintArr[1].minLinearLimit = new Laya.Vector3(0, lineY + 3, 0)
        // this.configurableConstraintArr[1].maxLinearLimit = new Laya.Vector3(0, lineY - 3, 0)

        // this.configurableConstraintArr[0].maxLinearLimit  = new Laya.Vector3(0, lineY - 3, 0)
        // this.configurableConstraintArr[1].minLinearLimit = new Laya.Vector3(0, lineY + 3, 0)

        // this.drawLine();
        this.ResetRod();
    }

    //重置杆子头上的位置
    public ResetRod() {
        this.FishingRod.transform.localPositionY = 3.4;
        this.FishingRod.transform.localPositionX = 0;
    }

    private scaleCount = 0;
    onUpdate() {

        this.updateLine();

        if (Laya.timer.scale == 0) {
            this.scaleCount = 0;
            this.ropePointRigArr[2].enabled =false;
        }
        else {
            if (this.scaleCount == 0) {
                this.scaleCount = 1;
                this.ropePointRigArr[2].enabled =true;
            }
        }
    }

    private bezierUtils: BezierUtils;

    private updateLine() {
        // this.pixeLine.setLine(0, this.ropePointArr[0].transform.position, this.ropePointArr[1].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);
        // this.pixeLine.setLine(1, this.ropePointArr[1].transform.position, this.ropePointArr[2].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);
        // this.pixeLine.setLine(2, this.ropePointArr[2].transform.position, this.ropePointArr[3].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);
        // this.pixeLine.setLine(3, this.ropePointArr[3].transform.position, this.ropePointArr[4].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);

        // let a = this.bezierUtils.createBezier5(this.ropePointArr[0].transform.position, this.ropePointArr[1].transform.position, this.ropePointArr[2].transform.position, this.ropePointArr[3].transform.position, this.ropePointArr[4].transform.position, 99, 1);
        this.bezierUtils = new BezierUtils();

        let a = this.bezierUtils.createBezier3(this.ropePointArr[0].transform.position, this.ropePointArr[1].transform.position, this.ropePointArr[2].transform.position, this.ropePoint_Arr.length, 1);

        for (let i = 0; i < a.length - 2; i++) {
            // this.pixeLineB.setLine(i, a[i], a[i + 1], Laya.Color.YELLOW, Laya.Color.YELLOW);

            // this.ropePoint_Arr[i].transform.localScaleZ
            let dis = Laya.Vector3.distance(a[i], a[i + 1]);
            // console.log(dis);
            this.ropePoint_Arr[i].transform.localScale = new Laya.Vector3(this.ropePoint_Arr[i].transform.localScale.x, this.ropePoint_Arr[i].transform.localScale.y, dis);
            // this.ropePoint_Arr[i].transform.localScaleZ = this.ropePoint_Arr[i].transform.localScaleZ * (1 / dis);
            this.ropePoint_Arr[i].transform.position = a[i];
            this.ropePoint_Arr[i].transform.lookAt(a[i + 1], new Laya.Vector3(0, 1, 0));
        }

    }


    // private configurableConstraint:
    private setConfigurableConstraint(ownerRigid: Laya.Rigidbody3D, connectRigidBody: Laya.Rigidbody3D) {
        var configurableConstraint: Laya.ConfigurableConstraint = ownerRigid.owner.addComponent(Laya.ConfigurableConstraint);
        this.configurableConstraintArr.push(configurableConstraint);
        configurableConstraint.setConnectRigidBody(ownerRigid, connectRigidBody);

        configurableConstraint.anchor = new Laya.Vector3(0, -10, 0);
        // configurableConstraint.connectAnchor = new Laya.Vector3(0, 0, 0);
        configurableConstraint.minLinearLimit = new Laya.Vector3(-1, -5, 0);
        configurableConstraint.maxLinearLimit = new Laya.Vector3(1, 5, 0);
        configurableConstraint.XMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
        configurableConstraint.YMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
        configurableConstraint.ZMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.angularXMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.angularYMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.angularZMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.linearLimitSpring = new Laya.Vector3(30, 30, 0);
        configurableConstraint.linearDamp = new Laya.Vector3(20, 20, 10);

    }


    private pixeLine: Laya.PixelLineSprite3D;
    //画线
    private drawLine() {

        // 
        //画线
        // for (let i = 0; i < this.ropePointArr.length; i++) {
        //     pixeLine.addLine(this.ropePointArr[0].transform.position, this.ropePointArr[1].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);
        // }
        // pixeLine.clear();
        // //射线类
        // this.pixeLine = new Laya.PixelLineSprite3D(20);
        // this.mainScene.addChild(this.pixeLine);
        // this.pixeLine.addLine(this.ropePointArr[0].transform.position, this.ropePointArr[1].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);
        // this.pixeLine.addLine(this.ropePointArr[1].transform.position, this.ropePointArr[2].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);
        // this.pixeLine.addLine(this.ropePointArr[2].transform.position, this.ropePointArr[3].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);
        // this.pixeLine.addLine(this.ropePointArr[3].transform.position, this.ropePointArr[4].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);

        this.pixeLine = new Laya.PixelLineSprite3D(100);
        // this.mainScene.addChild(this.pixeLine);
        for (let i = 0; i < 50; i++) {
            this.pixeLine.addLine(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0), Laya.Color.RED, Laya.Color.RED);
        }
    }

    /**
     * 鱼竿链接鱼线的点
     */
    public get FishingRod() {
        return this.ropePointArr[this.ropePointArr.length - 1];
    }

    public get FishingRodLine() {
        // console.log(this.ropePoint_Arr);
        return this.ropePoint_Arr[this.ropePoint_Arr.length - 3];
    }


    private isKeepDown = false;
    /**
     * 垂直弯曲
     */
    public CurveVertical(count: number) {
        if (this.isKeepDown) {
            this.FishingRod.transform.localPositionY = 1;
            return;
        }
        if (this.FishingRod.transform.localPositionY < 1) {
            this.isKeepDown = true;
            return;
        }
        // else {
        //     this.FishingRod.transform.localPositionY = 0.5
        // }

        this.FishingRod.transform.localPositionY += count;
        // this.FishingRod.transform.localPositionY = 0.5
    }


    private isKeepLeft = false;
    /**
     * 水平弯曲
     * @param count 
     */
    public CurveHorizontal(count: number) {
        // console.log(this.FishingRod.transform.localPositionX);
        // if ((this.FishingRod.transform.localPositionX < -1.7 && this.FishingRod.transform.localPositionX > -3) || (this.FishingRod.transform.localPositionX > -1.7 && this.FishingRod.transform.localPositionX < -0.5)) {
        //     this.FishingRod.transform.localPositionX += count;
        // }
        // console.log(this.FishingRod.transform.localPositionX);

        if (this.isKeepLeft) {
            this.FishingRod.transform.localPositionX = 0;
            return;
        }
        if (this.FishingRod.transform.localPositionX > 0) {
            this.isKeepLeft = true;
            return;
        }
        this.FishingRod.transform.localPositionX += count;
    }

    public DontKeep() {
        this.isKeepLeft = false;
        this.isKeepDown = false;
    }

}