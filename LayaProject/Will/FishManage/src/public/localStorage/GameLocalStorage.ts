import EventDispatcher = Laya.EventDispatcher;
import LocalStorage = Laya.LocalStorage;


export default class GameLocalStorage extends EventDispatcher {
    /**
     * 用于添加属性
     */
    public gameData: any = null;

    /**
     * 新手引导的步数
     */
    public get beginnerStep(): number{
        // return 2;
        return this.gameData.beginnerStep;
    }

    public set beginnerStep(count:number){
        this.gameData.beginnerStep = count;
        this.save();
    }

    /**
     * 唯一的名字 这个名字上线之前需要修改程唯一的
     */
    private LOCAL_STORAGE_NAME: string = "2010d796-27b3-5557-8223-14942a0as29c2c_will"; // -V2.0-DEMO
    /**
     * 
     */
    private static instance: GameLocalStorage = null;

    constructor() { super(); }

    public static get Instance(): GameLocalStorage {
        if (!this.instance) {
            this.instance = new GameLocalStorage();
            this.instance.init();
        }
        return this.instance;
    }

    public init(): void {

        let data: any = LocalStorage.getJSON(this.LOCAL_STORAGE_NAME);

        if (!data) {
            this.gameData = {};
            this.beginnerStep = 1;
            this.save();
        }
        else {
            this.gameData = data;
        }
    }

    /**
     * 保存数据
     */
    public save(): void {
        LocalStorage.setJSON(this.LOCAL_STORAGE_NAME, this.gameData);
    }

}