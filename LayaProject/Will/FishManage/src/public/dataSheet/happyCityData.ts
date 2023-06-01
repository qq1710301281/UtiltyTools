/**
 *娱乐城数据
 */
export default class happyCityData
{

	/**
	 * 娱乐城
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 名字
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * 建筑 ID
	 * @param building_id:number
	 */
	public building_id:number = 0;

	/**
	 * 等级
	 * @param level:number
	 */
	public level:number = 0;

	/**
	 * 0未锁定 1锁定
	 * @param lock:number
	 */
	public lock:number = 0;

	/**
	 * 前置解锁条件(娱乐城等级）

	 * @param open_conditions1:number
	 */
	public open_conditions1:number = 0;

	/**
	 * 玩家等级
	 * @param player_lvl:number
	 */
	public player_lvl:number = 0;

	/**
	 * 收益类型(根据item表id）
	 * @param entertainment_profit_type1:number

	 */
	public entertainment_profit_type1:number = 0;

	/**
	 * 收益数量
	 * @param entertainment_profit_1:number
	 */
	public entertainment_profit_1:number = 0;

	/**
	 * 收益类型(根据item表id）
	 * @param entertainment_profit_type2:number
	 */
	public entertainment_profit_type2:number = 0;

	/**
	 * 收益数量
	 * @param entertainment_profit_2:number
	 */
	public entertainment_profit_2:number = 0;

	/**
	 * 可获得奖励(老虎机中id）
	 * @param possible_reward:string
	 */
	public possible_reward:string = "";



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 娱乐城数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.name = value.name;
		this.building_id = value.building_id;
		this.level = value.level;
		this.lock = value.lock;
		this.open_conditions1 = value.open_conditions1;
		this.player_lvl = value.player_lvl;
		this.entertainment_profit_type1 = value.entertainment_profit_type1;
		this.entertainment_profit_1 = value.entertainment_profit_1;
		this.entertainment_profit_type2 = value.entertainment_profit_type2;
		this.entertainment_profit_2 = value.entertainment_profit_2;
		this.possible_reward = value.possible_reward;
	}

	/**
	 *
	 */
	public clone():happyCityData
	{
		return new happyCityData(this.data);
	}

}