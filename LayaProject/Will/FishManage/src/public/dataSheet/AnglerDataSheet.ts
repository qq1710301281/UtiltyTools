import AnglerData from "./AnglerData";
/**
 *钓手表
 */
export default class AnglerDataSheet
{
	
	/**
	 *
	 */
	private data:any = null;
	/**
	 *
	 */
	private datasheet:Map<string, AnglerData> = new Map();


	
	/**
	 * 钓手表
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		for(let key in value)
		{
			this.datasheet.set(key, new AnglerData(value[key]));
		}
	}
	
	/**
	 * 获得指定钓手配置数据
	 * @param value:any
	 */
	public getAnglerData(value:number):AnglerData
	{
		let data:AnglerData = null;
		let tempData:AnglerData = this.datasheet.get(value+"");
		if(tempData)
		{
			data = tempData.clone();
		}
		return data;
	}

	/**
	 * 获得所有钓手数据
	 */
	public getAnglerDatas():Array<AnglerData>
	{
		let anglerDatas:Array<AnglerData> = [];
		for (let entry of this.datasheet.entries())
		{
			anglerDatas.push(entry[1].clone());
		}
		return anglerDatas;
	}
	
	/**
	 * 获得指定钓手数据数组
	 * @param anglersID:Array<number> 要获得的钓手 ID 数组
	 */
	public getAnglerDatasByAnglersIDs(anglersID:Array<number>):Array<AnglerData>
	{
		let anglerDatas:Array<AnglerData> = [];
		for(let i:number=0; i<anglersID.length; i++)
		{
			for (let entry of this.datasheet.entries())
			{
				if(entry[1].id == anglersID[i])
				{
					anglerDatas.push(entry[1].clone());
				}
			}
		}
		return anglerDatas;
	}

	public getAnglerSkin(anglerData:AnglerData):string
	{
		let skin:string = "";
		for (let entry of this.datasheet.entries())
		{
			if(entry[1].id == anglerData.id)
			{
				skin = "res/image/public/touxiang/"+entry[1].icon+".png";
				break;
			}
		}
		return skin;
	}

}