
import scene3DCtrl from "./scene3DCtrl";

/**
 * 添加到3D场景上的脚本用来控制整个游戏的3D物体
 */
export default class scene3DObj extends Laya.Script {

    constructor() { super(); }

    //主场景
    public MainScene: Laya.Scene3D;

    public Scene3DCtrl: scene3DCtrl;

    public CtrlRoot: Laya.Sprite3D;

    public Transform: Laya.Transform3D;

    public Init(scene3DCtrl: scene3DCtrl) {
        this.Scene3DCtrl = scene3DCtrl;
        this.MainScene = this.Scene3DCtrl.MainScene;
        this.CtrlRoot = this.owner as Laya.Sprite3D;
        this.Transform = this.CtrlRoot.transform;
    }
}