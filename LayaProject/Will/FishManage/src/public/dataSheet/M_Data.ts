export default class M_Data {

    public static get Instance(): M_Data {
        if (!this.instance) {
            this.instance = new M_Data;
            this.instance.initData();
        }
        return this.instance;
    }

    private static instance: M_Data;

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
            this.WndPath[key] = `res/prefabs/public/wnd/${this.WndName[key]}.prefab`;
        }

        this.AllLayaPath.push(this.WndPath);
        this.AllLayaPath.push(this.PanelPath);
        this.AllLayaPath.push(this.BarPath);
        this.AllLayaPath.push(this.ColorPath);

        // this.AllLayaPath.push()
    }

    /**
     * 窗口名字
     */
    public WndName = {
        /** 加载窗口 */
        loading_wnd: "loading_wnd",
        /** 吐司窗口 */
        toast_wnd: "toast_wnd",
        Res_wnd: "Res_wnd",
        Player_Up_wnd: "Player_Up_wnd",
    }

    /**
     * 窗口路径 可以自己手动写，也可以动态获取 在单例初始化中获得即可 但一定要是表结构方便外部拿取
     */
    public WndPath: {
        loading_wnd,
        toast_wnd,
        Res_wnd,
        Player_Up_wnd,
    } = { loading_wnd: "", toast_wnd: "", Res_wnd: "", Player_Up_wnd: "" };


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

    /**
     * 颜色图片路径
     */
    public ColorPath = {
        circle: "res/image/common/circle.png",
        blue: "res/image/common/blue.png",
        gray: "res/image/common/gray.png",
        green: "res/image/common/green.png",
        orange: "res/image/common/orange.png",
        purple: "res/image/common/purple.png",
        red: "res/image/common/red.png",
    }

    // public alt
}