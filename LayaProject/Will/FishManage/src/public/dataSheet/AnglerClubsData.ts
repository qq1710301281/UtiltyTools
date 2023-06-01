/**
 *钓手俱乐部表数据
 */
export default class AnglerClubsData
{

	/**
	 * 钓手俱乐部表
	 * @param id:number
	 */
	public id:number = 0;

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
	 * 解锁钓手
	 * @param angler_id:string
	 */
	public angler_id:string = "";



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 钓手俱乐部表数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.building_id = value.building_id;
		this.level = value.level;
		this.angler_id = value.angler_id;
	}

	/**
	 *
	 */
	public clone():AnglerClubsData
	{
		return new AnglerClubsData(this.data);
	}

}