import detailed_wnd from "../../../lb/canvas/wnd/detailed_wnd";
import LBData from "../../../lb/dataSheet/LB_Data";
import SoundBolTime, { SoundName } from "../../../lb/manager/SoundBolTime";
import LL_Data from "../../../ll/dataSheet/LL_Data";
import BackpackLocalStorage, { AssetName } from "../../../ll/localStorage/BackpackLocalStorage";
import LLDataSheetManager from "../../../ll/manager/LLDataSheetManager";
import toast_wnd from "../../../public/canvas/wnd/toast_wnd";
import M_Tool from "../../../public/core/Toos/M_Tool";
import Button_ctrl from "../../../public/core/UI/Button_ctrl";
import UI_ctrl from "../../../public/core/UI/UI_ctrl";
import AnglerData from "../../../public/dataSheet/AnglerData";
import FishpointData from "../../../public/dataSheet/FishpointData";
import { Util } from "../../../public/game/Util";
import ui_mrg from "../../../public/manager/ui_mrg";
import Will_Data from "../../dataSheet/Will_Data";
import Will_UtilData from "../../dataSheet/Will_UtilData";
import Will_LocalData from "../../localStorage/Will_LocalData";
import Will_DataManager from "../../manager/Will_DataManager";
import game_wnd from "../wnd/game_wnd";
import goToSea_wnd from "../wnd/goToSea_wnd";

/**
 * 调试窗口用来做鱼的感受的编辑器
 */
export default class main_panel extends UI_ctrl {

    constructor() { super(); }

    private _goToSeaWnd: goToSea_wnd;

    private totalEnergy: number = 100;
    private currentEnergy: number = 50;

    onAwake(): void {
        super.onAwake();

        this.setBtn();
    }

    onUpdate() {

    }

    public Init(goToSeaWnd: goToSea_wnd) {
        this._goToSeaWnd = goToSeaWnd;
    }


    public SetBackBtnFnc(fnc: Function) {
        this.M_ButtonCtrl("l_t/back_btn").setOnClick(() => {
            fnc();
        })
    }


    public GoToFish() {
        
    }

    /**
    * 设置按钮
    */
    private setBtn() {
        this.M_Image("energyBG/energyBar").scaleY = this.currentEnergy / this.totalEnergy;
        this.M_ButtonCtrl("r_b/fish_btn").setOnClick(() => {
            console.log("精力" + this.currentEnergy);
            if (this.currentEnergy >= 10) {
                this.Close();
                this.currentEnergy -= 10;
                //精力重置
                this.M_Image("energyBG/energyBar").scaleY = this.currentEnergy / this.totalEnergy;
                this._goToSeaWnd.Scene3DCtrl.FishGear.fish.LoadRes(this.currentID);
                toast_wnd.Instance.ShowText("精力  -10");


                // toast_wnd.Instance.ShowText("消耗精力");
                (<game_wnd>ui_mrg.Instance.GetUI(Will_Data.Instance.WndName.game_wnd)).Fishing();

           

                // this._goToSeaWnd.Scene3DCtrl.FishGear.CtrlRoot.active = true;
       
            }
            else {
                toast_wnd.Instance.ShowText("精力不足请稍后再试");
                return;
            }

        });

        this.M_Image("c_b/right_btn").visible = false;
        this.M_ButtonCtrl("c_b/right_btn").setOnClick(() => {
            this.M_Image("c_b/left_btn").visible = true;
            this._goToSeaWnd.Scene3DCtrl.CameraCtrl.MoveToCamera(0, () => {
                this.M_Image("c_b/right_btn").visible = false;
            });
        });
        this.M_ButtonCtrl("c_b/left_btn").setOnClick(() => {
            this.M_Image("c_b/right_btn").visible = true;
            this._goToSeaWnd.Scene3DCtrl.CameraCtrl.MoveToCamera(1, () => {
                this.M_Image("c_b/left_btn").visible = false;
            });
        });

        this.M_ButtonCtrl("l_t/area_btn").setOnClick(() => {
            this._goToSeaWnd.FishPointPanel.Show();
        })

        this.M_ButtonCtrl("l_t/back_btn").setOnClick(() => {
            this._goToSeaWnd.Close();
            ui_mrg.Instance.ShowUI(LL_Data.Instance.WndName.Map_wnd);
            // SoundBolTime.getInstance().playMusicBg(SoundName.ATSEAMUSIC);
        })

        this.M_ButtonCtrl("l_t/backpack_btn").setOnClick(() => {
            let itmeCountArr = BackpackLocalStorage.ins.GetMaterialItemArr();
            for (let i = 0; i < this.M_Image("backpack_panel/iconArr").numChildren; i++) {
                (<Laya.Text>this.M_Image("backpack_panel/iconArr").getChildAt(i).getChildByName("content")).text = itmeCountArr[i];
            }
            this.M_Image("backpack_panel").visible = true;

        })
        this.M_ButtonCtrl("backpack_panel/close_btn").setOnClick(() => {
            this.M_Image("backpack_panel").visible = false;
        })

        this.M_ButtonCtrl("l_t/fishMap_btn").setOnClick(() => {
            ui_mrg.Instance.ShowUI(LBData.Instance.WndName.book_wnd);
            Will_UtilData.Instance.IsGoToSeaOfBook = true;
            console.log(Will_UtilData.Instance.IsGoToSeaOfBook);
        })
    }

