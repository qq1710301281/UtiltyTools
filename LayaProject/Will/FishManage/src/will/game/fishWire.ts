
import BezierUtils from "../../public/core/Toos/BezierUtils";
import fishGear from "./fishGear";
import scene3DObj from "./scene3DObj";
import waterTrigger from "./waterTrigger";

export default class fishWire extends Laya.Script {

    //绳子的节点
    private ropePointArr: Array<Laya.Sprite3D> = new Array<Laya.Sprite3D>();
    //绳子的刚体
    private ropePointRigArr: Array<Laya.Rigidbody3D> = new Array<Laya.Rigidbody3D>();
    //约束点集合
    private configurableConstraintArr: Array<Laya.ConfigurableConstraint> = new Array;

    //鱼线
    private ropeArr: Array<Laya.Sprite3D> = new Array<Laya.Sprite3D>();

    public FishGear: fishGear;//渔具

    constructor() { super(); }

    private cube: Laya.Sprite3D;//方块
    private cubeToDir: Laya.Vector3 = new Laya.Vector3;

    onAwake() {
        this.FishGear = this.owner.parent.getComponent(scene3DObj) as fishGear;//获取父节点的脚本
        this.init();

        this.cube = this.FishGear.owner.getChildByName("Cube") as Laya.Sprite3D;
        console.log(this.FishGear.owner, "9+++++", this.cube);
    }

    /**
     * 鱼往前跑
     */
    public Run(count: number) {
        // console.log(this.FishingPoint.transform.localPositionZ);
        if (this.FishingPoint.transform.localPositionZ + count < 3) {
            return;
        }
        // console.log(count);
        this.FishingPoint.transform.localPositionZ += count;
    }

    private coeX: number = -1;
    /**
     * 随机的左右移动
     */
    public RandomLeftRight(count: number) {

        // console.log(this.FishingPoint.transform.localPositionX);
        if (this.FishingPoint.transform.localPositionX > 7) {
            this.coeX = -1;
        }

        if (this.FishingPoint.transform.localPositionX < 1) {
            this.coeX = 1;
        }
        this.FishingPoint.transform.localPositionX += count * this.coeX * Laya.timer.delta / 1000 * 100;
    }


    public ToCenter(count: number) {

        // console.log(this.FishingPoint.transform.localPositionX);
        if (this.FishingPoint.transform.localPositionX < 0.5 && this.FishingPoint.transform.localPositionX > -0.5) {
            // console.log("在这个区间", this.FishingPoint.transform.localPositionX);
            // this.FishingPoint.transform.localPositionX = 0;
            return;
        }

        if (this.FishingPoint.transform.localPositionX > 0.5) {
            this.coeX = -1;
        }

        if (this.FishingPoint.transform.localPositionX < -0.5) {
            this.coeX = 1;
        }

        // console.log(this.coeX);
        this.FishingPoint.transform.localPositionX += count * this.coeX;
    }

    private timerCount: number = 0;
    private targetPos: Laya.Vector3 = new Laya.Vector3();
    onUpdate() {


        this.updateLine();

        let timer = Laya.timer.delta / 1000;

        if (this.FishingPoint) {
            // console.log(this.FishingPoint.transform.localPosition);
            
        }
        if (this.isStart) {
            // console.log(this.sprite.x);
            this.timerCount += timer;
            // if (this.timerCount >= 15) {
            //     this.isStart = false;
            // }
            // let coe: number = 0.001;
            // // console.log(this.sprite.x);
            // this.cubeToDir = new Laya.Vector3(this.cubeToDir.x * timer * coe , this.cubeToDir.y * timer * coe , this.cubeToDir.z * timer * coe );

            // Laya.Vector3.add(this.ropePointArr[2].transform.position, this.cubeToDir, this.targetPos);
            // console.log(this.cubeToDir);
            this.ropePointArr[2].transform.localPositionY += 20 * timer;
            this.ropePointArr[2].transform.localPositionZ -= 20 * timer;

            // console.log(  this.ropePointArr[2].transform.position);
            if (this.timerCount >= 1) {
                this.timerCount = 0;
                this.isStart = false;
                this.ropePointArr[2].transform.position = this.FishGear.fish.CtrlRoot.transform.position;
                this.FishGear.fish.LayDownFish();
            }
            // console.log();
            // this.ropePointArr[2].transform.localPositionY += 10;
        }
    }

