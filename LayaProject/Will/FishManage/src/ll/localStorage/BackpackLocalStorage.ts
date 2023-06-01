import GameLocalStorage from "../../public/localStorage/GameLocalStorage";
import ItemData from "../../public/dataSheet/ItemData";
import GameConstants from "../other/GameConstants";

export enum AssetName {
    金币 = 1,
    钻石,
    木头,
    金属,
    矿石,
    玉石,
    扳手,
    锤子,
}

/**
 * 背包存取
 */
export default class BackpackLocalStorage {

    /**
     * 
     */
    private static instance: BackpackLocalStorage = null;
    /**
     * 
     */
    private backpack: any = null;


    constructor() { }

    public static get ins(): BackpackLocalStorage {
        if (!this.instance) {
            this.instance = new BackpackLocalStorage();
            let backpack: any = GameLocalStorage.Instance.gameData.backpack;
            if (!backpack) {
                this.instance.backpack = {};
                this.instance.test(); // 正式版删除
                this.instance.ResetTaskItem();//任务初始化
                GameLocalStorage.Instance.gameData.backpack = this.instance.backpack;
                this.instance.save();
            }
            else {
                this.instance.backpack = backpack;
            }
        }

        return this.instance;
    }

    /**
     * 增加或者减少道具数量
     * @param itemID:number 道具 ID
     * @param count:number 数量 正数添加   负数减少
     */
    public changeItemCount(itemID: number, count: number): void {
        if (!this.backpack[itemID + ""]) {
            if (count > 0) {
                this.backpack[itemID + ""] = { num: count };
                this.save();
            }
        }
        else {
            let itemCount: number = this.backpack[itemID + ""].num + count;
            if (itemCount >= 0) {
                this.backpack[itemID + ""].num = itemCount;
                this.save();
            }
            else {
                this.backpack[itemID + ""].num = 0;
                this.save();
            }
        }
    }

    /**
     * 获得道具数量
     * @param itemID 
     */
    public getItemCount(itemID: number): number {
        let count: number = 0;
        if (this.backpack[itemID + ""]) {
            count = this.backpack[itemID + ""].num;
        }
        return count;
    }

    public GetMaterialItemArr() {
        let itemCountArr = [];
        for (const key in this.backpack) {
            if (+key > 2 && +key < 9) {
                itemCountArr.push(this.backpack[key].num);
            }
        }
        return itemCountArr
    }

       /**
     * 获得任务材料的表
     */
    public GetTaskItemArr(index: number) {
        let itemArr = {};
        for (const key in this.backpack) {
            if (+key > 8 && +key < 18) {
                itemArr[key] = this.backpack[key][index];
            }
        }
        return itemArr;
    }

    public SetTaskItem(index: number, itemID: number, count: number) {
        this.backpack[itemID + ""][index] = count;
        this.save();
    }


    private save(): void {
        GameLocalStorage.Instance.gameData.backpack = this.backpack;
        GameLocalStorage.Instance.save();
    }

    private test(): void {
        this.backpack = {
            "3": { num: 900000 },
            "4": { num: 900000 },
            "5": { num: 900000 },
            "6": { num: 900000 },
            "7": { num: 900000 },
            "8": { num: 900000 },
            // "9": { num: 100000 }
        }
    }

     /**
     * 重置任务对象
     */
    public ResetTaskItem() {
        for (let i = 9; i < 18; i++) {
            this.backpack[`${i}`] = [-1, -1, -1];
        }
    }
}