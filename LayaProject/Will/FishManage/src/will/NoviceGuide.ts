import LL_Data from "../ll/dataSheet/LL_Data";
import EventCenter from "../public/core/Game/EventCenter";
import assetLocalStorage from "../public/localStorage/assetLocalStorage";
import GameLocalStorage from "../public/localStorage/GameLocalStorage";
import ui_mrg from "../public/manager/ui_mrg";
import game_wnd from "./canvas/wnd/game_wnd";
import Will_Data from "./dataSheet/Will_Data";
/**引导模块 */
export class SEAWEEDGuide {
    private gameContainer:Laya.Image = null;
    private guideContainer:Laya.Sprite = null;
    private interactionArea:Laya.Sprite = null;
    private hitArea:Laya.HitArea = null;
    //小手
    private tipContainer:Laya.Image = null;
    //文字描述
    private textContainer:Laya.Image = null;

    private end:boolean  = false;
    private maskArea:Laya.Sprite = null;
    private falsePicture:Laya.Sprite = null;
    private falsePicture1:Laya.Sprite = null;
    private height:number = null;
    private distance:number = null;


    private guideSteps:Array<any> = 
    [
        {type:2,x:180,y:30,dir:'top',skip:true,width:750,height:120},
        {type:1,x:650,y:1100,dir:'center',skip:true},
        {type:1,x:521,y:Laya.stage.height-280,dir:'bottom',skip:false},
    ];

    //点击区域
    private guideStepClick:Array<any> = [
        {type:2,x:0,y:0,width:0,height:0},
        {type:1,x:650,y:1100,radius:150},
        {type:1,x:521,y:Laya.stage.height-280,radius:150},
    ]

    //小手引导位置
    private littleHand:Array<any> = [
        {type:1,x:666,y:102},
        {type:2,x:0,y:0},
        {type:1,x:652,y:Laya.stage.height-200},
    ]

    //引导文字
    private guideText:Array<any> = [
        {x:288,y:455.5,text:'控制力度保持力量的平衡，避免绳子耐久下降过快'},
        {x:358,y:569.5,text:'坚持住！这样会不断消耗鱼的体力'},
        {x:285,y:Laya.stage.height-800,text:'按住按钮增加力度'}
    ]


    private guideStep:number = 0;

    private tweenFunc:Function = ()=>{};

    constructor() 
    {
        /**监听下一步事件 */
        EventCenter.rigestEvent("nextStep",this.nextStep,this);

        //绘制一个蓝色方块，不被抠图
        this.gameContainer = new Laya.Image();
        // this.gameContainer.loadImage("res/mainMenu/bg.png");
        this.gameContainer.loadImage("");
        // this.gameContainer.left = 0;
        // this.gameContainer .top = 0;
        // this.gameContainer.right = 0;
        // this.gameContainer.bottom = 0;
        // this.gameContainer.alpha = 0;
        console.log(Laya.stage.numChildren)
        Laya.stage.addChild(this.gameContainer);
        this.gameContainer.zOrder = 2;

        // 引导所在容器
        this.guideContainer = new Laya.Sprite();
        // 设置容器为画布缓存
        this.guideContainer.cacheAs = "bitmap";
        Laya.stage.addChild(this.guideContainer);
        this.gameContainer.on("click", this, this.nextStep);
        this.guideContainer.zOrder = 2;

        //绘制遮罩区，含透明度，可见游戏背景
        this.maskArea = new Laya.Sprite();
        this.maskArea.alpha = 0.5;
        let height  = Laya.stage.height > 1920 ? 1920:Laya.stage.height;
        this.height = height;

        let distance = Laya.stage.height - height;
        this.distance = distance;
        this.maskArea.graphics.drawRect(0, distance, Laya.stage.width, height, "#000000");
        this.guideContainer.addChild(this.maskArea);

        //绘制一个圆形区域，利用叠加模式，从遮罩区域抠出可交互区
        this.interactionArea = new Laya.Sprite();
        //设置叠加模式
        this.interactionArea.blendMode = "destination-out";
        this.guideContainer.addChild(this.interactionArea);

        this.hitArea = new Laya.HitArea();
        this.hitArea.hit.drawRect(0, distance, Laya.stage.width, height, "#000000");

        this.guideContainer.hitArea = this.hitArea;
        this.guideContainer.mouseEnabled = true;

        //  //添加一个假区域做遮挡
         this.falsePicture = new Laya.Sprite();
         this.falsePicture.alpha = 0.5;
         this.falsePicture.graphics.drawRect(0,0,Laya.stage.width,distance, "#000000");
         this.falsePicture.zOrder = 5;
         Laya.stage.addChild(this.falsePicture);

         //做一个底部的用
         this.falsePicture1 = new Laya.Sprite();
         this.falsePicture1.alpha = 0.5;
         this.falsePicture1.graphics.drawRect(0,0,Laya.stage.width,-500, "#000000");
         this.falsePicture1.zOrder = 5;
         Laya.stage.addChild(this.falsePicture1);


        //添加小手
        this.tipContainer = new Laya.Image("res/guide/hand.png");
        this.tipContainer.anchorX = 0.5;
        this.tipContainer.anchorY = 0.5;
        this.tipContainer.zOrder = 4;
        Laya.stage.addChild(this.tipContainer);


        //添加文字描述
        this.textContainer = new Laya.Image();
        this.textContainer.anchorX = 0.5;
        this.textContainer.anchorY = 0.5;
        this.textContainer.zOrder = 3;
        // this.textContainer.width = 552;
        // this.textContainer.height = 320;

        let text = new Laya.Text();
        text.text = "从下而上";
        text.fontSize = 40;
        text.align = "left";
        text.color = "#534c4c"
        text.x  = 50;
        text.y  = 50;
        text.wordWrap = true;
        text.width = 480;
        text.leading = 20;
        this.textContainer.addChild(text);

        Laya.stage.addChild(this.textContainer);


        this.nextStep();
    }