    //小岛钓鱼区域ID
    private areaID: number;
    //鱼点ID
    private fishPointID: number;

    public Show(fnc: Function = null, when: { area, fishPoint } = null) {
        SoundBolTime.getInstance().playMusicBg(SoundName.ATSEAMUSIC);
        if (!when) {
            //默认进入最高的小岛里进行放置
            this.areaID = Will_UtilData.Instance.IslandCount;
            this.fishPointID = Will_LocalData.Instance.GetFishPointID(this.areaID);//获取当前区域解锁的最高鱼点
        }
        else if (when && when.area != 0 && when.fishPoint == 0) {
            //只传了一个区域
            this.areaID = when.area;
            this.fishPointID = Will_LocalData.Instance.GetFishPointID(this.areaID);//获取当前区域解锁的最高鱼点
        }
        else if (when && when.area == 0 && when.fishPoint != 0) {
            //只传了一个鱼点
            this.areaID = Will_DataManager.Instance.FishPointDataSheet.GetAreaID(when.fishPoint);
            this.fishPointID = when.fishPoint;
        }
        //展示这个主窗口需要通过当前获得解锁区域来展示对应的按钮 初始化区域集合及按钮
        this.initAreaArr();

        super.Show();
    }

    private currentID: number;
    /**
     * 初始化鱼点
     */
    public InitFishPointIcon(fishPointData: FishpointData) {
        this.M_Text("fishPint/content").text = fishPointData.name;
        // this._goToSeaWnd.Scene3DCtrl.FishGear.fish.LoadRes(fishPointData.id);
        console.log("++++++++++++" + fishPointData.id);
        this.currentID = fishPointData.id;
        for (let i = 0; i < this.M_Image("outPut/iconArr").numChildren; i++) {
            let image = this.M_Image("outPut/iconArr").getChildAt(i) as Laya.Image;
            image.visible = false;
        }

        for (let i = 0; i < fishPointData.profitTypeArr.length; i++) {
            if (fishPointData.profitTypeArr[i] == 0 || fishPointData.profitCountArr[i] == 0) {
                continue;
            }
            let image = this.M_Image("outPut/iconArr").getChildAt(i) as Laya.Image;
            image.visible = true;
            // console.log(LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(fishPointData.profitTypeArr[i]));
            // console.log("当前收益类型ID" + fishPointData.profitTypeArr[i]);
            image.skin = LLDataSheetManager.ins.itemDataSheet.getItemDataSkin(fishPointData.profitTypeArr[i]);
        }
    }