    private init() {
        //绳子的点
        for (let i = 0; i < this.owner.numChildren; i++) {
            this.ropePointArr.push(this.owner.getChildAt(i) as Laya.Sprite3D);
            this.ropePointRigArr.push(this.ropePointArr[i].getComponent(Laya.Rigidbody3D));
        }

        this.ropePointArr[2].addComponent(waterTrigger);
        //设置一个约束节点
        this.setConfigurableConstraint(this.ropePointRigArr[0], this.ropePointRigArr[1]);
        // this.setConfigurableConstraint(this.ropePointRigArr[1], this.ropePointRigArr[2]);
        // this.setConfigurableConstraint(this.ropePointRigArr[2], this.ropePointRigArr[3]);
        // this.setConfigurableConstraint(this.ropePointRigArr[3], this.ropePointRigArr[4]);


        (<Laya.Sprite3D>this.FishGear.ropePoint.getChildAt(0)).transform.localScale = new Laya.Vector3(0.02, 1, 0.02);

        // this.FishGear.ropePoint.transform.position = this.ropePointArr[0].transform.position;
        // console.log(this.FishGear.ropePoint);


        for (let i = 0; i < 100; i++) {
            this.ropeArr.push(Laya.Sprite3D.instantiate(this.FishGear.ropePoint, this.FishGear.MainScene, true));
            // console.log((<Laya.Sprite3D>this.ropePoint_Arr[i].getChildAt(0)).transform.localScale);
            // this.ropePoint_Arr[i].transform.setWorldLossyScale(0.)
            // (<Laya.Sprite3D>this.ropePoint_Arr[i].getChildAt(0)).transform.localScale = new Laya.Vector3(0.02, 1, 0.02);
        }
        // this.FishGear.ropePoint.active = false;

        // this.startPos = this.FishingPoint.transform.localPosition;
        // this.startPosX = this.FishingPoint.transform.localPositionX;
        // this.startPosZ = this.FishingPoint.transform.localPositionZ
        // console.log("初始的位置",    this.startPosX, this.startPosZ);

        this.ResetFishPoint();

    }

    private startPosX;
    private startPosZ;
    /**
     * 重置钓鱼的线头
     */
    public ResetFishPoint() {
        this.FishingPoint.transform.localPositionX = 0;
        this.FishingPoint.transform.localPositionZ = 10;
        this.FishingPoint.transform.localPositionY = -7.42;

        // console.log(this.FishingPoint.transform.localPositionY);
        this.GoWater();
        // console.log("回到初始的位置", this.FishingPoint.transform.position);

    }

    private bezierUtils: BezierUtils;

