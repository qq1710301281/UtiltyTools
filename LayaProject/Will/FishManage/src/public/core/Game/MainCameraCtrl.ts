import { Input, KeyCode } from "./InputManager";

export class MainCameraCtrl extends Laya.Script {
    constructor() {
        super();
    }
    private mainCamera: Laya.Camera;
    private isMouseDown: boolean = false;
    private isOnce: boolean = false;
    onAwake() {
        this.mainCamera = this.owner as Laya.Camera;
    }

    onEnable() {
        // console.log("再次哟i");
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, () => {
            this.isMouseDown = true;
            this.isOnce = true;
            // this.Shoot();
          
            
        })
        Laya.stage.on(Laya.Event.MOUSE_UP, this, () => {
            this.isMouseDown = false;
            this.mousePos = new Laya.Vector2(0, 0);
        })
        // console.log("输入舰艇了");
    }


    //玩家射击
    public Shoot() {

        //创建一个射线返回的储存数组
        var outs: Array<Laya.HitResult> = new Array<Laya.HitResult>();

        //创建一个射线
        var ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));

        //创建一个点 为鼠标在屏幕的坐标哦
        var point = new Laya.Vector2(Laya.stage.mouseX, Laya.stage.mouseY);

        //计算一个从屏幕空间生成的射线
        this.mainCamera.viewportPointToRay(point, ray);

        //使用3D场景的物理模拟器，检测所碰撞的物体
        // scene_mrg.Instance.mainScene.physicsSimulation.rayCastAll(ray, outs);

        //遍历 这个返回对象的数组 如果射到了地面或者某一个可操作物体 就在射到的位置生成探测器  用来探测周围的物体 
        if (outs.length != 0) {
            for (let i = 0; i < outs.length; i++) {
                if (outs[i].collider.owner.name == "Floor") {
                    // (<Laya.Sprite3D>outs[i].collider.owner).active = false;
                }
            }
        }

    }


    private mousePos: Laya.Vector2 = new Laya.Vector2(0, 0);
    onUpdate() {

        let timer = Laya.timer.delta / 1000;
        let speed: number = 5;
        if (this.isMouseDown && Input.getKey(KeyCode.Space)) {
            if (this.isOnce) {
                this.mousePos = new Laya.Vector2(Laya.stage.mouseX, Laya.stage.mouseY);
                this.isOnce = false;
                // console.log("鼠标点击");
                return;
            }
            // console.log("鼠标按下");


            if (this.mousePos.x != 0) {
                let dir: Laya.Vector2 = new Laya.Vector2(this.mousePos.x - Laya.stage.mouseX, this.mousePos.y -Laya.stage.mouseY);
                this.mainCamera.transform.localRotationEulerY += timer * speed * dir.x;
                this.mainCamera.transform.localRotationEulerX += timer * speed * dir.y;
            }

            this.mousePos = new Laya.Vector2(Laya.stage.mouseX, Laya.stage.mouseY);
        }

        if (Input.getKey(KeyCode.Ctrl)) {
            speed = 10;
        }
        if (Input.getKeyUp(KeyCode.Ctrl)) {
            speed = 5;
        }

        if (Input.getKey(KeyCode.W)) {
            let foward: Laya.Vector3 = new Laya.Vector3();
            this.mainCamera.transform.getForward(foward);
            foward = new Laya.Vector3(foward.x * timer * speed, foward.y * timer * speed, foward.z * timer * speed);
            this.mainCamera.transform.translate(foward, false);
        }
        if (Input.getKey(KeyCode.A)) {
            let right: Laya.Vector3 = new Laya.Vector3();
            this.mainCamera.transform.getRight(right);
            right = new Laya.Vector3(-right.x * timer * speed, -right.y * timer * speed, -right.z * timer * speed);
            this.mainCamera.transform.translate(right, false);
        }
        if (Input.getKey(KeyCode.S)) {
            let foward: Laya.Vector3 = new Laya.Vector3();
            this.mainCamera.transform.getForward(foward);
            foward = new Laya.Vector3(-foward.x * timer * speed, - foward.y * timer * speed, - foward.z * timer * speed);
            this.mainCamera.transform.translate(foward, false);

        }
        if (Input.getKey(KeyCode.D)) {
            let right: Laya.Vector3 = new Laya.Vector3();
            this.mainCamera.transform.getRight(right);
            right = new Laya.Vector3(right.x * timer * speed, right.y * timer * speed, right.z * timer * speed);
            this.mainCamera.transform.translate(right, false);
        }

        if (Input.getKey(KeyCode.Q)) {
            let up: Laya.Vector3 = new Laya.Vector3();
            this.mainCamera.transform.getUp(up);
            up = new Laya.Vector3(-up.x * timer * speed, -up.y * timer * speed, -up.z * timer * speed);
            this.mainCamera.transform.translate(up, false);
        }
        if (Input.getKey(KeyCode.E)) {
            let up: Laya.Vector3 = new Laya.Vector3();
            this.mainCamera.transform.getUp(up);
            up = new Laya.Vector3(up.x * timer * speed, up.y * timer * speed, up.z * timer * speed);
            this.mainCamera.transform.translate(up, false);
        }


    }
}