/**
 *老虎机数据
 */
export default class TigerData
{

	/**
	 * 老虎机
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 名称
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * id
	 * @param id_type:number
	 */
	public id_type:number = 0;

	/**
	 * icon
	 * @param icon:string
	 */
	public icon:string = "";

	/**
	 * 奖励类型1
	 * @param reward_type1:number
	 */
	public reward_type1:number = 0;

	/**
	 * 奖励数量
	 * @param reward1:number
	 */
	public reward1:number = 0;

	/**
	 * 权重
	 * @param weight:number
	 */
	public weight:number = 0;



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 老虎机数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.name = value.name;
		this.id_type = value.id_type;
		this.icon = value.icon;
		this.reward_type1 = value.reward_type1;
		this.reward1 = value.reward1;
		this.weight = value.weight;
	}

	/**
	 *
	 */
	public clone():TigerData
	{
		return new TigerData(this.data);
	}

}