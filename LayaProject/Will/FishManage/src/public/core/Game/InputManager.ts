
export class Input {
    /**
     * 游戏从运行开始经历的时间
     */
    public static mousePosition: Laya.Point = new Laya.Point;

    public static axis: Laya.Point = new Laya.Point;

    public static mouseAxis: Laya.Point = new Laya.Point;

    public static mouseRoll: number = 0;//鼠标滚轮

    /**
     * 获得键盘按键按下状态
     */
    public static getKeyDown(keyCode: KeyCode): boolean {
        if (Input.keyDic[keyCode] == KeyStatus.keyDown) {
            return true;
        }

        return false;
    }

    /**
     * 获得键盘按键按住状态
     */
    public static getKey(keyCode: KeyCode): boolean {
        if (Input.keyDic[keyCode] == KeyStatus.keyDown || Input.keyDic[keyCode] == KeyStatus.press) {
            return true;
        }

        return false;
    }

    /**
     * 获得键盘按键按并释放状态
     */
    public static getKeyUp(keyCode: KeyCode): boolean {
        if (Input.keyDic[keyCode] == KeyStatus.keyUp) {
            return true;
        }

        return false;
    }

    public static keyDic: { [key: number]: number } = {};

}

/**
 * 全局数据管理 跳场景传值用
 */
export default class InputManager extends Laya.Script {

    public static instance: InputManager;
    // public static get instance(): InputManager {
    //     if (this._instance == null) {
    //         var sprite: Laya.Node = new Laya.Node();
    //         sprite.name = "InputManager"
    //         Laya.stage.addChild(sprite);
    //         this._instance = sprite.addComponent(InputManager);
    //         this._instance.init();
    //     }
    //     return this._instance;
    // }

    private discardKeyList: number[] = [];

    private axisDir: Laya.Point = new Laya.Point();

    public init() {
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDownListener);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUpListener);
        Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, this.mouseRoll);

    }

    onAwake() {
        InputManager.instance = this;
        this.init();
    }

    onStart() {
        /*this.node.width = 5000;
        this.node.height = 5000;
        this.node.x = cc.winSize.width / 2;
        this.node.y = cc.winSize.height / 2;

        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>
        {
            event.bubbles = true;
            event.stopPropagation();
        
            cc.log("点击鼠标",event.getLocation());

        },this,false);*/

    }

    /**
     * 启动时间
     */
    public startup() {
        console.log("InputManager 启动输入管理");
        //cc.log("keycode?? ",cc.macro.KEY.num0,cc.macro.KEY.num1,cc.macro.KEY.num3)
    }

    public mouseRoll(e: Laya.Event) {
        let value: number = e.delta;
        Input.mouseRoll = value;
        if (value > 0) {//滚轮滑动增量大于0,向上滚动

        } else {//滚轮滑动增量小于0,向下滚动

        }
        // console.log(`____________鼠标滚动___________${e.delta}______`);
    }

    public onKeyDownListener(event: Laya.Event) {
        var keyCode: number = event.keyCode;

        if (event.keyCode >= 48 && event.keyCode <= 57) {
            keyCode += 48;
        }

        if (!Input.keyDic[keyCode]) {
            Input.keyDic[keyCode] = KeyStatus.keyDown;
        }

    }

    private onKeyUpListener(event: Laya.Event) {
        var keyCode: number = event.keyCode;

        if (event.keyCode >= 48 && event.keyCode <= 57) {
            keyCode += 48;
        }

        Input.keyDic[keyCode] = KeyStatus.keyUp;
    }

    private lastPos: Laya.Point = new Laya.Point(0, 0);
    onUpdate() {
        this.axisDir.x = 0;
        this.axisDir.y = 0;

        if (Input.getKey(KeyCode.LeftArrow) || Input.getKey(KeyCode.A)) {
            this.axisDir.x = -1;

        }

        if (Input.getKey(KeyCode.RightArrow) || Input.getKey(KeyCode.D)) {
            this.axisDir.x = 1;
        }

        if (Input.getKey(KeyCode.UpArrow) || Input.getKey(KeyCode.W)) {
            this.axisDir.y = 1;
        }

        if (Input.getKey(KeyCode.DownArrow) || Input.getKey(KeyCode.S)) {
            this.axisDir.y = -1;
        }

        Input.axis = this.axisDir;

        //鼠标当前的位置
        Input.mousePosition = new Laya.Point(Laya.MouseManager.instance.mouseX, Laya.MouseManager.instance.mouseY);//更新鼠标

        // //判断鼠标往那边移动了
        // if (Input.mousePosition.x > this.lastPos.x) {
        //     Input.mouseAxis.x = 1;
        // }
        // else if (Input.mousePosition.x < this.lastPos.x) {
        //     Input.mouseAxis.x = -1;
        // }
        // else if (Input.mousePosition.x == this.lastPos.x) {
        //     Input.mouseAxis.x = 0;
        // }

        // if (Input.mousePosition.y > this.lastPos.y) {
        //     Input.mouseAxis.y = 1;
        // }
        // else if (Input.mousePosition.y < this.lastPos.y) {
        //     Input.mouseAxis.y = -1;
        // }
        // else if (Input.mousePosition.y == this.lastPos.y) {
        //     Input.mouseAxis.y = 0;
        // }

        // //鼠标上一帧的位置
        // this.lastPos = Input.mousePosition;


    }

    onLateUpdate() {
        for (var i = 0; i < this.discardKeyList.length; i++) {
            delete Input.keyDic[this.discardKeyList[i]];
        }
        this.discardKeyList.length = 0;

        for (var keyCode in Input.keyDic) {
            if (Input.keyDic[keyCode] == KeyStatus.keyDown) {
                Input.keyDic[keyCode] = KeyStatus.press;
            }

            if (Input.keyDic[keyCode] == KeyStatus.keyUp) {
                Input.keyDic[keyCode] = KeyStatus.none;
                this.discardKeyList.push(Number(keyCode));
            }
        }
    }

}

//InputManager.instance.startup();//启动输入管理

export enum KeyStatus {
    none,
    keyDown,
    press,
    keyUp,
}

export enum KeyCode {
    None = 0,

    Space = 32,
    Enter = 13,
    Ctrl = 17,
    Alt = 18,
    Escape = 27,

    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,

    A = 65,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J,
    K,
    L,
    M,
    N,
    O,
    P,
    Q,
    R,
    S,
    T,
    U,
    V,
    W,
    X,
    Y,
    Z,

    F1 = 112,
    F2,
    F3,
    F4,
    F5,
    F6,
    F7,
    F8,
    F9,
    F10,
    F11,
    F12,

    Num0 = 96,
    Num1,
    Num2,
    Num3,
    Num4,
    Num5,
    Num6,
    Num7,
    Num8,
    Num9,

}


