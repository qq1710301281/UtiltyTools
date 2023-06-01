/**
 *任务表数据
 */
export default class OrderData
{

	/**
	 * 任务表
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 描述
	 * @param description:string
	 */
	public description:string = "";

	/**
	 * 订单所需钓鱼区域(区域id）
	 * @param order_region:number
	 */
	public order_region:number = 0;

	/**
	 * 奖励数量
	 * @param order_reward:string
	 */
	public order_reward:string = "";

	/**
	 * 前置开启条件(好评数量)
	 * @param condition:number
	 */
	public condition:number = 0;

	/**
	 * 任务完成所得材料id(item表）
	 * @param mission_id:string
	 */
	public mission_id:string = "";

	/**
	 * 所需材料数量
	 * @param number:string
	 */
	public number:string = "";



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 任务表数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.description = value.description;
		this.order_region = value.order_region;
		this.order_reward = value.order_reward;
		this.condition = value.condition;
		this.mission_id = value.mission_id;
		this.number = value.number;
	}

	/**
	 *
	 */
	public clone():OrderData
	{
		return new OrderData(this.data);
	}

}