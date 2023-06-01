export default class Clock {

    /// <summary>
    /// 1只显示秒，2只显示分秒，3只显示时分秒
    /// </summary>
    //@property({type:cc.Integer,tooltip:"1只显示秒，2只显示分秒，3只显示时分秒"})
    public hms: number = 2;

    //@property({type:cc.Label,tooltip:"显示倒计时的文本"})
    public timeText: Laya.Label = null;

    /// <summary>
    /// 0是倒计时，1是顺计时
    /// </summary>
    //@property({type:cc.Integer,tooltip:"0是倒计时，1是顺计时"})
    public increse: number = 0;

    /// <summary>
    /// 时长
    /// </summary>
    //@property({type:cc.Integer,tooltip:"时长"})
    public timeLength: number = 0;

    /// <summary>
    /// 每个时间步的间隔，单位为秒
    /// </summary>
    //@property({type:cc.Integer,tooltip:"每个时间步的间隔，单位为秒"})
    public timeStep: number = 1.0;

    private _stime: number = 0;
    private _etime: number = 0;

    private _currentCount: number = 0;

    private _hour: number = 0;//时
    private _minute: number = 0;//分
    private _second: number = 0;//秒

    private _isStop: boolean = true;

    /// <summary>
    /// 没一个时间步执行的会掉
    /// </summary>
    private _callback: Function = null;

    /// <summary>
    /// 时间结束时执行的回调
    /// </summary>
    private _completeCallback: Function = null;

    private timer: Laya.Timer = new Laya.Timer();



    /// <summary>
    /// 开始计时
    /// </summary>
    /// <param name="callback">计时执行的回调</param>
    public Play(callback: Function = null, completeCallback: Function = null)  {

        this._callback = callback;
        this._completeCallback = completeCallback;
        this._isStop = false;
        this.timer.clear(this, this.ClockTime);

        this.ClockTime();
        this.timer.loop(this.timeStep * 1000, this, this.ClockTime);
        // this.timer.frameLoop(24, this, this.ClockTime);
    }

    /// <summary>
    /// 停止计时
    /// </summary>
    public Stop()  {
        this.timer.clear(this, this.ClockTime);
        this._isStop = true;
    }

    /// <summary>
    /// 计时重置
    /// </summary>
    public Reset()  {
        this._currentCount = 0;
        this._isStop = true;
    }


    /// <summary>
    /// 时钟计时
    /// </summary>
    /// <returns></returns>
    private ClockTime()  {
        if (this._isStop)  {
            this.timer.clear(this, this.ClockTime);
            return;
        }

        if (this._currentCount < this.timeLength)  {
            this._currentCount++;

            var num: number = 0;

            if (this.increse == 1)  {
                num = this._stime + this._currentCount;
            }
            else if (this.increse == 0)  {
                num = this.timeLength - this._currentCount + this._stime;
            }
            else  {
                this.timer.clear(this, this.ClockTime);
                return;
            }

            //this._hour = Math.floor(num / 3600) % 24;//转换小时 24小时制
            this._hour = Math.floor(num / 3600);//转换小时 
            this._minute = Math.floor((num - this.hour * 3600) / 60);//转换分钟
            this._second = num - (this.hour * 3600 + this.minute * 60);//转换秒数

            var str: string = "";
            if (this.hms == 1)  {
                //str = this.second >= 10 ? "" + this.second : "0" + this.second;
                str = "" + num;
            }
            else if (this.hms == 2)  {
                str = this.minute + ":" + (this.second >= 10 ? "" + this.second : "0" + this.second);
            }
            else if (this.hms == 3)  {
                str = (this.hour >= 10 ? this.hour + ":" : "0" + this.hour + ":") +
                    (this.minute >= 10 ? this.minute + ":" : "0" + this.minute + ":") + (this.second >= 10 ? "" + this.second : "0" + this.second);
            }

            if (this._callback != null)  {
                this._callback(this.second, this.minute, this.hour, str, num);
            }

            if (this.timeText != null)  {
                this.timeText.text = str;
            }
        } else  {
            this._isStop = true;
            this.timer.clear(this, this.ClockTime);

            if (this._completeCallback != null)  {
                this._completeCallback();
            }


            return;
        }

    }

    /// <summary>
    /// 当前计时了多少步
    /// </summary>
    public get currentCount()  {
        return this._currentCount;
    }

    /// <summary>
    /// 小时
    /// </summary>
    public get hour(): number  {

        return this._hour;

    }

    /// <summary>
    /// 分钟
    /// </summary>
    public get minute(): number  {
        return this._minute;
    }

    /// <summary>
    /// 秒钟
    /// </summary>
    public get second(): number  {

        return this._second;
    }

    public get running(): boolean  {
        return !this._isStop;
    }


}
