import AnglerClubsData from "./AnglerClubsData";
import AnglerData from "./AnglerData";

/**
 *钓手俱乐部表
 */
export default class AnglerClubsDataSheet
{
	
	/**
	 *
	 */
	private data:any = null;
	/**
	 *
	 */
	private datasheet:Map<string, AnglerClubsData> = new Map();


	
	/**
	 * 钓手俱乐部表
	 * @param value:any
	 */
	constructor(value:any)
	{
		this.data = value;
		for(let key in value)
		{
			this.datasheet.set(key, new AnglerClubsData(value[key]));
		}
	}
	
	/**
	 * 获得钓手所属的建筑 ID
	 * @param anglerID:number 钓手 ID
	 */
	public getBuildingID(anglerID:number):number
	{
		let building_id:number = 0;
		let isBreak:boolean = false;
		for (let entry of this.datasheet.entries())
		{
			let strID:Array<string> = entry[1].angler_id.split("_");
			for(let i:number=0; i<strID.length; i++)
			{
				if(parseInt(strID[i]) == anglerID)
				{
					building_id = entry[1].building_id;
					isBreak = true;
					break;
				}
			}
			if(isBreak)
			{
				break;
			}
		}
		return building_id;
	}
	
	/**
	 * 获得钓手的ID数组
	 * @param value:any
	 */
	public getAnglersID(building_id:number):Array<number>
	{
		let anglerIDs:Array<number> = [];
		for (let entry of this.datasheet.entries())
		{
			if(entry[1].building_id == building_id)
			{
				let strID:Array<string> = entry[1].angler_id.split("_");
				for(let i:number=0; i<strID.length; i++)
				{
					anglerIDs.push(parseInt(strID[i]));
				}
			}
		}
		return anglerIDs;
	}

	/**
	 * 获得 钓手是否已经解锁
	 * @param building_id:number 钓手俱乐部 ID
	 * @param anglerClubsCurrentLevel:number 钓手俱乐部当前等级
	 * @param angler_id:number 钓手 ID
	 */
	public isUnlock(building_id:number, anglerClubsCurrentLevel:number, angler_id:number):boolean
	{
		let isUnlock:boolean = false;
		for (let entry of this.datasheet.entries())
		{
			if(entry[1].building_id == building_id && entry[1].level <= anglerClubsCurrentLevel)
			{
				let strID:Array<string> = entry[1].angler_id.split("_");
				for(let i:number=0; i<strID.length; i++)
				{
					if(parseInt(strID[i]) == angler_id)
					{
						isUnlock = true;
						break;
					}
				}
			}
			if(isUnlock)
			{
				break;
			}
		}
		return isUnlock;
	}

	/**
	 * 获得钓手解锁 所需要的建筑等级
	 * @param building_id 
	 * @param angler_id 
	 */
	public getUnlockLevel(building_id:number, angler_id:number):number
	{
		let isBreak:boolean = false;
		let unlockLevel:number = 1;
		for (let entry of this.datasheet.entries())
		{
			if(entry[1].building_id == building_id)
			{
				let strID:Array<string> = entry[1].angler_id.split("_");
				for(let i:number=0; i<strID.length; i++)
				{
					if(parseInt(strID[i]) == angler_id)
					{
						unlockLevel = entry[1].level;
						isBreak = true;
						break;
					}
				}
			}
			if(isBreak)
			{
				break;
			}
		}
		return unlockLevel;
	}

}