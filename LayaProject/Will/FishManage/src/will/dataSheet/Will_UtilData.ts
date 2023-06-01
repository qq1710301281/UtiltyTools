import BuildingStorageData from "../../jqx/localStorage/BuildingStorageData";
import IslandLocalStorage from "../../ll/localStorage/IslandLocalStorage";
import AnglerData from "../../public/dataSheet/AnglerData";
import BuildingData from "../../public/dataSheet/BuildingData";

export default class Will_UtilData {

    private static instance: Will_UtilData;

    public static get Instance(): Will_UtilData {
        if (!this.instance) {
            this.instance = new Will_UtilData


        }
        return this.instance;
    }

    /**
     * 玩家的等级
     */
    public PlayerGrade: number = 50;

    /**
     * 小岛数量
     */
    public IslandCount: number = 3;


    /**
     * 钓鱼难度
     */
    public FishDifficulty: number = 1;

    /**
     * 餐厅等级集合
     */
    public RestGradeArr = [0, 0, 0];

    /** 从海上打开图鉴 */
    public IsGoToSeaOfBook: boolean = false;


    public BuildingData: BuildingStorageData;

}