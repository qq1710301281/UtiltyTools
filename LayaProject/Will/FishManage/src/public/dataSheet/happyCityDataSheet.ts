import happyCityData from "./happyCityData";
/**
 *娱乐城
 */
export default class happyCityDataSheet
{
	
	/**
	 *
	 */
	private data:any = null;
	/**
	 *
	 */
	private datasheet:Map<string, happyCityData> = new Map();


	
	/**
	 * 娱乐城
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		for(let key in value)
		{
			this.datasheet.set(key, new happyCityData(value[key]));
		}
	}
	
	/**
	 * 获得指定   配置数据
	 * @param value:any
	 */
	public gethappyCityData(value:number):happyCityData
	{
		let data:happyCityData = null;
		let tempData:happyCityData = this.datasheet.get(value+"");
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
	public gethappyCityDatas():Array<happyCityData>
	{
		let happyCityDatas:Array<happyCityData> = [];
		for (let entry of this.datasheet.entries())
		{
			happyCityDatas.push(entry[1].clone());
		}
		return happyCityDatas;
	}


	/**
	 * 获取指定的娱乐城数据
	 * @param building_id  娱乐城building_id
	 * @param level 娱乐城的等级
	 */
	public gethappyCityDataItemDatas(building_id:number,level:number):happyCityData {
		let data:happyCityData = null;
		for (let i in this.data) {
			if(this.data[i].building_id == building_id && this.data[i].level == level) {
				data = this.gethappyCityData(Number(i));
				return data;
			}
		}
	}
}