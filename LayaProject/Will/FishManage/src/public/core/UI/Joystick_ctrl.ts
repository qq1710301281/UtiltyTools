import InputManager, { Input } from "../Game/InputManager";

export default class Joystick_ctrl extends Laya.Script {
    public trans: Laya.Sprite;

    public dirTrans: Laya.Point;

    //使用设置
    private is2D: boolean = false;//是否2D游戏


    private stick: Laya.Node;//中心圆盘

    public isStarted: boolean = false;//是否开始控制

    private moveContainer: Laya.Sprite;//可活动的父容器
    private moveContainerStartPos: Laya.Point;//可活动的父容器初始值

    /**
     * 公开参数
     */

    public dirStr: string = "";//2D使用的分部局

    public dir: Laya.Point = Laya.Point.create();//弧度

    public last_dir: Laya.Point = Laya.Point.create();//弧度

    public deg: number;//角度

    public isUp: boolean = false;//是否执行一次抬起操作

    public touchNum: number = 0;

    private startFnc: Function;
    public endFnc: Function;


    /**
    * 公开参数 end
    */


    constructor() { super(); }

    onAwake(): void {

        this.dir.x = 0;
        this.dir.y = 0;
        this.deg = 180;

        this.stick = this.owner.getChildByName("Handle");

        this.trans = this.owner as Laya.Sprite;

        this.moveContainer = this.owner.parent as Laya.Sprite;//获取父容器 

        this.moveContainerStartPos = new Laya.Point(this.moveContainer.x, this.moveContainer.y);

        this.owner.getChildByName("Background").on(Laya.Event.MOUSE_DOWN, this, this.on_drag_start)//原来是在按钮上地方按下
        //this.moveContainer.on(Laya.Event.MOUSE_DOWN,this, this.on_drag_start);
        this.moveContainer.on(Laya.Event.MOUSE_UP, this, this.on_drag_end)
        // this.moveContainer.on(Laya.Event.MOUSE_OUT, this, this.on_drag_end)
        this.moveContainer.on(Laya.Event.MOUSE_MOVE, this, this.on_drag_move)

    }

    onStart(): void {
    }

    onUpdate(): void {
        //console.log(this.dirStr);
    }

    // public Reset(){
    //     this.dir.x = 0;
    //     this.dir.y = 0;
    // }

    onDestroy() {
        this.moveContainer.off(Laya.Event.MOUSE_OUT, this, this.on_drag_end)
        this.moveContainer.off(Laya.Event.MOUSE_MOVE, this, this.on_drag_move)
    }

    public SetDragStart(node: Laya.Node, start: Function, end: Function) {
        node.on(Laya.Event.MOUSE_DOWN, this, this.on_drag_start);
        this.startFnc = start;
        this.endFnc = end;
    }

    //初始化当前的坐标等
    public InitStick() {
        this.isUp = true;//抬起来了
        //console.log(`结束`);
        this.isStarted = false;
        var stickNode: Laya.Sprite = this.stick as Laya.Sprite;
        stickNode.pos(0, 0);

        this.last_dir.x = this.dir.x;
        this.last_dir.y = this.dir.y;
        this.dir.x = 0;
        this.dir.y = 0;

        this.dirStr = "中间";
    }


    public on_drag_start(): void {
        // console.log(`在任意地方按下+++++++++++ 按下摇杆上的球`);
        // var point: Laya.Point = this.moveContainer.globalToLocal(new Laya.Point(Laya.MouseManager.instance.mouseX, Laya.MouseManager.instance.mouseY));
        // this.moveContainer.pos(point.x, point.y);
        // var isStart: boolean = true;

        // var touches: Array<Touch> = e.touches;
        // //如果触摸点存在
        // if (touches && touches.length == 1) {
        //     console.log(`触摸点为一个`, touches[0].target);
        // }


        // if(rote_ctrl.instance.toucheNum == 1){
        //     this.touchNum = 2;
        // }
        // else{
        //     this.touchNum = 1;
        // }
        if (this.startFnc) {
            this.startFnc();
        }
        this.isStarted = true;
    }


