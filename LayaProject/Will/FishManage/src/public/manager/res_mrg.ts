import loading_wnd from "../canvas/wnd/loading_wnd";
import DataManager from "../core/Data/DataManager";
import ui_mrg from "./ui_mrg";


export default class res_mrg extends Laya.Script {

    public static Instance: res_mrg;

    //unity资源集合
    private _unityResPath: Array<string> = new Array<string>();
    //laya资源集合
    private _layaResPath: Array<string> = new Array<string>();

    //加载进度参数
    private _totalNum: number = 0;
    private _nowNum: number = 0;

    //供外部调用的已经加载完毕的参数
    private UnityRes = {};//unity导入过来的资源 scene3D、sprite3D...
    private LayaRes = {};//laua中的资源  sound、prefab...
    private AnimRes = {}//animClip

    public prog: number;//加载进度条比例
    public isLoadFinished: boolean;//是否加载完毕

    public loadingWnd: loading_wnd;//用来更新进度条的面板

    constructor() { super(); }

    onAwake(): void {
        res_mrg.Instance = this;
    }

    private isLoadJson: boolean = false;//是否加载表
    private isShowLoading: boolean = true;//是否显示加载条
    //加载资源
    public PreloadResPkg(layaResArr: Array<string>, unityResArr: Array<string>, backFnc: Function = null, isShowLoading: boolean = true) {
        this._layaResPath = layaResArr;
        this._unityResPath = unityResArr;
        this._backFnc = backFnc;


        //资源总数
        this._totalNum = this._unityResPath.length + this._layaResPath.length;

        // 给表增加一个位置
        if (!this.isLoadFinished) {
            // console.log(this._totalNum);
            this._totalNum += 1;
        }
        // console.log(this._totalNum);

        if (this._totalNum == 0) {
            backFnc();
            return;
        }

        this.isShowLoading = isShowLoading;

        if (this.isShowLoading) {
            console.log("loading展示");
            this.loadingWnd.Show();
        }
        
        if (!this.isLoadFinished) {
            DataManager.Instance.InitJsonData(() => {
                this.checkProg();
                this.isLoadJson = true;
            });
        }
        // console.log(layaResArr,unityResArr);

        // console.log(this._unityResPath);
        //分别加载unity资源
        for (let i = 0; i < this._unityResPath.length; i++) {
            this.loadUnityRes(this._unityResPath[i]);
        }
        //分别加载laya资源
        for (let i = 0; i < this._layaResPath.length; i++) {
            this.loadLayaRes(this._layaResPath[i]);
        }
    }



    private _backFnc: Function;
    //检查进度更新进度条
    checkProg() {
        this._nowNum++;
        this.prog = this._nowNum / this._totalNum;

        // console.log("当前进度>>>>>>" + this.prog);

        //更新进度条
        this.loadingWnd.UpdateProg(this.prog);

        // console.log(this._nowNum,this._totalNum);
        //调用资源加载完成
        if (this._nowNum >= this._totalNum) {
            this.isLoadFinished = true;
            this._nowNum = 0;
            console.log("资源加载完毕+++++++++++++++");
            if (this._backFnc) {
                //执行回调函数
                this._backFnc();
            }
            this.loadingWnd.ResLoadFinish();
        }
    }


    //获取Unity资源
    GetUnityRes(url: string): any {
        // console.log(this.UnityRes);
        return this.UnityRes[url];
    }

    //获取Laya资源
    GetLayaRes(url: string): any {
        return this.LayaRes[url];
    }

    //加载Unity的资源
    private loadUnityRes(url: string) {
        Laya.Scene3D.load(url, Laya.Handler.create(this, function (unityRes) {

            //console.log(unityRes);
            this.UnityRes[url] = unityRes;

            this.checkProg();//检查进度
        }))
    }

    //加载Laya的资源
    private loadLayaRes(url: string) {
        // console.log(url);
        Laya.loader.load(url, Laya.Handler.create(this, function (layaRes) {
            if (layaRes instanceof Laya.Prefab) {
                layaRes.create();
            }
            // console.log(layaRes);
            this.LayaRes[url] = layaRes;

            this.checkProg();//检查进度
        }))
    }

    //释放Unity资源
    reloaseUnityRes(url: string) {
        if (this.UnityRes[url])
            this.UnityRes[url] = null;
    }
    //释放Laya资源
    reloaseLayaRes(url: string) {
        if (!this.LayaRes[url]) {
            return;
        }
        this.LayaRes[url].json = null;
        Laya.loader.clearRes(url);
        this.LayaRes[url] = null;
    }


    //暂时不需要加载动画资源
    private loadAnimRes(url: string) {
        Laya.AnimationClip.load(url, Laya.Handler.create(this, function (animRes) {

            this.AnimRes[url] = animRes;

            this.checkProg();//检查进度
        }))
    }


}