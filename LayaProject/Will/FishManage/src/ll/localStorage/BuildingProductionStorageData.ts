export default class BuildingProductionStorageData
{
    /**
     * 岛屿 ID
     */
    public isLand_id:number = 0;
    /**
     * 建筑 ID
     */
    public building_id:number = 0;
    /**
     * 产出总时间
     */
    public productionAllTime:number = 0;
    /**
     * 上一次产出时间点
     */
    public oldProductionTime:number = 0;
    /**
     * 停止生产时长 2 小时 4 小时 6 小时
     */
    public stopProductionTime:number = 0;
    /**
     * 建筑产出 金币数量
     */
    public production_gold_coins:number = 0;
    /**
     * 是否停止生产 1 停止生产   0 继续生产
     */
    public stopProduction:number = 0;



    constructor() {}



}