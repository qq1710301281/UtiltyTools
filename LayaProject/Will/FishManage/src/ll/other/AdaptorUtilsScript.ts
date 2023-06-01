/**
 * 适配 适配器
 * 本游戏只是竖屏 横屏没有考虑
 * 缩放比 0-1 之间
 * 如果换小一些的手机那么 缩放比会变小 如果再换更小的手机那么缩放比会更小 1.0......, 0.9......, 0.8......, 0.7......, 0.6......, 0.5............
 * 反之从小一些的手机换大一些的手机 缩放比就会越来越大 直到到达支持的最大设计宽高比的手机 0.5......, 0.6......, 0.7......, 0.8......, 0.9......, 1.0......
 */
export default class AdaptorUtilsScript {
    
    public static instance:AdaptorUtilsScript = null;

    /**
     * 游戏设计宽度
     */
    public designWidth:number = 0;
    /**
     * 游戏设计高度
     */
    public designHeight:number = 0;
    /**
     * 当前实际宽度
     */
    public realGameWidth:number = 0;
    /**
     * 当前实际高度
     */
    public realGameHeight:number = 0;



    /**
     * 游戏实际适配比例
     */
    private _realRatio:number = 0;



    constructor() {}
    
    public static get ins():AdaptorUtilsScript
    {
        if(!this.instance)
        {
            this.instance = new AdaptorUtilsScript();
        }
        return this.instance;
    }

    /**
     * 初始化 适配器 基础参数
     * @param dwidth:number 游戏设计宽度 本游戏中为 750
     * @param dHeight:number 游戏设计高度 本游戏中为 1623
     */
    public init(dwidth:number, dHeight:number):void
    {
        this.designWidth = dwidth;
        this.designHeight = dHeight;
        // 设计宽度 / 当前游戏浏览器窗口物理宽度 = 设计宽度与当前游戏浏览器窗口物理宽度的缩放比
        let ratio:number = this.designWidth / Laya.Browser.width;
        this.realGameWidth = Laya.Browser.width;
        // 当前游戏浏览器窗口物理高度 * 设计宽度与当前游戏浏览器窗口物理宽度的缩放比 = 当前实际高度
        this.realGameHeight = Math.floor(Laya.Browser.height * ratio);
        console.log("width:"+Laya.Browser.width+"   height:"+Laya.Browser.height+"   clientWidth:"+Laya.Browser.clientWidth+"   clientHeight:"+Laya.Browser.clientHeight+"   pixelRatio:"+Laya.Browser.pixelRatio);
    }

    /**
     * 获得真实缩放比
     */
    public get realRatio():number
    {
        if(this._realRatio)
        {
            return this._realRatio;
        }
        else
        {
            //设计高度 / 设计宽度 = 设计宽高比
            let tempRatio:number = this.designWidth / this.designHeight;
            //设计宽高比 / 物理宽高比 = 真实缩放比
            this._realRatio = tempRatio / this.physicalAspectRatio;
            return this._realRatio;
        }
    }

    /**
     * 获得物理宽高比
     * 当前游戏浏览器窗口物理宽度 / 当前游戏浏览器窗口物理高度 = 物理宽高比 (物理宽高比包含了各种手机的物理宽高比并且他们之间的的比例肯定是不一样的)
     */
    public get physicalAspectRatio():number
    {
        return Laya.Browser.width/Laya.Browser.height;
    }

}