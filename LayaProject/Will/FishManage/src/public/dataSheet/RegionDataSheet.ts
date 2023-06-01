import RegionData from "./RegionData";
/**
 *岛屿区域表
 */
export default class RegionDataSheet
{
	
	/**
	 *
	 */
	private data:any = null;
	/**
	 *
	 */
	private datasheet:Map<string, RegionData> = new Map();


	
	/**
	 * 岛屿区域表
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		for(let key in value)
		{
			this.datasheet.set(key, new RegionData(value[key]));
		}
	}
	
	/**
	 * 获得指定   配置数据
	 * @param id:number 区域 ID
	 */
	public getRegionData(id:number):RegionData
	{
		let data:RegionData = null;
		let tempData:RegionData = this.datasheet.get(id+"");
		if(tempData)
		{
			data = tempData.clone();
		}
		return data;
	}
	
	/**
	 * 获得指定岛屿的区域配置数据数组IsLand
	 * @param idLandID:any
	 * @returns Array<RegionData>
	 */
	public getIsLandRegionDatas(isLandID:number):Array<RegionData>
	{
		let datas:Array<RegionData> = [];
		for (let entry of this.datasheet.entries())
		{
			let regionData:RegionData = entry[1].clone();
			if(regionData.island_id == isLandID)
			{
				datas.push(regionData);
			}
			
		}
		return datas;
	}

	/**
	 * 获得区域图片
	 * @param id 
	 */
	public getRegionSkin(id:number):string
	{
		let skin:string = "";
		let tempData:RegionData = this.datasheet.get(id+"");
		if(tempData)
		{
			skin = "res/image/ll/Map_wnd/map/island"+tempData.island_id+"/"+tempData.icon;
		}
		return skin;
	}

}