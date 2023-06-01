import CinemaData from "./CinemaData";
/**
 *影城
 */
export default class CinemaDataSheet {

	/**
	 *
	 */
	private data: any = null;
	/**
	 *
	 */
	private datasheet: Map<string, CinemaData> = new Map();



	/**
	 * 影城
	 * @param value:any
	 */
	constructor(value: any) {
		this.data = value;
		for (let key in value) {
			this.datasheet.set(key, new CinemaData(value[key]));
		}
	}

	/**
	 * 根据海岛影城等级获得指定配置数据
	 * @param value:any
	 */
	public getCinemaDataByLv(movie_level: number): CinemaData {
		let data: CinemaData = null;
		let tempData: CinemaData = this.datasheet.get(movie_level + "");
		if (tempData) {
			data = tempData.clone();
		}
		return data;
	}

	/**
	 * 获得指定   配置数据数组
	 * @param value:any
	 */
	public getCinemaDatas(): Array<CinemaData> {
		let CinemaDatas: Array<CinemaData> = [];
		for (let entry of this.datasheet.entries()) {
			CinemaDatas.push(entry[1].clone());
		}
		return CinemaDatas;
	}

	/**
	 * 获得影城配置数据
	 * @param id 
	 */
	public getCinemaData(id:number):CinemaData
	{
		let cinemaData:CinemaData = null;
		if(this.datasheet.has(id + ""))
		{
			cinemaData = this.datasheet.get(id + "").clone();
		}
		return cinemaData;
	}

	/**
	 * 获得建筑图标
	 * @param buildingData 
	 */
	public getBuildingSkin(movieData: CinemaData): string {
		return "res/image/public/cinema/" + movieData.icon;
	}

}