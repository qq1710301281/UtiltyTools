import { Input, KeyCode } from "../../public/core/Game/InputManager";
import M_Tool from "../../public/core/Toos/M_Tool";
import scene3DCtrl from "./scene3DCtrl";
import scene3DObj from "./scene3DObj";

export default class rubbish extends scene3DObj {

    constructor() { super(); }

    private rubbishArr: Array<Laya.Sprite3D> = new Array();

    private rubbishRoot: Laya.Sprite3D;

    private randomZArr = [];
    private nomalXArr = [];
    private nomalYArr = [];

    private speedArr = [];
    private countYArr = [];


    public Init(scene3DCtrl: scene3DCtrl) {
        super.Init(scene3DCtrl);

        for (let i = 0; i < this.owner.numChildren; i++) {
            this.owner.getChildAt(i).name = "RubishObj";
            this.rubbishArr.push(this.owner.getChildAt(i) as Laya.Sprite3D);
        }

        //克隆三套并添加到这个集合中
        for (let i = 0; i < 3; i++) {
            for (let l = 0; l < 4; l++) {
                this.rubbishArr.push(Laya.Sprite3D.instantiate(this.rubbishArr[l], this.owner));
            }
        }

        this.rubbishRoot = this.Scene3DCtrl.MainScene.getChildByName("RubbishRoot") as Laya.Sprite3D;
        // console.log("+++++++" + (<Laya.Sprite3D>this.rubbishRoot.getChildAt(0).getChildAt(0)).transform.position.x);
        for (let i = 0; i < 4; i++) {
            this.randomZArr.push((this.rubbishRoot.getChildAt(i) as Laya.Sprite3D).transform.position.z);

        }
        this.nomalXArr = [(<Laya.Sprite3D>this.rubbishRoot.getChildAt(0)).transform.position.x, (<Laya.Sprite3D>this.rubbishRoot.getChildAt(4)).transform.position.x];

        this.nomalYArr = [(<Laya.Sprite3D>this.rubbishRoot.getChildAt(5)).transform.position.y, (<Laya.Sprite3D>this.rubbishRoot.getChildAt(6)).transform.position.y];

        for (let i = 0; i < this.rubbishArr.length; i++) {
            this.setRandomPos(i);
        }
    }

    public RestartRubbish(isShow: boolean = true) {
        this.IsShow = isShow;
        for (let i = 0; i < this.rubbishArr.length; i++) {
            this.setRandomPos(i);
        }
    }

    //给鱼设置一个随机的位置
    private setRandomPos(index: number) {
        this.countYArr[index] = 1;
        this.rubbishArr[index].active = true;
        this.speedArr[index] = M_Tool.GetRandomNum(5, 20);
        let z0 = M_Tool.GetRandomNum(0, 1);
        let z1 = M_Tool.GetRandomNum(this.randomZArr[z0 == 0 ? 0 : 2], this.randomZArr[z0 == 0 ? 1 : 3]);
        this.rubbishArr[index].transform.position = new Laya.Vector3(this.nomalXArr[0], this.nomalYArr[0], z1);
    }

    public IsShow: boolean = true;
    onUpdate() {

        // if (Input.getKeyDown(KeyCode.R)) {

        //     this.RestartRubbish(false);
        // }
        // if (Input.getKeyDown(KeyCode.T)) {

        //     this.RestartRubbish();
        // }

        if (!this.IsShow) {
            return;
        }

        let timer = Laya.timer.delta / 1000;
        for (let i = 0; i < this.rubbishArr.length; i++) {

            let targetY = this.rubbishArr[i].transform.position.y += 0.02 * this.countYArr[i];
            if (targetY > this.nomalYArr[1] || targetY < this.nomalYArr[0]) {
                this.countYArr[i] = -this.countYArr[i];
            }

            this.rubbishArr[i].transform.position = new Laya.Vector3(this.rubbishArr[i].transform.position.x - timer * this.speedArr[i], targetY, this.rubbishArr[i].transform.position.z);

            if (this.rubbishArr[i].transform.position.x < this.nomalXArr[1]) {
                this.setRandomPos(i);
            }
        }
        // console.log(this.rubbishArr[0].transform.position.x);

    }
}