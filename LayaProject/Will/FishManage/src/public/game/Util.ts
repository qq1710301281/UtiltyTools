import res_mrg from "../manager/res_mrg";

export class Util {

    /**
     * 获得预制体
     * @param prefabPath 预制体路径
     */
    public static GetPrefab(prefabPath: string): Laya.Sprite {
        return (res_mrg.Instance.GetLayaRes(prefabPath) as Laya.Prefab).create() as Laya.Sprite;
    }

    /**
     * 获得3D预制体
     * @param prefabPath 
     */
    public static Get3DModel(prefabPath: string): Laya.Sprite3D {
        return res_mrg.Instance.GetUnityRes(prefabPath) as Laya.Sprite3D;
    }

}