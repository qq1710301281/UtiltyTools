import DataStorage from "../Data/DataStorage";
import M_Tool from "./M_Tool";

/**
 * 离线时间控制器
 */
export default class OfflineTimerCtrl {

    private static instance: OfflineTimerCtrl;

    public static get Instance() {
        if (!OfflineTimerCtrl.instance) {
            OfflineTimerCtrl.instance = new OfflineTimerCtrl;
            this.instance.initData();
        }
        return OfflineTimerCtrl.instance;
    }

    //固定经过标签
    private passTag: string = "fishing_PassTimer_alksjdlkasjdlkjasdlkj";

    //离线时间
    private offlineTime: number = 0;

    private initData() {
        let startTime: number = new Date().getTime();
        let passTime: number = DataStorage.getIntItem(this.passTag, 0);
        this.offlineTime = passTime == 0 ? 0 : startTime - passTime;
        DataStorage.setItem(this.passTag, new Date().getTime());
        Laya.timer.loop(1000, this, () => {
            DataStorage.setItem(this.passTag, new Date().getTime());
        })
    }

    /**
     * 
     * @param timerType 时间类型  0是秒  1是分钟  2 是小时
     */
    public GetOfflineTime(timerType: number): number {
        switch (timerType) {
            case 0:
                return this.offlineTime / 1000;
            case 1:
                return this.offlineTime / 1000 / 60;
            case 2:
                return this.offlineTime / 1000 / 60 / 60;
        }
    }

}