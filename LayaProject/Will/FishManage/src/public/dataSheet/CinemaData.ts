/**
 *影城数据
 */
export default class CinemaData
{

	/**
	 * 影城
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
	 * icon
	 * @param icon:string
	 */
	public icon:string = "";

	/**
	 * 名字
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * 影厅金币加成
	 * @param cinema1_buff:number
	 */
	public cinema1_buff:number = 0;

	/**
	 * 影厅钻石加成
	 * @param cinema2_buff:number
	 */
	public cinema2_buff:number = 0;

	/**
	 * 影片播放时间
	 * 单位：小时
	 * @param film_length:number
	 */
	public film_length:number = 0;



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 影城数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.building_id = value.building_id;
		this.building_lv = value.building_lv;
		this.icon = value.icon;
		this.name = value.name;
		this.cinema1_buff = value.cinema1_buff;
		this.cinema2_buff = value.cinema2_buff;
		this.film_length = value.film_length;
	}

	/**
	 *
	 */
	public clone():CinemaData
	{
		return new CinemaData(this.data);
	}

}