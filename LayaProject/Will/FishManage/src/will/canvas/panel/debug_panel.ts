import DataStorage from "../../../public/core/Data/DataStorage";
import Button_ctrl from "../../../public/core/UI/Button_ctrl";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import res_mrg from "../../../public/manager/res_mrg";
import game_wnd from "../../canvas/wnd/game_wnd";
import Will_Data from "../../dataSheet/Will_Data";


/**
 * 调试窗口用来做鱼的感受的编辑器
 */
export default class debug_panel extends UI_ctrl {

    constructor() { super(); }

    private gameWnd: game_wnd;

    fishingjData = {
        fishFroceLow: [50, "鱼最低速率", "鱼影响玩家力度下降的速率"],
        fishFroceHigh: [80, "鱼最高速率", "鱼影响玩家力度上升的速率"],
        playerForce: [200, "玩家操作速率", "玩家力度速率减去鱼的速率为玩家力度上升,因此要比鱼的速率高"],
        playerDurability: [10, "玩家耐力下降", "玩家耐力减少的速率"],
        fishDurability: [30, "鱼耐力下降", "鱼耐力减少的速率"],
        roteRate: [0.2, "力度检测区比例", "力度检测的比例随着鱼竿牛逼而增加"],
    }
    private arr1 = [50, 80, 500, 20, 20, 0.8];
    private arr2 = [50, 80, 300, 20, 20, 0.35];
    private arr3 = [50, 80, 500, 35, 40, 0.1];

    onAwake(): void {
        super.onAwake();
        // this.Show();

        // //执行预加载
        // res_mrg.Instance.PreloadResPkg([this.dataBarPath], [], () => {

        // })

        this.initPanel();

        // this.saveData
    }

    onUpdate() {
        // console.log("aaa");
    }


    public dataArr: Array<number> = new Array;
    /**
     * 初始化硬盘
     */
    private saveData() {
        this.dataArr = new Array;
        for (const key in this.fishingjData) {
            // console.log(key, this.fishingjData[key]);
            let count = +(<Laya.TextInput>this.M_Image("dataBarRoot").getChildByName(key).getChildByName("textInput")).text;

            // let count: number = this.fishingjData[key][0];
            DataStorage.setItem("fish_" + key.toString(), count);//写入到内存中
            this.dataArr.push(count);


        }
    }

    /**
     * 初始化面板
     */
    private initPanel() {
        this.dataArr = new Array;//数据集合

        let line = -1;

        for (const key in this.fishingjData) {
            let count: number = DataStorage.getIntItem("fish_" + key.toString(), this.fishingjData[key][0]);//返回一个默认值
            // this.fishingjData[key][0] = count;//重置这个表
            this.dataArr.push(count);//添加到集合中

            let dataBar: Laya.Image = (res_mrg.Instance.GetLayaRes(Will_Data.Instance.BarPath.dataBarPath) as Laya.Prefab).create() as Laya.Image;;
            dataBar.name = key;
            this.M_Image("dataBarRoot").addChild(dataBar);
            //信息按钮
            let infoBtn: Button_ctrl = dataBar.getChildByName("Info").addComponent(Button_ctrl);
            infoBtn.SetMouseDown(() => {
                this.M_Image("dataBarRoot/dataBarRootTip").visible = true;
                this.M_Text("dataBarRootTip/content").text = this.fishingjData[key][2];

            });
            infoBtn.SetMouseUp(() => {
                this.M_Image("dataBarRoot/dataBarRootTip").visible = false;
            });
            infoBtn.image.on(Laya.Event.MOUSE_OVER, infoBtn.image, () => {
                this.M_Image("dataBarRoot/dataBarRootTip").visible = true;
                this.M_Text("dataBarRootTip/content").text = this.fishingjData[key][2];
            });
            infoBtn.image.on(Laya.Event.MOUSE_OUT, infoBtn.image, () => {
                this.M_Image("dataBarRoot/dataBarRootTip").visible = false;
            });


            //图标
            (<Laya.Text>dataBar.getChildByName("tip")).text = this.fishingjData[key][1];

            //输出文本
            let textInput: Laya.TextInput = (<Laya.TextInput>dataBar.getChildByName("textInput"));
            textInput.text = count.toString();

            //添加按钮
            let addBtn: Button_ctrl = dataBar.getChildByName("add_btn").addComponent(Button_ctrl);
            addBtn.setOnClick(() => {
                if (textInput.text == "" || textInput.text == null) {
                    textInput.text = count.toString();
                }
                let countNum = +textInput.text;
                countNum++;
                textInput.text = countNum.toString();
            });

            let lowBtn: Button_ctrl = dataBar.getChildByName("low_btn").addComponent(Button_ctrl);
            lowBtn.setOnClick(() => {
                if (textInput.text == "" || textInput.text == null) {
                    textInput.text = count.toString();
                }
                let countNum = +textInput.text;
                countNum--;
                textInput.text = countNum.toString();
            });


            line++;
            dataBar.pos(20, 10 + line * (dataBar.height + 10));
        }

        this.M_Image("dataBarRoot").setChildIndex(this.M_Image("dataBarRoot/dataBarRootTip"), this.M_Image("dataBarRoot").numChildren - 1);

    }




    public Init(gameWnd: game_wnd) {
        this.gameWnd = gameWnd;

        this.M_ButtonCtrl("start_btn").setOnClick(() => {
            this.saveData();//保存数据
            this.gameWnd.PullFish();

            this.gameWnd.ResultPanel.Start();
            // this.playingWnd.ShowText("个体的斯特他发噶所谓")
        })

        let isBig = false;
        this.M_ButtonCtrl("dataBarRoot/big_btn").setOnClick(() => {
            this.saveData();
            isBig = !isBig;
            if (isBig) {
                this.M_Text("big_btn/content").text = "><";
                Laya.Tween.to(this.M_Image("dataBarRoot"), { scaleX: 3, scaleY: 3 }, 800, Laya.Ease.circOut);
            }
            else {
                this.M_Text("big_btn/content").text = "<>";
                Laya.Tween.to(this.M_Image("dataBarRoot"), { scaleX: 1, scaleY: 1 }, 800, Laya.Ease.circOut);
            }

        });

        //
        this.M_ButtonCtrl("dataBarRoot/reset_btn").setOnClick(() => {
            Laya.LocalStorage.clear();
            this.dataArr = new Array;
            for (const key in this.fishingjData) {
                // console.log(key, this.fishingjData[key]);
                (<Laya.TextInput>this.M_Image("dataBarRoot").getChildByName(key).getChildByName("textInput")).text = this.fishingjData[key][0];

                // let count: number = this.fishingjData[key][0];
                DataStorage.setItem("fish_" + key.toString(), this.fishingjData[key][0]);//写入到内存中
                this.dataArr.push(this.fishingjData[key][0]);


            }
        })
    }

}