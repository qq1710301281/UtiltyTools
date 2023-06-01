import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import { createrFlight } from "./flight";

export default class guide_wnd extends UI_ctrl {


    private hands:Laya.Image = null;


    private textImg:Laya.Image = null;

    private textInput:Laya.TextInput = null;

    private circular:Laya.Image = null;

    constructor() {
        super();
    }


    onAwake() {
        super.onAwake();
        (this.owner as Laya.Image).zOrder = 99;
        (this.owner as Laya.Image).y = 600;
    }


    Show() {
        super.Show();

        /**注册事件 */
        this.M_ButtonCtrl("add_btn").setOnClick(()=>{
            console.log("添加引导小手");
            if(this.hands){return}
            this.hands = new Laya.Image("res/guide/hand.png");
            this.hands.anchorX = 0.5;
            this.hands.anchorY = 0.5;
            this.hands.pos(300,300);
            Laya.stage.addChild(this.hands);
            this.jiantong(1);
        })

        this.M_ButtonCtrl("add_btn1").setOnClick(()=>{
            console.log("添加引导文字")
            if(this.textImg){return}
            this.textImg   = new Laya.Image("res/image/common/black.png");
            this.textImg.width = 552;
            this.textImg.height = 253;
            this.textImg.pos(300,300);
            Laya.stage.addChild(this.textImg)

            this.textInput = new Laya.TextInput();
            this.textInput.skin = "res/guide/tip.png";
            this.textInput.fontSize = 40;
            this.textInput.align = "left";
            this.textInput.valign = "top";
            this.textInput.color = "#534c4c"
            this.textInput.wordWrap = true;
            this.textInput.text = "请输入描述";
            this.textInput.width = 552;
            this.textInput.height = 200;
            this.textImg.addChild(this.textInput);
            this.jiantong(3);
        })

        this.M_ButtonCtrl("add_btn2").setOnClick(()=>{
            console.log("添加引导透明区域")
            if(this.circular){return}
            this.circular = new Laya.Image("res/image/common/circle.png");
            this.circular.width = 300;
            this.circular.height = 300;
            this.circular.pos(300,300);
            this.circular.alpha = 0.9;
            Laya.stage.addChild(this.circular);

            this.jiantong(2);
        })

        this.M_ButtonCtrl("add_btn3").setOnClick(()=>{
            console.log("添加引导结束")



            //添加json
            // let guideSteps = {
            //     type:1,x:this.circular.x+150,y:this.circular.y+150,dir:"bottom"
            // }

            // let littleHand = {
            //     type:1,x:this.hands.x,y:this.hands.y
            // }

            // let guideText = {
            //     x:this.textImg.x,y:this.textImg.y,text:this.textInput.text
            // }

            console.log(`{type:1,x:${this.circular.x+150},y:${this.circular.y+150},dir:'center'}`);
            console.log(`{type:1,x:${this.circular.x+150},y:${this.circular.y+150},radius:150}`);

            console.log(`{type:1,x:${this.hands.x},y:${this.hands.y}}`);
            console.log(`{x:${this.textImg.x},y:${this.textImg.y},text:'${this.textInput.text}'}`)
            this.removeFunc();
        })


        this.M_ButtonCtrl("add_btn4").setOnClick(()=>{
            Laya.timer.scale = 0;
        })

        this.M_ButtonCtrl("add_btn5").setOnClick(()=>{
            Laya.timer.scale = 1;
        })


        this.M_ButtonCtrl("add_btn6").setOnClick(()=>{
            console.log("金币飞行")
            createrFlight(1,new Laya.Point(540,900));
        })
    }



    private down1:boolean = false;
    //监听事件
    jiantong(i:number):void {
        if(i == 2) {
            this.circular.on(Laya.Event.MOUSE_DOWN,this,this.downFunc);
            this.circular.on(Laya.Event.MOUSE_MOVE,this,this.moveFunc);
            this.circular.on(Laya.Event.MOUSE_OUT,this,this.outFunc);
        }

        if(i == 1) {
            this.hands.on(Laya.Event.MOUSE_DOWN,this,this.downFunc);
            this.hands.on(Laya.Event.MOUSE_MOVE,this,this.moveFunc);
            this.hands.on(Laya.Event.MOUSE_OUT,this,this.outFunc);
        }
     
        if(i == 3) {
            this.textImg.on(Laya.Event.MOUSE_DOWN,this,this.downFunc);
            this.textImg.on(Laya.Event.MOUSE_MOVE,this,this.moveFunc);
            this.textImg.on(Laya.Event.MOUSE_OUT,this,this.outFunc);
        }
    }


    //移除
    removeFunc():void {
        this.circular.off(Laya.Event.MOUSE_DOWN,this,this.downFunc);
        this.circular.off(Laya.Event.MOUSE_MOVE,this,this.moveFunc);
        this.circular.off(Laya.Event.MOUSE_OUT,this,this.outFunc);

        this.textImg.off(Laya.Event.MOUSE_DOWN,this,this.downFunc);
        this.textImg.off(Laya.Event.MOUSE_MOVE,this,this.moveFunc);
        this.textImg.off(Laya.Event.MOUSE_OUT,this,this.outFunc);

        this.hands.off(Laya.Event.MOUSE_DOWN,this,this.downFunc);
        this.hands.off(Laya.Event.MOUSE_MOVE,this,this.moveFunc);
        this.hands.off(Laya.Event.MOUSE_OUT,this,this.outFunc);

        this.textInput.destroy();
        this.textImg.destroy();
        this.hands.destroy();
        this.circular.destroy();

        this.circular = null;
        this.textImg = null;
        this.textInput = null;
        this.hands = null;
    }

    currentImg:string = null;

    downFunc(e):void {
        this.currentImg = e.target.skin;
        this.down1 = true;
    }

    moveFunc():void {
        if(this.down1) {
            if(this.currentImg == "res/guide/hand.png") {
                this.hands.x = Laya.stage.mouseX;
                this.hands.y = Laya.stage.mouseY;
            }else if(this.currentImg == "res/image/common/circle.png") {
                this.circular.x = Laya.stage.mouseX - 150;
                this.circular.y = Laya.stage.mouseY - 150;
            }else if(this.currentImg == "res/image/common/black.png") {
                console.log("？？？")
                this.textImg.x = Laya.stage.mouseX - 276;
                this.textImg.y = Laya.stage.mouseY - 126.5;
            }
            
        }
    }


    outFunc():void {
        this.down1 = false;
    }
}