import SoundBolTime, { SoundName } from "../../../lb/manager/SoundBolTime";
import EventCenter from "../Game/EventCenter";
import { Input } from "../Game/InputManager";

export default class Button_ctrl extends Laya.Script {

    public image: Laya.Image;

    private pathNomal: string = "";
    private pathSelect: string = "";

    private isEffect: boolean = true;//是否点击特效
    private isJustEffect: boolean = true;//正面特效 先大后小
    private isMouseDown: boolean = false;

    private onClickFnc: Function;//点击

    private baseScaleX: number = 1;
    private baseScaleY: number = 1;

    private _scale: number = 1;

    private press: Function;//按住

    private _mouseDown: Function;
    private _mouseMove: Function;
    private _mouseUp: Function;

    public disabledBtn: boolean = false;

    private get scale(): number {
        return this._scale;
    }

    private set scale(value: number) {
        if (this.owner.destroyed) {
            return;
        }

        this._scale = value;
        (<Laya.Sprite>this.owner).scale(this.baseScaleX * this._scale, this.baseScaleY * this._scale, true);
    }


    constructor() {
        super();
    }

    onAwake() {
        this.image = this.owner as Laya.Image;
    }

    public BtnText(textName: string): Laya.Text {
        return this.owner.getChildByName(textName) as Laya.Text;
    }

    onUpdate() {
        if (this.isMouseDown) {
            //长按中
            if (this.press != null) {
                this.press();
            }
        }

    }

    //按住
    public SetPress(press: Function) {
        this.press = press;
    }

    //设置执行一次
    public SetOnce(fnc: Function, delay: number = 0) {
        Laya.timer.once(delay, this, fnc);
    }

    //设置可控检测点击
    public setOnClick(onClick: Function, isShowEffect: boolean = true, isJustEffect: boolean = true) {
        this.onClickFnc = onClick;
        this.isEffect = isShowEffect;
        this.isJustEffect = isJustEffect;
    }

    public SetMouseDown(mouseDown: Function) {
        this._mouseDown = mouseDown;
    }
    public SetMouseMove(mouseMove: Function) {
        this._mouseMove = mouseMove;
    }
    public SetMouseUp(mouseUp: Function) {
        this._mouseUp = mouseUp;
    }

    //设置点击后的状态
    public setClickState(path?) {
        this.pathNomal = path[0];
        this.pathSelect = path[1];
    }

    private isMoveHide: boolean = false;
    //设置移动失效
    public SetMoveHide() {
        this.isMoveHide = true;
    }

    private isClick: boolean = false;


    private isMove: boolean = false;

    private isReset: boolean = false;
    private currentScale: number;
    private resultScale: number;

    //设置重置
    public SetReset(current: number, resultScale) {
        this.isReset = true;
        this.currentScale = current;
        this.resultScale = resultScale;
    }

