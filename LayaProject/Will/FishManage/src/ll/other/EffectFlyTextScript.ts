import GameConstants from "./GameConstants";


export default class EffectFlyTextScript extends Laya.Sprite
{
    private txt:Laya.Text = new Laya.Text();
    private _message:string = "";
    private _font:string = "SimHei";
    private _borderColor:string = "";
    private _startPosition:Laya.Vector2 = null;
    private _endPosition:Laya.Vector2 = null;
    private _fontAlign:string = "center";
    private _fontSize:number = 36;
    private _fontColor:string = "#ffffff";
    private _fontWidth:number = 0;
    private _fontHeight:number = 0;
    private _fontStroke:number = 6;
    private _fontStrokeColor:string = "#000000";
    private _txtX:number = -9999;
    private _txtY:number = -9999;
    private _targetAlpha:number = 0;
    private _duration:number = 0;
    private _delay:number = 0;
    private _ease:any = Laya.Ease.linearNone;
    private _bgColor:string = null;



    constructor() { super(); }

    public renderText () : void
    {
        this.txt.font = this._font;
        this.txt.align = this._fontAlign;
        this.txt.fontSize = this._fontSize;
        this.txt.color = this._fontColor;
        this.txt.width = this._fontWidth != 0? this._fontWidth : 0;
        this.txt.height = this._fontHeight != 0? this._fontHeight : 0;
        this.txt.stroke = this._fontStroke;
        this.txt.strokeColor = this._fontStrokeColor;
        this.txt.borderColor = this._borderColor;
        this.txt.text = this._message;
        this.txt.x = -this._fontWidth / 2;
        this.txt.y = -this._fontHeight / 2;
        this.txt.bgColor = this._bgColor;
        this.addChild( this.txt );
        var txtRectangle:laya.maths.Rectangle = this.txt.getBounds();
        if ( this._fontWidth == 0 )
        {
            this.txt.x = -txtRectangle.width / 2;
        }
        if ( this._fontHeight == 0 )
        {
            this.txt.y = -txtRectangle.height / 2;
        }
        if ( this._txtX != -9999 )
        {
            this.txt.x = this._txtX;
        }
        if ( this._txtY != -9999 )
        {
            this.txt.y = this._txtY;
        }
    }

    public set message ( value:string )
    {
        this._message = value;
    }

    public get message () : string
    {
        return this._message;
    }

    public set font ( value:string )
    {
        this._font = value;
    }

    public set borderColor ( value:string )
    {
        this._borderColor = value;
    }

    public set startPosition ( value:Laya.Vector2 )
    {
        this._startPosition = value;
        this.x = this._startPosition.x;
        this.y = this._startPosition.y;
    }

    public set endPosition ( value:Laya.Vector2 )
    {
        this._endPosition = value;
    }

    public set fontAlign ( value:string )
    {
        this._fontAlign = value;
    }

    public set fontSize ( value:number )
    {
        this._fontSize = value;
    }

    public set fontColor ( value:string )
    {
        this._fontColor = value;
    }

    public set fontWidth ( value:number )
    {
        this._fontWidth = value;
    }

    public set fontHeight ( value:number )
    {
        this._fontHeight = value;
    }

    public set fontStroke ( value:number )
    {
        this._fontStroke = value;
    }

    public set fontStrokeColor ( value:string )
    {
        this._fontStrokeColor = value;
    }

    public set bgColor ( value:string )
    {
        this._bgColor = value;
    }

    public set textX ( value:number )
    {
        this._txtX = value;
    }

    public set textY ( value:number )
    {
        this._txtY = value;
    }

    public set targetAlpha ( value:number )
    {
        this._targetAlpha = value;
    }

    public get width () : number
    {
        return this.txt.getBounds().width;
    }

    public get height () : number
    {
        return this.txt.getBounds().height;
    }

    public set duration ( value:number )
    {
        this._duration = value;
    }

    public set delay ( value:number )
    {
        this._delay = value;
    }

    public set ease ( value:any )
    {
        this._ease = value;
    }

    onEnable(): void {
    }

    /**
     * 
     * @param moveDuration 默认值 200
     * @param moveDelay 默认值 200
     * @param ease 默认值 Laya.Ease.linearNone
     * @param _startPosition 默认值 null
     * @param _endPosition 默认值 null
     */
    public fly () : void
    {
        this.event( GameConstants.START_FLY );
        Laya.Tween.to(this, { x:this._endPosition.x, y:this._endPosition.y, alpha:this._targetAlpha }, this._duration, this._ease, new Laya.Handler(this, this.completeHandler ), this._delay);
    }

    private completeHandler () : void
    {
        if ( this.parent )
        {
            this.parent.removeChild( this );
        }
        this.event( GameConstants.FLY_END );
        this.destroy(true);
    }

    onDisable(): void {
    }
}