    nextStep():void{

        if (this.guideStep == this.guideSteps.length)
        {
            console.log("下一步");
            EventCenter.removeEvent("nextStep",this.nextStep,this);
            this.guideContainer.removeSelf();
            this.gameContainer.removeSelf();
            this.tipContainer.removeSelf();
            this.textContainer.removeSelf();
            this.falsePicture.removeSelf();
            this.falsePicture1.removeSelf();
        }
        else
        {
            let index = this.guideStep++;
            var step:any = this.guideSteps[index];
            var click:any = this.guideStepClick[index];
            var handel:any = this.littleHand[index];
            var textType:any = this.guideText[index];
            this.hitArea.unHit.clear();
            this.interactionArea.graphics.clear();
            this.maskArea.graphics.clear();
            this.falsePicture.graphics.clear();
            this.falsePicture1.graphics.clear();
            

            //做个效果
            this.maskArea.visible = false;
            this.tipContainer.visible = false;
            this.textContainer.visible = false;
            Laya.timer.once(500,this,()=>{
                this.maskArea.visible      = true;
                this.tipContainer.visible  = true;
                this.textContainer.visible = true;
                let deviation = 0;
                if(step.dir == "center") {
                    deviation = this.distance/2;
                }
    
                //解决适配问题
                if(step.dir == "bottom") {
                    //底部
                    this.maskArea.graphics.drawRect(0, this.distance, Laya.stage.width, this.height, "#000000");
                    this.falsePicture.graphics.drawRect(0,0,Laya.stage.width,this.distance, "#000000");
                }else if(step.dir == "top") {
                    //顶部
                    this.maskArea.graphics.drawRect(0, 0, Laya.stage.width, this.height, "#000000");
                    this.falsePicture.graphics.drawRect(0,Laya.stage.height-this.distance,Laya.stage.width,this.distance, "#000000");
                }else if(step.dir == "center") {
                    //中心位置
                    this.maskArea.graphics.drawRect(0, deviation, Laya.stage.width, this.height, "#000000");
    
                    //去顶部
                    this.falsePicture.graphics.drawRect(0,0,Laya.stage.width,deviation, "#000000");
                    //去底部
                    this.falsePicture1.graphics.drawRect(0,Laya.stage.height-deviation,Laya.stage.width,deviation, "#000000");
                }
    
                //根据类型判断绘制形状
                if(step.type == 1) {
                    this.interactionArea.graphics.drawCircle(step.x, step.y+deviation,click.radius,"#000000");
                    this.hitArea.unHit.drawCircle(click.x, click.y+deviation,click.radius, "#000000");
                }else if(step.type == 2) {
                    this.interactionArea.graphics.drawRect(step.x, step.y + deviation,step.width,step.height?step.height:this.height,"#000000");
                    this.hitArea.unHit.drawRect(click.x, click.y + deviation,click.width,click.height, "#000000");
                }
    
                //清理动作
                Laya.Tween.clearAll(this.tipContainer);
                this.tipContainer.visible = handel.type == 1;
                this.tipContainer.graphics.clear();
                this.tipContainer.loadImage("res/guide/hand.png")
                this.tipContainer.pos(handel.x, handel.y+deviation);
                this.wobble(handel);
    
                this.textContainer.graphics.clear();
                if(textType.text !== null) {
                    this.textContainer.visible = true;
                    this.textContainer.loadImage("res/guide/tip.png");
                    this.textContainer.pos(textType.x,textType.y+deviation);
                    //渲染文字
                    let text = this.textContainer.getChildAt(0) as Laya.Text;
                    text.text = textType.text;
                }else {
                    this.textContainer.visible = false;
                }
    
                console.log("????",this.guideStep)
    
                if(step.skip) {
                    Laya.timer.once(3000,this,()=>{
                        this.nextStep();
                    })
                }
            })

            this.home();
        }
    }

    home():void {
        if(this.guideStep == 1) {
            // Laya.timer.scale = 0;
        }
    }

