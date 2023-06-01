import { KeyStatus } from "../../public/core/Game/InputManager";
import MovieClip = Laya.MovieClip;
import Stage = Laya.Stage;
import Browser = Laya.Browser;
import WebGL = Laya.WebGL;

/**
 * 数值转换  最多支持E 可添加
 * @param num 传过来的值
 * @param digits 保留几位 默认两位
 */
export function numberFormatter(num, digits = 2) {
    const si = [
        // { value: 1E18, symbol: 'E' },
        // { value: 1E15, symbol: 'P' },
        // { value: 1E12, symbol: 'T' },
        // { value: 1E9, symbol: 'G' },
        // { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' }
    ]
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
        }
    }
    return num.toString()
}
export default class JQX_Tools {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**调试输出 */
    private static islog: boolean = true;
    public static log(message?: any, ...optionalParams: any[]): void {
        if (JQX_Tools.islog == true) {
            console.log(message, ...optionalParams);
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 计算时间转换成 时 分 秒
     * @param __time  总时间
     * @param __insertHout 不用管
     * @param __insertMinute 不用管
     */
    public static formToTimeString(__time: number, __insertHout: string = ":", __insertMinute: string = ":"): string {
        var __hour: number = Math.floor(__time / 60 / 60 >> 0);
        var __minute: number = Math.floor((__time / 60) % 60);
        var __second: number = Math.floor(__time % 60);
        var __timeTxt: string = "";
        __timeTxt += ((__hour > 100) ? __hour.toString() : (100 + __hour).toString().substr(1)) + __insertHout;
        __timeTxt += ((__minute < 10) ? ("0" + __minute.toString()) : __minute.toString()) + __insertMinute;
        __timeTxt += (__second < 10) ? ("0" + __second.toString()) : __second.toString();

        return __timeTxt;
    }
   
}