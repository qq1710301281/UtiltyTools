/**
 *岛屿区域表数据
 */
export default class RegionData
{

	/**
	 * 岛屿区域表
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 岛屿 id
	 * @param island_id:number
	 */
	public island_id:number = 0;

	/**
	 * 名字
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * 背景图
	 * @param icon:string
	 */
	public icon:string = "";

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
	 * 岛屿区域表数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.island_id = value.island_id;
		this.name = value.name;
		this.icon = value.icon;
		this.description = value.description;
	}

	/**
	 *
	 */
	public clone():RegionData
	{
		return new RegionData(this.data);
	}

}