    //小手晃动
    wobble(data:any):void {
        this.tweenFunc = ()=>{
            if(this.end) {
                return;
            }
            if(data.type == 1) {
                Laya.Tween.to(this.tipContainer,{scaleX:1.2,scaleY:1.2},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                    Laya.Tween.to(this.tipContainer,{scaleX:1,scaleY:1},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                        this.tweenFunc();
                    }))
                }))
            }else if(data.type == 2) {
                Laya.Tween.to(this.tipContainer,{x:data.moveX,y:data.moveY},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                    Laya.Tween.to(this.tipContainer,{x:data.x,y:data.y},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                        this.tweenFunc();
                    }))
                }))
            }
        }
        this.tweenFunc();
    }
}

//二阶段引导
export class SecondStage{
    private gameContainer:Laya.Image = null;
    private guideContainer:Laya.Sprite = null;
    private interactionArea:Laya.Sprite = null;
    private hitArea:Laya.HitArea = null;
    //小手
    private tipContainer:Laya.Image = null;
    //文字描述
    private textContainer:Laya.Image = null;

    private end:boolean  = false;
    private maskArea:Laya.Sprite = null;
    private falsePicture:Laya.Sprite = null;
    private falsePicture1:Laya.Sprite = null;
    private height:number = null;
    private distance:number = null;


    private guideSteps:Array<any> = 
    [
        {type:1,x:530,y:Laya.stage.height-280,dir:'bottom',skip:false,mo:1},
        {type:2,x:0,y:0,width:Laya.stage.width,height:null,dir:'top',skip:true,mo:2},
    ];

    //点击区域
    private guideStepClick:Array<any> = [
        {type:1,x:530,y:Laya.stage.height-290,radius:350},
        {type:2,x:0,y:0,width:0,height:0},
    ]

    //小手引导位置
    private littleHand:Array<any> = [
        {type:1,x:652,y:Laya.stage.height-200},
        {type:2,x:0,y:0},
    ]

    //引导文字
    private guideText:Array<any> = [
        {x:285,y:Laya.stage.height-1000,text:'鱼已经放弃挣扎了，点击按钮将于拉上来。'},
        {x:285,y:Laya.stage.height-800,text:'哇！这是什么鱼，金光闪闪~~真是太美了'},
    ]


    private guideStep:number = 0;

    private tweenFunc:Function = ()=>{};

    constructor() 
    {
        /**监听下一步事件 */
        EventCenter.rigestEvent("nextStep",this.nextStep,this);

        //绘制一个蓝色方块，不被抠图
        this.gameContainer = new Laya.Image();
        // this.gameContainer.loadImage("res/mainMenu/bg.png");
        this.gameContainer.loadImage("");
        // this.gameContainer.left = 0;
        // this.gameContainer .top = 0;
        // this.gameContainer.right = 0;
        // this.gameContainer.bottom = 0;
        // this.gameContainer.alpha = 0;
        console.log(Laya.stage.numChildren)
        Laya.stage.addChild(this.gameContainer);
        this.gameContainer.zOrder = 2;

        // 引导所在容器
        this.guideContainer = new Laya.Sprite();
        // 设置容器为画布缓存
        this.guideContainer.cacheAs = "bitmap";
        Laya.stage.addChild(this.guideContainer);
        this.gameContainer.on("click", this, this.nextStep);
        this.guideContainer.zOrder = 2;

        //绘制遮罩区，含透明度，可见游戏背景
        this.maskArea = new Laya.Sprite();
        this.maskArea.alpha = 0.5;
        let height  = Laya.stage.height > 1920 ? 1920:Laya.stage.height;
        this.height = height;

        let distance = Laya.stage.height - height;
        this.distance = distance;
        this.maskArea.graphics.drawRect(0, distance, Laya.stage.width, height, "#000000");
        this.guideContainer.addChild(this.maskArea);

        //绘制一个圆形区域，利用叠加模式，从遮罩区域抠出可交互区
        this.interactionArea = new Laya.Sprite();
        //设置叠加模式
        this.interactionArea.blendMode = "destination-out";
        this.guideContainer.addChild(this.interactionArea);

        this.hitArea = new Laya.HitArea();
        this.hitArea.hit.drawRect(0, distance, Laya.stage.width, height, "#000000");

        this.guideContainer.hitArea = this.hitArea;
        this.guideContainer.mouseEnabled = true;

        //  //添加一个假区域做遮挡
         this.falsePicture = new Laya.Sprite();
         this.falsePicture.alpha = 0.5;
         this.falsePicture.graphics.drawRect(0,0,Laya.stage.width,distance, "#000000");
         this.falsePicture.zOrder = 5;
         Laya.stage.addChild(this.falsePicture);

         //做一个底部的用
         this.falsePicture1 = new Laya.Sprite();
         this.falsePicture1.alpha = 0.5;
         this.falsePicture1.graphics.drawRect(0,0,Laya.stage.width,-500, "#000000");
         this.falsePicture1.zOrder = 5;
         Laya.stage.addChild(this.falsePicture1);


        //添加小手
        this.tipContainer = new Laya.Image("res/guide/hand.png");
        this.tipContainer.anchorX = 0.5;
        this.tipContainer.anchorY = 0.5;
        this.tipContainer.zOrder = 4;
        Laya.stage.addChild(this.tipContainer);


        //添加文字描述
        this.textContainer = new Laya.Image();
        this.textContainer.anchorX = 0.5;
        this.textContainer.anchorY = 0.5;
        this.textContainer.zOrder = 3;
        // this.textContainer.width = 552;
        // this.textContainer.height = 320;

        let text = new Laya.Text();
        text.text = "从下而上";
        text.fontSize = 40;
        text.align = "left";
        text.color = "#534c4c"
        text.x  = 50;
        text.y  = 50;
        text.wordWrap = true;
        text.width = 480;
        text.leading = 20;
        this.textContainer.addChild(text);

        Laya.stage.addChild(this.textContainer);


        this.nextStep();
    }

