import res_mrg, { M_Path } from "../../managers/res_mrg";

export default class Pool {
    constructor() { }
    public _list: Array<Laya.Sprite> = new Array<Laya.Sprite>();
    //产出
    public Spawn(objName: string): Laya.Sprite {
        var result: Laya.Sprite;
        if (this._list.length > 0) {
            result = this._list.pop();
            result.visible = true;
            Laya.stage.addChild(result);
        }
        else {
            result = (res_mrg.Instance.GetLayaRes(M_Path.PoolObjPathDir.TryGetValue(objName)) as Laya.Prefab).create() as Laya.Sprite;
            result.visible = false;
            result.visible = true;
        }

        return result;
    }
    //回收
    public Recycle(target: Laya.Sprite) {
        // console.log(target.name);
        target.visible = false;
        this._list.push(target);
    }
}