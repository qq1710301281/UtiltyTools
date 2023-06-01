import fishGear from "./fishGear";

export default class waterTrigger extends Laya.Script3D {

    constructor() { super(); }


    onCollisionEnter(collision: Laya.Collision) {
        // console.log(collision.other);
        if (collision.other.owner.name == "blueTop") {
            // console.log( mainScene_mrg.Instance.blueWaterDown);
            // fishGear.Instance.blueWaterDown.active = false;

            // fishGear.Instance.blueWaterDown.transform.position = collision.contacts[0].positionOnA;
            // fishGear.Instance.blueWaterDown.active = true;

            // console.log("碰到了水花", collision.contacts[0].positionOnA);
        }
    }

    onCollisionExit(collision: Laya.Collision) {
        // console.log(collision.other);
        if (collision.other.owner.name == "blueTop") {
            // console.log( mainScene_mrg.Instance.blueWaterDown);
            // fishGear.Instance.blueWaterDown.active = false;

            // fishGear.Instance.blueWaterDown.transform.position = collision.contacts[0].positionOnA;
            // fishGear.Instance.blueWaterDown.active = true;

            // console.log("碰到了水花", collision.contacts[0].positionOnA);
        }
    }
}