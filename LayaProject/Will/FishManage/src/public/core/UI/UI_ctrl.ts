import res_mrg from "../../manager/res_mrg";
import Button_ctrl from "./Button_ctrl";

export default class UI_ctrl extends Laya.Script {

    /** 储存整个UI的路径表 */
    protected view = {};

    /** 资源表 每段的资源存放在一个集合中 */
    protected layaResPath: {};

    protected unityResPath: {};


    /** 资源分段的数量 */
    protected resCount: number;

    /** 当前资源是否加载过 */
    protected isLoad: boolean;

    constructor() { super(); }

    onAwake(): void {
        this.loadAllInview(this.owner, "");

        //示例
        this.layaResPath = {
            count0: [
                "res/image/common/circle.png",
            ],
            count1: [
                "res/image/common/circle.png",
            ],
        }



        this.resCount = 0;
        this.isLoad = false;

        this.Close();//挂上此脚本之后关闭此窗口
    }

    /**
     * 重置唯一路径
     * 此方法可以反复调用，调用之后再show会再次加载loding条 
     */
    protected resetOnlyPath(path: string[]) {
        this.resCount = 0;
        this.isLoad = false;

        //只遍历第一个索引
        for (const key in this.layaResPath) {
            this.layaResPath[key] = path;
            this.resCount++;
            return;
        }

    }

    //初始化此窗口的子节点到一个表中 方便使用
    private loadAllInview(root: Laya.Node, path: string) {

        // var buttonClick: Laya.Handler = Laya.Handler.create(this, this.playTap, null, false)
        for (var i = 0; i < root.numChildren; i++) {
            var child = root.getChildAt(i);
            if (child instanceof Laya.Image) {
                // console.log(child.getComponent(Button_ctrl));
                if (child.getComponent(Button_ctrl) == null) {
                    if (child.name.search("_btn") != -1) {
                        //如果是_btn为后缀的  添加按钮控制
                        // console.log(child.name);
                        child.addComponent(Button_ctrl);
                    }
                }

            }
            this.view[path + child.name] = child;
            this.loadAllInview(child, child.name + "/");
        }
    }


    //关闭此窗口
    public Close() {
        (<Laya.Image>this.owner).visible = false;
    }

    //展示此窗口
    public Show(delayFnc?: Function, when: any = null) {
        //如果还没有展示
        if (!this.isLoad) {
            this.isLoad = true;
            if (this.resCount == 0) {
                if (delayFnc) {
                    delayFnc();
                }
                this.M_Image().visible = true;
                return;
            }

            //从0开始加载
            let currentResCount: number = 0;
            let layaPathArr: Array<string> = new Array;
            for (const key in this.layaResPath) {
                //分段加载控制
                if (currentResCount == this.resCount) {
                    break;
                }
                for (let i = 0; i < this.layaResPath[key].length; i++) {
                    layaPathArr.push(this.layaResPath[key][i]);
                }
                currentResCount++;
            }

            currentResCount = 0;
            let unityPathArr: Array<string> = new Array;
            for (const key in this.unityResPath) {
                //分段加载控制
                if (currentResCount == this.resCount) {
                    break;
                }
                for (let i = 0; i < this.unityResPath[key].length; i++) {
                    unityPathArr.push(this.unityResPath[key][i]);
                }
                // unityPathArr.concat(this.layaResPath[key]);
                currentResCount++;
            }

            res_mrg.Instance.PreloadResPkg(layaPathArr, unityPathArr, () => {
                if (delayFnc) {
                    delayFnc();
                }
                this.M_Image().visible = true;
            });
            return;
        }

        if (delayFnc) {
            delayFnc();
        }
        this.M_Image().visible = true;
    }

    protected playTap() {
        // Laya.SoundManager.playSound(res_mrg.Instance.tapSound);
    }

    public M_Button(path?: string): Laya.Button {
        if (!path)
            return this.owner as Laya.Button;
        return this.view[path];
    }

    public M_Sprite(path?: string): Laya.Sprite {
        if (!path)
            return this.owner as Laya.Sprite;
        return this.view[path];
    }

    public M_Image(path?: string): Laya.Image {
        if (!path)
            return this.owner as Laya.Image;
        return this.view[path];
    }

    public M_TextInput(path?: string): Laya.TextInput {
        if (!path)
            return this.owner as Laya.TextInput;
        return this.view[path];
    }

    public M_Text(path?: string): Laya.Text {
        if (!path)
            return this.owner as Laya.Text;
        return this.view[path];
    }

    public M_List(path?: string): Laya.List {
        if (!path)
            return this.owner as Laya.List;
        return this.view[path];
    }

    public M_Box(path?: string): Laya.Box {
        if (!path)
            return this.owner as Laya.Box;
        return this.view[path];
    }

    public M_ButtonCtrl(path?: string): Button_ctrl {
        if (path == null)
            return this.owner.getComponent(Button_ctrl);
        return (<Laya.Image>this.view[path]).getComponent(Button_ctrl);
    }
    public M_FontClip(path?: string): Laya.FontClip {
        if (path == null)
            return this.owner as Laya.FontClip;
        return this.view[path];
    }


}