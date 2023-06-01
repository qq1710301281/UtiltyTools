import LBDataSheetManager from "../../lb/manager/LBDataSheetManager";
import { Dictionary } from "../../public/core/Data/Dictionary";
import { NumArray } from "../../public/core/Data/NumArray";
import BezierUtils from "../../public/core/Toos/BezierUtils";
import M_Tool from "../../public/core/Toos/M_Tool";
import TigerData from "../../public/dataSheet/TigerData";
import TigerDataSheet from "../../public/dataSheet/TigerDataSheet";
import { Util } from "../../public/game/Util";
import GameLocalStorage from "../../public/localStorage/GameLocalStorage";
import res_mrg from "../../public/manager/res_mrg";
import ui_mrg from "../../public/manager/ui_mrg";
import game_wnd from "../canvas/wnd/game_wnd";
import Will_Data from "../dataSheet/Will_Data";
import Will_DataManager from "../manager/Will_DataManager";
import fishGear from "./fishGear";
import scene3DObj from "./scene3DObj";

export default class fish extends Laya.Script {

    //绳子的节点
    private ropePointArr: Array<Laya.Sprite3D> = new Array<Laya.Sprite3D>();
    //绳子的刚体
    private ropePointRigArr: Array<Laya.Rigidbody3D> = new Array<Laya.Rigidbody3D>();
    //约束点集合
    private configurableConstraintArr: Array<Laya.ConfigurableConstraint> = new Array;

    private ropePoint_Arr: Array<Laya.Sprite3D> = new Array<Laya.Sprite3D>();
    //渔具
    public FishGear: fishGear;

    constructor() { super(); }

    public CtrlRoot: Laya.Sprite3D;

    public fishPoint: Laya.Sprite3D;

    onAwake() {
        this.FishGear = this.owner.parent.getComponent(scene3DObj) as fishGear;//获取父节点的脚本
        this.CtrlRoot = this.owner as Laya.Sprite3D;
        this.init();

        // this.cube = this.FishGear.owner.getChildByName("Cube") as Laya.Sprite3D;
        // console.log(this.FishGear.owner, "9+++++", this.cube);


        /**遍历之后让鱼添加到对象上面 */
        // for (let i = 0; i < Will_Data.Instance.fishArr.length; i++) {
        //     let fish: Laya.Sprite3D = res_mrg.Instance.GetUnityRes(Will_Data.Instance.fishArr[i].path);
        //     this.fishPoint.addChild(fish);
        //     fish.active = false;
        //     fish.transform.localPosition = new Laya.Vector3(0, 0, 0);
        //     this.fishDic.push(fish);
        // }
        //临时的鱼
        // let tempfish: Laya.Sprite3D = res_mrg.Instance.GetUnityRes(Table.fishArr[0].path);
        // // console.log(tempfish);
        // this.fishPoint.addChild(tempfish);
        // // tempfish.transform.position = this.fish.fishPoint.transform.position;
        // tempfish.transform.localPosition = new Laya.Vector3(0, 0, 0);
        // this.FishGear.fishWire.FishPoint = tempfish;

        this.state = (this.FishGear.modelFish.getComponent(Laya.Animator) as Laya.Animator).getControllerLayer(0).getAnimatorState("Take 001");
    }

    /**鱼名字的集合 */
    private fishNameArr: Array<string>;
    /**鱼名字的集合 */
    private fishNameCNArr: Array<string>;
    /**鱼ID的集合 */
    private fishIDArr: Array<number>;
    /**权重的集合 */
    private weightArr: Array<number>;

    private state: Laya.AnimatorState;

