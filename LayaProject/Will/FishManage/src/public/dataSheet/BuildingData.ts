/**
 *建筑表数据
 */
export default class BuildingData
{

	/**
	 * 建筑表
	 * @param id:number
	 */
	public id:number = 0;

	/**
	 * 类型
	 * 1 功能建筑
	 * 2 普通建筑
	 * 3 特殊建筑
	 * @param type:number
	 */
	public type:number = 0;

	/**
	 * 建筑 ID
	 * @param building_id:number
	 */
	public building_id:number = 0;

	/**
	 * 所属岛屿 ID
	 * @param island_id:number
	 */
	public island_id:number = 0;

	/**
	 * 所属区域 ID
	 * @param region_id:number
	 */
	public region_id:number = 0;

	/**
	 * 特殊建筑类型
	 * 1 钓手俱乐部
	 * 2 海岛娱乐城
	 * 3 海底世界
	 * 4 高塔餐厅
	 * 5 摩天轮
	 * 6 海岛影城
	 * @param building_type:number
	 */
	public building_type:number = 0;

	/**
	 * 名字
	 * @param name:string
	 */
	public name:string = "";

	/**
	 * 等级
	 * @param level:number
	 */
	public level:number = 0;

	/**
	 * 解锁所需玩家等级
	 * 锁定是否可以搭建
	 * @param unlock_level:number
	 */
	public unlock_level:number = 0;

	/**
	 * 目标类型
	 * 1 打开世界地图
	 * 2 打开升级界面
	 * 3 打开钓鱼界面
	 * @param target:number
	 */
	public target:number = 0;

	/**
	 * 建筑图标
	 * @param icon:string
	 */
	public icon:string = "";

	/**
	 * 内部图标
	 * @param inside_icon:string
	 */
	public inside_icon:string = "";

	/**
	 * 描述
	 * @param description:string
	 */
	public description:string = "";

	/**
	 * x 坐标
	 * @param x:number
	 */
	public x:number = 0;

	/**
	 * y坐标
	 * @param y:number
	 */
	public y:number = 0;

	/**
	 * 升级所需玩家等级
	 * @param level_limit:number
	 */
	public level_limit:number = 0;

	/**
	 * 升级所需金币(x为建筑等级）
	 * @param update_gold_coins:string
	 */
	public update_gold_coins:string = "";

	/**
	 * 升级所需钻石
	 * @param diamonds:number
	 */
	public diamonds:number = 0;

	/**
	 * 升级所需材料 ID 1
	 * @param item_1:number
	 */
	public item_1:number = 0;

	/**
	 * 升级所需材料数量1(x为建筑等级）
	 * @param item_count1:string
	 */
	public item_count1:string = "";

	/**
	 * 升级所需材料 ID 2
	 * @param item_2:number
	 */
	public item_2:number = 0;

	/**
	 * 升级所需材料数量2(x为建筑等级）
	 * @param item_count2:string
	 */
	public item_count2:string = "";

	/**
	 * 升级所需材料 ID 3
	 * @param item_3:number
	 */
	public item_3:number = 0;

	/**
	 * 升级所需材料数量3(x为建筑等级）
	 * @param item_count3:string
	 */
	public item_count3:string = "";

	/**
	 * 升级所需材料 ID 4
	 * @param item_4:number
	 */
	public item_4:number = 0;

	/**
	 * 升级所需材料数量4(x为建筑等级）
	 * @param item_count4:string
	 */
	public item_count4:string = "";

	/**
	 * 升级奖励1 exp
	 * @param update_reward_exp:number
	 */
	public update_reward_exp:number = 0;

	/**
	 * 升级奖励2 star
	 * @param update_reward_star:number
	 */
	public update_reward_star:number = 0;

	/**
	 * 普通建筑
	 * 产出时间间隔 秒
	 * 目前没用
	 * @param production_time:number
	 */
	public production_time:number = 0;

	/**
	 * 普通建筑
	 * 产出 金币
	 * @param production_gold_coins:string
	 */
	public production_gold_coins:string = "";



	/**
	 *
	 */
	private data:any = null;



	/**
	 * 建筑表数据
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		this.id = value.id;
		this.type = value.type;
		this.building_id = value.building_id;
		this.island_id = value.island_id;
		this.region_id = value.region_id;
		this.building_type = value.building_type;
		this.name = value.name;
		this.level = value.level;
		this.unlock_level = value.unlock_level;
		this.target = value.target;
		this.icon = value.icon;
		this.inside_icon = value.inside_icon;
		this.description = value.description;
		this.x = value.x;
		this.y = value.y;
		this.level_limit = value.level_limit;
		this.update_gold_coins = value.update_gold_coins;
		this.diamonds = value.diamonds;
		this.item_1 = value.item_1;
		this.item_count1 = value.item_count1;
		this.item_2 = value.item_2;
		this.item_count2 = value.item_count2;
		this.item_3 = value.item_3;
		this.item_count3 = value.item_count3;
		this.item_4 = value.item_4;
		this.item_count4 = value.item_count4;
		this.update_reward_exp = value.update_reward_exp;
		this.update_reward_star = value.update_reward_star;
		this.production_time = value.production_time;
		this.production_gold_coins = value.production_gold_coins;
	}

	/**
	 *
	 */
	public clone():BuildingData
	{
		return new BuildingData(this.data);
	}

}