    public isCaneDo: boolean = false;
    on_drag_end(): void {

        if (this.isStarted == false) {
            return;
        }
        this.isUp = true;//抬起来了
        //console.log(`结束`);
        this.isStarted = false;
        var stickNode: Laya.Sprite = this.stick as Laya.Sprite;
        stickNode.pos(0, 0);
        this.trans.visible = false;
        if (this.outStick) {
            if (this.isCaneDo) {
                this.outStick();
                this.isCaneDo = false;
            }

        }

        this.last_dir.x = this.dir.x;
        this.last_dir.y = this.dir.y;
        this.dir.x = 0;
        this.dir.y = 0;

        this.dirStr = "中间";
        this.touchNum = 0;

        if (this.endFnc) {
            this.endFnc();
        }
    }

    //超出的范围
    private outStick: Function;
    //超出摇杆范围执行的函数
    public SetOutStick(fnc: Function) {
        this.outStick = fnc;
    }

    on_drag_move(): void {

        if (this.isStarted == false) {
            return;
        }


        var selfNode: Laya.Sprite = this.owner as Laya.Sprite;
        var pos: Laya.Point = Laya.Point.create();
        pos.x = Laya.stage.mouseX;
        pos.y = Laya.stage.mouseY;
        selfNode.globalToLocal(pos);// 把stage的全局坐标转换为本地坐标。

        var stickNode: Laya.Sprite = this.stick as Laya.Sprite;

        //摇杆设置类
        var max_R = 120;//最大半径
        var min_R = 20;//最小检测半径

        var pos_x: number = pos.x;
        var pos_y: number = pos.y;
        //更新位置
        var len = pos.distance(0, 0);
        if (len > max_R) {
            pos.x = pos.x * max_R / len;
            pos.y = pos.y * max_R / len;
            // console.log("超出了位置了");
            this.trans.pos(Input.mousePosition.x - pos.x, Input.mousePosition.y - pos.y);
            // this.dirTrans=
            // if (this.outStick) {
            //     this.outStick();
            // }

        }
        else if (len < min_R) {
            stickNode.pos(pos.x, pos.y);
            return;
        }
        stickNode.pos(pos.x, pos.y);

        this.dir.x = pos_x / len;
        this.dir.y = pos_y / len;

        var rad = Math.atan2(pos.x, pos.y);
        this.deg = (180 / Math.PI) * rad;

        var rad = Math.atan2(pos.x, pos.y);

        if ((rad >= -Math.PI / 8 && rad < 0) || (rad >= 0 && rad < Math.PI / 8)) {
            this.dirStr = "DynamicBackward";//下
        } else if ((rad >= 7 * Math.PI / 8 && rad < Math.PI) || (rad >= -Math.PI && rad < -7 * Math.PI / 8)) {
            this.dirStr = "DynamicForward";//上
        } else if (rad >= 3 * Math.PI / 8 && rad < 5 * Math.PI / 8) {
            this.dirStr = "DynamicRight";//右
        } else if (rad >= 5 * Math.PI / 8 && rad < 7 * Math.PI / 8) {
            this.dirStr = "DynamicRight";//右上
        } else if (rad >= Math.PI / 8 && rad < 3 * Math.PI / 8) {
            this.dirStr = "DynamicRight";//右下
        } else if (rad >= -5 * Math.PI / 8 && rad < -3 * Math.PI / 8) {
            this.dirStr = "DynamicLeft";//左
        } else if (rad >= -7 * Math.PI / 8 && rad < -5 * Math.PI / 8) {
            this.dirStr = "DynamicLeft";//左上
        } else {
            this.dirStr = "DynamicLeft";//左下
        }
    }
}