import LLDataSheetManager from "../../ll/manager/LLDataSheetManager";
import CinemaData from "../../public/dataSheet/CinemaData";
import CinemaConstants from "../other/CinemaConstants";
import CinemaLocalStorageData from "./CinemaLocalStorageData";
import LocalStorage = Laya.LocalStorage;


export default class CinemaStorageData {
    private static instance: CinemaStorageData = null;
    private cinemaStorageData: Array<{ building_id: number, id: number, film_length: number, isTurue: boolean }> = [];
    /**
 * 唯一的名字
 */
    private LOCAL_STORAGE_NAME: string = "f37be69b-7443-5b96-b39b-170f4e806e9b_will"; // -V2.0-DEMO-CinemaStorage
    constructor() { }
    public static get ins(): CinemaStorageData {
        if (!this.instance) {
            this.instance = new CinemaStorageData;
            let tempBuildingsData: any = LocalStorage.getJSON(this.instance.LOCAL_STORAGE_NAME);
            if (!tempBuildingsData) {
                let cinemaDatas: Array<CinemaData> = LLDataSheetManager.ins.cinemaDataSheet.getCinemaDatas();
                for (let i: number = 0; i < cinemaDatas.length; i++) {
                    let cinemasData: CinemaData = cinemaDatas[i];
                    this.instance.cinemaStorageData.push(
                        {
                            building_id: cinemasData.building_id,
                            id: cinemasData.id,
                            film_length: cinemasData.film_length * (CinemaConstants.CINEMA_FILM_TIME_SECOND),
                            isTurue: false
                        }
                    );
                }
                this.instance.save();
               
            }
            else {
                this.instance.cinemaStorageData = tempBuildingsData;
            }
        }
        return this.instance;
    }

    /**
     * 获取所有影城数据
     * @param id 海岛影城ID
     */
    public getCinemaTimerByBuildingsID(): Array<CinemaLocalStorageData> {
        let cinemaLocalStorageDatas:Array<CinemaLocalStorageData> = [];
        for (let i = 0; i < this.cinemaStorageData.length; i++) {
            let cinemaLocalStorageData:CinemaLocalStorageData = new CinemaLocalStorageData();
            cinemaLocalStorageData.building_id = this.cinemaStorageData[i].building_id;
            cinemaLocalStorageData.film_length = this.cinemaStorageData[i].film_length;
            cinemaLocalStorageData.id = this.cinemaStorageData[i].id;
            cinemaLocalStorageData.isTurue = this.cinemaStorageData[i].isTurue;
            cinemaLocalStorageDatas.push(cinemaLocalStorageData);
        }
        return cinemaLocalStorageDatas;
    }

    /**修改状态 */
    setStatus(index: number, building_id:number, bool: boolean = true): number {
        let finalIndex:number = 0;
        let tempIndex:number = 0;
        for (let i = 0; i < this.cinemaStorageData.length; i++) {
            if(this.cinemaStorageData[i].building_id == building_id)
            {
                tempIndex = i;
                break;
            }
        }
        finalIndex = tempIndex + index;
        this.cinemaStorageData[finalIndex].isTurue = bool;
        this.save();
        return finalIndex;
    }

    /**
     * 获得影城索引是否属于当前建筑
     * @param building_id 
     * @param index 
     */
    public inBuilding(building_id:number, index:number):boolean
    {
        let inArray:boolean = false;
        for (let i = 0; i < this.cinemaStorageData.length; i++) {
            if(this.cinemaStorageData[i].building_id == building_id)
            {
                if(index == i)
                {
                    inArray = true;
                    break;
                }
            }
        }
        return inArray;
    }

    /**
     * 获得当前建筑 影城起始索引
     * @param building_id 
     */
    public getStarIndex(building_id:number):number
    {
        let starIndex:number = 0;
        for (let i = 0; i < this.cinemaStorageData.length; i++) {
            if(this.cinemaStorageData[i].building_id == building_id)
            {
                starIndex = i;
                break;
            }
        }
        return starIndex;
    }

    /**
     * 更新
     * @ i  类型
     * @ num 时间
     */
    saveitemById(list: any[]): void {
        for (let i = 0; i < this.cinemaStorageData.length; i++) {
            this.cinemaStorageData[i].film_length = list[i];
        }

        this.save();
    }

    private save(): void {
        LocalStorage.setJSON(this.LOCAL_STORAGE_NAME, this.cinemaStorageData);//存储数据
    }
}