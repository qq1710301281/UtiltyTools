
export class Dictionary<KT, VT> {
	private keys: Array<KT> = [];
	private values: Array<VT> = [];
	protected nElements: number;
	private isCache: boolean;
	public get count(): number {
		return this.Count();
	}

	public GetKeyByIndex(index: number): KT {
		return this.keys[index];
	}

	public GetValueByIndex(index: number): VT {
		return this.values[index];
	}

	public constructor(isCache: boolean = true) {
		this.isCache = isCache;
	}

	/**给字典增加一条数据,返回字典的长度 */
	public Add(key: any, value: any): number {
		if (this.ContainsKey(key)) {
			this.SetDicValue(key, value);
		}
		else {

			this.keys.push(key);
			this.values.push(value);
			this.nElements++;
		}
		return this.nElements;
	}

	public Remove(key: any) {
		var index = this.keys.indexOf(key, 0);
		if (index != -1) {
			this.keys.splice(index, 1);
			this.values.splice(index, 1);

			this.nElements--;
		}
	}

	private Count(): number {
		return this.keys.length;
	}

	/**直接使用SetDicValue()修改已经存在的字典数据项，并更新缓存引用 */
	public SetDicValue(key: any, value: any) {
		//如果字典中已经包含这个对象  那么就添加
		if (this.ContainsKey(key)) {
			let index = this.keys.indexOf(key, 0);
			this.keys[index] = key;
			this.values[index] = value;
			return;
		}
		else {
			this.Add(key, value);
		}
	}

	/**
	 *开启"[]"访问的情况下，缓存与字典数据为同一份，引用数据会同时修改，
	 *非引用数据不能被修改，只能访问
	 */
	public GetValue(key: KT): VT {
		var index = this.keys.indexOf(key, 0);
		if (index != -1) {
			return this.values[index];
		}
		return null;
	}

	public GetKeyIndex(key: KT): number {
		var index = this.keys.indexOf(key, 0);
		if (index != -1) {
			return index;
		}
		return null;
	}


	public ContainsKey(key: any): boolean {
		let ks = this.keys;
		for (let i = 0; i < ks.length; ++i) {
			if (ks[i] == key) {
				return true;;
			}
		}
		return false;
	}

	public ContainsValue(value: any): boolean {
		let vs = this.values;
		for (let i = 0; i < vs.length; ++i) {
			if (vs[i] == value) {
				return true;;
			}
		}
		return false;
	}

	public GetKeys(): KT[] {
		return this.keys;
	}

	public GetValues(): VT[] {
		return this.values;
	}

	public Clear() {
		this.keys = [];
		this.values = [];
		this.nElements = 0;
	}

	public isEmpty(): boolean {
		return this.nElements <= 0;
	}
}