    //展示放大缩小的效果
    public ShowScaleEffect(scaleNum: number, delay: number = 80, commonNumber: number = 1) {
        Laya.Tween.to(this, { scale: scaleNum }, delay, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(this, { scale: commonNumber }, delay);
        }));
    }

    //设置禁用状态
    public SetDisabeld(isDisabeld: boolean) {
        this.image.disabled = isDisabeld;
    }

    //鼠标按下
    onMouseDown(e: Laya.Event) {
        // if (e.touches.length > 1) {
        //     return;
        // }

        if (this.disabledBtn) {
            return;
        }


        this.isFirstClick = true;

        this.isMouseDown = true;//鼠标按下
        this.isMove = false;//移动
        this.moveTimer = 0;
        this.isOnce = true;//执行一次

        if (this._mouseDown) {
            Laya.Tween.to(this, { scale: 0.8 }, 80);
            this._mouseDown();
        }
        else{
            SoundBolTime.getInstance().playSound(SoundName.Tap);

        }

        if (this.onClickFnc != null) {
            if (!this.isJustEffect) {

            }
            else if (this.isEffect) {
                if (this.isReset) {
                    Laya.Tween.to(this, { scale: this.currentScale }, 80);
                    return;
                }
                // console.log("设置特效了");
                Laya.Tween.to(this, { scale: 0.8 }, 80);
            }
        }
    }



    onMouseUp() {

        if (!this.isMouseDown)
            return;

        this.isMouseDown = false;
        if (this._mouseUp != null) {
            this._mouseUp();//或者离开执行一次
            Laya.Tween.to(this, { scale: 1 }, 80);

        }



        if (this.onClickFnc != null) {


            if (!this.isJustEffect) {
                Laya.Tween.to(this, { scale: 1.3 }, 100, null, Laya.Handler.create(this, () => {
                    Laya.Tween.to(this, { scale: 1 }, 100);
                }));
            }
            else if (this.isEffect) {
                if (this.isReset) {
                    Laya.Tween.to(this, { scale: this.resultScale }, 80);

                }
                else {
                    Laya.Tween.to(this, { scale: 1 }, 80);

                }
            }

            //如果设置了不准移动 就不执行点击逻辑
            if (this.isMoveHide && this.isMove) {
                console.log("移动了");
                return;
            }

            this.onClickFnc(this);
            EventCenter.postEvent("nextStep");
        }

        //如果没有路径
        if (this.pathSelect == "")
            return;

        this.isClick = !this.isClick
        if (this.isClick) {
            this.image.skin = this.pathSelect;
        }
        else {
            this.image.skin = this.pathNomal;

        }

    }

    onMouseOut() {
        if (!this.isMouseDown)
            return;
        this.isMouseDown = false;
        this.isMove = false;
        if (this._mouseUp != null) {
            this._mouseUp();//或者离开执行一次
            Laya.Tween.to(this, { scale: 1 }, 80);
        }

        if (!this.isJustEffect) {
            Laya.Tween.to(this, { scale: 1.2 }, 80, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(this, { scale: 1 }, 80);
            }));
        }
        if (this.onClickFnc != null) {
            //播放音效 
            // Laya.SoundManager.playSound(Table.Sound.click);
            if (this.isEffect) {
                if (this.isReset) {
                    Laya.Tween.to(this, { scale: this.resultScale }, 80);
                    return;
                }
                Laya.Tween.to(this, { scale: 1 }, 80);
            }
        }

    }


    private isOnce: boolean = false;

    private moveTimer: number = 0;
    onMouseMove() {
        if (!this.isMouseDown)
            return;

        this.moveTimer += Laya.timer.delta / 1000;
        if (this.moveTimer >= 0.2) {
            this.isMove = true;
        }

        if (this.isMoveHide) {
            if (this.isOnce) {
                this.isOnce = false;
                Laya.Tween.to(this, { scale: 1 }, 80);
            }

        }

        this.updateMouseDir();//更新鼠标偏移量

        if (this._mouseMove) {
            this._mouseMove();
        }

    }

    private currentMousePos: Laya.Point;//当前鼠标位置
    private lastMousePos: Laya.Point;//上一帧鼠标位置
    private isFirstClick: boolean = false;//是否第一次点击

    private isUpdateDir: boolean = false;//是否进行更新
    public SetUpdateDir() {
        console.log(":设置了");
        this.isUpdateDir = true;
    }

    private mouseDir: Laya.Point = new Laya.Point(0, 0);//获取鼠标的偏移量
    public get MouseDir() {
        return this.mouseDir;
    }

    public get IsMouseDown() {
        return this.isMove;
    }

    //鼠标偏移量更新的函数
    private updateMouseDir() {


        if (!this.isUpdateDir)
            return;


        if (this.isFirstClick) {
            console.log("鼠标的位置", Input.mousePosition);
            this.lastMousePos = Input.mousePosition;
            this.isFirstClick = false;
            return;
        }
        else {
            // console.log("开始更新", this.lastMousePos );
            this.currentMousePos = Input.mousePosition;
            if (this.lastMousePos == null) {
                return;
            }
        }
        // console.log("开始更新");
        this.mouseDir = new Laya.Point(this.currentMousePos.x - this.lastMousePos.x, this.currentMousePos.y - this.lastMousePos.y);
        // console.log("开始更新", this.mouseDir);
    }




}