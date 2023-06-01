/**
 *鱼点表数据
 */
export default class FishpointData {

	/**
	 * 鱼点表
	 * @param id:number
	 */
	public id: number = 0;

	/**
	 * 岛屿 id
	 * @param region_id:number
	 */
	public region_id: number = 0;

	/**
	 * 名字
	 * @param name:string
	 */
	public name: string = "";

	/**
	 * 玩家等级（解锁所需等级）
	 * @param player_grade:number
	 */
	public player_grade: number = 0;

	/**
	 * 目标鱼1 id
	 * @param fish1_id:number
	 */
	public fish1_id: number = 0;

	/**
	 * 目标鱼2 id
	 * @param fish2_id:number
	 */
	public fish2_id: number = 0;

	/**
	 * 目标鱼3 id
	 * @param fish3_id:number
	 */
	public fish3_id: number = 0;

	/**
	 * 目标鱼4 id
	 * @param fish4_id:number
	 */
	public fish4_id: number = 0;

	/**
	 * 目标鱼5 id
	 * @param fish5_id:number
	 */
	public fish5_id: number = 0;

	/**
	 * 目标鱼6 id
	 * @param fish6_id:number
	 */
	public fish6_id: number = 0;

	/**
	 * 鱼ID集合
	 */
	public fishIDArr: Array<number> = new Array<number>();

	/**
	 * 收益类型(根据item表id）
	 * @param fishpoint_profit_type1:number
	 */
	public fishpoint_profit_type1: number = 0;

	/**
	 * 收益数量
	 * @param fishpoint_profit_1:number
	 */
	public fishpoint_profit_1: number = 0;

	/**
	 * 收益类型(根据item表id）
	 * @param fishpoint_profit_type2:number
	 */
	public fishpoint_profit_type2: number = 0;

	/**
	 * 收益数量
	 * @param fishpoint_profit_2:number
	 */
	public fishpoint_profit_2: number = 0;

	/**
	 * 收益类型(根据item表id）
	 * @param fishpoint_profit_type3:number
	 */
	public fishpoint_profit_type3: number = 0;

	/**
	 * 收益数量
	 * @param fishpoint_profit_3:number
	 */
	public fishpoint_profit_3: number = 0;

	/**
	 * 收益类型(根据item表id）
	 * @param fishpoint_profit_type4:number
	 */
	public fishpoint_profit_type4: number = 0;

	/**
	 * 收益数量
	 * @param fishpoint_profit_4:number
	 */
	public fishpoint_profit_4: number = 0;



	/**
	 * 收益类型的集合
	 */
	public profitTypeArr: Array<number> = new Array<number>();

	/**
	 * 收益数量的集合
	 */
	public profitCountArr: Array<number> = new Array<number>();



	/**
	 *
	 */
	private data: any = null;



	/**
	 * 鱼点表数据
	 * @param value:any
	 */
	constructor(value: any) {
		this.data = value;
		this.id = value.id;
		this.region_id = value.region_id;
		this.name = value.name;
		this.player_grade = value.player_grade;
		this.fish1_id = value.fish1_id;
		this.fish2_id = value.fish2_id;
		this.fish3_id = value.fish3_id;
		this.fish4_id = value.fish4_id;
		this.fish5_id = value.fish5_id;
		this.fish6_id = value.fish6_id;
		for (let i = 1; i < 7; i++) {
			if (value[`fish${i}_id`]!=0) {
				this.fishIDArr.push(value[`fish${i}_id`]);
			}
		}
		this.fishpoint_profit_type1 = value.fishpoint_profit_type1;
		this.fishpoint_profit_1 = value.fishpoint_profit_1;
		this.fishpoint_profit_type2 = value.fishpoint_profit_type2;
		this.fishpoint_profit_2 = value.fishpoint_profit_2;
		this.fishpoint_profit_type3 = value.fishpoint_profit_type3;
		this.fishpoint_profit_3 = value.fishpoint_profit_3;
		this.fishpoint_profit_type4 = value.fishpoint_profit_type4;
		this.fishpoint_profit_4 = value.fishpoint_profit_4;
		for (let i = 1; i < 5; i++) {
			if (value[`fishpoint_profit_type${i}`]!=0) {
				this.profitTypeArr.push(value[`fishpoint_profit_type${i}`]);
				this.profitCountArr.push(value[`fishpoint_profit_${i}`]);
			}
		}

	}

	/**
	 *
	 */
	public clone(): FishpointData {
		return new FishpointData(this.data);
	}

}