    nextStep():void{

        if (this.guideStep == this.guideSteps.length)
        {
            console.log("接收了==========");
            EventCenter.removeEvent("nextStep",this.nextStep,this);
            this.guideContainer.removeSelf();
            this.gameContainer.removeSelf();
            this.tipContainer.removeSelf();
            this.textContainer.removeSelf();
            this.falsePicture.removeSelf();
            this.falsePicture1.removeSelf();
            //返回首页
            (<game_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.game_wnd)).BackMap();
            ui_mrg.Instance.GetUI(LL_Data.Instance.WndName.Map_wnd).Show();
           //进去下一步引导
           new NoviceGuide();
        }
        else
        {
            let index = this.guideStep++;
            var step:any = this.guideSteps[index];
            var click:any = this.guideStepClick[index];
            var handel:any = this.littleHand[index];
            var textType:any = this.guideText[index];
            this.hitArea.unHit.clear();
            this.interactionArea.graphics.clear();
            this.maskArea.graphics.clear();
            this.falsePicture.graphics.clear();
            this.falsePicture1.graphics.clear();
            

            //做个效果
            this.maskArea.visible = false;
            this.tipContainer.visible = false;
            this.textContainer.visible = false;
            Laya.timer.once(500,this,()=>{
                this.maskArea.visible      = true;
                this.tipContainer.visible  = true;
                this.textContainer.visible = true;
                let deviation = 0;
                if(step.dir == "center") {
                    deviation = this.distance/2;
                }
    
                //解决适配问题
                if(step.dir == "bottom") {
                    //底部
                    this.maskArea.graphics.drawRect(0, this.distance, Laya.stage.width, this.height, "#000000");
                    this.falsePicture.graphics.drawRect(0,0,Laya.stage.width,this.distance, "#000000");
                }else if(step.dir == "top") {
                    //顶部
                    this.maskArea.graphics.drawRect(0, 0, Laya.stage.width, this.height, "#000000");
                    if(step.mo == 2) {
                        this.falsePicture.visible = false;
                    }
                }else if(step.dir == "center") {
                    //中心位置
                    this.maskArea.graphics.drawRect(0, deviation, Laya.stage.width, this.height, "#000000");
    
                    //去顶部
                    this.falsePicture.graphics.drawRect(0,0,Laya.stage.width,deviation, "#000000");
                    //去底部
                    this.falsePicture1.graphics.drawRect(0,Laya.stage.height-deviation,Laya.stage.width,deviation, "#000000");
                }
    
                //根据类型判断绘制形状
                if(step.type == 1) {
                    this.interactionArea.graphics.drawCircle(step.x, step.y+deviation,click.radius,"#000000");
                    this.hitArea.unHit.drawCircle(click.x, click.y+deviation,click.radius, "#000000");
                }else if(step.type == 2) {
                    this.interactionArea.graphics.drawRect(step.x, step.y + deviation,step.width,step.height?step.height:this.height,"#000000");
                    this.hitArea.unHit.drawRect(click.x, click.y + deviation,click.width,click.height, "#000000");
                }
    
                //清理动作
                Laya.Tween.clearAll(this.tipContainer);
                this.tipContainer.visible = handel.type == 1;
                this.tipContainer.graphics.clear();
                this.tipContainer.loadImage("res/guide/hand.png")
                this.tipContainer.pos(handel.x, handel.y+deviation);
                this.wobble(handel);
    
                this.textContainer.graphics.clear();
                if(textType.text !== null) {
                    this.textContainer.visible = true;
                    this.textContainer.loadImage("res/guide/tip.png");
                    this.textContainer.pos(textType.x,textType.y+deviation);
                    //渲染文字
                    let text = this.textContainer.getChildAt(0) as Laya.Text;
                    text.text = textType.text;
                }else {
                    this.textContainer.visible = false;
                }
    
    
                if(step.skip) {
                    Laya.timer.once(5000,this,()=>{
                        this.nextStep();
                    })
                }
            })
        }
    }
    //小手晃动
    wobble(data:any):void {
        this.tweenFunc = ()=>{
            if(this.end) {
                return;
            }
            if(data.type == 1) {
                Laya.Tween.to(this.tipContainer,{scaleX:1.2,scaleY:1.2},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                    Laya.Tween.to(this.tipContainer,{scaleX:1,scaleY:1},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                        this.tweenFunc();
                    }))
                }))
            }else if(data.type == 2) {
                Laya.Tween.to(this.tipContainer,{x:data.moveX,y:data.moveY},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                    Laya.Tween.to(this.tipContainer,{x:data.x,y:data.y},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                        this.tweenFunc();
                    }))
                }))
            }
        }
        this.tweenFunc();
    }
}

