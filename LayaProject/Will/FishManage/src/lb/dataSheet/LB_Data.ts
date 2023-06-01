export default class LBData {

    public static get Instance(): LBData {
        if (!this.instance) {
            this.instance = new LBData;
            this.instance.initData();
        }
        return this.instance;
    }

    private static instance: LBData;

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
            this.WndPath[key] = `res/prefabs/lb/wnd/${this.WndName[key]}.prefab`;
        }

        this.AllLayaPath.push(this.WndPath);
    }

    /**
     * 窗口名字
     */
    public WndName = {
        /** 加载窗口 */
        entertainment_wnd:"entertainment_wnd",
        publicGong_wnd:"publicGong_wnd",
        reward_wnd:"reward_wnd",
        underwater_wnd:"underwater_wnd",
        book_wnd:"book_wnd",
        detailed_wnd:"detailed_wnd",
        FerrisWheel_wnd:"FerrisWheel_wnd",
        tipBox_wnd:"tipBox_wnd",
        guide_wnd:"guide_wnd",
        Excessive:"Excessive",
    }

    /**
     * 窗口路径 可以自己手动写，也可以动态获取 在单例初始化中获得即可 但一定要是表结构方便外部拿取
     */
    public WndPath: {
        entertainment_wnd,
        publicGong_wnd,
        reward_wnd,
        underwater_wnd,
        book_wnd,
        detailed_wnd,
        FerrisWheel_wnd,
        tipBox_wnd,
        guide_wnd,
        Excessive
    } = {entertainment_wnd:"",publicGong_wnd:"",reward_wnd:"",underwater_wnd:"",book_wnd:"",detailed_wnd:"",FerrisWheel_wnd:"",tipBox_wnd:"",guide_wnd:"",Excessive:""};


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




}