    //鱼嘴点
    public FishPoint: Laya.Sprite3D;
    private updateLine() {
        // this.pixeLine.setLine(0, this.ropePointArr[0].transform.position, this.ropePointArr[1].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);
        // this.pixeLine.setLine(1, this.ropePointArr[1].transform.position, this.ropePointArr[2].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);
        // this.pixeLine.setLine(2, this.ropePointArr[2].transform.position, this.ropePointArr[3].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);
        // this.pixeLine.setLine(3, this.ropePointArr[3].transform.position, this.ropePointArr[4].transform.position, Laya.Color.YELLOW, Laya.Color.YELLOW);

        // let a = this.bezierUtils.createBezier5(this.ropePointArr[0].transform.position, this.ropePointArr[1].transform.position, this.ropePointArr[2].transform.position, this.ropePointArr[3].transform.position, this.ropePointArr[4].transform.position, 99, 1);
        this.bezierUtils = new BezierUtils();

        let a = this.bezierUtils.createBezier3(this.ropePointArr[0].transform.position, this.ropePointArr[1].transform.position, this.ropePointArr[2].transform.position, 50, 1);

        let temp: Laya.Sprite;
        for (let i = 0; i < a.length - 2; i++) {
            // this.pixeLineB.setLine(i, a[i], a[i + 1], Laya.Color.YELLOW, Laya.Color.YELLOW);

            // // this.ropePoint_Arr[i].transform.localScaleZ

            // if (this.FishPoint && i == a.length - 3) {
            //     let dis = Laya.Vector3.distance(a[i], this.FishPoint.transform.position);
            //     this.ropeArr[i].transform.localScale = new Laya.Vector3(this.ropeArr[i].transform.localScale.x, this.ropeArr[i].transform.localScale.y, dis);
            //     this.ropeArr[i].transform.position = a[i];
            //     this.ropeArr[i].transform.lookAt(this.FishPoint.transform.position, new Laya.Vector3(0, 1, 0));
            //     continue;
            // }

            let dis = Laya.Vector3.distance(a[i], a[i + 1]);
            // console.log(dis);
            this.ropeArr[i].transform.localScale = new Laya.Vector3(this.ropeArr[i].transform.localScale.x, this.ropeArr[i].transform.localScale.y, dis);
            // this.ropePoint_Arr[i].transform.localScaleZ = this.ropePoint_Arr[i].transform.localScaleZ * (1 / dis);
            this.ropeArr[i].transform.position = a[i];
            this.ropeArr[i].transform.lookAt(a[i + 1], new Laya.Vector3(0, 1, 0));
        }
        // let dis = Laya.Vector3.distance(this.ropePointArr[0].transform.position, this.ropePointArr[this.ropePointArr.length - 1].transform.position);
        // this.FishGear.ropePoint.transform.localScale = new Laya.Vector3(this.FishGear.ropePoint.transform.localScale.x, this.FishGear.ropePoint.transform.localScale.y, dis / 2);
        // this.FishGear.ropePoint.transform.position = this.ropePointArr[0].transform.position;
        // this.FishGear.ropePoint.transform.lookAt(this.ropePointArr[this.ropePointArr.length - 1].transform.position, new Laya.Vector3(0, -1, 0));
    }


    // private configurableConstraint:
    private setConfigurableConstraint(ownerRigid: Laya.Rigidbody3D, connectRigidBody: Laya.Rigidbody3D) {
        var configurableConstraint: Laya.ConfigurableConstraint = ownerRigid.owner.addComponent(Laya.ConfigurableConstraint);
        this.configurableConstraintArr.push(configurableConstraint);
        configurableConstraint.setConnectRigidBody(ownerRigid, connectRigidBody);

        configurableConstraint.anchor = new Laya.Vector3(0, -2, 0);
        configurableConstraint.connectAnchor = new Laya.Vector3(0, -2, 0);
        // configurableConstraint.minLinearLimit = new Laya.Vector3(-3, 0, 0);
        // configurableConstraint.maxLinearLimit = new Laya.Vector3(3, 0, 0);
        configurableConstraint.minLinearLimit = new Laya.Vector3(0, 0, 0);
        configurableConstraint.maxLinearLimit = new Laya.Vector3(0, 0, 0);
        configurableConstraint.XMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.YMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.ZMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.angularXMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.angularYMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.angularZMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.linearLimitSpring = new Laya.Vector3(100, 100, 100);
        configurableConstraint.linearDamp = new Laya.Vector3(10, 10, 10);

        // configurableConstraint.linearLimitSpring = new Laya.Vector3(0, 0, 0);
        // configurableConstraint.linearDamp = new Laya.Vector3(0, 0, 0);
    }

    private sprite: Laya.Sprite = new Laya.Sprite;
    private isStart: boolean = false;

    /**
     * 回到水里
     */
    public GoWater() {
        if (this.configurableConstraintArr[1]) {
            // this.configurableConstraintArr[1].enabled = false;
            // console.log(this.configurableConstraintArr.length);

            this.configurableConstraintArr[1].destroy();
            // this.configurableConstraintArr[1] = null;
            this.configurableConstraintArr.pop()

            for (let i = 0; i < this.ropePointRigArr.length; i++) {
                this.ropePointRigArr[i].wakeUp();
            }
            // console.log(this.configurableConstraintArr.length);
            // this.ropePointRigArr[1].owner.getComponent(Laya.ConfigurableConstraint)
        }

        // this.ropePointArr[1].transform.position = this.ropePointArr[0].transform.position

        this.configurableConstraintArr[0].connectAnchor = new Laya.Vector3(0, -2, 0);
        this.configurableConstraintArr[0].anchor = new Laya.Vector3(0, -2, 0);
        this.configurableConstraintArr[0].minLinearLimit = new Laya.Vector3(0, 0, 0);
        this.configurableConstraintArr[0].maxLinearLimit = new Laya.Vector3(0, 0, 0);
        // this.configurableConstraintArr[0].XMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        // this.configurableConstraintArr[0].YMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
    }



