import DataStorage from "../Data/DataStorage";

//签到逻辑处理脚本
export default class SignInHelper {

    private static signNum: number;//签到次数
    private static today: number;//今天
    private static signDate;//上次签到日期

    private static sevenDayCount: number;//当前七天签到的进度

    //初始化当前硬盘
    public static TimerInit() {
        //如果内部储存中 没有满七天签到
        if (DataStorage.getItem("SevenDayCount") == null || DataStorage.getItem("SevenDayCount") == "") {
            DataStorage.setItem("IsSignInToday", "0");//今天是否签到
            DataStorage.setItem("SevenDayCount", "0");//七天签到次数
        }
        this.sevenDayCount = DataStorage.getIntItem("SevenDayCount", 0);//七日

        // localStorage.setItem("signNum", "6");
        // localStorage.setItem("signDate", "6");
        // localStorage.setItem("signNum", "0");
    }

    // private static once:boolean=false;
    //时间初始化
    public static GetTimerData(): any[] {
        this.today = new Date().getDay();//获取今天是周几
        // this.today = 2;
        //如果今天是周日
        if (DataStorage.getItem("sunday") == "" || DataStorage.getItem("sunday") == null) {
            if (this.today == 0) {
                DataStorage.setItem("sunday", "0");
            }
        }

        this.signNum = this.GetSignNum();//获取签到的次数
        this.signDate = this.GetSignData();//获取上次签到日期

        console.log("上次签到" + this.signDate, "今天" + this.today);
        //如果今天和上次签到的一天是同一天就跳过
        if (this.IsOneDay(this.today, this.signDate)) {
            console.log("今天和上次签到的一天是同一天,今天已经签到");
            //如果今天是周日
            let resultArr;
            // if(this.today==0){
            //     resultArr = [this.signNum, true, this.sevenDayCount];//返回一个结果 0 签到的次数 1 是否签到 2 第几个七天签到

            // }
            // else{
            //     resultArr = [this.signNum, true, this.sevenDayCount];//返回一个结果 0 签到的次数 1 是否签到 2 第几个七天签到
            // }

            resultArr = [this.signNum, true, this.today];//返回一个结果 0 签到的次数 1 是否签到 2 第几个七天签到

            return resultArr;
        }

        //如果不是同一天 就开始新的一天
        console.log(`新的一天++++++++++++++++`);
        //新的签到周期，需要清除签到存档(清楚签到次数和上一次签到日期)
        // if (this.NeedClean()) {
        //     console.log("清理硬盘中的日期");
        //     //移除硬盘中的标签
        //     localStorage.removeItem("signNum");
        //     localStorage.removeItem("signDate");
        // }

        this.signNum = this.GetSignNum();//获取签到的次数  此时再获取如果需要清除存档就会变成0 

        //如果在七日签到内  是否七天的判定就是当天签到的天数 
        if (+localStorage.getItem("IsSevenDay") <= 6) {
            localStorage.setItem("IsSevenDay", this.signNum.toString());

        }

        localStorage.setItem("IsSignInToday", "0");//未签到 就为0

        let resultArr = [this.signNum, false, this.today];//返回一个结果 0 今天是周几 1 是否签到 2 第几个七日签到
        return resultArr;
    }

    //执行签到逻辑
    public static DoSignIn() {
        localStorage.setItem("IsSignInToday", "1")//今天已签到  为 1
        console.log("开始签到++++++++++++++++");
        if (this.today == 0) {
            console.log("周日签到了++++++++++++++++");
            DataStorage.setItem("sunday", "1");
        }

        this.signNum++;
        this.signDate = this.today;
        localStorage.setItem("signDate", this.signDate.toString());//写入签到日期
        localStorage.setItem("signNum", this.signNum.toString());//写入签到次数

        console.log("当前签到的次数" + this.signNum);
        //签到次数到达七天
        if (this.signNum == 7) {
            this.sevenDayCount += 1;
            DataStorage.setItem("SevenDayCount", this.sevenDayCount);
            localStorage.setItem("signNum", "0");
            localStorage.setItem("signDate", this.today.toString());
        }
    }


    //获取签到的次数
    private static GetSignNum(): number {
        if (localStorage.getItem("signNum"))
            return +localStorage.getItem("signNum");
        return 0;

    }

    //获取上次签到日期
    private static GetSignData(): number {
        if (localStorage.getItem("signDate")) {
            return +localStorage.getItem("signDate");
        }
        return -1;

    }

    //判断是否是同一天
    private static IsOneDay(t1: number, t2: number): boolean {
        if (t1 == t2)
            return true;
        return false;
    }

    //需要清除数据(当签到天数大于等于7天或者签到间隔大约一天，则重置数据)
    private static NeedClean(): boolean {
        this.today = new Date().getDay();//获取今天是周几
        this.signNum = this.GetSignNum();//获取签到的次数
        this.signDate = this.GetSignData();//获取上次签到日期
        console.log("清理日期的签到次数" + this.signNum + "今天" + this.today + "上次签到的日期" + this.signDate + "结果" + Math.abs(this.today - this.signDate));
        // //签到天数大于等于7天或者签到间隔大约一天
        // if (this.signNum >= 7 || Math.abs(this.today - this.signDate) > 1)
        //     return true;
        // return false;

        //临时改为 4天
        //签到天数大于等于7天或者签到间隔大约一天
        if (this.signNum >= 3 || Math.abs(this.today - this.signDate) > 1)
            return true;
        return false;
    }



}