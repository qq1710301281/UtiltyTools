import EventDispatcher=Laya.EventDispatcher;

/**
 * 地图对外类
 */
export default class MapManager extends EventDispatcher
{
    /**
     * 当前所在岛屿 ID
     */
    public currentIsLandID:number = 1;

    private static instance:MapManager;



    constructor() { super(); }

    public static get ins():MapManager
    {
        if (!this.instance)
        {
            this.instance = new MapManager();
        }
        return this.instance;
    }

}