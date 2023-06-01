import underwaterData from "./underwaterData";
/**
 *海底世界表
 */
export default class underwaterDataSheet
{
	
	/**
	 *
	 */
	private data:any = null;
	/**
	 *
	 */
	private datasheet:Map<string, underwaterData> = new Map();


	
	/**
	 * 海底世界表
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		for(let key in value)
		{
			this.datasheet.set(key, new underwaterData(value[key]));
		}
	}
	
	/**
	 * 获得指定   配置数据
	 * @param value:any
	 */
	public getunderwaterData(value:number):underwaterData
	{
		let data:underwaterData = null;
		let tempData:underwaterData = this.datasheet.get(value+"");
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
	public getunderwaterDatas():Array<underwaterData>
	{
		let underwaterDatas:Array<underwaterData> = [];
		for (let entry of this.datasheet.entries())
		{
			underwaterDatas.push(entry[1].clone());
		}
		return underwaterDatas;
	}


	/**
	 * 获取指定的娱乐城数据
	 * @param building_id  娱乐城building_id
	 * @param level 娱乐城的等级
	 */
	public gethappyCityDataItemDatas(building_id:number,level:number):underwaterData {
		let data:underwaterData = null;
		for (let i in this.data) {
			if(this.data[i].building_id == building_id && this.data[i].building_lv == level) {
				data = this.getunderwaterData(Number(i));
				return data;
			}
		}
	}

}