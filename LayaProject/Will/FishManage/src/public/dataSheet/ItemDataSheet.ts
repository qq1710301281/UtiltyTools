import ItemData from "./ItemData";

/**
 *道具表
 */
export default class ItemDataSheet {

	/**
	 *
	 */
	private data: any = null;
	/**
	 *
	 */
	private datasheet: Map<string, ItemData> = new Map();



	/**
	 * 道具表
	 * @param value:any
	 */
	constructor(value: any) {
		this.data = value;
		for (let key in value) {
			this.datasheet.set(key, new ItemData(value[key]));
		}
	}

	/**
	 * 获得指定物品配置数据
	 * @param id:any 物品 ID
	 */
	public getItemData(id: number): ItemData {
		let data: ItemData = null;
		let tempData: ItemData = this.datasheet.get(id + "");
		if (tempData) {
			data = tempData.clone();
		}
		return data;
	}

	public getItemDataSkin(id: number): string {
		let skin:string = "";
		let tempData: ItemData = this.datasheet.get(id + "");
		if (tempData) {
			skin = "res/image/public/itms/" + tempData.icon;
		}
		else
		{
			console.log("这个Item ID不存在 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+id);
		}
		return skin;
	}

	/**
	 * 获得指定   配置数据数组
	 * @param value:any
	 */
	public getItemDatas(): Array<ItemData> {
		let ItemDatas: Array<ItemData> = [];
		for (let entry of this.datasheet.entries()) {
			ItemDatas.push(entry[1].clone());
		}
		return ItemDatas;
	}

}