export default class StopOnclick extends Laya.Script {
    onClick(event: Laya.Event) {
        event.stopPropagation();
    }
}
