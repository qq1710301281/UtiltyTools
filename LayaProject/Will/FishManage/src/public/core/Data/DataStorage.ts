
export default class DataStorage {
    
    public static getItem(key: string, defaultValue: any = null): any  {
        var value = this.getStorage(key);

        if (!value)
            return defaultValue;

        return value;
    }


    public static getIntItem(key: string, defaultValue: number): number  {
        var value = parseInt(this.getStorage(key));

        if (!value)
            return defaultValue;

        return value;
    }

    public static getFloatItem(key: string, defaultValue: number): number  {
        var value = parseFloat(this.getStorage(key));

        if (!value)
            return defaultValue;

        return value;
    }

    public static setItem(key: string, value: any)  {

        this.setStorage(key, value);

    }

    public static getStorage(key: string): any  {
        return Laya.LocalStorage.getItem(key);
    }

    public static setStorage(key: string, value: any): any  {
        Laya.LocalStorage.setItem(key, value);
    }

    public static removeItem(key: string)  {
        return Laya.LocalStorage.removeItem(key);
    }

    public static clearAll(){
        Laya.LocalStorage.clear();
    }

}
