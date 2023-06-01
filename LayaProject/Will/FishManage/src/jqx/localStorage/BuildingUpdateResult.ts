import BuildingStorageData from "./BuildingStorageData";

/**
 * 建筑升级结果
 */
export default class BuildingUpdateResult
{
    /**
     * 建筑升级错误代码
     * 0 升级建筑成功
     * 1 玩家等级不够
     * 2 货币不够
     * 3 资源不够
     */
    public errorCode:number = 0;
    /**
     * 建筑升级数据
     */
    public buildingStorageData:BuildingStorageData = null;



    constructor() {}

}