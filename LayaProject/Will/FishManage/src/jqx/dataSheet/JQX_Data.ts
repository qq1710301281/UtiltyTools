import BuildingStorageData from "../localStorage/BuildingStorageData";

export default class JQX_Data {

    public static get Instance(): JQX_Data {
        if (!this.instance) {
            this.instance = new JQX_Data;
            this.instance.initData();
        }
        return this.instance;
    }

    private static instance: JQX_Data;

    //注意这两个集合中只包含首次加载的路径 其余的需要分布加载请在每个窗口中添加 
    /** 公开的Laya路径集合 */
    public AllLayaPath: Array<{}> = new Array;

    /** 公开的Unity路径集合 */
    public AllUnityPath: Array<{}> = new Array;

    /**
     * 建筑升级数据
     */
    public buildingStorageData: BuildingStorageData = null;

    /**
     * 调用单例的数据写在初始化数据这个方法中
     */
    private initData() {
        //初始化窗口路径
        for (const key in this.WndName) {
            this.WndPath[key] = `res/prefabs/jqx/wnd/${this.WndName[key]}.prefab`;
        }
        this.AllLayaPath.push(["res/atlas/res/image/public/cinema.atlas"]);
        this.AllLayaPath.push(["res/atlas/res/image/public/cinema/cinema01.atlas"]);
        this.AllLayaPath.push(["res/atlas/res/image/public/cinema/cinema02.atlas"]);
        this.AllLayaPath.push(this.WndPath);
        this.AllLayaPath.push(this.PanelPath);
        this.AllLayaPath.push(this.BarPath);
    }

    /**
     * 窗口名字
     */
    public WndName = {
        /** 加载窗口 */
        PlainBuildings_wnd: "PlainBuildings_wnd",
        Upgrade_wnd: "Upgrade_wnd",
        SpecialMovie_wnd: "SpecialMovie_wnd",

    }

    /**
     * 窗口路径 可以自己手动写，也可以动态获取 在单例初始化中获得即可 但一定要是表结构方便外部拿取
     */
    public WndPath: {
        PlainBuildings_wnd,
        SpecialMovie_wnd,
        Upgrade_wnd,
    } = { PlainBuildings_wnd: "",SpecialMovie_wnd:"",Upgrade_wnd:""};


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

    } = {};

    /**
     * 条路径 可以自己手动写，也可以动态获取 在单例初始化中获得即可 但一定要是表结构方便外部拿取
     */
    public BarPath: {

    }




}