    //当前按钮的集合
    private btnArr: Array<Button_ctrl> = new Array<Button_ctrl>();

    /**
     * 初始化区域按钮
     * @param btnIndex 按钮索引 
     */
    private initAreaBtn(btnIndex: number) {
        for (let i = 0; i < this.btnArr.length; i++) {
            this.btnArr[i].disabledBtn = false;
            (<Laya.Image>this.btnArr[i].owner.getChildByName("light")).visible = false;
        }
        console.log("当前的区域ID" + btnIndex);

        this._goToSeaWnd.FishPointPanel.M_Image("regionBG").skin = Will_Data.Instance.AreaPath[btnIndex - 1];

        this.btnArr[btnIndex - 1].disabledBtn = true;
        (<Laya.Image>this.btnArr[btnIndex - 1].owner.getChildByName("light")).visible = true;

        let anglerArr: Array<AnglerData> = LL_Data.Instance.getUnlockAnglers(btnIndex);

        // console.log("钓手信息", anglerArr);
        // let anglerNameArr= ["bantianyinshi","diaoyulaoren","diaoyunvhai","diaoyuqingnian","diaoyushaonian","diaoyushaonv"];

        let anglerNameArr = [];
        for (let i = 0; i < anglerArr.length; i++) {
            anglerNameArr.push(anglerArr[i].model);
        }


        this._goToSeaWnd.Scene3DCtrl.boat.LoadRes(btnIndex, anglerNameArr);
    }


    /**
     * 初始化区域按钮集合
     */
    private initAreaArr() {
        let areaBtnArr = this.M_Image("c_b/areaBtnArr");
        areaBtnArr.destroyChildren();
        this.btnArr = new Array;
        this.currentPosIndex = -1;

        //总共的小岛数量
        for (let i = 0; i < Will_UtilData.Instance.IslandCount; i++) {
            let areaBtn: Button_ctrl = (Util.GetPrefab(Will_Data.Instance.BtnPath.areaBtn)).addComponent(Button_ctrl);
            this.btnArr.push(areaBtn);
            areaBtnArr.addChild(areaBtn.owner);
            (<Laya.Text>areaBtn.owner.getChildByName("content")).text = LLDataSheetManager.ins.islandDataSheet.getIslandData(i + 1).name;

            let areaID = i + 1;
            let fishPointID = Will_LocalData.Instance.GetFishPointID(areaID);//获取当前区域解锁的最高鱼点
            this.setImagePos(areaBtn.owner as Laya.Image, Will_UtilData.Instance.IslandCount - 1);


            areaBtn.setOnClick(() => {
                this.initAreaBtn(areaID);

                this.M_Image("c_b/left_btn").visible = false;
                this.M_Image("c_b/right_btn").visible = false;

                if (this._goToSeaWnd.Scene3DCtrl.CameraCtrl.CurrentPosIndex == 0) {
                    this.M_Image("c_b/right_btn").visible = true;
                    this._goToSeaWnd.Scene3DCtrl.CameraCtrl.MoveToCamera(1, () => {
                        this.M_Image("c_b/left_btn").visible = false;
                    });

                }
                else {
                    this.M_Image("c_b/left_btn").visible = true;
                    this._goToSeaWnd.Scene3DCtrl.CameraCtrl.MoveToCamera(0, () => {
                        this.M_Image("c_b/right_btn").visible = false;
                    });
                }

                this._goToSeaWnd.CloudCtrl(false, () => {

                    //云彩关闭藏起来的逻辑
                    this.InitFishPointIcon(Will_DataManager.Instance.FishPointDataSheet.GetFishpointDataByFishID(fishPointID));
                    this._goToSeaWnd.FishPointPanel.InitFishPointBtnArr(areaID);// 初始化鱼点

                    Laya.timer.once(500, this, () => {
                        //云彩关闭后
                        this._goToSeaWnd.CloudCtrl(true, () => {
                            //云彩打开之后执行的逻辑
                            toast_wnd.Instance.ShowText("欢迎来到" + LLDataSheetManager.ins.islandDataSheet.getIslandData(areaID).name);
                        });
                    })

                });

            })
        }

        this._goToSeaWnd.CloudCtrl(false, () => {

            // 初始化鱼点按钮
            this._goToSeaWnd.FishPointPanel.InitFishPointBtnArr(this.areaID);
            //初始化当前鱼点在主界面的显示
            this.InitFishPointIcon(Will_DataManager.Instance.FishPointDataSheet.GetFishpointDataByFishID(this.fishPointID));
            this.initAreaBtn(this.areaID);

            Laya.timer.once(500, this, () => {
                //云彩关闭后
                this._goToSeaWnd.CloudCtrl(true, () => {
                    //云彩打开之后执行的逻辑
                    toast_wnd.Instance.ShowText("欢迎来到" + LLDataSheetManager.ins.islandDataSheet.getIslandData(this.areaID).name);
                });
            })

        }, 10);


    }

