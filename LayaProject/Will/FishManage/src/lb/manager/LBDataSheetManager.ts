import DataManager, { Table } from "../../public/core/Data/DataManager";
import FishDataSheet from "../../public/dataSheet/FishDataSheet";
import happyCityDataSheet from "../../public/dataSheet/happyCityDataSheet";
import TigerDataSheet from "../../public/dataSheet/TigerDataSheet";
import underwaterDataSheet from "../../public/dataSheet/underwaterDataSheet";
import EventDispatcher=Laya.EventDispatcher;

/**
 * 配置表管理类
 */
export default class LBDataSheetManager extends EventDispatcher
{

    //娱乐城表
    public happyCityDataSheet:happyCityDataSheet = null;

    //老虎机表
    public TigerDataSheet:TigerDataSheet = null;

    //海底世界表
    public underwater:underwaterDataSheet = null;

    //鱼表
    public Fish:FishDataSheet = null;

    private static instance:LBDataSheetManager;


    constructor() { super(); }

    public static get ins():LBDataSheetManager
    {
        if (!this.instance)
        {
            this.instance = new LBDataSheetManager();
            this.instance.happyCityDataSheet = new happyCityDataSheet(DataManager.Instance.GetJson(Table.Json.happyCity));
            this.instance.TigerDataSheet = new TigerDataSheet(DataManager.Instance.GetJson(Table.Json.Tiger));
            this.instance.underwater = new underwaterDataSheet(DataManager.Instance.GetJson(Table.Json.underwater));
            this.instance.Fish = new FishDataSheet(DataManager.Instance.GetJson(Table.Json.Fish));
        }
        return this.instance;
    }

}