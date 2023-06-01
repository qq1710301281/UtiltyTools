import BuildingStorageData from "../../jqx/localStorage/BuildingStorageData";
import AnglerData from "../../public/dataSheet/AnglerData";
import AnglerLocalStorage from "../localStorage/AnglerLocalStorage";
import AnglerStorageData from "../localStorage/AnglerStorageData";
import IslandLocalStorage from "../localStorage/IslandLocalStorage";
import LLDataSheetManager from "../manager/LLDataSheetManager";
import GameConstants from "../other/GameConstants";

export default class LL_Data {

    public static get Instance(): LL_Data {
        if (!this.instance) {
            this.instance = new LL_Data;
            this.instance.initData();
        }
        return this.instance;
    }

    private static instance: LL_Data;

    //注意这两个集合中只包含首次加载的路径 其余的需要分布加载请在每个窗口中添加 
    /** 公开的Laya路径集合 */
    public AllLayaPath: Array<{}> = new Array;

    /** 公开的Unity路径集合 */
    public AllUnityPath: Array<{}> = new Array;

    public resetIslandUI:boolean = true;
    
    /**
     * 当前所在岛屿 ID
     */
    public currentIsLandID:number = 1;

    /**
     * 
     */
    public buildingStorageData:BuildingStorageData = null;

    /**
     * 调用单例的数据写在初始化数据这个方法中
     */
    private initData() {
  //初始化窗口路径
        for (const key in this.WndName) {
            this.WndPath[key] = `res/prefabs/ll/wnd/${this.WndName[key]}.prefab`;
        }
        let resCount:number = IslandLocalStorage.ins.selfIslands().length; // 以购买的岛屿
        let currentResCount: number = 0;
        let layaPathArr = {
            count1:[
                "res/atlas/res/image/ll/Map_wnd/map/isLand1.atlas",
                "res/atlas/res/image/ll/Building/island1.atlas",
                "res/atlas/res/image/public/itms.atlas",
                "res/atlas/res/image/ll/Angler.atlas",
                "res/atlas/res/image/ll/Building/ui.atlas",
                LL_Data.Instance.otherPath.building
            ],
            count2:[
                "res/atlas/res/image/ll/Map_wnd/map/isLand2.atlas",
                "res/atlas/res/image/ll/Building/island2.atlas"
            ],
            count3:[
                "res/atlas/res/image/ll/Map_wnd/map/isLand3.atlas",
                "res/atlas/res/image/ll/Building/island3.atlas",
            ],
            count4:[
                "res/atlas/res/image/ll/Map_wnd/map/isLand4.atlas",
                "res/atlas/res/image/ll/Building/island4.atlas",
            ],
            count5:[
                "res/atlas/res/image/ll/Map_wnd/map/isLand5.atlas",
                "res/atlas/res/image/ll/Building/island5.atlas",
            ]
        }
        let layaPathArr1={}
        for (const key in layaPathArr) {
            //分段加载控制
            if (currentResCount == resCount) {
                break;
            }
            for (let i = 0; i < layaPathArr[key].length; i++) {
                layaPathArr1[i+""]=layaPathArr[key][i] ;
            }
            currentResCount++;
        }
        this.AllLayaPath = [
            layaPathArr1,
            this.WndPath
        ];
    }

    /**
     * 窗口名字
     */
    public WndName = {
        Map_wnd: "Map_wnd",
        Island_wnd: "Island_wnd",
        AnglerClubs_wnd: "AnglerClubs_wnd"
    }

    /**
     * 窗口路径 可以自己手动写，也可以动态获取 在单例初始化中获得即可 但一定要是表结构方便外部拿取
     */
    public WndPath: {
        Map_wnd,
        Island_wnd,
        AnglerClubs_wnd
    } = {Map_wnd:"",Island_wnd:"",AnglerClubs_wnd:""};


    /**
    * 面板名字
    */
    public PanelName = {

    }

    /**
     * 面板路径 可以自己手动写，也可以动态获取 在单例初始化中获得即可 但一定要是表结构方便外部拿取
     */
    public PanelPath: {

    } = {};


    /**
    * 条名字
    */
    public BarName = {

    }

    /**
     * 条路径 可以自己手动写，也可以动态获取 在单例初始化中获得即可 但一定要是表结构方便外部拿取
     */
    public BarPath: {

    } = {};


    public otherPath={
        building:"res/prefabs/ll/other/Building.prefab",
    }

    /**
     * 获得当前岛屿 已解锁的钓手
     */
    public getUnlockAnglers(islandID:number):Array<AnglerData>
    {
        let building_id:number = LLDataSheetManager.ins.buildingDataSheet.getSpecialBuildingID(islandID, GameConstants.SPECIAL_BUILDING_TYPE_1);
        let anglersID:Array<number> = LLDataSheetManager.ins.anglerClubsDataSheet.getAnglersID(building_id);
        let anglerStorageDatas:Array<AnglerStorageData> = AnglerLocalStorage.ins.getAnglerStorageDatas();
        let anglerDatas:Array<AnglerData> = [];
        for(let i:number=0; i<anglerStorageDatas.length; i++)
        {
            for(let j:number=0; j<anglersID.length; j++)
            {
                if(anglerStorageDatas[i].lock == 0)
                {
                    if(anglerStorageDatas[i].id == anglersID[j])
                    {
                        let anglerData:AnglerData = LLDataSheetManager.ins.anglerDataSheet.getAnglerData(anglerStorageDatas[i].id);
                        if(anglerStorageDatas[i].emotion > anglerData.emotion_boundary)
                        {
                            anglerDatas.push(anglerData);
                        }
                    }
                }
            }
        }
        return anglerDatas;
    }

}