
export var SoundName = {
    Tap: "tap",
    //挣扎鱼
    D3STRUGGLE: "zhengzha",            //挣扎
    //点击按钮
    CLICKSOUND: "anniu_tongyong",   //点击按钮 错误操作
    //获取资源
    RESOURCESSOUND: "shouqu",        //获取金币 获取资源 (放置)   //世界地图 购买小岛  //餐厅 制作按钮
    //点击建筑
    ARCHITECTURE: "anniu_jianzhu",   //小岛主界面 点击建筑
    //搭建
    BUILDSOUND: "anniu_dajian",      //小岛主界面 搭建按钮
    //建筑升级
    UPGRADESOUND: "shengjijianzhu",  //小岛主界面  建筑升级成功
    //背景音乐小岛主界面
    ISLEMUSIC: "BJ_xiaodao",          //小岛主界面 背景音乐
    //玩家升级
    GROWUPSOUND: "guzhang",           //小岛主界面  玩家升级音效
    //过场 帷幕(云）
    CLOUDMUSIC: "BJ_jiesuan3d",       //小岛主界面  帷幕(云）
    //海上 背景音乐
    ATSEAMUSIC: "BJ_fangzhi",         //海上 背景音乐
    //海上 点击垃圾
    GARBAGESOUND: "chenggong",        //海上点垃圾   //影城开始放映  //摩天轮交换完成  //钓手俱乐部 鼓舞成功
    //3D背景音乐
    D3MUSIC: "BJ_3ddiaoyu",           //3D背景音乐
    //按住按钮
    PRESSSOUND: "shouxian",           //3D按住按钮
    //松开按钮
    RELEASESOUND: "fangxian",         //3D松开按钮
    //升级结算
    VICTORYSOUND: "win",              //3D胜利结算
    //失败结算
    FAILSOUND: "shibai",              //3D失败结算
    //手动调鱼按钮
    MANUALSOUND: "anniu_diaoyu",      //3D手动钓鱼按钮
    //3D结算背景音乐
    D3SETTLEMENTMUSIC: "BJ_jiesuan3d", //3D结算背景音乐
    //餐厅背景音乐
    RESTAURANTMUSIC: "BJ_canting",     //餐厅背景音乐
    //海底世界背景音乐
    UNDERWATERWORLDMUSIC: "BJ_haiyangguan", //海底世界背景音乐
    //心情增加
    ADDMOODSOUND: "oy",                      //摩天轮心情增加
    //摩天轮背景音乐
    FERRISWHELLMUSIC: "BJ_motianlun",        //摩天轮背景音乐
    //旋转 娱乐城
    ROTATESOUND: "laohuji_zhuandong",        //娱乐城旋转按钮
    //停止 娱乐城
    STOPITSOUND: "laohuji_tingzhi",          //娱乐城停止音效
    //获取奖励
    REWARDSOUND: "laohuji_dingdingding",     //娱乐城获取奖励音效
    //娱乐城背景音乐
    ENTERTAINMENTMUSIC: "BJ_yulecheng",      //娱乐城背景音乐
    //影城背景音乐
    STUDIOMUSIC: "BJ_yingcheng",             //影城音乐
    //钓手俱乐部 背景音乐
    CLUBMUSIC: "BJ_club",                    //钓手俱乐部音乐
    //打字
    DAZISOUND:"dazi",                        //引导打字
}

export default class SoundBolTime {
    private static _instance: SoundBolTime = null;
    private constructor() { };
    static getInstance(): SoundBolTime {
        if (SoundBolTime._instance == null) {
            SoundBolTime._instance = new SoundBolTime();
        }
        return SoundBolTime._instance;
    }

    playSound(py: string, isLoop: boolean = false): void {
        // let soundSwitch = JSON.parse(cache.getInstance().localStorageGetItem('soundSwitch'));
        // if(soundSwitch) {
        if (isLoop) {
            Laya.SoundManager.playSound(`res/sound/${py}.wav`, 0);
            return;
        }
        Laya.SoundManager.playSound(`res/sound/${py}.wav`);
        // }
    }

    public bg: any = null;
    private bgsrc: string = null;
    playMusicBg(py: string): void {
        // let soundSwitch = JSON.parse(cache.getInstance().localStorageGetItem('soundSwitch'));
        // if(soundSwitch) {
        if (Laya.Browser.onWeiXin) {
            this.bg = window['wx'].createInnerAudioContext();
            this.bg.autoplay = true;
            this.bg.loop = true;
            this.bg.src = `res/sound/${py}.mp3`;
            this.bg.play();
        } else {
            console.log("播放")
            Laya.SoundManager.playMusic(`res/sound/${py}.mp3`, 0);
        }

        //加载集合中 上次的音效
        if (this.bgsrc == null) {
            this.bgsrc = `res/sound/${py}.mp3`; //添加音乐
        }
        // }
    }


    /**
     * 关闭恢复上一个音效
     */
    closeMusic(): void {
        //播放上一个音效
        if (this.bgsrc) {
            Laya.SoundManager.playMusic(this.bgsrc, 0);
        }
    }

    //停止播放
    stopMusicBg(): void {
        if (Laya.Browser.onWeiXin) {
            this.bg.stop();
        } else {
            Laya.SoundManager.stopMusic();
        }
    }
}