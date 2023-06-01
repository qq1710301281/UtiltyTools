import IslandData from "../../public/dataSheet/IslandData";
import assetLocalStorage from "../../public/localStorage/assetLocalStorage";
import GameLocalStorage from "../../public/localStorage/GameLocalStorage";
import Will_UtilData from "../../will/dataSheet/Will_UtilData";
import LLDataSheetManager from "../manager/LLDataSheetManager";
import GameUtils from "../other/GameUtils";
import IslandLocalStorageData from "./IslandLocalStorageData";

/**
 * 世界地图岛屿状态存取
 */
export default class IslandLocalStorage
{
    /**
     * 
     */
    private static instance: IslandLocalStorage = null;
    /**
     * 
     */
    private islands:Array<{id:number,buy:number}> = [];



    constructor() {}
    
    public static get ins(): IslandLocalStorage
    {
        if (!this.instance)
        {
            this.instance = new IslandLocalStorage();
            let tempIslands: any = GameLocalStorage.Instance.gameData.islands;
            if (!tempIslands)
            {
                let islandsData:Array<IslandData> = LLDataSheetManager.ins.islandDataSheet.getIslandDatas();
                for(let i:number=0; i<islandsData.length; i++)
                {
                    this.instance.islands.push({id:islandsData[i].id, buy:islandsData[i].buy});
                }
                this.instance.save();
            }
            else
            {
                this.instance.islands = tempIslands;
            }
        }
        return this.instance;
    }

    /**
     * 获得所有岛屿
     */
    public islandLocalStorage():Array<IslandLocalStorageData>
    {
        let array:Array<IslandLocalStorageData> = [];
        for(let i:number=0; i<this.islands.length; i++)
        {
            let islandLocalStorageData:IslandLocalStorageData = new IslandLocalStorageData();
            islandLocalStorageData.id = this.islands[i].id;
            islandLocalStorageData.buy = this.islands[i].buy;
            array.push(islandLocalStorageData);
        }
        return array;
    }

    /**
     * 购买岛屿
     * @param id:number 岛屿 ID
     * @return number 0 失败   1 成功
     */
    public buyIsland(id:number):number
    {
        let buyType:number = 0;
        let islandData:IslandData = LLDataSheetManager.ins.islandDataSheet.getIslandData(id);
        if(islandData)
        {
            for(let i:number=0; i<this.islands.length; i++)
            {
                if(this.islands[i].id == id)
                {
                    let conditions1:boolean = assetLocalStorage.Instance.coin > islandData.coin;
                    let conditions2:boolean = assetLocalStorage.Instance.gem > islandData.diamond;
                    if(conditions1 && conditions2)
                    {
                        this.islands[i].buy = 1;
                        Will_UtilData.Instance.IslandCount = this.selfIslands().length;
                        this.save();
                        GameUtils.showFlyText("恭喜您开启了"+islandData.name+"!", "#ff0000", 36);
                        buyType = 1;
                        break;
                    }
                    else
                    {
                        GameUtils.showFlyText("货币不够,不能购买!", "#ff0000", 36);
                        break;
                    }
                }
            }
        }
        return buyType;
    }

    /**
     * 获得已购买的小岛
     */
    public selfIslands():Array<IslandLocalStorageData>
    {
        let array:Array<IslandLocalStorageData> = [];
        for(let i:number=0; i<this.islands.length; i++)
        {
            if(this.islands[i].buy)
            {
                let islandLocalStorageData:IslandLocalStorageData = new IslandLocalStorageData();
                islandLocalStorageData.id = this.islands[i].id;
                islandLocalStorageData.buy = this.islands[i].buy;
                array.push(islandLocalStorageData);
            }
        }
        return array;
    }

    /**
     * 获得指定岛屿是否是自己的
     * @param island_id 
     */
    public getIslandsIsSelf(island_id:number):boolean
    {
        let isSelf:boolean = false;
        for(let i:number=0; i<this.islands.length; i++)
        {
            if(this.islands[i].id == island_id)
            {
                if(this.islands[i].buy)
                {
                    isSelf = true;
                    break;
                }
            }
        }
        return isSelf;
    }

    /**
     * 获得指定岛屿数据
     * @param id:number 岛屿 ID
     */
    public getIslandLocalStorageData(id:number):IslandLocalStorageData
    {
        let islandLocalStorageData:IslandLocalStorageData = new IslandLocalStorageData();
        for(let i:number=0; i<this.islands.length; i++)
        {
            if(this.islands[i].id == id)
            {
                islandLocalStorageData.id = this.islands[i].id;
                islandLocalStorageData.buy = this.islands[i].buy;
            }
        }
        return islandLocalStorageData;
    }

    private save():void
    {
        GameLocalStorage.Instance.gameData.islands = this.islands;
        GameLocalStorage.Instance.save();
    }

}