import FishpointData from "./FishpointData";
/**
 *鱼点表
 */
export default class FishpointDataSheet {

	/**
	 *
	 */
	private data: any = null;
	/**
	 *
	 */
	private datasheet: Map<string, FishpointData> = new Map();



	/**
	 * 鱼点表
	 * @param value:any
	 */
	constructor(value: any) {
		this.data = value;
		for (let key in value) {
			this.datasheet.set(key, new FishpointData(value[key]));
		}
	}

	/**
	 * 通过鱼点ID获得区域ID
	 * @param fishiPointID 鱼点ID
	 */
	public GetAreaID(fishiPointID: number): number {
		return this.GetFishpointDataByFishID(fishiPointID).region_id;
	}

	/**
	 *  通过玩鱼点的ID 获得某个鱼点数据 
	 * @param fishID:any
	 */
	public GetFishpointDataByFishID(fishPointID: number): FishpointData {
		return this.datasheet.get(fishPointID + "");
	}


	/**
	 * 通过鱼的ID获得区域的ID
	 * @param fishID 鱼ID
	 */
	public GetAreaIDByFishID(fishID: number) {
		for (let entry of this.datasheet.entries()) {
			let fishData: FishpointData = entry[1];
			for (let i = 0; i < fishData.fishIDArr.length; i++) {
				if (fishData.fishIDArr[i] == fishID) {
					console.log("当前的鱼点数据"+fishData.id);
					return fishData.region_id;
				}
			}
		}
		return 1;
	}

	/**
	 * 通过岛屿ID获得鱼点的集合
	 */
	public GetFishPointArrByRegionID(regionID: number): Array<FishpointData> {
		let FishpointDataArr: Array<FishpointData> = new Array<FishpointData>();;

		for (let entry of this.datasheet.entries()) {
			if (entry[1].region_id == regionID) {
				FishpointDataArr.push(entry[1]);
			}
		}

		if (FishpointDataArr.length != 0) {
			return FishpointDataArr;
		}
		return null;
	}

	/**
	 * 获得指定   配置数据数组
	 * @param value:any
	 */
	public getFishpointDatas(): Array<FishpointData> {
		let FishpointDatas: Array<FishpointData> = [];
		for (let entry of this.datasheet.entries()) {
			FishpointDatas.push(entry[1].clone());
		}
		return FishpointDatas;
	}

}