/**界面引导 */
export class NoviceGuide {
    private gameContainer:Laya.Image = null;
    private guideContainer:Laya.Sprite = null;
    private interactionArea:Laya.Sprite = null;
    private hitArea:Laya.HitArea = null;
    //小手
    private tipContainer:Laya.Image = null;
    //文字描述
    private textContainer:Laya.Image = null;

    private end:boolean  = false;
    private maskArea:Laya.Sprite = null;
    private falsePicture:Laya.Sprite = null;
    private falsePicture1:Laya.Sprite = null;
    private height:number = null;
    private distance:number = null;


    private guideSteps:Array<any> = 
    [
        {type:2,x:0,y:0,dir:'center',skip:true,width:0,height:0},
        {type:2,x:0,y:0,dir:'center',skip:true,width:0,height:0},

        {type:1,x:827,y:1189,dir:"center",skip:false},
        {type:1,x:827,y:1189,dir:"center",skip:false},
        {type:1,x:540,y:1311,dir:"center",skip:false},

        //特殊
        {type:1,x:532,y:1091,dir:'center'},

        {type:1,x:546,y:1374,dir:"center",skip:false},
        {type:1,x:924,y:270,dir:"center",skip:false},
        {type:1,x:357,y:918,dir:"center",skip:false},
        {type:1,x:357,y:918,dir:"center",skip:false},
        {type:1,x:525,y:1305,dir:"center",skip:false},
        {type:1,x:532,y:1091,dir:'center'},
        {type:1,x:546,y:1383,dir:"center",skip:false},
        {type:1,x:927,y:309,dir:'center',skip:false},
        {type:1,x:627,y:Laya.stage.height-150,dir:'bottom',skip:false},
        {type:1,x:830,y:1144,dir:'center',skip:false},
        {type:1,x:830,y:1144,dir:'center',skip:false},
        {type:2,x:265,y:760,width:642,height:357,dir:'top',skip:true},

        // {type:2,x:860,y:140,width:230,height:156,dir:'top',skip:true},

        {type:1,x:149,y:159,dir:'top',skip:false},
        {type:1,x:412,y:851,dir:'center',skip:false},
        {type:1,x:412,y:851,dir:'center',skip:false},
        {type:2,x:620,y:900,dir:'top',width:280,height:160,skip:true},
        {type:1,x:152,y:165,dir:'top',skip:false},


        //引导去前岛
        {type:1,x:405,y:Laya.stage.height-150,dir:'bottom',skip:false},
        {type:1,x:918,y:749,dir:'center',skip:false},
        {type:2,x:200,y:313,dir:'center',width:690,height:330,skip:true},
        {type:2,x:430,y:830,dir:'center',width:460,height:60,skip:true},
        {type:2,x:549,y:928,dir:'center',width:260,height:60,skip:true},
        {type:1,x:150,y:152,dir:'center',skip:false},
        {type:1,x:252,y:1501,dir:'center',skip:false},


        //引导3D界面
        {type:2,x:207,y:100,dir:'top',width:600,height:180,skip:true},
        {type:1,x:149,y:593,dir:'top',skip:false},
        {type:2,x:700,y:1500,dir:'center',width:200,height:200,skip:true},
        {type:1,x:41,y:54,dir:'top',skip:false},
        {type:1,x:84,y:365,dir:'top',skip:false},

        //引导灯塔
        {type:2,x:340,y:340,dir:'center',width:200,height:300,skip:true},

        //结尾
        {type:2,x:556,y:701,dir:'center',width:0,height:0,skip:true},
        {type:2,x:556,y:701,dir:'center',width:0,height:0,skip:true},
    ];

