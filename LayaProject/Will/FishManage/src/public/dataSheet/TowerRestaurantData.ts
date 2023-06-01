/**
 *餐厅表数据
 */
export default class TowerRestaurantData
{

	/**
	 * 餐厅表
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 建筑 id
	 * @param building_id:number
	 */
	public building_id:number = 0;

	/**
	 * 等级
	 * @param building_lv:number
	 */
	public building_lv:number = 0;

	/**
	 * 名字
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * 订单数量
	 * @param order_number:number
	 */
	public order_number:number = 0;



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 餐厅表数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.building_id = value.building_id;
		this.building_lv = value.building_lv;
		this.name = value.name;
		this.order_number = value.order_number;
	}

	/**
	 *
	 */
	public clone():TowerRestaurantData
	{
		return new TowerRestaurantData(this.data);
	}

}