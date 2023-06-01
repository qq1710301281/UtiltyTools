import FishData from "./FishData";
/**
 *鱼表
 */
export default class FishDataSheet {

	/**
	 *
	 */
	private data: any = null;
	/**
	 *
	 */
	private datasheet: Map<string, FishData> = new Map();



	/**
	 * 鱼表
	 * @param value:any
	 */
	constructor(value: any) {
		this.data = value;
		for (let key in value) {
			this.datasheet.set(key, new FishData(value[key]));
		}
	}

	/**
	 * 通过鱼的ID获得奖励的集合
	 * @param fishID 鱼的ID
	 */
	public GetRewardListByFishID(fishID: number) {
		let rewardArr = [];
		let fishData: FishData = this.datasheet.get(fishID + "");
		for (let i = 1; i < 3; i++) {
			if (fishData[`currency${i}`] == 0 || fishData[`price${i}`] == 0) {
				continue;
			}
			rewardArr.push([fishData[`currency${i}`], fishData[`price${i}`]]);
		}
		return rewardArr;
	}

	/**
	 * 获得指定   配置数据
	 * @param value:any
	 */
	public getFishData(value: number): FishData {
		let data: FishData = null;
		let tempData: FishData = this.datasheet.get(value + "");
		if (tempData) {
			data = tempData.clone();
		}
		return data;
	}

	/**
	 * 获得指定   配置数据数组
	 * @param value:any
	 */
	public getFishDatas(): Array<FishData> {
		let FishDatas: Array<FishData> = [];
		for (let entry of this.datasheet.entries()) {
			FishDatas.push(entry[1].clone());
		}
		return FishDatas;
	}

}