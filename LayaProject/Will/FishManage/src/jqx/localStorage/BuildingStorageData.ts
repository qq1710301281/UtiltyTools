/**
 * 建筑升级数据
 */
export default class BuildingStorageData
{
    /**
     * 所属岛屿 ID
     */
    public isLand_id:number = 0;
    /**
     * 建筑 ID
     */
    public building_id: number = 0;
    /**
	 * 类型
	 * 1 功能建筑
	 * 2 普通建筑
	 * 3 特殊建筑
	 */
    public type: number = 0;
    /**
     * 建筑等级
     */
    public level: number = 0;



    constructor() {}

    
}