    public Jump(isStart: boolean = true) {
        // console.log(this.ropePointRigArr[2]);
        if (!this.configurableConstraintArr[1]) {
            //如果没添加过就添加
            console.log("添加新的", this.configurableConstraintArr.length);
            this.setConfigurableConstraint(this.ropePointRigArr[1], this.ropePointRigArr[2]);
        }
        // this.configurableConstraintArr[1].enabled = true;
        this.configurableConstraintArr[0].connectAnchor = new Laya.Vector3(0, 0, 0);
        this.configurableConstraintArr[0].anchor = new Laya.Vector3(0, -5, 0);
        this.configurableConstraintArr[0].minLinearLimit = new Laya.Vector3(-3, 0, 0);
        this.configurableConstraintArr[0].maxLinearLimit = new Laya.Vector3(-3, 0, 0);
        // this.configurableConstraintArr[0].XMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        // this.configurableConstraintArr[0].YMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;

        // this.sprite.x = 0;
        this.isStart = isStart;

        // Laya.Vector3.subtract(this.cube.transform.position, this.ropePointArr[1].transform.position, this.cubeToDir);
        // this.cubeToDir = M_Tool.normalizeObj(this.cubeToDir);//归一化这个向量
        // Laya.Tween.to(this.sprite, { x: 1000 }, 15000, Laya.Ease.strongOut, Laya.Handler.create(this, () => {

        // }))

        return;


        this.ropePointRigArr[2].isKinematic = false;
        // this.ropePointRigArr[2].gravity = new Laya.Vector3(0, -1, 0);
        if (!this.configurableConstraintArr[1]) {
            this.setConfigurableConstraint(this.ropePointRigArr[1], this.ropePointRigArr[2]);
        }
        this.ropePointRigArr[1].isKinematic = true;
        this.ropePointRigArr[2].applyImpulse(new Laya.Vector3(0, 100, 0))

        this.configurableConstraintArr[0].connectAnchor = new Laya.Vector3(0, 0, 0);
        this.configurableConstraintArr[0].anchor = new Laya.Vector3(0, -5, 0);
        this.configurableConstraintArr[0].minLinearLimit = new Laya.Vector3(-3, 0, 0);
        this.configurableConstraintArr[0].maxLinearLimit = new Laya.Vector3(-3, 0, 0);
        this.configurableConstraintArr[0].XMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        this.configurableConstraintArr[0].YMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;


        this.configurableConstraintArr[1].connectAnchor = new Laya.Vector3(0, 0, 0);
        this.configurableConstraintArr[1].anchor = new Laya.Vector3(0, -5, 0);
        this.configurableConstraintArr[1].minLinearLimit = new Laya.Vector3(-3, 0, 0);
        this.configurableConstraintArr[1].maxLinearLimit = new Laya.Vector3(-3, 0, 0);
        this.configurableConstraintArr[1].XMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        this.configurableConstraintArr[1].YMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;

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

    public get Test(): Laya.ConfigurableConstraint {
        return this.configurableConstraintArr[0];
    }

    /**
     * 鱼线链接鱼竿的点
     */
    public get FishingRod() {
        return this.ropePointArr[0];
    }

    /**
     * 鱼咬钩的点
     */
    public get FishingPoint() {
        return this.ropePointArr[this.ropePointArr.length - 1];
    }

    /**
     * 鱼钩
     */
    public get FishHook() {
        return this.ropeArr[this.ropeArr.length - 3];
    }

    /**
     * 鱼水花
     */
    public get Water() {
        // console.log(this.FishingPoint);
        return this.FishingPoint.getChildAt(0) as Laya.Sprite3D;
    }


}