/**
 *海底世界表数据
 */
export default class underwaterData
{

	/**
	 * 海底世界表
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 建筑 id
	 * @param building_id:number
	 */
	public building_id:number = 0;

	/**
	 * 建筑等级
	 * @param building_lv:number
	 */
	public building_lv:number = 0;

	/**
	 * 名字
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * 目标鱼1 id
	 * @param fish1_id:number
	 */
	public fish1_id:number = 0;

	/**
	 * 目标鱼2 id
	 * @param fish2_id:number
	 */
	public fish2_id:number = 0;

	/**
	 * 目标鱼3 id
	 * @param fish3_id:number
	 */
	public fish3_id:number = 0;

	/**
	 * 目标鱼4 id
	 * @param fish4_id:number
	 */
	public fish4_id:number = 0;

	/**
	 * 门票
	 * @param ticket:number
	 */
	public ticket:number = 0;



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 海底世界表数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.building_id = value.building_id;
		this.building_lv = value.building_lv;
		this.name = value.name;
		this.fish1_id = value.fish1_id;
		this.fish2_id = value.fish2_id;
		this.fish3_id = value.fish3_id;
		this.fish4_id = value.fish4_id;
		this.ticket = value.ticket;
	}

	/**
	 *
	 */
	public clone():underwaterData
	{
		return new underwaterData(this.data);
	}

}