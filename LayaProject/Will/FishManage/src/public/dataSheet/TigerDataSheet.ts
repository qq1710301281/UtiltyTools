import TigerData from "./TigerData";
/**
 *老虎机
 */
export default class TigerDataSheet
{
	
	/**
	 *
	 */
	private data:any = null;
	/**
	 *
	 */
	private datasheet:Map<string, TigerData> = new Map();


	
	/**
	 * 老虎机
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		for(let key in value)
		{
			this.datasheet.set(key, new TigerData(value[key]));
		}
	}
	
	/**
	 * 获得指定   配置数据
	 * @param value:any
	 */
	public getTigerData(value:number):TigerData
	{
		let data:TigerData = null;
		let tempData:TigerData = this.datasheet.get(value+"");
		if(tempData)
		{
			data = tempData.clone();
		}
		return data;
	}
	
	/**
	 * 获得指定   配置数据数组
	 * @param value:any
	 */
	public getTigerDatas():Array<TigerData>
	{
		let TigerDatas:Array<TigerData> = [];
		for (let entry of this.datasheet.entries())
		{
			TigerDatas.push(entry[1].clone());
		}
		return TigerDatas;
	}

}