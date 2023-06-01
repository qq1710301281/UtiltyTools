/**
 *鱼表数据
 */
export default class FishData
{

	/**
	 * 鱼表
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 名字
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * 描述
	 * @param description:string
	 */
	public description:string = "";

	/**
	 * 图标
	 * @param icon_name:string
	 */
	public icon_name:string = "";

	/**
	 * 模型
	 * @param model_name:string
	 */
	public model_name:string = "";

	/**
	 * 售卖类型1
	 * @param currency1:number
	 */
	public currency1:number = 0;

	/**
	 * 售卖价格1
	 * @param price1:number
	 */
	public price1:number = 0;

	/**
	 * 售卖类型2
	 * @param currency2:number
	 */
	public currency2:number = 0;

	/**
	 * 售卖价格2
	 * @param price2:number
	 */
	public price2:number = 0;

	/**
	 * 出现权重
	 * @param weight:number
	 */
	public weight:number = 0;

	/**
	 * 难度等级
	 * @param diffcuilty_lv:number
	 */
	public diffcuilty_lv:number = 0;

	/**
	 * 稀有值
	 * @param rarity:number
	 */
	public rarity:number = 0;



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 鱼表数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.name = value.name;
		this.description = value.description;
		this.icon_name = value.icon_name;
		this.model_name = value.model_name;
		this.currency1 = value.currency1;
		this.price1 = value.price1;
		this.currency2 = value.currency2;
		this.price2 = value.price2;
		this.weight = value.weight;
		this.diffcuilty_lv = value.diffcuilty_lv;
		this.rarity = value.rarity;
	}

	/**
	 *
	 */
	public clone():FishData
	{
		return new FishData(this.data);
	}

}