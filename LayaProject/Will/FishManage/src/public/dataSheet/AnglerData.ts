/**
 *钓手表数据
 */
export default class AnglerData
{

	/**
	 * 钓手表
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 人员名称
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * 钓手图标
	 * @param icon:string
	 */
	public icon:string = "";

	/**
	 * 模型
	 * @param model:string
	 */
	public model:string = "";

	/**
	 * 技能 类型
	 * 1 材料增加
	 * 2 心情不减
	 * 3 精力消耗数值
	 * @param skill_type:number
	 */
	public skill_type:number = 0;

	/**
	 * 技能描述
	 * @param skill_description:string
	 */
	public skill_description:string = "";

	/**
	 * 技能影响数值
	 * @param skill_value:string
	 */
	public skill_value:string = "";

	/**
	 * 心情临界值(小于等于临界值钓手特质会失效）
	 * @param emotion_boundary:number
	 */
	public emotion_boundary:number = 0;

	/**
	 * 初始心情值
	 * @param emotion:number
	 */
	public emotion:number = 0;

	/**
	 * 心情值减少速率 4 小时
	 * 单位 秒
	 * @param emotion_reduce_rate:number
	 */
	public emotion_reduce_rate:number = 0;

	/**
	 * 是否锁定
	 * 此字段程序用填1即可
	 * @param lock:number
	 */
	public lock:number = 0;



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 钓手表数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.name = value.name;
		this.icon = value.icon;
		this.model = value.model;
		this.skill_type = value.skill_type;
		this.skill_description = value.skill_description;
		this.skill_value = value.skill_value;
		this.emotion_boundary = value.emotion_boundary;
		this.emotion = value.emotion;
		this.emotion_reduce_rate = value.emotion_reduce_rate;
		this.lock = value.lock;
	}

	/**
	 *
	 */
	public clone():AnglerData
	{
		return new AnglerData(this.data);
	}

}