    private posArr = [
        [0],
        [-200, 200],
        [-200, 0, 200],
        [-360, -120, 120, 360],
        [-400, -200, 0, 200, 400],
    ]

    private imagePosY: number = -135;
    private currentPosIndex: number = -1;
    private setImagePos(image: Laya.Image, areaIndex: number) {
        this.currentPosIndex++;
        image.pos(this.posArr[areaIndex][this.currentPosIndex], this.imagePosY);
    }

    onMouseDown() {
        // console.log("鼠标点击");
        let wordPos: Laya.Vector4 = this._goToSeaWnd.Scene3DCtrl.CameraCtrl.ShootRayOnScreen();
        if (wordPos) {
            // console.log(wordPos);
            let screenPos: Laya.Vector2 = new Laya.Vector2(wordPos.x, wordPos.y);

            SoundBolTime.getInstance().playSound(SoundName.GARBAGESOUND);
            let randomCount: number = M_Tool.GetRandomNum(0, 4);
            if (this.currentEnergy > 90) {
                randomCount = M_Tool.GetRandomNum(1, 6);
            }
            // console.log("随机数"+randomCount);
            let targetContent: string;

            let count: number = M_Tool.GetRandomNum(1, 3);
            switch (randomCount) {
                case 0:
                    this.currentEnergy += 10;
                    this.M_Image("energyBG/energyBar").scaleY = this.currentEnergy / this.totalEnergy;
                    targetContent = "精力 +1";
                    break;
                case 1:
                    targetContent = "木头 +" + count;
                    BackpackLocalStorage.ins.changeItemCount(AssetName.木头, count);
                    break;
                case 2:
                    targetContent = "金属 +" + count
                    BackpackLocalStorage.ins.changeItemCount(AssetName.金属, count);
                    break;
                case 3:
                    targetContent = "矿石 +" + count
                    BackpackLocalStorage.ins.changeItemCount(AssetName.矿石, count);
                    break;
                case 4:
                    targetContent = "玉石 +" + count
                    BackpackLocalStorage.ins.changeItemCount(AssetName.玉石, count);

                    break;
                case 5:
                    targetContent = "扳手 +" + count
                    BackpackLocalStorage.ins.changeItemCount(AssetName.扳手, count);

                    break;
                case 6:
                    targetContent = "锤子 +" + count
                    BackpackLocalStorage.ins.changeItemCount(AssetName.锤子, count);

                    break;
            }


            this.ShowEnergy(screenPos, targetContent);
        }

    }

    public ShowEnergy(pos: Laya.Vector2, content: string) {
        Laya.Tween.clearAll(this.M_Text("energy"));
        this.M_Text("energy").text = content;
        this.M_Text("energy").visible = true;
        this.M_Text("energy").pos(pos.x, pos.y);

        Laya.Tween.to(this.M_Text("energy"), { y: this.M_Text("energy").y - 100 }, 2000, Laya.Ease.strongOut, Laya.Handler.create(this, () => {
            this.M_Text("energy").visible = false;
        }));
    }

}