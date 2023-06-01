export default class MovieImage extends Laya.Script {
    /**
  * 海岛影城播动画
  * @param createMovieClip
  */
    private isSkin: string = "res/image/public/cinema/false_play.png";
    private cinemaPathNum: string[] = [
        "res/image/public/cinema/cinema001.png",
        "res/image/public/cinema/cinema002.png"
    ]


    private cinemaPath002: string[] = [
        "res/image/public/cinema/cinema01.png",
        "res/image/public/cinema/cinema02.png",
    ]


    public func: Function = null;

    private spend: number = 800;



    constructor() { super(); }



    /**
     * 
     * @param img 改变的图片节点
     * @param loop 是否循环播放 0是默认循环
     * @param type 是播放2张 还是4张 默认2张
     */
    public createMovieClip(loop: number = 0, type: number = 0) {
        let list = this.cinemaPathNum; // 2张
        if (type == 1) {
            list = this.cinemaPath002; //4张
        }
        //单次播放
        this.func = () => {
            if (this.func) {
                for (let i: number = 0; i < list.length; i++) {
                    Laya.timer.once(this.spend * (i + 1), this, () => {
                        (this.owner as Laya.Image).skin = this.func !== null ? list[i] : this.isSkin;
                        if (i == list.length - 1) {
                            if (loop == 0) {
                                if (this.func) {
                                    this.func();
                                }
                            }
                        }
                    })
                }
            }
        }
        if (this.func) {
            this.func();
        }
    }


    //销毁
    public closeAim(): void {
        if (this.func) {
            Laya.timer.clear(this, this.func);
            (this.owner as Laya.Image).skin = this.isSkin;
            this.func = null;

        }

    }
}