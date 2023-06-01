import M_Tool from "../../../public/core/Toos/M_Tool";

export default class flight extends Laya.Script {

    /** @prop {name:imgSkin, tips:"皮肤", type:Node, default:null}*/
    public imgSkin: Laya.Image = null;

    private self:Laya.Image = null;

    private diamond:Laya.Point = null;
    private gold:Laya.Point = null;

    private type:number = 0;
    goldNum:number = 0;

 
    onEnable():void {
        
        this.self = this.owner as Laya.Image;
        // this.diamond = M_Config.diamond.localToGlobal(new Laya.Point(0,0));
        // this.gold    = M_Config.gold.localToGlobal(new Laya.Point(0,0));

        this.diamond = new Laya.Point(551,40);
        this.gold    = new Laya.Point(251,40);
    }


    initSkin(type:number,points,goldNum:number):void {
        this.type = type;
        this.goldNum = goldNum;
        //随机位置
        let x = M_Tool.GetRandomNum(points.x-200,points.x+200);
        let y = M_Tool.GetRandomNum(points.y-200,points.y +200);
        this.self.pos(x,y);
        this.imgSkin.skin = type == 1?"res/image/public/globalImg/img15.png":"res/image/public/globalImg/img16.png";

        Laya.Tween.to(this.self,{scaleX:1.2,scaleY:1.2},600,Laya.Ease.elasticOut,Laya.Handler.create(this,()=>{}))
    }


    //飞行到目标区域
    move():void {
        if(this.type == 1) {
            Laya.Tween.to(this.self,{x:this.gold.x,y:this.gold.y},300,Laya.Ease.linearIn,Laya.Handler.create(this,()=>{
                Laya.Pool.recover('goldItem',this.self);
                this.self.scale(0.6,0.6);
                this.self.removeSelf();
            }))
        }else if(this.type == 2) {
            Laya.Tween.to(this.self,{x:this.diamond.x,y:this.diamond.y},300,Laya.Ease.linearIn,Laya.Handler.create(this,()=>{
                Laya.Pool.recover('goldItem',this.self);
                this.self.scale(0.6,0.6);
                this.self.removeSelf();
                
            }))
        }
    }
}


/**
 * 
 * @param type 类型
 * @param num  数量
 * @param goldNum 
 */
export function createrFlight(type: number,points:Laya.Point,num: number = 10,goldNum:number = 0) {
    // let postionX: number[] = [320, 620];
    // let postionY: number[] = [800, 1000];
    for (let i = 0; i < num; i++) {
        Laya.loader.create(`res/prefabs/lb/wnd/flight.prefab`, Laya.Handler.create(this, (menu: Laya.Prefab) => {
            let load = Laya.Pool.getItemByCreateFun('goldItem', menu.create, menu);
            Laya.stage.addChild(load);
            load.zOrder = 10;
            (load.getComponent(flight) as flight).initSkin(type, points,goldNum);
            Laya.timer.once(i * 60, this, () => {
                (load.getComponent(flight) as flight).move();
            })
        }));
    }
}