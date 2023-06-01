import IslandData from "./IslandData";
/**
 *岛屿表
 */
export default class IslandDataSheet
{
	
	/**
	 *
	 */
	private data:any = null;
	/**
	 *
	 */
	private datasheet:Map<string, IslandData> = new Map();


	
	/**
	 * 岛屿表
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		for(let key in value)
		{
			this.datasheet.set(key, new IslandData(value[key]));
		}
	}
	
	/**
	 * 获得指定岛屿配置数据
	 * @param value:any
	 */
	public getIslandData(value:number):IslandData
	{
		let data:IslandData = null;
		let tempData:IslandData = this.datasheet.get(value+"");
		if(tempData)
		{
			data = tempData.clone();
		}
		return data;
	}
	
	/**
	 * 获得所有岛屿配置数据数组
	 * @param value:any
	 */
	public getIslandDatas():Array<IslandData>
	{
		let IslandDatas:Array<IslandData> = [];
		for (let entry of this.datasheet.entries())
		{
			IslandDatas.push(entry[1].clone());
		}
		return IslandDatas;
	}

}