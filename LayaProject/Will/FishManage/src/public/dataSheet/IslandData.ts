/**
 *岛屿表数据
 */
export default class IslandData
{

	/**
	 * 岛屿表
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 名字
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * 是否已经购买
	 * 0 未购买
	 * 1 已购买
	 * @param buy:number
	 */
	public buy:number = 0;

	/**
	 * 解锁所需玩家等级
	 * @param level_limit:number
	 */
	public level_limit:number = 0;

	/**
	 * 解锁所需玩家星级
	 * @param star_limit:number
	 */
	public star_limit:number = 0;

	/**
	 * 描述
	 * @param description:string
	 */
	public description:string = "";

	/**
	 * 购买所需金币
	 * @param coin:number
	 */
	public coin:number = 0;

	/**
	 * 购买所需钻石
	 * @param diamond:number
	 */
	public diamond:number = 0;



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 岛屿表数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.name = value.name;
		this.buy = value.buy;
		this.level_limit = value.level_limit;
		this.star_limit = value.star_limit;
		this.description = value.description;
		this.coin = value.coin;
		this.diamond = value.diamond;
	}

	/**
	 *
	 */
	public clone():IslandData
	{
		return new IslandData(this.data);
	}

}