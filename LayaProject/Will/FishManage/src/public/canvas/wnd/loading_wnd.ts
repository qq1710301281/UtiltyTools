import UI_ctrl from "../../core/UI/UI_ctrl";


export default class loading_wnd extends UI_ctrl {
    constructor() { super(); }

    private progBar: Laya.Image;//进度条
    private progText: Laya.Text;//进度文字

    onAwake() {
        super.onAwake();
        this.Init();
    }

    public Init() {
        //进度条
        this.progBar = this.M_Image("progRoot/progBar");
        this.progText = this.M_Text("progRoot/progText");
    }

    //更新进度条
    public UpdateProg(prog) {
        if (!this.M_Image().visible) {
            this.progBar.scaleX = 0;//进度条归零
        }
        this.progBar.scaleX = prog;
        this.progText.text = Math.floor(prog * 100) + " %";
    }

    //资源加载完成
    public ResLoadFinish() {
        // this.Close();//关闭loading
        Laya.timer.once(500, this, () => {
            this.Close();//关闭loading
        })
    }

    public Show() {
        //loading最外层显示
        this.owner.parent.setChildIndex(this.M_Image(), this.owner.parent.numChildren - 1);
        super.Show();
    }
}