    /**
     * 通过鱼点ID 加载鱼的资源
     * @param fishPointID 鱼点ID
     */
    public LoadRes(fishPointID: number) {
        let unityPathArr: Array<string> = new Array;
        // console.log(Will_DataManager.Instance.FishPointDataSheet);
        if (fishPointID == 0) {
            this.fishIDArr = [0];
        }
        else {
            this.fishIDArr = Will_DataManager.Instance.FishPointDataSheet.GetFishpointDataByFishID(fishPointID).fishIDArr;
        }


        // console.log("+++++++++++++++");
        // console.log("当前的鱼点ID" + fishPointID);
        // console.log("当前的鱼ID" + this.fishIDArr[0]);

        // console.log(fishPointID, this.fishIDArr);


        this.fishNameArr = new Array;
        this.fishNameCNArr = new Array;
        this.weightArr = new Array;
        for (let i = 0; i < this.fishIDArr.length; i++) {
            console.log("当前遍历索引" + i);
            let fishData = LBDataSheetManager.ins.Fish.getFishData(this.fishIDArr[i]);
            console.log("鱼的信息", fishData);
            // console.log(fishData);
            this.fishNameArr.push(fishData.model_name);
            this.fishNameCNArr.push(fishData.name);
            let fishPath = `res/res3D/LayaScene_FishiNoAni/Conventional/${fishData.model_name}.lh`;
            unityPathArr.push(fishPath);
            this.weightArr.push(fishData.weight);
        }

        // console.log("将要加载的鱼点+++++++++++++" + fishPointID, unityPathArr);
        res_mrg.Instance.PreloadResPkg([], unityPathArr, () => {
            for (let i = 0; i < unityPathArr.length; i++) {
                if (!this.fishPoint.getChildByName(this.fishNameArr[i])) {
                    let fish: Laya.Sprite3D = Util.Get3DModel(unityPathArr[i]);
                    // this.state =  (fish.getComponent(Laya.Animator) as Laya.Animator).getControllerLayer(0).getAnimatorState("Take 001");
                    // console.log(this.state);
                    // (fish.getComponent(Laya.Animator) as Laya.Animator).getControllerLayer(0).removeState(this.state);
                    // console.log(fish);
                    this.fishPoint.addChild(fish);
                    fish.active = false;
                    // let point: Laya.Sprite3D = M_Tool.GetDeepChildByName(fish, "point") as Laya.Sprite3D;
                    // let newRoot: Laya.Sprite3D = new Laya.Sprite3D;
                    // point.addChild(newRoot);
                    // newRoot.transform.localPosition = new Laya.Vector3(0, 0, 0);
                    // // newRoot.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                    // fish.parent.addChild(newRoot);
                    // newRoot.addChild(fish);
                    // newRoot.name = fish.name;
                    // newRoot.active = false;
                    // console.log(newRoot);
                    fish.transform.localPosition = new Laya.Vector3(0, 0, 0);
                    this.fishDic.Add(this.fishNameArr[i], fish);
                }
            }

            // console.log("鱼点内容加载完毕" + fishPointID, this.fishDic);
        }, false);
    }


    private ropeParent: Laya.Sprite3D;
    /**
     * 将鱼拿起来
     */
    public LayUpFish() {
        this.isStartJump = false;
        this.ropePointRigArr[1].isKinematic = true;
        this.ropePointRigArr[2].isKinematic = true;
        this.ropePointArr[1].transform.localPositionY += 5;
        this.ropePointArr[2].transform.localPositionY += 10;//网上体十米

        this.CtrlRoot.active = false;
        this.ropeParent.active = false;
    }





    private partIns: Laya.Particle2D;

    //开始跳
    private isStartJump: boolean = false;
    /**
     * 把鱼放下
     */
    public LayDownFish() {
        this.CtrlRoot.active = true;
        this.ropeParent.active = true;

        this.ropePointRigArr[1].isKinematic = false;
        this.ropePointRigArr[2].isKinematic = false;
        this.isStartJump = true;//开始跳


        
        // if (!this.partIns) {
        //     let partIns = new Laya.Particle2D(res_mrg.Instance.GetLayaRes(Will_Data.Instance.PanelPath.test));
        //     this.M_Image("succeed").addChild(partIns);
        //     // 开始发射粒子
        //     partIns.emitter.start();
        //     // 播放
        //     partIns.play();
        //     partIns.pos(524, 632);
        //     this.partIns = partIns;
        // }


        if (GameLocalStorage.Instance.beginnerStep == 1) {
            this.showFish(0);
            return;
        }

        let numberArr: NumArray = new NumArray(this.weightArr);
        let index = M_Tool.GetProRandomNum(numberArr);

        // console.log(index);
        this.showFish(index);

        // this.count++;
        // if (this.count == this.fishDic.count) {
        //     this.count = 0;
        // }
        // (<game_wnd>ui_mrg.Instance.GetUI(Table.WndName.game_wnd)).ResultPanel.ShoFishName(this.count);
    }

    private count: number = -1;

    private fishDic: Dictionary<string, Laya.Sprite3D> = new Dictionary;

    /**展示钓上来的鱼 */
    private showFish(fishIndex: number) {
        for (let i = 0; i < this.fishDic.count; i++) {
            this.fishDic.GetValueByIndex(i).active = false;
        }
        // console.log(this.fishNameArr[fishIndex]);

        // Laya.timer.once(1500, this, () => {
        // })
        (<game_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.game_wnd)).ResultPanel.ShowResult(true, this.fishIDArr[fishIndex]);
        // console.log("当前钓上来的鱼是" + this.fishNameArr[fishIndex]);
        this.currentFish = this.fishDic.GetValue(this.fishNameArr[fishIndex]);

