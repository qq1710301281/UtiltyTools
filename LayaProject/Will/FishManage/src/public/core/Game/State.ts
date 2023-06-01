//抽象类状态机类
export default abstract class State {
    constructor() { }

    protected _usedCount: number;

    public abstract EnterState(): void;

    public abstract UpdateState(): void;

    public abstract ExitState(): void;
}