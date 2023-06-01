

export default class DataManager {

    private static _instance: DataManager = null;

    private data: Map<string, any> = new Map();

    private constructor() { };

    public static get Instance(): DataManager {
        if (DataManager._instance == null) {
            DataManager._instance = new DataManager();
        }
        return DataManager._instance;
    }

    /**加载本地JSON */
    private loadResJson(_callFun: Function, _jsonFile: string[]) {
        let fileCount = _jsonFile.length;
        let arrLoadSuccess = 0;
        for (let i = 0; i < fileCount; i++) {
            // console.log(`res/json/${_jsonFile[i]}.json`);
            Laya.loader.load(`res/json/${_jsonFile[i]}.json`, Laya.Handler.create(this, () => {
                arrLoadSuccess += 1;
                var json: JSON = Laya.loader.getRes(`res/json/${_jsonFile[i]}.json`);
                // console.log("++++++++++++++++++++++回调" + json);
                this.data.set(_jsonFile[i], json);
                if (arrLoadSuccess == fileCount) {
                    _callFun("success", arrLoadSuccess);
                } else {
                    _callFun("loading", +_jsonFile[i], arrLoadSuccess);
                }
            }), null, Laya.Loader.JSON)
        }
    }

    /**获取Json */
    GetJson(_keyName: string) {

        // console.log("尝试获取表", _keyName);
        // console.log("返回表", this.data.get(_keyName));
        return this.data.get(_keyName);
    }


    public get JsonArr() {
        let jsonArr: Array<string> = new Array();
        for (const key in Table.Json) {
            jsonArr.push(Table.Json[key]);
        }
        // console.log(jsonArr);
        return jsonArr;
    }

    /**初始化JSON数据 */
    InitJsonData(_callFun: Function) {

        if (this.JsonArr.length == 0) {
            _callFun();
            return;
        }

        this.loadResJson((res) => {
            if (res == "success") {
                _callFun();


                // console.log("所有表初始化完毕", this.data);
                // console.log("鱼表"+this.GetJson(Table.Json.Fish));
                // console.log("钓手"+this.GetJson(Table.Json.Angler));
                // console.log("钓手俱乐部表"+this.GetJson(Table.Json.AnglerClubs));
                // console.log("建筑表"+this.GetJson(Table.Json.Building));
                // console.log("特殊建筑-海岛影城"+this.GetJson(Table.Json.Cinema));
                // console.log("道具表"+this.GetJson(Table.Json.Item));
                // console.log("订单表"+this.GetJson(Table.Json.Order));
                // console.log("区域表"+this.GetJson(Table.Json.Region));
                // console.log("老虎机表 "+this.GetJson(Table.Json.Tiger));
                // console.log("餐厅表"+this.GetJson(Table.Json.TowerRestaurant));
                // console.log("娱乐城表 "+this.GetJson(Table.Json.happyCity));
                // console.log("海底世界表 "+this.GetJson(Table.Json.underwater));
                // console.log("经验表"+this.GetJson(Table.Json.Level));
                // console.log("岛屿表"+this.GetJson(Table.Json.Island));
                // console.log("鱼点表"+this.GetJson(Table.Json.Fishpoint));







                // console.log(this.GetJson(Table.Json.Angler)["1"]);
                // console.log(this.GetJson(Table.Json.Angler)["1"]);

                // console.log(this.GetJson(Table.Json.Angler)["1"]["id"]);
                // console.log("所有表初始化+++++++++++完毕", this.data);

                // console.log(this.GetJson(Table.Json.Fish)["1"]);
                // console.log(this.GetJson(Table.Json.Fish)["1"]);

                // console.log(this.GetJson(Table.Json.Fish)["1"]["id"]);

                // for (const key in this.data) {
                //     // console.log(this.data[key]);
                // }
            }

        }, this.JsonArr);
    }
}

export class Table {
    public static Json = {
        /** 经验表 */ Level: "Level",
        /** 岛屿表 */ Island: "Island",
        /** 区域表 */ Region: "Region",
        /** 建筑表 */ Building: "Building",
        /** 钓手表 */ Angler: "Angler",
        /** 钓手俱乐部表 */ AnglerClubs: "AnglerClubs",
        /** 道具表 */ Item: "Item",
        /** 特殊建筑-海岛影城 */Cinema: "Cinema",



        /** 鱼点表 */ Fishpoint: "Fishpoint",
        /**老虎机表 */Tiger: "Tiger",
        /**娱乐城表 */happyCity: "happyCity",
        /**海底世界表 */underwater: "underwater",
        /**鱼表 */ Fish: "Fishssss",

        /** 餐厅表 */TowerRestaurant: "TowerRestaurant",
        /** 订单表 */ Order: "Order",
    }


}