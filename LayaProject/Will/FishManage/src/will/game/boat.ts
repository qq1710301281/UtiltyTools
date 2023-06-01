import LB_LocalData from "../../lb/localStorage/LB_LocalData";
import LL_Data from "../../ll/dataSheet/LL_Data";
import AnglerClubsLocalStorage from "../../ll/localStorage/AnglerClubsLocalStorage";
import AnglerClubsStorageData from "../../ll/localStorage/AnglerClubsStorageData";
import AnglerLocalStorage from "../../ll/localStorage/AnglerLocalStorage";
import LLDataSheetManager from "../../ll/manager/LLDataSheetManager";
import { Input, KeyCode } from "../../public/core/Game/InputManager";
import AnglerData from "../../public/dataSheet/AnglerData";
import { Util } from "../../public/game/Util";
import res_mrg from "../../public/manager/res_mrg";
import Will_Data from "../dataSheet/Will_Data";
import Will_DataManager from "../manager/Will_DataManager";
import scene3DCtrl from "./scene3DCtrl";
import scene3DObj from "./scene3DObj";

/**
 * 船
 */
export default class boat extends scene3DObj {

    constructor() { super(); }

    public Init(scene3DCtrl: scene3DCtrl) {
        super.Init(scene3DCtrl);
    }

    private boat: Laya.Sprite3D;
    onUpdate() {

    }

    // private boatName
    /**
     * 加载资源 
     */
    public LoadRes(regionID: number, nameArr: string[]) {
        let unityPathArr: Array<string> = new Array;

        //预加载船只
        // let regionName: string = LLDataSheetManager.ins.regionDataSheet.getRegionData(regionID).name;
        let regionName: string = Will_Data.Instance.AreaName[regionID - 1];


        let boatPath: string = Will_Data.Instance.AreaUnityPath[regionID - 1];
        unityPathArr.push(boatPath);


        //预加载角色
        // console.log(anglerArr);
        // for (let i=0; i<anglerArr.length; i++) {

        // }


        for (let i = 0; i < nameArr.length; i++) {
            let rolePath: string = `res/res3D/LayaScene_Role/Conventional/${nameArr[i]}.lh`;
            unityPathArr.push(rolePath);
        }


        // console.log("止行了++++++");
        res_mrg.Instance.PreloadResPkg([], unityPathArr, () => {
            // console.log("船的节点的数量", this.owner, +this.owner.getChildByName(regionName).numChildren);
            // console.log(regionName, this.owner);

            // for (let i = 0; i < this.owner.numChildren; i++) {
            //     this.owner.getChildAt(i).active = false;
            // }
            // this.owner.getChildByName(regionName).active = true;
            if (this.owner.getChildByName("boatRoot").getChildAt(6)) {
                this.owner.getChildByName("boatRoot").getChildAt(6).destroy();
            }
            let boat = Laya.Sprite3D.instantiate(Util.Get3DModel(boatPath), this.owner.getChildByName("boatRoot"));
            // this.owner.getChildByName("boatRoot").addChild(boat);
            boat.transform.localPosition = new Laya.Vector3(0, 0, 0);
            boat.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
            boat.transform.localRotation = new Laya.Quaternion(0, 0, 0, 0);

            for (let i=0; i<this.owner.getChildByName("boatRoot").numChildren-1; i++) {
                let roleRoot = this.owner.getChildByName("boatRoot").getChildAt(i);
                roleRoot.destroyChildren();
            }

            for (let i = 0; i < unityPathArr.length - 1; i++) {
                let roleRoot = this.owner.getChildByName("boatRoot").getChildAt(i);
                // roleRoot.destroyChildren();
                // console.log(unityPathArr[i + 1]);
                let role = Laya.Sprite3D.instantiate(Util.Get3DModel(unityPathArr[i + 1]), roleRoot);
                // console.log(i);
                // roleRoot.addChild(role);
                role.transform.localPosition = new Laya.Vector3(0, 0, 0);
                role.transform.rotationEuler = new Laya.Vector3(0, 0, 0);
                role.transform.localRotation = new Laya.Quaternion(0, 0, 0, 0);
            }

        }, false);
    }


}