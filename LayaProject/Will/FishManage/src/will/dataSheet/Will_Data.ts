import assetLocalStorage from "../../public/localStorage/assetLocalStorage";
import GameLocalStorage from "../../public/localStorage/GameLocalStorage";
import Will_LocalData from "../localStorage/Will_LocalData";

export default class Will_Data {

    public static get Instance(): Will_Data {
        if (!this.instance) {
            this.instance = new Will_Data;
            this.instance.initData();
        }
        return this.instance;
    }

    private static instance: Will_Data;

    //注意这两个集合中只包含首次加载的路径 其余的需要分布加载请在每个窗口中添加 
    /** 公开的Laya路径集合 */
    public AllLayaPath: Array<{}> = new Array;

    /** 公开的Unity路径集合 */
    public AllUnityPath: Array<{}> = new Array;

    /**
     * 调用单例的数据写在初始化数据这个方法中
     */
    private initData() {
        //初始化窗口路径
        for (const key in this.WndName) {
            this.WndPath[key] = `res/prefabs/will/wnd/${this.WndName[key]}.prefab`;
        }

        for (let i = 0; i < this.AreaName.length; i++) {
            this.AreaPath.push(`res/image/will/goToSeaWnd/fishPointPanel/${this.AreaName[i]}.png`);
            this.AreaUnityPath.push(`res/res3D/LayaScene_Boat/Conventional/${this.AreaName[i]}.lh`);
        }

        // console.log(GameLocalStorage.Instance.beginnerStep );
        if (GameLocalStorage.Instance.beginnerStep == 1) {
            this.UnityPath["jinyu"] = this.FishPath;
        }
        console.log(this.UnityPath);

        this.AllLayaPath.push(this.WndPath);
        this.AllLayaPath.push(this.BarPath);
        this.AllLayaPath.push(this.BtnPath);
        // this.AllLayaPath.push(this.PanelPath);
        this.AllUnityPath.push(this.UnityPath);
    }

    /**
     * 窗口名字
     */
    public WndName = {
        /** 出海窗口 */
        goToSea_wnd: "goToSea_wnd",
        /** 游戏窗口 */
        game_wnd: "game_wnd",
        restuarant_wnd: "restuarant_wnd",
    }

    /**
     * 窗口路径 可以自己手动写，也可以动态获取 在单例初始化中获得即可 但一定要是表结构方便外部拿取
     */
    public WndPath: {
        goToSea_wnd,
        game_wnd,
        restuarant_wnd,

    } = {
            goToSea_wnd: "",
            game_wnd: "",
            restuarant_wnd: "",
        };


    /**
    * 面板名字
    */
    public PanelName = {
      
    }

    /**
     * 面板路径 可以自己手动写，也可以动态获取 在单例初始化中获得即可 但一定要是表结构方便外部拿取
     */
    public PanelPath: {
        test
    } = { test: "res/prefabs/public/anim/test.part"};


    /**
    * 条名字
    */
    public BarName = {
        /** 临时的数据条预制体 */
        dataBarPath: "dataBarPath"
    }

    /**
     * 条路径 可以自己手动写，也可以动态获取 在单例初始化中获得即可 但一定要是表结构方便外部拿取
     */
    public BarPath = {
        dataBarPath: "res/prefabs/will/bar/data_bar.prefab",

    };


    public BtnName = {
        /** 区域按钮 */
        areaBtn: "area_btn",
    }
    public BtnPath = {
        /** 区域按钮 */
        areaBtn: "res/prefabs/will/btn/area_btn.prefab",
    }


    /** 主场景 */
    public MainScene: string = "res/res3D/LayaScene_MainScene/Conventional/MainScene.ls";

    public FishPath: string = `res/res3D/LayaScene_FishiNoAni/Conventional/jinyu.lh`;

    public AreaName = [
        "huanghai",
        "xiaweiyi",
        "beidaidao",
        "mengjiala",
        "milu"
    ]

    public AreaPath = [];
    public AreaUnityPath = [];

    public UnityPath: {
        MainScene
    } = {
            MainScene: this.MainScene,
        }

    public get fishArr() {
        let arr = [
            { name: "bimuyu", nameCN: "石斑鱼", path: "" },
            { name: "ciba", nameCN: "石斑鱼", path: "" },
            { name: "datouxueyu", nameCN: "石斑鱼", path: "" },
            { name: "guitouyu", nameCN: "石斑鱼", path: "" },
            { name: "heidiaoyu", nameCN: "石斑鱼", path: "" },
            { name: "heimalinyu", nameCN: "石斑鱼", path: "" },
            { name: "hialian", nameCN: "石斑鱼", path: "" },
            { name: "hongweiyu", nameCN: "石斑鱼", path: "" },
            { name: "hutouyu", nameCN: "石斑鱼", path: "" },
            { name: "jianyu", nameCN: "石斑鱼", path: "" },
            { name: "jinqiangyu", nameCN: "石斑鱼", path: "" },
            { name: "jinxianyu", nameCN: "石斑鱼", path: "" },
            { name: "lanmalinyu", nameCN: "石斑鱼", path: "" },
            { name: "lanyuancan", nameCN: "石斑鱼", path: "" },
            { name: "luyu", nameCN: "石斑鱼", path: "" },
            { name: "qingyu", nameCN: "石斑鱼", path: "" },
            { name: "qiyu", nameCN: "石斑鱼", path: "" },
            { name: "shibanyu", nameCN: "石斑鱼", path: "" },
            { name: "shidiaoyu", nameCN: "石斑鱼", path: "" },
            { name: "wenmalinyu", nameCN: "石斑鱼", path: "" },
            { name: "yueliangyu", nameCN: "石斑鱼", path: "" },
            { name: "zhendiaoyu", nameCN: "石斑鱼", path: "" },
        ]
        for (let i = 0; i < arr.length; i++) {
            arr[i].path = `res/res3D/LayaScene_Fish/Conventional/${arr[i].name}.lh`;
        }

        return arr;
    }


}