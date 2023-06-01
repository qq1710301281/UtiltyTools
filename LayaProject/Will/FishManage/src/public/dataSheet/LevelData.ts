/**
 *经验数据
 */
export default class LevelData
{

	/**
	 * 经验
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 等级
	 * @param level:number
	 */
	public level:number = 0;

	/**
	 * 所需经验
	 * @param exp:number
	 */
	public exp:number = 0;

	/**
	 * 建筑升级金币收益百分比
	 * @param coin_percent:number
	 */
	public coin_percent:number = 0;

	/**
	 * 建筑升级物品收益百分比
	 * @param item_percent:number
	 */
	public item_percent:number = 0;



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 经验数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.level = value.level;
		this.exp = value.exp;
		this.coin_percent = value.coin_percent;
		this.item_percent = value.item_percent;
	}

	/**
	 *
	 */
	public clone():LevelData
	{
		return new LevelData(this.data);
	}

}