
export class NumArray {
	private arr: Array<number> = new Array;

	constructor(arr) {
		this.arr = arr;
		// console.log(this.arr);
	}
	/**
	 * 求这个集合的和
	 */
	public Sum(index: number = this.arr.length): number {
		let toatalCount: number = 0;
		for (let i = 0; i < index; i++) {
			toatalCount += this.arr[i];
		}
		return toatalCount;
	}

	public get count(): number {
		return this.arr.length;
	}

	public GetValue(index: number): number {
		return this.arr[index];
	}
}