        this.currentFish.active = true;
        let Animator = this.currentFish.getComponent(Laya.Animator);
        if (!Animator) {
            Animator = this.currentFish.addComponent(Laya.Animator);
            let animCtrl: Laya.AnimatorControllerLayer = new Laya.AnimatorControllerLayer("");
            (Animator as Laya.Animator).addControllerLayer(animCtrl);
            (Animator as Laya.Animator).getControllerLayer(0).addState(this.state);

        }
        (Animator as Laya.Animator).play("Take 001", 0);

    }

    /** 当前的鱼 */
    private currentFish: Laya.Sprite3D;
    private roteRandom: number = 20;
    onUpdate() {

        this.updateLine();

        let timer = Laya.timer.delta / 1000;
        if (this.isStartJump) {
            // console.log( (<Laya.Sprite3D>this.ropePointArr[2].getChildAt(0)));
            this.currentFish.transform.localRotationEulerY += timer * this.roteRandom;

            // this.ropePointArr[2].transform.localRotationEulerY += timer * 200;
        }

    }

    private init() {
        //绳子的点
        for (let i = 0; i < this.owner.numChildren; i++) {
            this.ropePointArr.push(this.owner.getChildAt(i) as Laya.Sprite3D);
            this.ropePointRigArr.push(this.ropePointArr[i].getComponent(Laya.Rigidbody3D));
        }
        this.fishPoint = this.ropePointArr[2];

        // this.ropePointArr[2].addComponent(waterTrigger);
        //设置一个约束节点
        this.setConfigurableConstraint(this.ropePointRigArr[0], this.ropePointRigArr[1]);
        this.setConfigurableConstraint(this.ropePointRigArr[1], this.ropePointRigArr[2]);
        // this.setConfigurableConstraint(this.ropePointRigArr[2], this.ropePointRigArr[3]);
        // this.setConfigurableConstraint(this.ropePointRigArr[3], this.ropePointRigArr[4]);


        (<Laya.Sprite3D>this.FishGear.ropePoint.getChildAt(0)).transform.localScale = new Laya.Vector3(0.02, 1, 0.02);


        this.ropeParent = new Laya.Sprite3D;
        this.FishGear.MainScene.addChild(this.ropeParent);
        for (let i = 0; i < 100; i++) {
            this.ropePoint_Arr.push(Laya.Sprite3D.instantiate(this.FishGear.ropePoint, this.ropeParent, true));
        }

        Laya.timer.loop(2000, this, () => {
            // console.log("给力");
            // this.ropePointRigArr[1].applyImpulse(new Laya.Vector3(5, 10, 0));
            if (!this.isStartJump) {
                return;
            }
            this.ropePointRigArr[2].applyImpulse(new Laya.Vector3(M_Tool.GetRandomNum(-5, 5), 10, 0));
            this.roteRandom = M_Tool.GetRandomNum(-20, 20);
        })

        this.LayUpFish();
    }




    /*************************************************  画线相关 */

    //#region 

    private bezierUtils: BezierUtils;

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

        configurableConstraint.anchor = new Laya.Vector3(0, -2, 0);
        configurableConstraint.connectAnchor = new Laya.Vector3(0, 0, 0);
        configurableConstraint.minLinearLimit = new Laya.Vector3(-3, -1, 0);
        configurableConstraint.maxLinearLimit = new Laya.Vector3(3, 1, 0);
        // configurableConstraint.minLinearLimit = new Laya.Vector3(0, 0, 0);
        // configurableConstraint.maxLinearLimit = new Laya.Vector3(0, 0, 0);
        configurableConstraint.XMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;//X轴上不限制
        configurableConstraint.YMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
        configurableConstraint.ZMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.angularXMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.angularYMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
        configurableConstraint.angularZMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        configurableConstraint.linearLimitSpring = new Laya.Vector3(100, 100, 100);
        configurableConstraint.linearDamp = new Laya.Vector3(10, 10, 10);

        // configurableConstraint.linearLimitSpring = new Laya.Vector3(0, 0, 0);
        // configurableConstraint.linearDamp = new Laya.Vector3(0, 0, 0);
    }


    public Jump() {
        if (!this.configurableConstraintArr[1]) {
            this.setConfigurableConstraint(this.ropePointRigArr[1], this.ropePointRigArr[2]);
        }
        this.configurableConstraintArr[0].anchor = new Laya.Vector3(0, -2, 0);
        this.configurableConstraintArr[0].connectAnchor = new Laya.Vector3(0, 0, 0);
        this.configurableConstraintArr[0].minLinearLimit = new Laya.Vector3(-3, 0, 0);
        this.configurableConstraintArr[0].maxLinearLimit = new Laya.Vector3(-3, 0, 0);
        this.configurableConstraintArr[0].XMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        this.configurableConstraintArr[0].YMotion = Laya.ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        return;
    }


    private pixeLine: Laya.PixelLineSprite3D;
    //画线
    private drawLine() {

        this.pixeLine = new Laya.PixelLineSprite3D(100);
        // this.mainScene.addChild(this.pixeLine);
        for (let i = 0; i < 50; i++) {
            this.pixeLine.addLine(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0), Laya.Color.RED, Laya.Color.RED);
        }
    }


    //#endregion

}