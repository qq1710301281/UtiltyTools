import Sprite=Laya.Sprite;

export default class MoveBar extends Laya.Script
{
    /**
     * 
     */
    public offsetTime:number = 3000;
    /**
     * 
     */
    public isStart:boolean = false;

    /**
     * 
     */
    private mask:Sprite = new Sprite();
    /**
     * 
     */
    private barValue:number = 0;
    /**
     * 
     */
    private targetTime:number = 0;
    /**
     * 调用时间间隔
     */
    private duration:number = 1;



    constructor() { super(); }

    onAwake():void
    {
        (this.owner as any).mask = this.mask;
    }

    onEnable(): void {
    }

    public beginMove()
    {
        if(!this.isStart)
        {
            this.isStart = true;
            this.targetTime = Laya.timer.currTimer + this.offsetTime;
            Laya.timer.loop(this.duration, this, this.move);
        }
    }

    private move():void
    {
        if(this.value < 1)
        {
            this.value = 1 - (this.targetTime - Laya.timer.currTimer) / this.offsetTime;
            
        }
        else
        {
            this.targetTime = Laya.timer.currTimer + this.offsetTime;
            this.value = 0.01;
        }
    }

    private set value(num:number)
    {
        this.barValue = num < 0? 0 : num;
        this.barValue = num > 1? 1 : this.barValue;
        this.mask.graphics.clear();
        this.mask.graphics.drawRect(0, 0, this.barValue*(this.owner as any).width == 0? 1 : this.barValue*(this.owner as any).width, (this.owner as any).height, "#000000");
    }

    private get value():number
    {
        return this.barValue;
    }

    public stop():void
    {
        Laya.timer.clear(this, this.move);
        this.value = 0.01;
        this.targetTime = 0;
        this.isStart = false;
    }

    onDisable(): void {
    }

}