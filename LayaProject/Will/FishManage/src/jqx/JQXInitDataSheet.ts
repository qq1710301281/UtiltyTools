import BuildingDataSheet from "../public/dataSheet/BuildingDataSheet";
import DataManager, { Table } from "../public/core/Data/DataManager";

export default class JQXInitDataSheet {

    private static instance: JQXInitDataSheet = null;
    public buildingDatasheet: BuildingDataSheet = null;
    
    constructor() { }
    public static get ins(): JQXInitDataSheet {
        if (!this.instance) {
            this.instance = new JQXInitDataSheet();
            this.instance.buildingDatasheet = new BuildingDataSheet(DataManager.Instance.GetJson(Table.Json.Building));
        }
        return this.instance;
    }
}