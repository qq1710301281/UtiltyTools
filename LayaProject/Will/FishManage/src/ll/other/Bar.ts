import Image=Laya.Image;
import Sprite=Laya.Sprite;
import Text=Laya.Text;

export default class Bar extends Laya.Script
{
    /**
     * 
     */
    public txtBeginning:string = "";
    /**
     * 
     */
    public txtEnding:string = "";
    /**
     * 
     */
    public textName:string = "";
    /**
     * 
     */
    public text:Text = null;



    /**
     * 
     */
    private container:any = null;
    /**
     * 
     */
    private mask:Sprite = new Sprite();
    /**
     * 
     */
    private barValue:number = 0;
    

    
    constructor() { super(); }

    onAwake():void
    {
        this.container = this.owner.parent;
        (this.owner as any).mask = this.mask;
    }

    public init():void
    {
        if(!this.text)
        {
            this.text = (this.owner.getChildByName(this.textName) as Text);
            let tx:number = this.text.x;
            let ty:number = this.text.y;
            this.owner.removeChild(this.text);
            this.text.x = (this.owner as any).x + tx;
            this.text.y = (this.owner as any).y + ty;
            this.container.addChild(this.text);
        }
    }
    
    onEnable(): void {
    }

    /**
     * 
     * @param num 
     */
    public set value(num:number)
    {
        this.barValue = num < 0? 0 : num;
        this.barValue = num > 1? 1 : this.barValue;
        this.mask.graphics.clear();
        this.mask.graphics.drawRect(0, 0, this.barValue*(this.owner as any).width == 0?1:this.barValue*(this.owner as any).width, (this.owner as any).height, "#000000");
        this.text.text = `${this.txtBeginning}${Math.floor(this.barValue * 100)}${this.txtEnding}`;
    }

    public get value():number
    {
        return this.barValue;
    }

    onDisable(): void {
    }
}