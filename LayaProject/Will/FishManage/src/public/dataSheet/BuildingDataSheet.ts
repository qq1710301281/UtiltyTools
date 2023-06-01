import GameConstants from "../../ll/other/GameConstants";
import BuildingData from "./BuildingData";
/**
 *建筑表
 */
export default class BuildingDataSheet {

	/**
	 *
	 */
	private data: any = null;
	/**
	 *
	 */
	private datasheet: Map<string, BuildingData> = new Map();



	/**
	 * 建筑表
	 * @param value:any
	 */
	constructor(value: any) {
		this.data = value;
		for (let key in value) {
			this.datasheet.set(key, new BuildingData(value[key]));
		}
	}

	/**
	 * 获得指定建筑指定等级配置数据
	 * @param building_id:number 建筑 ID
	 * @param level:number 建筑等级
	 */
	public getBuildingData(building_id: number, level: number): BuildingData {
		let buildingData: BuildingData = null;
		for (let entry of this.datasheet.entries()) {
			if (entry[1].type == GameConstants.BUILDING_TYPE_2) {
				if (entry[1].building_id == building_id && entry[1].level >= level) {
					buildingData = entry[1].clone();
					break;
				}
			}
			else if (entry[1].type == GameConstants.BUILDING_TYPE_3) {
				if (entry[1].building_id == building_id && entry[1].level == level) {
					buildingData = entry[1].clone();
					break;
				}
			}
			else
			{
				if (entry[1].building_id == building_id && entry[1].level == level) {
					buildingData = entry[1].clone();
					break;
				}
			}
		}
		return buildingData;
	}

	/**
	 * 获得指定类型的所有最低等级的建筑 配置数据
	 * @param types.indexOf():Array<number> 建筑类型数组 [1].indexOf(entry[1].type) >= 0
	 */
	public getIsLandBuildings(types: Array<number>): Array<BuildingData> {
		let buildingDatas: Array<BuildingData> = [];
		let currentBuildingID: number = -1;
		for (let entry of this.datasheet.entries()) {
			if ((types.indexOf(entry[1].type) >= 0) && (currentBuildingID != entry[1].building_id)) {
				currentBuildingID = entry[1].building_id;
				let buildingData: BuildingData = entry[1].clone();
				if (buildingData.level > 1) {
					buildingData.level = 1;
				}
				buildingDatas.push(buildingData);
			}
		}
		return buildingDatas;
	}

	/**
	 * 获得建筑最大等级
	 * @param building_id:number 建筑 ID
	 */
	public getBuildingMaxLevel(building_id:number):number
	{
		let maxLevel:number = 0;
		for (let entry of this.datasheet.entries()) {
			if (entry[1].building_id == building_id) {
				maxLevel = entry[1].level;
			}
		}
		return maxLevel;
	}

	/**
	 * 获取指定岛屿所有建筑最大等级之和
	 * @param island_id 
	 */
	public getIsLandBuildingLevelMax(island_id:number):number
	{
		let maxLevel:number = 0;
		let currentBuildingID: number = -1;
		for (let entry of this.datasheet.entries())
		{
			if (entry[1].island_id == island_id)
			{
				if(currentBuildingID != entry[1].building_id)
				{
					currentBuildingID = entry[1].building_id;
					maxLevel += this.getBuildingMaxLevel(entry[1].building_id);
				}
			}
		}
		return maxLevel;
	}

	/**
	 * 获得所有岛屿中 指定特殊建筑 最低等级 配置数据数组
	 */
	public getSpecialBuildings(building_type:number):Array<BuildingData>
	{
		let currentBuildingID:number = 0;
		let buildings:Array<BuildingData> = [];
		for (let entry of this.datasheet.entries())
		{
			if (entry[1].building_type == building_type)
			{
				if(currentBuildingID != entry[1].building_id)
				{
					currentBuildingID = entry[1].building_id;
					buildings.push(entry[1].clone());
				}
			}
		}
		return buildings;
	}

	/**
	 * 获得 建筑所属 岛屿 ID
	 */
	public getIsland(building_id:number):number
	{
		let isladn_id:number = 0;
		for (let entry of this.datasheet.entries())
		{
			if (entry[1].building_id == building_id)
			{
				isladn_id = entry[1].island_id;
				break;
			}
		}
		return isladn_id;
	}

	/**
	 * 获得指定岛屿指定类型的 特殊建筑 ID
	 * @param island_id 
	 * @param building_type 
	 */
	public getSpecialBuildingID(island_id:number, building_type:number):number
	{
		let building_id:number = 0;
		for (let entry of this.datasheet.entries())
		{
			if (entry[1].island_id == island_id && entry[1].building_type == building_type)
			{
				building_id = entry[1].building_id;
				break;
			}
		}
		return building_id;
	}

	/**
	 * 获得建筑图标
	 * @param buildingData 
	 */
	public getBuildingSkin(buildingData:BuildingData):string
	{
		return "res/image/ll/Building/island"+buildingData.island_id+"/"+buildingData.icon;
	}

}