    //点击区域
    private guideStepClick:Array<any> = [
        {type:2,x:0,y:0,width:0,height:0},
        {type:2,x:0,y:0,width:0,height:0},

        {type:1, x: 827, y: 1189,radius:150},
        {type:1, x: 827, y: 1189,radius:150},
        {type:1, x: 540, y: 1311,radius:150},

        //特殊
        {type:1,x:532,y:1091,radius:150},
        {type:1,x:546,y:1374,radius:150},
        {type:1,x:924,y:270,radius:150},
        {type:1,x:357,y:918,radius:150},
        {type:1,x:357,y:918,radius:150},
        {type:1,x:525,y:1305,radius:150},
        {type:1,x:532,y:1091,radius:150},
        {type:1,x:546,y:1383,radius:150},
        {type:1,x:927,y:309,radius:150},
        {type:1,x:627,y:Laya.stage.height-150,radius:150},
        {type:1,x:830,y:1144,radius:150},
        {type:1,x:830,y:1144,radius:150},
        {type:2,x:0,y:0,width:0,height:0},

        // {type:2,x:0,y:0,width:0,height:0},

        {type:1,x:149,y:159,radius:150},
        {type:1,x:412,y:851,radius:150},
        {type:1,x:412,y:851,radius:150},
        {type:2,x:0,y:0,width:0,height:0},
        {type:1,x:152,y:165,radius:150},

        // 引导去前岛
        {type:1,x:405,y:Laya.stage.height-150,radius:150},
        {type:1,x:918,y:749,radius:150},
        {type:2,x:0,y:0,width:0,height:0},
        {type:2,x:0,y:0,width:0,height:0},
        {type:2,x:0,y:0,width:0,height:0},
        {type:1,x:150,y:152,radius:150},
        {type:1,x:252,y:1501,radius:150},

        //引导3D
        {type:2,x:0,y:0,width:0,height:0},
        {type:1,x:149,y:599,radius:150},
        {type:2,x:0,y:0,width:0,height:0},
        {type:1,x:41,y:54,radius:150},
        {type:1,x:84,y:365,radius:150},

        //引导灯塔
        {type:2,x:0,y:0,width:0,height:0},

        //结尾
        {type:2,x:0,y:0,width:0,height:0},
        {type:2,x:0,y:0,width:0,height:0}
    ]

    //小手引导位置
    private littleHand:Array<any> = [
        {type:2,x:0,y:0},
        {type:2,x:0,y:0},
        {type:1,x:930,y:1339},
        {type:1,x:930,y:1339},
        {type:1,x:630,y:1356},
        //特殊
        {type:1,x:620,y:1167},
        {type:1,x:663,y:1422},
        {type:1,x:1029,y:354},
        {type:1,x:453,y:1011},
        {type:1,x:453,y:1011},
        {type:1,x:672,y:1356},
        {type:1,x:620,y:1167},
        {type:1,x:657,y:1428},
        {type:1,x:1029,y:345},
        {type:1,x:780,y:Laya.stage.height-60},
        {type:1,x:905,y:1252},
        {type:1,x:905,y:1252},
        {type:1,x:695,y:1060},

        // {type:2,x:0,y:0},

        {type:1,x:172,y:250},
        {type:1,x:523,y:959},
        {type:1,x:523,y:959},
        {type:1,x:813,y:969},
        {type:1,x:182,y:226},

        // 引导前岛
        {type:1,x:506,y:Laya.stage.height-60},
        {type:1,x:1006,y:813},
        {type:2,x:0,y:0},
        {type:2,x:0,y:0},
        {type:2,x:0,y:0},
        {type:1,x:181,y:271},
        {type:1,x:357,y:1674},

        //引导3D
        {type:1,x:683,y:256},
        {type:1,x:217,y:648},
        {type:2,x:0,y:0},
        {type:1,x:145,y:142},
        {type:1,x:219,y:466},
        //引导灯塔
        {type:2,x:219,y:466},
        //结尾
        {type:2,x:219,y:466},
        {type:2,x:219,y:466},
    ]

    //引导文字
    private guideText:Array<any> = [
        {x: 248, y: 760.5, text: "管家：该起床了。我们马上就要到达夏威夷小岛了。"},
        {x: 248, y: 760.5, text: "。。。。。。。金色的鱼~~原来真的是一场梦。。。"},
        {x: 248, y: 760.5, text: "好了，睡也睡舒服了，快开始搭建我们的海钓王国吧。"},
        {x: 248, y: 760.5, text: "搭建好了，快进来看看吧！点击建筑进入"},
        {x: 258, y: 1571.5, text: "这些建筑等级越高收益越高。这将使金币的主要来源。"},
        //特殊
        {x:297,y:1485.5,text:'解锁了许愿池'},

        {x: 273, y: 1586.5, text: "玩家等级提升会解锁更多的建筑功能"},
        {x: 0, y: 0, text: null},
        {x: 258, y: 1127.5, text: "点击搭建许愿池"},
        {x: 258, y: 1127.5, text: "点击进入许愿池"},
        {x: 273, y: 767.5, text: "升级许愿池"},

        {x: 273, y: 567.5, text: "解锁了海底世界"},

        {x: 303, y: 1535.5, text: "又解锁了新的建筑，快去看一看。"},
        {x:0,y:0,text:null},
        {x:312,y:Laya.stage.height-700,text:'看看小岛另一侧都可以搭建些什么。'},
        {x:294,y:578.5,text:'点击搭建海洋馆'},
        {x:294,y:578.5,text:'点击进入海洋馆'},
        {x:294,y:1162.5,text:'提升玩家等级，并钓到更多种类的鱼，可以解锁更多的展馆'},
        // {x:294,y:379.5,text:'冒险中获得的鱼都会记录在这里'},
        {x:288,y:1014.5,text:null},
        {x:264,y:1129.5,text:'餐厅也是必不可少的经营建筑，点击搭建'},
        {x:264,y:1129.5,text:'点击进入'},
        {x:257,y:1162.5,text:'餐厅每日都会接收到客人的菜单，通过钓鱼获得材料'},
        {x:321,y:535.5,text:null},

        //引导前进
        {x:294,y:808.5,text:null},
        {x:281,y:1085.5,text:'每个小岛都有自己的钓手俱乐部，好像很热闹，快来看一看'},
        {x:271,y:879.5,text:'升级建筑会获得更多的钓手，这些钓手会伴随你一去出航钓鱼'},
        {x:271,y:1127.5,text:'每个钓手的心情都会在工作中降低。如果过低将不会一起同行。'},
        {x:257,y:1171.5,text:'记得经常鼓舞他们！增加他们的心情！'},
        {x:300,y:300,text:null},
        {x:265,y:958.5,text:'点击码头出海看一看，钓鱼是获取建设材料的'},

        //引导3D
        {x:271,y:487.5,text:'鱼点可获得建筑材料，通过手动钓鱼和自动收益都可以获得'},
        {x:304,y:485.5,text:'点击进入小岛区域。'},
        {x:240,y:1132.5,text:'开启的鱼点都会自动获得收益，记得领取这些材料奖励'},
        {x:300,y:300,text:null},
        {x:288,y:838.5,text:null},
        //引导灯塔
        {x:291,y:846.5,text:'点击灯塔，可以查看世界地图'},
        //结尾
        {x:274,y:897.5,text:'管家：我还有点其他事情要做，接下来的王国建设就靠你来探索了'},
        {x:274,y:897.5,text:'欢迎来到海钓王国'},
    ]


