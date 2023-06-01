import scene3DCtrl from "./scene3DCtrl";
import scene3DObj from "./scene3DObj";

export default class cloud extends scene3DObj {


    constructor() { super(); }

    private cloudF: Laya.Sprite3D;
    private cloudFSpeed: number = 2;
    private cloudB: Laya.Sprite3D;
    private cloudBSpeed: number = 1;

    public Init(scene3DCtrl: scene3DCtrl) {
        super.Init(scene3DCtrl);

        this.cloudF = this.owner.getChildAt(0) as Laya.Sprite3D;
        this.cloudB = this.owner.getChildAt(1) as Laya.Sprite3D;
    }


    onUpdate() {
        let timer = Laya.timer.delta/1000;

        this.cloudF.transform.localPositionX -= timer * this.cloudFSpeed;
        this.cloudB.transform.localPositionX -= timer * this.cloudBSpeed;

    }
}