interface QueueObj {
    [propName: number]: any;
}
export class Queue<T> {

    // private elements: Array<T>;
    // private _size: number | undefined;

    // public constructor(capacity?: number) {
    //     this.elements = new Array<T>();
    //     this._size = capacity;
    // }

    private count: number;
    private lowestCount: number;
    private items: QueueObj;

    constructor() {
        this.count = 0;
        this.lowestCount = 0;
        this.items = {};
    }

    public push(item: T) {
        // if (o == null) {
        //     return false;
        // }
        // //如果传递了size参数就设置了队列的大小
        // if (this._size != undefined && !isNaN(this._size)) {
        //     if (this.elements.length == this._size) {
        //         this.pop();
        //     }
        // }
        // this.elements.unshift(o);
        // return true;

        // 队列的末尾添加元素: 将队列的大小作为key
        this.items[this.count] = item;
        this.count++;
    }

    //根据索引获得值
    public getValue(index: number): T {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.lowestCount + index];
    }

    public get LowestCount() {
        return this.lowestCount;
    }

    public top(): T {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.lowestCount];
        // return this.elements[0];
    }

    public pop(): T {
        if (this.isEmpty()) {
            return undefined;
        }
        const result = this.items[this.lowestCount];
        // 删除队首元素
        delete this.items[this.lowestCount];
        // 队首元素自增
        this.lowestCount++;
        return result;
        // return this.elements.pop();
    }

    isEmpty() {
        return this.count - this.lowestCount === 0;
    }

    public get length(): number {
        // return this.elements.length;
        return this.count - this.lowestCount;
    }

    public empty(): boolean {
        return this.length == 0;
    }

    public clear() {
        this.count = 0;
        this.lowestCount = 0;
        this.items = {};

        // delete this.elements;
        // this.elements = new Array<T>();
    }
}
