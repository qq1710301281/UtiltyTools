import OrderData from "./OrderData";
/**
 *任务表
 */
export default class OrderDataSheet {

	/**
	 *
	 */
	private data: any = null;
	/**
	 *
	 */
	private datasheet: Map<string, OrderData> = new Map();



	/**
	 * 任务表
	 * @param value:any
	 */
	constructor(value: any) {
		this.data = value;
		for (let key in value) {
			this.datasheet.set(key, new OrderData(value[key]));
		}
	}

	/**
	 * 获得指定   配置数据
	 * @param value:any
	 */
	public getOrderData(value: number): OrderData {
		let data: OrderData = null;
		let tempData: OrderData = this.datasheet.get(value + "");
		if (tempData) {
			data = tempData.clone();
		}
		return data;
	}

	/**
	 * 获取所有能够产出的最大ID
	 */
	public GetCanMadeOrderID(sayGood: number) {
		let orderID: number = 0;
		for (let entry of this.datasheet.entries()) {
			if (entry[1].condition <= sayGood) {
				orderID = entry[1].id;
			}
		}
		return orderID;
	}

	/**
	 * 获得指定   配置数据数组
	 * @param value:any
	 */
	public getOrderDatas(): Array<OrderData> {
		let OrderDatas: Array<OrderData> = [];
		for (let entry of this.datasheet.entries()) {
			OrderDatas.push(entry[1].clone());
		}
		return OrderDatas;
	}

	/**
	 * 通过订单ID获取订单的奖励集合
	 * @param orderID 订单ID
	 */
	public GetRewardArr(orderID) {
		let rewardArr = [];
		let orderData: OrderData = this.getOrderData(orderID);
		let mission_idArr = orderData.mission_id.split("_");
		let numberArr = orderData.number.split("_");
		for (let i = 0; i < mission_idArr.length; i++) {
			rewardArr.push([+mission_idArr[i], +numberArr[i]]);
		}
		// console.log(rewardArr[0],mission_idArr,numberArr);
		return rewardArr;
	}

}