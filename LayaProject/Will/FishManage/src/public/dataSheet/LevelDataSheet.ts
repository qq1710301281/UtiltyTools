import LevelData from "./LevelData";
/**
 *经验
 */
export default class LevelDataSheet
{
	
	/**
	 *
	 */
	private data:any = null;
	/**
	 *
	 */
	private datasheet:Map<string, LevelData> = new Map();


	
	/**
	 * 经验
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		for(let key in value)
		{
			this.datasheet.set(key, new LevelData(value[key]));
		}
	}
	
	/**
	 * 获得指定   配置数据
	 * @param value:any
	 */
	public getLevelData(value:number):LevelData
	{
		let data:LevelData = null;
		let tempData:LevelData = this.datasheet.get(value+"");
		if(tempData)
		{
			data = tempData.clone();
		}
		return data;
	}
	
	/**
	 * 根据指定经验获得等级
	 * @param exp:any
	 */
	public getLevel(exp:number):number
	{
		let level:number = 1;
		for (let entry of this.datasheet.entries())
		{
			if(exp >= entry[1].exp)
			{
				level = entry[1].level;
			}
		}
		return level;
	}

}