import scene3DCtrl from "./scene3DCtrl";
import scene3DObj from "./scene3DObj";

export default class blue extends scene3DObj {

    constructor() { super(); }

    private blue: Laya.Sprite3D;

    public blueWaterDown: Laya.Sprite3D;//出水的的水花特效

    // public blueWaterMove: Laya.Sprite3D;//移动的水花特效

    public Init(scene3DCtrl: scene3DCtrl) {
        super.Init(scene3DCtrl);

        this.blue = this.owner as Laya.Sprite3D;
        this.blueCtrl();
    }

    private blueCtrl() {
        this.blueWaterDown = this.blue.getChildByName("waterDown") as Laya.Sprite3D;
        // this.blueWaterMove = this.blue.getChildByName("waterMove") as Laya.Sprite3D;
        // console.log(this.blueWaterDown);
        let material: Laya.UnlitMaterial = (this.blue.getChildByName("blueBowen") as Laya.MeshSprite3D).meshRenderer.material as Laya.UnlitMaterial;
        let isUP: boolean = false;
        Laya.timer.frameLoop(2, this, () => {
            let timer = Laya.timer.delta / 1000;
            material.tilingOffsetZ += timer * 0.2;
            // console.log( material.tilingOffsetW);
            material.tilingOffsetW += timer * 0.05 * (isUP ? 1 : -1);
            // console.log(material.tilingOffsetY);
            if (material.tilingOffsetW > 1 || material.tilingOffsetW < -1) {
                isUP = !isUP;
            }
            // console.log(material.tilingOffsetX);
            // if (material.tilingOffsetX > 35) {
            //     material.tilingOffsetX = 0;
            // }
            // material.tilingOffsetY += timer * 0.1;
        })

        // console.log(material.tilingOffsetX);
    }
}