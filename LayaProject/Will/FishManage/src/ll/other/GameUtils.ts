import AdaptorUtilsScript from "./AdaptorUtilsScript";
import EffectFlyTextScript from "./EffectFlyTextScript";
import ColorFilter=Laya.ColorFilter;

export default class GameUtils
{
    
    constructor() {}

    /**
     * 显示提示飞行文本
     * @param message:提示内容
     * @param color:文字颜色
     * @param size:文字大小
     */
    public static showFlyText(message:string, color:string, size:number):void
    {
        var effectText:EffectFlyTextScript = new EffectFlyTextScript();
        effectText.message = message;
        effectText.fontSize = size;
        effectText.duration = 200;
        effectText.delay = 1000;
        effectText.fontColor = color;
        effectText.renderText();
        effectText.startPosition = new Laya.Vector2(AdaptorUtilsScript.ins.designWidth/2, AdaptorUtilsScript.ins.realGameHeight/2);
        effectText.endPosition = new Laya.Vector2(AdaptorUtilsScript.ins.designWidth/2, AdaptorUtilsScript.ins.realGameHeight/2-200);
        effectText.mouseEnabled = false;
        Laya.stage.addChild( effectText );
        effectText.fly();
    }

    public static graying(img:any):void
    {
        var grayscaleMat: Array<number> = [
            0.3086, 0.6094, 0.0820, 0, 0, 
            0.3086, 0.6094, 0.0820, 0, 0, 
            0.3086, 0.6094, 0.0820, 0, 0, 
            0, 0, 0, 1, 0
        ];
        var grayscaleFilter:ColorFilter = new ColorFilter(grayscaleMat);
        img.filters = [grayscaleFilter];
    }

    /**
     * 加
     * @param val1 
     * @param val2 
     */
    public static add(val1:number, val2:number):number
    {
        return this.getNumber(this.getNumber(val1)+this.getNumber(val2));
    }

    /**
     * 减
     * @param val1 
     * @param val2 
     */
    public static sub(val1:number, val2:number):number
    {
        return this.getNumber(this.getNumber(val1)-this.getNumber(val2));
    }

    /**
     * 乘
     * @param val1 
     * @param val2 
     */
    public static mult(val1:number, val2:number):number
    {
        return this.getNumber(this.getNumber(val1)*this.getNumber(val2));
    }

    /**
     * 除
     * @param val1 
     * @param val2 
     */
    public static div(val1:number, val2:number):number
    {
        return this.getNumber(this.getNumber(val1)/this.getNumber(val2));
    }

    private static getNumber(val:number):number
    {
        return Math.round(val*100)/100;
    }
}