    private guideStep:number = 0;

    private tweenFunc:Function = ()=>{};

    constructor() 
    {
        /**监听下一步事件 */
        EventCenter.rigestEvent("nextStep",this.nextStep,this);

        //绘制一个蓝色方块，不被抠图
        this.gameContainer = new Laya.Image();
        // this.gameContainer.loadImage("res/mainMenu/bg.png");
        this.gameContainer.loadImage("");
        // this.gameContainer.left = 0;
        // this.gameContainer .top = 0;
        // this.gameContainer.right = 0;
        // this.gameContainer.bottom = 0;
        // this.gameContainer.alpha = 0;
        console.log(Laya.stage.numChildren)
        Laya.stage.addChild(this.gameContainer);
        this.gameContainer.zOrder = 2;

        // 引导所在容器
        this.guideContainer = new Laya.Sprite();
        // 设置容器为画布缓存
        this.guideContainer.cacheAs = "bitmap";
        Laya.stage.addChild(this.guideContainer);
        this.gameContainer.on("click", this, this.nextStep);
        this.guideContainer.zOrder = 2;

        //绘制遮罩区，含透明度，可见游戏背景
        this.maskArea = new Laya.Sprite();
        this.maskArea.alpha = 0.5;
        let height  = Laya.stage.height > 1920 ? 1920:Laya.stage.height;
        this.height = height;

        let distance = Laya.stage.height - height;
        this.distance = distance;
        this.maskArea.graphics.drawRect(0, distance, Laya.stage.width, height, "#000000");
        this.guideContainer.addChild(this.maskArea);

        //绘制一个圆形区域，利用叠加模式，从遮罩区域抠出可交互区
        this.interactionArea = new Laya.Sprite();
        //设置叠加模式
        this.interactionArea.blendMode = "destination-out";
        this.guideContainer.addChild(this.interactionArea);

        this.hitArea = new Laya.HitArea();
        this.hitArea.hit.drawRect(0, distance, Laya.stage.width, height, "#000000");

        this.guideContainer.hitArea = this.hitArea;
        this.guideContainer.mouseEnabled = true;

        //  //添加一个假区域做遮挡
         this.falsePicture = new Laya.Sprite();
         this.falsePicture.alpha = 0.5;
         this.falsePicture.graphics.drawRect(0,0,Laya.stage.width,distance, "#000000");
         this.falsePicture.zOrder = 5;
         Laya.stage.addChild(this.falsePicture);

         //做一个底部的用
         this.falsePicture1 = new Laya.Sprite();
         this.falsePicture1.alpha = 0.5;
         this.falsePicture1.graphics.drawRect(0,0,Laya.stage.width,-500, "#000000");
         this.falsePicture1.zOrder = 5;
         Laya.stage.addChild(this.falsePicture1);


        //添加小手
        this.tipContainer = new Laya.Image("res/guide/hand.png");
        this.tipContainer.anchorX = 0.5;
        this.tipContainer.anchorY = 0.5;
        this.tipContainer.zOrder = 4;
        Laya.stage.addChild(this.tipContainer);


        //添加文字描述
        this.textContainer = new Laya.Image();
        this.textContainer.anchorX = 0.5;
        this.textContainer.anchorY = 0.5;
        this.textContainer.zOrder = 3;
        // this.textContainer.width = 552;
        // this.textContainer.height = 320;

        let text = new Laya.Text();
        text.text = "从下而上";
        text.fontSize = 40;
        text.align = "left";
        text.color = "#534c4c"
        text.x  = 50;
        text.y  = 50;
        text.wordWrap = true;
        text.width = 480;
        text.leading = 20;
        this.textContainer.addChild(text);

        Laya.stage.addChild(this.textContainer);


        this.nextStep();
    }

