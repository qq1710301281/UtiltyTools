import SoundBolTime, { SoundName } from "../../lb/manager/SoundBolTime";
import LLDataSheetManager from "../../ll/manager/LLDataSheetManager";
import Player_Up_wnd from "../canvas/wnd/Player_Up_wnd";
import M_Data from "../dataSheet/M_Data";
import ui_mrg from "../manager/ui_mrg";
import GameLocalStorage from "./GameLocalStorage";
/**
 * 资产的
 */
export default class assetLocalStorage {

    public static get Instance(): assetLocalStorage {
        if (!this.instance) {
            this.instance = new assetLocalStorage;
            this.instance.initData();
        }
        return this.instance;
    }

    private static instance: assetLocalStorage;

    private _assetData: { coin: number, gem: number, points: number, exp: number, star: number, playerLevel: number, sayGood: number, tutorialFinished:boolean } = null;//资产数据

    private initData() {
        let assetData: any = GameLocalStorage.Instance.gameData.assetData;
        if (!assetData) {
            this._assetData = {
                coin: 5000,
                gem: 2,
                points: 0,
                exp: 0,
                star: 0,
                playerLevel: 1,
                sayGood: 0,
                tutorialFinished: false
            };
            //后边写其他的资产等等++++
            this.save();
        }
        else {
            this._assetData = assetData;
        }
    }

    //金币
    public get coin() {
        return this._assetData.coin;
    }
    public set coin(count: number) {
        this._assetData.coin = count;
        this.save();
    }

    //钻石
    public get gem() {
        return this._assetData.gem;
    }
    public set gem(count: number) {
        this._assetData.gem = count;
        this.save();
    }

    /**
     * 获得当前积分
     */
    public get points(): number {
        return this._assetData.points;
    }
    public set points(count: number) {
        this._assetData.points = count;
        this.save();
    }

    /**
     * 获得当前经验
     */
    public get exp(): number {
        return this._assetData.exp;
    }
    public set exp(count: number) {
        this._assetData.exp = count;
        let templevel = this.playerLevel;
        this.playerLevel = LLDataSheetManager.ins.levelDataSheet.getLevel(this._assetData.exp);
        if (templevel != this.playerLevel) {
            (ui_mrg.Instance.GetUI(M_Data.Instance.WndName.Player_Up_wnd) as Player_Up_wnd).Show();
            //音效用法
            SoundBolTime.getInstance().playSound(SoundName.GROWUPSOUND);
        }
        this.save();
    }

    /**
     * 获得当前星评
     */
    public get star(): number {
        return this._assetData.star;
    }
    public set star(count: number) {
        this._assetData.star = count;
        this.save();
    }

    /**
   * 获得当前好评
   */
    public get sayGood(): number {
        return this._assetData.sayGood;
    }
    public set sayGood(count: number) {
        this._assetData.sayGood = count;
        this.save();
    }

    /**
     * 获得玩家等级
     */
    public get playerLevel(): number {
        return this._assetData.playerLevel;
    }
    public set playerLevel(count: number) {
        this._assetData.playerLevel = count;
        this.save();
    }

    /**
     * 新手引导是否完成
     */
    public get tutorialFinished():boolean
    {
        return this._assetData.tutorialFinished;
    }

    /**
     * 新手引导是否完成
     */
    public set tutorialFinished(value:boolean)
    {
        this._assetData.tutorialFinished = value;
        this.save();
    }

    private save() {
        GameLocalStorage.Instance.gameData.assetData = this._assetData;
        GameLocalStorage.Instance.save();
    }
}