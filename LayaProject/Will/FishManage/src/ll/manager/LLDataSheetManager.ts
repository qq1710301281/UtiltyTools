import CinemaDataSheet from "../../public/dataSheet/CinemaDataSheet";
import DataManager, { Table } from "../../public/core/Data/DataManager";
import AnglerClubsDataSheet from "../../public/dataSheet/AnglerClubsDataSheet";
import AnglerDataSheet from "../../public/dataSheet/AnglerDataSheet";
import BuildingDataSheet from "../../public/dataSheet/BuildingDataSheet";
import IslandDataSheet from "../../public/dataSheet/IslandDataSheet";
import ItemDataSheet from "../../public/dataSheet/ItemDataSheet";
import LevelDataSheet from "../../public/dataSheet/LevelDataSheet";
import RegionDataSheet from "../../public/dataSheet/RegionDataSheet";
import EventDispatcher=Laya.EventDispatcher;

/**
 * 配置表管理类
 */
export default class LLDataSheetManager extends EventDispatcher
{

    public buildingDataSheet:BuildingDataSheet = null;
    public islandDataSheet:IslandDataSheet = null;
    public itemDataSheet:ItemDataSheet = null;
    public levelDataSheet:LevelDataSheet = null;
    public regionDataSheet:RegionDataSheet = null;
    public anglerDataSheet:AnglerDataSheet = null;
    public anglerClubsDataSheet:AnglerClubsDataSheet = null;
    public cinemaDataSheet:CinemaDataSheet=null

    private static instance:LLDataSheetManager;



    constructor() { super(); }

    public static get ins():LLDataSheetManager
    {
        if (!this.instance)
        {
            this.instance = new LLDataSheetManager();
            this.instance.islandDataSheet = new IslandDataSheet(DataManager.Instance.GetJson(Table.Json.Island));
            this.instance.regionDataSheet = new RegionDataSheet(DataManager.Instance.GetJson(Table.Json.Region));
            this.instance.itemDataSheet = new ItemDataSheet(DataManager.Instance.GetJson(Table.Json.Item));
            this.instance.levelDataSheet = new LevelDataSheet(DataManager.Instance.GetJson(Table.Json.Level));
            this.instance.buildingDataSheet = new BuildingDataSheet(DataManager.Instance.GetJson(Table.Json.Building));
            this.instance.anglerDataSheet = new AnglerDataSheet(DataManager.Instance.GetJson(Table.Json.Angler));
            this.instance.anglerClubsDataSheet = new AnglerClubsDataSheet(DataManager.Instance.GetJson(Table.Json.AnglerClubs));
            this.instance.cinemaDataSheet = new CinemaDataSheet(DataManager.Instance.GetJson(Table.Json.Cinema));
        }
        return this.instance;
    }

}