namespace engine {
    // export interface Drawable {
    //     draw(canvas: CanvasRenderingContext2D);
    // }
    export interface HitTestable {
        hitTest(x: number, y: number);
    }
    export abstract class DisplayObject implements HitTestable {
        x = 0;
        y = 0;
        scaleX = 1;
        scaleY = 1;
        rotation = 0;//360度角度值
        alpha = 1;//绝对透明度
        width = 0;
        height = 0;
        parent: DisplayObject = null;
        type = "DisplayObject"
        localAlpha = 1;//控制渲染的透明度

        matrix: math.Matrix = new math.Matrix();
        localMatrix: math.Matrix = new math.Matrix();
        constructor(type: string) {
            this.type = type;
        }
        update() {
            //每次画更新修改信息
            this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);

            if (this.parent) {
                this.localAlpha = this.alpha * this.parent.localAlpha;
                this.localMatrix = math.matrixAppendMatrix(this.matrix, this.parent.localMatrix);
            }
            else {
                this.localAlpha = this.alpha;
                this.localMatrix = this.matrix;
            }
            // this.updateMatrix(canvas);
            // this.render(canvas);

            // console.log("localAlpha        "+this.localAlpha);
            // console.log("globalAlpha       "+this.globalAlpha);
            // this.resetMatrix(canvas);

        }
        // updateMatrix(canvas: CanvasRenderingContext2D) {
        //     canvas.globalAlpha = this.localAlpha;
        //     canvas.setTransform(this.localMatrix.a, this.localMatrix.b, this.localMatrix.c, this.localMatrix.d, this.localMatrix.tx, this.localMatrix.ty);
        //     //canvas.translate(0,0);
        //     // console.log(this.localMatrix.toString());
        // }
        // resetMatrix(canvas: CanvasRenderingContext2D) {
        //     canvas.globalAlpha = 1;
        //     canvas.setTransform(1, 0, 0, 0, 1, 0);
        // }
        // abstract render(canvas: CanvasRenderingContext2D);
        abstract hitTest(x: number, y: number);
        touchEnable = false;
        //picture
        //  |---containner
        //          |-----stage
        $dispatchPropagationEvent(Chain: DisplayObject[], touchEvent: MyTouchEvent, isCapture?: boolean) {//    默认是冒泡
            if (this.touchEnable == true) {
                if (isCapture) {//捕获
                    var captureDisplayObjects = Chain;
                    captureDisplayObjects.reverse();
                    captureDisplayObjects.forEach(displayObject => {
                        displayObject.listenerList.forEach(listen => {
                            if (touchEvent.type == listen.type && listen.isCapture)//捕获
                                listen.func();
                        });
                    });
                    Chain.reverse();//再次反转过来
                }
                var bubbleDisplayObjects = Chain;
                bubbleDisplayObjects.forEach(displayObject => {
                    displayObject.listenerList.forEach(listen => {
                        if (touchEvent.type == listen.type && !listen.isCapture)//冒泡
                            listen.func();
                    });
                });
            }
        }
        dispatchEvent(event: Event) {
            this.listenerList.forEach(listen => {
                if (listen.type == event.type) {
                    listen.func();
                }
            });
        }
        listenerList: EventListen[] = [];
        addEventListener(type: string, func: Function, IsCatch?: boolean) {
            var EventListener = new EventListen(type, func, IsCatch);
            if (this.listenerList.indexOf(EventListener) == -1)
                this.listenerList.push(EventListener);
        }
        removeEventListener(type: string, func: Function, IsCatch?: boolean) {
            // if(type==MyTouchEvent.ENTER_FRAME){
            //     Disobject_Frames.Instance.register(func);
            // }
            var EventListener = new EventListen(type, func, IsCatch);
            var index = this.listenerList.indexOf(EventListener);
            if (index == -1)
                console.error("Cannot find that you want to remove event");
            this.listenerList.splice(index);
        }
    }
}