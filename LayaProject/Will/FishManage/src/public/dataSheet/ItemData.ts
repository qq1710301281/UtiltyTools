/**
 *道具表数据
 */
export default class ItemData
{

	/**
	 * 道具表
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 道具名称
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * 道具icon
	 * @param icon:string
	 */
	public icon:string = "";

	/**
	 * 大类型
	 * 1货币
	 * 2材料
	 * 3玩家经验
	 * @param type:number
	 */
	public type:number = 0;

	/**
	 * 描述
	 * @param description:string
	 */
	public description:string = "";



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 道具表数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.name = value.name;
		this.icon = value.icon;
		this.type = value.type;
		this.description = value.description;
	}

	/**
	 *
	 */
	public clone():ItemData
	{
		return new ItemData(this.data);
	}

}