declare namespace engine.ResourceLoad {
    interface Processor {
        load(url: string, callback: Function): void;
    }
    class ImageProcessor implements Processor {
        load(url: string, callback: Function): void;
    }
    class TextProcessor implements Processor {
        load(url: string, callback: Function): void;
    }
    function mapTypeSelector(typeSelector: (url: string) => string): void;
    function load(url: string, callback: (data: any) => void): any;
    function get(url: string): any;
    function map(type: string, processor: Processor): void;
}
declare namespace engine.ResourceManager {
    function getRes(id: string): ImageResource;
    function loadRes(id: any): ImageResource;
    function load(): void;
    function addImageJson(id: string, url: string, width: number, height: number): void;
    class ImageResource {
        width: number;
        height: number;
        id: string;
        isLoaded: boolean;
        bitmapData: HTMLImageElement;
        private static loadImage;
        private static loadImageIsLoad;
        private url;
        constructor(id: string);
        load(): void;
    }
}
declare namespace engine {
    class CanvasRenderer {
        private stage;
        private context2D;
        constructor(stage: Stage, context2D: CanvasRenderingContext2D);
        render(): void;
        renderContainer(stage: DisplayObjectContainer): void;
        renderBitmap(bitmap: Bitmap): void;
        renderTextField(textField: TextField): void;
    }
}
declare namespace engine {
    /**
     * Tween是Egret的动画缓动类
     * @see http://edn.egret.com/cn/docs/page/576 Tween缓动动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
     * @language zh_CN
     */
    class Tween {
        /**
         * 不做特殊处理
         * @constant {number} egret.Tween.NONE
         * @private
         */
        private static NONE;
        /**
         * 循环
         * @constant {number} egret.Tween.LOOP
         * @private
         */
        private static LOOP;
        /**
         * 倒序
         * @constant {number} egret.Tween.REVERSE
         * @private
         */
        private static REVERSE;
        /**
         * @private
         * 保存所有Tween的列表
         */
        private static _tweens;
        /**
         * @private
         */
        private static IGNORE;
        /**
         * @private
         * 插件
         */
        private static _plugins;
        /**
         * @private
         * 初始化
         */
        private static _inited;
        /**
         * @private
         */
        private _target;
        /**
         * @private
         */
        private _useTicks;
        /**
         * @private全局暂停
         */
        private ignoreGlobalPause;
        /**
         * 对象的循环
         * @private
         */
        private loop;
        /**
         *
         * @private
         * 插件缓存数据
         */
        private pluginData;
        /**
         * @private
         * 当前属性
         */
        private _curQueueProps;
        /**
         * @private
         */
        private _initQueueProps;
        /**
         * @private
         */
        private _steps;
        /**
         * @private
         */
        private paused;
        /**
         * @private 持续时间
         */
        private duration;
        /**
         * @private
         */
        private _prevPos;
        /**
         * @private
         */
        private position;
        /**
         * @private
         */
        private _prevPosition;
        /**
         * @private
         */
        private _stepPosition;
        /**
         * @private
         */
        private passive;
        /**
         * 激活一个对象，对其添加 Tween 动画
         * @param target {any} 要激活 Tween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false。
         * 不建议使用，可使用 Tween.removeTweens(target) 代替。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static get(target: any, props?: {
            loop?: boolean;
            onChange?: Function;
            onChangeObj?: any;
            useTicks?: boolean;
            ignoreGlobalPause?: boolean;
            pause?: boolean;
            position?: number;
        }, pluginData?: any, override?: boolean): Tween;
        /**
         * 删除一个对象上的全部 Tween 动画
         * @param target  需要移除 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static removeTweens(target: any): void;
        /**
         * 暂停某个对象的所有 Tween
         * @param target 要暂停 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static pauseTweens(target: any): void;
        /**
         * 继续播放某个对象的所有缓动
         * @param target 要继续播放 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static resumeTweens(target: any): void;
        /**
         * @private
         *
         * @param delta
         * @param paused
         */
        private static tick(timeStamp, paused?);
        private static _lastTime;
        /**
         * @private
         *
         * @param tween
         * @param value
         */
        private static _register(tween, value);
        /**
         * 删除所有 Tween
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static removeAllTweens(): void;
        /**
         * 创建一个 egret.Tween 对象
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(target: any, props?: any, pluginData?: any);
        /**
         * @private
         *
         * @param target
         * @param props
         * @param pluginData
         */
        private initialize(target, props, pluginData);
        /**
         * @private
         *
         * @param value
         * @param actionsMode
         * @returns
         */
        setPosition(value: number, actionsMode?: number): boolean;
        /**
         * @private
         *
         * @param startPos
         * @param endPos
         * @param includeStart
         */
        private _runAction(action, startPos, endPos, includeStart?);
        /**
         * @private
         *
         * @param step
         * @param ratio
         */
        private _updateTargetProps(step, ratio);
        /**
         * Whether setting is paused
         * @param value {boolean} Whether to pause
         * @returns Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置是否暂停
         * @param value {boolean} 是否暂停
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        setPaused(value: boolean): Tween;
        /**
         * @private
         *
         * @param props
         * @returns
         */
        private _cloneProps(props);
        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _addStep(o);
        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _appendQueueProps(o);
        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _addAction(o);
        /**
         * @private
         *
         * @param props
         * @param o
         */
        private _set(props, o);
        /**
         * 等待指定毫秒后执行下一个动画
         * @param duration {number} 要等待的时间，以毫秒为单位
         * @param passive {boolean} 等待期间属性是否会更新
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        wait(duration: number, passive?: boolean): Tween;
        /**
         * 将指定对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param duration {number} 持续时间
         * @param ease {egret.Ease} 缓动算法
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        to(props: any, duration?: number, ease?: Function): Tween;
        /**
         * 执行回调函数
         * @param callback {Function} 回调方法
         * @param thisObj {any} 回调方法this作用域
         * @param params {any[]} 回调方法参数
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @example
         * <pre>
         *  egret.Tween.get(display).call(function (a:number, b:string) {
         *      console.log("a: " + a); //对应传入的第一个参数 233
         *      console.log("b: " + b); //对应传入的第二个参数 “hello”
         *  }, this, [233, "hello"]);
         * </pre>
         * @language zh_CN
         */
        call(callback: Function, thisObj?: any, params?: any[]): Tween;
        /**
         * Now modify the properties of the specified object to the specified value
         * @param props {Object} Property set of an object
         * @param target The object whose Tween to be resumed
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * 立即将指定对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param target 要继续播放 Tween 的对象
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        set(props: any, target?: any): Tween;
        /**
         * Execute
         * @param tween {egret.Tween} The Tween object to be operated. Default: this
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 执行
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        play(tween?: Tween): Tween;
        /**
         * Pause
         * @param tween {egret.Tween} The Tween object to be operated. Default: this
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 暂停
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        pause(tween?: Tween): Tween;
        /**
         * @method egret.Tween#tick
         * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        $tick(delta: number): void;
    }
}
declare namespace engine {
    class Event {
        type: string;
        target: any;
        bubbles: boolean;
        cancelable: boolean;
        static ENTER_FRAME: string;
        static DATE: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    }
    class MyTouchEvent extends Event {
        stageX: number;
        stageY: number;
        static TouchDown: string;
        static TouchUp: string;
        static TouchClick: string;
        static TOUCH_BEGIN: string;
        static TOUCH_END: string;
        static TOUCH_MOVE: string;
        constructor(x: number, y: number, type: string);
    }
    class EventListen {
        type: string;
        func: Function;
        isCapture: boolean;
        constructor(type: string, func: Function, isCapture?: boolean);
    }
}
declare namespace engine {
    class Ticker {
        private static _instance;
        static readonly Instance: Ticker;
        ticker_Listeners: Function[];
        register(listener: Function): void;
        unregister(listener: Function): void;
        clear(): void;
        notify(deltaTime?: number): void;
    }
    function startTick(func: Function): void;
    function stopTick(func: Function): void;
    function getTimer(): number;
    function MysetTimeout(func: Function, time: number): void;
}
declare namespace math {
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        isPointInRectangle(point: Point): boolean;
    }
    function pointAppendMatrix(point: Point, m: Matrix): Point;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m: Matrix): Matrix;
    function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix;
    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        toString(): string;
        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
    }
}
declare namespace engine {
    interface HitTestable {
        hitTest(x: number, y: number): any;
    }
    abstract class DisplayObject implements HitTestable {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        alpha: number;
        width: number;
        height: number;
        parent: DisplayObject;
        type: string;
        localAlpha: number;
        matrix: math.Matrix;
        localMatrix: math.Matrix;
        constructor(type: string);
        update(): void;
        abstract hitTest(x: number, y: number): any;
        touchEnable: boolean;
        touchChildren: boolean;
        $dispatchPropagationEvent(Chain: DisplayObject[], touchEvent: MyTouchEvent, isCapture?: boolean): void;
        dispatchEvent(event: Event): void;
        listenerList: EventListen[];
        addEventListener(type: string, func: Function, IsCatch?: boolean): void;
        removeEventListener(type: string, func: Function, IsCatch?: boolean): void;
    }
}
declare namespace engine {
    class DisplayObjectContainer extends DisplayObject {
        DisplayObjects: DisplayObject[];
        constructor(type?: string);
        addChild(child: DisplayObject): void;
        removeChild(child: DisplayObject): void;
        removeAllChild(): void;
        update(): void;
        hitTest(x: number, y: number): DisplayObject[];
        dispatchEvent(event: Event): void;
        swapChildren(from: DisplayObject, to: DisplayObject): void;
    }
}
declare namespace engine {
    class Stage extends DisplayObjectContainer {
        DisplayObjects: DisplayObject[];
        private static instance;
        static context2d: CanvasRenderingContext2D;
        private Isinstance;
        constructor(context2d: CanvasRenderingContext2D);
        static getInstance(): Stage;
    }
}
declare namespace engine {
    class Bitmap extends DisplayObject {
        img: engine.ResourceManager.ImageResource;
        constructor(id?: string);
        src: string;
        hitTest(x: number, y: number): this;
    }
}
declare namespace engine {
    class TextField extends DisplayObject {
        text: string;
        color: string;
        fontSize: number;
        fontName: string;
        constructor();
        hitTest(x: number, y: number): this;
    }
}
declare namespace engine {
    function run(canvas: HTMLCanvasElement): Stage;
}
