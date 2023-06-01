import LL_Data from "../../ll/dataSheet/LL_Data";
import BackpackLocalStorage from "../../ll/localStorage/BackpackLocalStorage";
import LLDataSheetManager from "../../ll/manager/LLDataSheetManager";
import GameLocalStorage from "../../public/localStorage/GameLocalStorage";

/**
 * 本地数据
 */
export default class Will_LocalData {

    private static instance: Will_LocalData;

    public static get Instance(): Will_LocalData {
        if (!this.instance) {
            this.instance = new Will_LocalData;
            this.instance.initData();
        }
        return this.instance;
    }

    private _goToSeaData = {};//出海数据

    private _orderIDArr = [];//订单ID集合

    private _orderIsMadeArr = [];//订单制作集合

    private initData() {
        let goToSeaData: any = GameLocalStorage.Instance.gameData.goToSeaData;
        // console.log(goToSeaData);
        if (!goToSeaData) {
            for (let i = 0; i < 5; i++) {
                this._goToSeaData[(i + 1).toString()] = 5 * i + 1;
            }
            this._orderIDArr = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
            this._orderIsMadeArr = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
            this.save()
        }
        else {
            this._goToSeaData = goToSeaData;
            this._orderIDArr = GameLocalStorage.Instance.gameData.orderIDArr;
            this._orderIsMadeArr = GameLocalStorage.Instance.gameData.orderIsMadeArr;
        }
    }

    /**
     * 改变菜单集合
     * @param index 
     * @param arr 
     */
    public ChangeOrderIsMadeArr(index: number, arr: number[]) {
        this._orderIsMadeArr[index] = arr;
        this.save();
    }

    /**
     * 获得当前餐厅的完成订单数
     * @param index 
     */
    public GetMadeCout(index: number) {
        let count: number = 0;
        // console.log(this._orderIsMadeArr);
        for (let i = 0; i < this._orderIsMadeArr[index].length; i++) {
            if (this._orderIsMadeArr[index][i] == 1) {
                count += 1;
            }
        }

        return count;
    }

    /**
     * 改变某个菜单的制作情况
     * @param restIndex 
     * @param orderIndex 
     */
    public ChangeOrderIsMade(restIndex: number, orderIndex: number) {
        this._orderIsMadeArr[restIndex][orderIndex] = 1;
        this.save();
    }

    /**
     * 获取菜单的集合
     * @param index 餐厅索引
     */
    public GetOrderrIsMadeArr(index: number): number[] {
        return this._orderIsMadeArr[index];
    }

    /**
     * 改变菜单集合
     * @param index 
     * @param arr 
     */
    public ChangeOrderArr(index: number, arr: number[]) {
        this._orderIDArr[index] = arr;
        this.save();
    }

    /**
     * 获取菜单的集合
     * @param index 餐厅索引
     */
    public GetOrderArr(index: number): number[] {
        return this._orderIDArr[index];
    }

    /**
     * 通过小岛ID获得对应的鱼点ID
     */
    public GetFishPointID(regionID: number) {
        return this._goToSeaData[regionID.toString()];
    }

    /**
     * 设置某个小岛ID的鱼点ID
     * @param regionID 小岛ID
     * @param fishPointID 鱼点ID
     */
    public SetFishPointID(regionID: number, fishPointID: number) {
        this._goToSeaData[regionID.toString()] = fishPointID;
        this.save();
    }

    private save() {
        GameLocalStorage.Instance.gameData.goToSeaData = this._goToSeaData;
        GameLocalStorage.Instance.gameData.orderIDArr = this._orderIDArr;
        GameLocalStorage.Instance.gameData.orderIsMadeArr = this._orderIsMadeArr;
        GameLocalStorage.Instance.save();
    }

}