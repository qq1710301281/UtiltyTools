//观察者模式
export default class EventCenter {

    private static events: Map<string, Array<EventHandler>> = new Map<string, Array<EventHandler>>();

    //注册
    static rigestEvent(eventName: string, callback: Function, target: object): void {
        if (eventName == undefined || callback == undefined || target == undefined) {
            throw Error("reigst event error");
        }

        if (EventCenter.events[eventName] == undefined) {
            EventCenter.events[eventName] = new Array<EventHandler>();
        }

        let handler = new EventHandler(target, callback);

        EventCenter.events[eventName].push(handler);
    }


    //派发
    static postEvent(eventName: string, param?: any): void {

        let handlers = EventCenter.events[eventName];

        if (handlers == undefined) {
            return;
        }

        for (let i = 0; i < handlers.length; i++) {

            let handler = handlers[i];

            if (handler) {
                try {
                    handler.func.call(handler.target, param);
                } catch (e) {
                    console.log(e.message);
                    console.log(e.stack.toString());
                }
            }
        }
    }

    //移除
    static removeEvent(eventName: string, callback: Function, target: object) {
        let handlers = EventCenter.events[eventName];

        if (handlers == undefined) {
            return;
        }

        for (let i = 0; i < handlers.length; i++) {
            let handler = handlers[i];
            if (handler != undefined)
            {
                if(handler.target != undefined || handler.func == callback) {
                    //    handlers.splice(i,1);
                    console.log(this.events);
                    
                    handlers[i] = undefined;
                    break;
                }
            }
        }
    }
}


export class EventHandler {
    target: object;
    func: Function;

    constructor(target: object, func: Function) {
        this.target = target;
        this.func = func;
    }
}