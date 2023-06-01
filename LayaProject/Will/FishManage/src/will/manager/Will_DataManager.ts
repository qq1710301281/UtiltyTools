import DataManager, { Table } from "../../public/core/Data/DataManager";
import FishpointDataSheet from "../../public/dataSheet/FishpointDataSheet";
import OrderDataSheet from "../../public/dataSheet/OrderDataSheet";
import TowerRestaurantDataSheet from "../../public/dataSheet/TowerRestaurantDataSheet";

export default class Will_DataManager {

    private static instance: Will_DataManager;

    public static get Instance(): Will_DataManager {
        if (!this.instance) {
            this.instance = new Will_DataManager;
            this.instance.FishPointDataSheet = new FishpointDataSheet(DataManager.Instance.GetJson(Table.Json.Fishpoint));
            this.instance.OrderDataSheet = new OrderDataSheet(DataManager.Instance.GetJson(Table.Json.Order));
            this.instance.TowerRestaurantDataSheet = new TowerRestaurantDataSheet(DataManager.Instance.GetJson(Table.Json.TowerRestaurant));
        }
        return this.instance;
    }

    public FishPointDataSheet: FishpointDataSheet;
    public OrderDataSheet: OrderDataSheet;
    public TowerRestaurantDataSheet: TowerRestaurantDataSheet;

}