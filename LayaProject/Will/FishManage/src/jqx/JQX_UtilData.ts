export default class JQX_UtilData {
    private static instance: JQX_UtilData;
    constructor() { };
    public static get Instance(): JQX_UtilData {
        if (!this.instance) {
            this.instance = new JQX_UtilData;
        }
        return this.instance;
    }
}