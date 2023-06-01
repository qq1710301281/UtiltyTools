import TowerRestaurantData from "./TowerRestaurantData";
/**
 *餐厅表
 */
export default class TowerRestaurantDataSheet
{
	
	/**
	 *
	 */
	private data:any = null;
	/**
	 *
	 */
	private datasheet:Map<string, TowerRestaurantData> = new Map();


	
	/**
	 * 餐厅表
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		for(let key in value)
		{
			this.datasheet.set(key, new TowerRestaurantData(value[key]));
		}
	}
	
	/**
	 * 获得指定   配置数据
	 * @param value:any
	 */
	public getTowerRestaurantData(value:number):TowerRestaurantData
	{
		let data:TowerRestaurantData = null;
		let tempData:TowerRestaurantData = this.datasheet.get(value+"");
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
	public getTowerRestaurantDatas():Array<TowerRestaurantData>
	{
		let TowerRestaurantDatas:Array<TowerRestaurantData> = [];
		for (let entry of this.datasheet.entries())
		{
			TowerRestaurantDatas.push(entry[1].clone());
		}
		return TowerRestaurantDatas;
	}

}