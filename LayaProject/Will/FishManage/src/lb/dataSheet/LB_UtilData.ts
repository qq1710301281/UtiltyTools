
export default class LB_UtilData {

    private static instance: LB_UtilData;

    private constructor(){};

    public static get Instance(): LB_UtilData {
        if (!this.instance) {
            this.instance = new LB_UtilData;
        }
        return this.instance;
    }


    //老虎机奖励
    private reward:any = null;

    //详细信息
    private index:number = null;

    //打开界面显示数据
    private entertainmentData:any = {
        building_id: 4, //建筑id
        level:1, //建筑等级
    };

    /**
     * 接收建筑ID 和 等级
     */
    SetEntertainmentCity(id:number,level:number):void {
        this.entertainmentData.building_id = id;
        this.entertainmentData.level = level;
    }

    /**
     * 获取建筑
     */
    GetEntertainmentCity() {
        return this.entertainmentData;
    }


    /**
     * 设置老虎机奖励
     */
    setReward(item:any):void {
        this.reward = item;
    }


    /**
     * 获取老虎机奖励
     */
    getReward():any {
        return this.reward;
    }


    /**
     * 设置详细信息
     */
    setDetailed(i:number):void {
        this.index = i;
    }


    /**
     * 获取详细信息
     */
    getDetailed():number {
        return this.index;
    }
}