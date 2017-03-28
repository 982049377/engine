namespace engine {
    export function run(canvas: HTMLCanvasElement) {

        // var canvas = document.getElementById("context") as HTMLCanvasElement;
        var context2d = canvas.getContext("2d");
        var stage = new Stage(context2d);
        var canvasRenderer = new CanvasRenderer(stage, context2d);

        let lastNow = Date.now();
        let enterFrame = (callback) => {
            let now = Date.now();
            var deltaTime = now - lastNow;
            eventDispose();
            Ticker.Instance.notify(deltaTime);
            // console.log("deltaTime" + deltaTime);
            context2d.clearRect(0, 0, canvas.width, canvas.height)
            context2d.save();
            // stage.draw(context2d);
            stage.update();
            canvasRenderer.render();
            context2d.restore();

            lastNow = now;
            window.requestAnimationFrame(enterFrame);;
        }
        window.requestAnimationFrame(enterFrame);



        //事件处理机制
        function eventDispose() {
            var event = new Event(Event.ENTER_FRAME);
            stage.dispatchEvent(event);
        }

        //MyTouchEvent的相应机制
        window.onmousedown = (down) => {
            var downX = down.x - 3;
            var downY = down.y - 3;
            var touchEvent = new MyTouchEvent(downX, downY, MyTouchEvent.TouchDown);
            var downChain = stage.hitTest(downX, downY);
            stage.$dispatchPropagationEvent(downChain, touchEvent, true);
            // stage.dispatchEvent(downChain, touchEvent);
            window.onmouseup = (up) => {
                var upX = down.x - 3;
                var upY = down.y - 3;
                var upChain = stage.hitTest(upX, upY);
                if (downChain[0] == upChain[0]) {
                    var touchEvent = new MyTouchEvent(downX, downY, MyTouchEvent.TouchClick);
                    var ChickChain = stage.hitTest(upX, upY);
                    stage.$dispatchPropagationEvent(ChickChain, touchEvent, true);
                    // stage.dispatchEvent(ChickChain, touchEvent);
                }
                stage.$dispatchPropagationEvent(upChain, touchEvent, true);
                // stage.dispatchEvent(upChain, touchEvent);
            }
        }

        window.onmousedown = (down) => {
            ifMouseDown = true;
            var downX = down.x - 3;
            var downY = down.y - 3;
            var touchEvent = new MyTouchEvent(downX, downY, MyTouchEvent.TouchDown);
            var downChain = stage.hitTest(downX, downY);
            // stage.$dispatchPropagationEvent(downChain, touchEvent, true);
            // stage.dispatchEvent(downChain, touchEvent);
            window.onmouseup = (up) => {
                ifMouseDown = false;
                var upX = down.x - 3;
                var upY = down.y - 3;
                var upChain = stage.hitTest(upX, upY);
                if (downChain[0] == upChain[0]) {
                    var touchEvent = new MyTouchEvent(downX, downY, MyTouchEvent.TouchClick);
                    var ChickChain = stage.hitTest(upX, upY);
                    stage.$dispatchPropagationEvent(ChickChain, touchEvent, true);
                    // stage.dispatchEvent(ChickChain, touchEvent);
                }
                stage.$dispatchPropagationEvent(upChain, touchEvent, true);
                // stage.dispatchEvent(upChain, touchEvent);
            }
        }

        let clickResult: DisplayObject;
        let currentX: number;
        let currentY: number;
        let tempX: number;
        let tempY: number;
        let ifMouseDown = false;


        window.onmousemove = (down) => {
            var downX = down.x - 3;
            var downY = down.y - 3;
            var touchEvent = new MyTouchEvent(downX, downY, MyTouchEvent.TouchDown);
            var downChain = stage.hitTest(downX, downY);

            tempX = currentX;
            tempY = currentY;

            currentX = down.offsetX;
            currentY = down.offsetY;

            if (ifMouseDown) {
                // for (var i = 0; i < downChain.length; i++) {
                //     for (let temp of downChain[i].listenerList) {
                //         if (temp.type == MyTouchEvent.TOUCH_MOVE && temp.isCapture == true) {
                //             temp.func(down);
                //         }
                //     }
                // }
                // for (var i = 0; i < downChain.length - 1; i++) {
                //     for (let temp of downChain[i].listenerList) {
                //         if (temp.type == MyTouchEvent.TOUCH_MOVE && temp.isCapture == false) {
                //             temp.func(down);
                //         }
                //     }
                // }
                var temp = downChain[0];
                temp.listenerList.forEach(listen => {
                    if (listen.type == MyTouchEvent.TOUCH_BEGIN) {
                        console.log("begin");
                        listen.func();
                    }
                    if (listen.type == MyTouchEvent.TOUCH_MOVE) {
                        console.log("move");
                        listen.func();
                    }
                    if (listen.type == MyTouchEvent.TOUCH_END) {
                        console.log("end");
                        listen.func();
                    }
                });
            }
        }

        return stage;
    }
}