    nextStep():void{

        if (this.guideStep == this.guideSteps.length)
        {
            EventCenter.removeEvent("nextStep",this.nextStep,this);
            this.guideContainer.removeSelf();
            this.gameContainer.removeSelf();
            this.tipContainer.removeSelf();
            this.textContainer.removeSelf();
            this.falsePicture.removeSelf();
            this.falsePicture1.removeSelf();
            assetLocalStorage.Instance.tutorialFinished = true;
            GameLocalStorage.Instance.beginnerStep = 2;
        }
        else
        {
            let index = this.guideStep++;
            var step:any = this.guideSteps[index];
            var click:any = this.guideStepClick[index];
            var handel:any = this.littleHand[index];
            var textType:any = this.guideText[index];
            this.hitArea.unHit.clear();
            this.interactionArea.graphics.clear();
            this.maskArea.graphics.clear();
            this.falsePicture.graphics.clear();
            this.falsePicture1.graphics.clear();
            

            //做个效果
            this.maskArea.visible = false;
            this.tipContainer.visible = false;
            this.textContainer.visible = false;
            Laya.timer.once(500,this,()=>{
                this.maskArea.visible      = true;
                this.tipContainer.visible  = true;
                this.textContainer.visible = true;
                let deviation = 0;
                if(step.dir == "center") {
                    deviation = this.distance/2;
                }
    
                //解决适配问题
                if(step.dir == "bottom") {
                    //底部
                    this.maskArea.graphics.drawRect(0, this.distance, Laya.stage.width, this.height, "#000000");
                    this.falsePicture.graphics.drawRect(0,0,Laya.stage.width,this.distance, "#000000");
                }else if(step.dir == "top") {
                    //顶部
                    this.maskArea.graphics.drawRect(0, 0, Laya.stage.width, this.height, "#000000");
                    this.falsePicture.graphics.drawRect(0,Laya.stage.height-this.distance,Laya.stage.width,this.distance, "#000000");
                }else if(step.dir == "center") {
                    //中心位置
                    this.maskArea.graphics.drawRect(0, deviation, Laya.stage.width, this.height, "#000000");
                    //去顶部
                    this.falsePicture.graphics.drawRect(0,0,Laya.stage.width,deviation, "#000000");
                    //去底部
                    this.falsePicture1.graphics.drawRect(0,Laya.stage.height-deviation,Laya.stage.width,deviation, "#000000");
                }
    
                //根据类型判断绘制形状
                if(step.type == 1) {
                    this.interactionArea.graphics.drawCircle(step.x, step.y+deviation,click.radius,"#000000");
                    this.hitArea.unHit.drawCircle(click.x, click.y+deviation,click.radius, "#000000");
                }else if(step.type == 2) {
                    this.interactionArea.graphics.drawRect(step.x, step.y + deviation,step.width,step.height?step.height:this.height,"#000000");
                    this.hitArea.unHit.drawRect(click.x, click.y + deviation,click.width,click.height, "#000000");
                }
    
                //清理动作
                Laya.Tween.clearAll(this.tipContainer);
                this.tipContainer.visible = handel.type == 1;
                this.tipContainer.graphics.clear();
                this.tipContainer.loadImage("res/guide/hand.png")
                this.tipContainer.pos(handel.x, handel.y+deviation);
                this.wobble(handel);
    
                this.textContainer.graphics.clear();
                if(textType.text !== null) {
                    this.textContainer.visible = true;
                    this.textContainer.loadImage("res/guide/tip.png");
                    this.textContainer.pos(textType.x,textType.y+deviation);
                    //渲染文字
                    let text = this.textContainer.getChildAt(0) as Laya.Text;
                    text.text = textType.text;
                }else {
                    this.textContainer.visible = false;
                }
    
                console.log("????",this.guideStep)
    
                if(step.skip) {
                    Laya.timer.once(3000,this,()=>{
                        this.nextStep();
                    })
                }
            })

            this.home();
        }
    }

    home():void {
        if(this.guideStep == 1) {
            // Laya.timer.scale = 0;
        }
    }

    //小手晃动
    wobble(data:any):void {
        this.tweenFunc = ()=>{
            if(this.end) {
                return;
            }
            if(data.type == 1) {
                Laya.Tween.to(this.tipContainer,{scaleX:1.2,scaleY:1.2},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                    Laya.Tween.to(this.tipContainer,{scaleX:1,scaleY:1},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                        this.tweenFunc();
                    }))
                }))
            }else if(data.type == 2) {
                Laya.Tween.to(this.tipContainer,{x:data.moveX,y:data.moveY},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                    Laya.Tween.to(this.tipContainer,{x:data.x,y:data.y},600,Laya.Ease.linearInOut,Laya.Handler.create(this,()=>{
                        this.tweenFunc();
                    }))
                }))
            }
        }
        this.tweenFunc();
    }
}