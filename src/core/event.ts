namespace engine {
    export class Event {
        type: string;
        target: any
        bubbles = false;
        cancelable = false;
        static ENTER_FRAME = "enterframe";
        public static DATE: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean) {
            this.type = type;
            if (bubbles != null)
                this.bubbles = bubbles;
            if (cancelable != null)
                this.cancelable = cancelable;
        }

    }
    export class MyTouchEvent extends Event {//点击事件响应
        stageX: number;
        stageY: number;
        // type: string;

        static TouchDown = "touchdown";
        static TouchUp = "touchup";
        static TouchClick = "touchclick";
        static TOUCH_BEGIN = "touchbegin";
        static TOUCH_END = "touchend";
        static TOUCH_MOVE = "touchmove";
        constructor(x: number, y: number, type: string) {
            super(type);
            this.stageX = x;
            this.stageY = y;
            // this.type = type;
        }
    }
    export class EventListen {//DisplayObject中储存
        type: string;
        func: Function;
        isCapture: boolean = false;
        constructor(type: string, func: Function, isCapture?: boolean) {
            this.type = type;
            this.func = func;
            if (isCapture != null)
                this.isCapture = isCapture;
        }
    }

}