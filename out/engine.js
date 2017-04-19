var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//ResourceManager是将资源加载到内存中，RES是加入到舞台。
var engine;
(function (engine) {
    var ResourceLoad;
    (function (ResourceLoad) {
        var ImageProcessor = (function () {
            function ImageProcessor() {
            }
            ImageProcessor.prototype.load = function (url, callback) {
                var image = document.createElement("img");
                image.src = url;
                // console.log(url);
                image.onload = function () {
                    callback();
                };
            };
            return ImageProcessor;
        }());
        ResourceLoad.ImageProcessor = ImageProcessor;
        var TextProcessor = (function () {
            function TextProcessor() {
            }
            TextProcessor.prototype.load = function (url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open("get", url);
                xhr.send();
                xhr.onload = function () {
                    callback(xhr.responseText);
                };
            };
            return TextProcessor;
        }());
        ResourceLoad.TextProcessor = TextProcessor;
        function mapTypeSelector(typeSelector) {
            getTypeByURL = typeSelector;
        }
        ResourceLoad.mapTypeSelector = mapTypeSelector;
        var cache = {};
        function load(url, callback) {
            var type = getTypeByURL(url);
            var processor = createProcessor(type);
            if (processor != null) {
                processor.load(url, function (data) {
                    cache[url] = data;
                    callback(data);
                });
            }
        }
        ResourceLoad.load = load;
        function get(url) {
            return cache[url];
        }
        ResourceLoad.get = get;
        var getTypeByURL = function (url) {
            if (url.indexOf(".jpg") >= 0) {
                return "image";
            }
            if (url.indexOf(".png") >= 0) {
                return "image";
            }
            else if (url.indexOf(".mp3") >= 0) {
                return "sound";
            }
            else if (url.indexOf(".json") >= 0) {
                return "text";
            }
        };
        var hashMap = {
            "image": new ImageProcessor(),
            "text": new TextProcessor()
        };
        function createProcessor(type) {
            var processor = hashMap[type];
            return processor;
        }
        function map(type, processor) {
            hashMap[type] = processor;
        }
        ResourceLoad.map = map;
    })(ResourceLoad = engine.ResourceLoad || (engine.ResourceLoad = {}));
})(engine || (engine = {}));
//  class SoundProcessor implements Processor {
//         load(url: string, callback: Function) { }
//     }
//     mapTypeSelector((url) => {
//         return "image";
//     })
//     map("sound", new SoundProcessor())
//     load("1.mp3", () => {
//     }) 
var engine;
(function (engine) {
    var ResourceManager;
    (function (ResourceManager) {
        var ImageJson = [
            { id: "loading.png", url: "loading.png", width: 200, height: 200 },
        ];
        var __cache = {};
        function getRes(id) {
            if (__cache[id]) {
                return __cache[id];
            }
            else {
                __cache[id] = new ImageResource(id);
                return __cache[id];
            }
        }
        ResourceManager.getRes = getRes;
        function loadRes(id) {
            var resource = getRes(id);
            resource.load();
            return resource;
        }
        ResourceManager.loadRes = loadRes;
        function load() {
            for (var index in __cache) {
                __cache[index].load();
            }
        }
        ResourceManager.load = load;
        function addImageJson(id, url, width, height) {
            ImageJson.forEach(function (element) {
                if (element.id == id)
                    return;
            });
            var tempElement = { id: id, url: url, width: width, height: height };
            ImageJson.push(tempElement);
        }
        ResourceManager.addImageJson = addImageJson;
        var ImageResource = (function () {
            function ImageResource(id) {
                var _this = this;
                this.width = 0;
                this.height = 0;
                this.isLoaded = false;
                ImageJson.forEach(function (element) {
                    if (element.id == id) {
                        _this.id = id;
                        _this.width = element.width;
                        _this.height = element.height;
                        _this.url = element.url;
                        _this.isLoaded = false;
                    }
                });
                if (this.width == 0 && this.height == 0) {
                    console.error("没有所需的Json数据文件");
                    return;
                }
                // // this.url = url;
                this.bitmapData = document.createElement("img");
                if (engine.ResourceLoad.get("loading.png") != null && !ImageResource.loadImageIsLoad) {
                    this.bitmapData = engine.ResourceLoad.get("loading.png");
                    ImageResource.loadImageIsLoad = true;
                    this.load();
                    return;
                }
                if (ImageResource.loadImageIsLoad == false) {
                    ImageResource.loadImage = document.createElement("img");
                    ImageResource.loadImage.src = "loading.png";
                    console.log(ImageResource.loadImage.src);
                    ImageResource.loadImage.onload = function () {
                        _this.bitmapData = ImageResource.loadImage;
                        ImageResource.loadImageIsLoad = true;
                    };
                }
                else
                    this.bitmapData = ImageResource.loadImage;
                this.load();
            }
            ImageResource.prototype.load = function () {
                var _this = this;
                if (engine.ResourceLoad.get(this.id) != null) {
                    this.bitmapData = engine.ResourceLoad.get(this.id);
                    this.isLoaded = true;
                    return;
                }
                var realResource = document.createElement("img");
                realResource.src = this.url;
                realResource.onload = function () {
                    _this.bitmapData = realResource;
                    _this.isLoaded = true;
                };
            };
            return ImageResource;
        }());
        ImageResource.loadImageIsLoad = false;
        ResourceManager.ImageResource = ImageResource;
    })(ResourceManager = engine.ResourceManager || (engine.ResourceManager = {}));
})(engine || (engine = {}));
var engine;
(function (engine) {
    var CanvasRenderer = (function () {
        function CanvasRenderer(stage, context2D) {
            this.stage = stage;
            this.context2D = context2D;
        }
        CanvasRenderer.prototype.render = function () {
            var stage = this.stage;
            var context2D = this.context2D;
            this.renderContainer(stage);
        };
        CanvasRenderer.prototype.renderContainer = function (stage) {
            for (var _i = 0, _a = stage.DisplayObjects; _i < _a.length; _i++) {
                var child = _a[_i];
                this.context2D.globalAlpha = child.localAlpha;
                var m = child.localMatrix;
                this.context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                if (child.type == "Bitmap") {
                    // if (child.x == 0) {
                    //     console.log("..................");
                    // }
                    this.renderBitmap(child);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child);
                }
                else if (child.type == "DisplayObjectContainer" || child.type == "Stage") {
                    this.renderContainer(child);
                }
                // console.log(child.type + this.context2D.globalAlpha);
            }
        };
        CanvasRenderer.prototype.renderBitmap = function (bitmap) {
            if (bitmap.img.bitmapData == undefined) {
                bitmap.img.load();
                console.log(bitmap.img.id);
                console.log(bitmap.img.bitmapData);
                return;
            }
            // console.log(engine.ResourceLoad.get("!"));
            if (bitmap.img.isLoaded) {
                this.context2D.drawImage(bitmap.img.bitmapData, 0, 0, bitmap.img.width, bitmap.img.height);
            }
            // else {
            //     // bitmap.img.bitmapData.src = bitmap._src;
            //     if (bitmap.width == 0)
            //         bitmap.width = bitmap.img.width;
            //     if (bitmap.height == 0)
            //         bitmap.height = bitmap.img.height;
            //     bitmap.img.bitmapData.onload = () => {
            //         bitmap.img.isLoaded = true;
            //     }
            // }
        };
        CanvasRenderer.prototype.renderTextField = function (textField) {
            this.context2D.fillStyle = textField.color;
            // console.log("textfield"+this.alpha);
            this.context2D.font = textField.fontSize.toString() + "px " + textField.fontName.toString();
            this.context2D.fillText(textField.text, textField.x, textField.y);
            var textWidth = this.context2D.measureText(textField.text).width;
            if (textWidth > 500) {
                var scaled = 500 / textWidth;
                this.context2D.scale(scaled, scaled);
            }
            // console.log("this.context2D.font" + this.context2D.font)
        };
        return CanvasRenderer;
    }());
    engine.CanvasRenderer = CanvasRenderer;
})(engine || (engine = {}));
var engine;
(function (engine) {
    /**
     * Tween是Egret的动画缓动类
     * @see http://edn.egret.com/cn/docs/page/576 Tween缓动动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
     * @language zh_CN
     */
    var Tween = (function () {
        /**
         * 创建一个 egret.Tween 对象
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        // propType = {
        //     loop: boolean,//设置循环播放
        //     onChange: Function,//设置更新函数
        //     onChangeObj: any,//更新函数作用域
        //     useTicks: boolean,//帧动画
        //     ignoreGlobalPause: boolean,//全局暂停
        //     pause: boolean,//暂停
        //     // position://位置 意义不明
        // }
        function Tween(target, props, pluginData) {
            /**
             * @private
             */
            this._target = null;
            /**
             * @private
             */
            this._useTicks = false;
            /**
             * @private全局暂停
             */
            this.ignoreGlobalPause = false;
            /**
             * 对象的循环
             * @private
             */
            this.loop = false;
            /**
             *
             * @private
             * 插件缓存数据
             */
            this.pluginData = null;
            /**
             * @private
             */
            this._steps = null;
            /**
             * @private
             */
            this.paused = false;
            /**
             * @private 持续时间
             */
            this.duration = 0;
            /**
             * @private
             */
            this._prevPos = -1;
            /**
             * @private
             */
            this.position = null;
            /**
             * @private
             */
            this._prevPosition = 0;
            /**
             * @private
             */
            this._stepPosition = 0;
            /**
             * @private
             */
            this.passive = false;
            // super();
            this.initialize(target, props, pluginData);
        }
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
        // propType = {
        //     loop: boolean,//设置循环播放
        //     onChange: Function,//设置更新函数
        //     onChangeObj: any,//更新函数作用域
        //     useTicks: boolean,//帧动画
        //     ignoreGlobalPause: boolean,//全局暂停
        //     pause: boolean,//暂停
        //     // position://位置 意义不明
        // }
        Tween.get = function (target, props, pluginData, override) {
            if (pluginData === void 0) { pluginData = null; }
            if (override === void 0) { override = false; }
            if (override) {
                Tween.removeTweens(target);
            }
            return new Tween(target, props, pluginData);
        };
        /**
         * 删除一个对象上的全部 Tween 动画
         * @param target  需要移除 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        Tween.removeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        };
        /**
         * 暂停某个对象的所有 Tween
         * @param target 要暂停 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        Tween.pauseTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = engine.Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                }
            }
        };
        /**
         * 继续播放某个对象的所有缓动
         * @param target 要继续播放 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        Tween.resumeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = engine.Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = false;
                }
            }
        };
        /**
         * @private
         *
         * @param delta
         * @param paused
         */
        Tween.tick = function (timeStamp, paused) {
            if (paused === void 0) { paused = false; }
            var delta = timeStamp - Tween._lastTime;
            Tween._lastTime = timeStamp;
            var tweens = Tween._tweens.concat();
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.$tick(tween._useTicks ? 1 : delta);
            }
            return false;
        };
        /**
         * @private
         *
         * @param tween
         * @param value
         */
        Tween._register = function (tween, value) {
            var target = tween._target;
            var tweens = Tween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
                if (!Tween._inited) {
                    Tween._lastTime = engine.getTimer();
                    engine.startTick(Tween.tick);
                    Tween._inited = true;
                }
            }
            else {
                if (target) {
                    target.tween_count--;
                }
                var i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        return;
                    }
                }
            }
        };
        /**
         * 删除所有 Tween
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        Tween.removeAllTweens = function () {
            var tweens = Tween._tweens;
            for (var i = 0, l = tweens.length; i < l; i++) {
                var tween = tweens[i];
                tween.paused = true;
                tween._target.tweenjs_count = 0;
            }
            tweens.length = 0;
        };
        /**
         * @private
         *
         * @param target
         * @param props
         * @param pluginData
         */
        Tween.prototype.initialize = function (target, props, pluginData) {
            this._target = target;
            if (props) {
                this._useTicks = props.useTicks; //帧动画
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                // props.onChange && this.addEventListener("change", props.onChange, props.onChangeObj);
                if (props.override) {
                    Tween.removeTweens(target);
                }
            }
            this.pluginData = pluginData || {};
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            if (props && props.paused) {
                this.paused = true;
            }
            else {
                Tween._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position, Tween.NONE);
            }
        };
        /**
         * @private
         *
         * @param value
         * @param actionsMode
         * @returns
         */
        Tween.prototype.setPosition = function (value, actionsMode) {
            if (actionsMode === void 0) { actionsMode = 1; }
            if (value < 0) {
                value = 0;
            }
            //正常化位置
            var t = value;
            var end = false;
            if (t >= this.duration) {
                if (this.loop) {
                    var newTime = t % this.duration;
                    if (t > 0 && newTime === 0) {
                        t = this.duration;
                    }
                    else {
                        t = newTime;
                    }
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }
            if (end) {
                this.setPaused(true);
            }
            var prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;
            if (this._target) {
                if (this._steps.length > 0) {
                    // 找到新的tween
                    var l = this._steps.length;
                    var stepIndex = -1;
                    for (var i = 0; i < l; i++) {
                        if (this._steps[i].type == "step") {
                            stepIndex = i;
                            if (this._steps[i].t <= t && this._steps[i].t + this._steps[i].d >= t) {
                                break;
                            }
                        }
                    }
                    for (var i = 0; i < l; i++) {
                        if (this._steps[i].type == "action") {
                            //执行actions
                            if (actionsMode != 0) {
                                if (this._useTicks) {
                                    this._runAction(this._steps[i], t, t);
                                }
                                else if (actionsMode == 1 && t < prevPos) {
                                    if (prevPos != this.duration) {
                                        this._runAction(this._steps[i], prevPos, this.duration);
                                    }
                                    this._runAction(this._steps[i], 0, t, true);
                                }
                                else {
                                    this._runAction(this._steps[i], prevPos, t);
                                }
                            }
                        }
                        else if (this._steps[i].type == "step") {
                            if (stepIndex == i) {
                                var step = this._steps[stepIndex];
                                this._updateTargetProps(step, Math.min((this._stepPosition = t - step.t) / step.d, 1));
                            }
                        }
                    }
                }
            }
            // this.dispatchEventWith("change");
            return end;
        };
        /**
         * @private
         *
         * @param startPos
         * @param endPos
         * @param includeStart
         */
        Tween.prototype._runAction = function (action, startPos, endPos, includeStart) {
            if (includeStart === void 0) { includeStart = false; }
            var sPos = startPos;
            var ePos = endPos;
            if (startPos > endPos) {
                //把所有的倒置
                sPos = endPos;
                ePos = startPos;
            }
            var pos = action.t;
            if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                action.f.apply(action.o, action.p);
            }
        };
        /**
         * @private
         *
         * @param step
         * @param ratio
         */
        Tween.prototype._updateTargetProps = function (step, ratio) {
            var p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            }
            else {
                this.passive = !!step.v;
                //不更新props.
                if (this.passive) {
                    return;
                }
                //使用ease
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }
            for (var n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                    v = ratio == 1 ? v1 : v0;
                }
                else {
                    v = v0 + (v1 - v0) * ratio;
                }
                var ignore = false;
                if (arr = Tween._plugins[n]) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == Tween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    this._target[n] = v;
                    this.set(this._curQueueProps);
                }
            }
        };
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
        Tween.prototype.setPaused = function (value) {
            this.paused = value;
            Tween._register(this, !value);
            return this;
        };
        /**
         * @private
         *
         * @param props
         * @returns
         */
        Tween.prototype._cloneProps = function (props) {
            var o = {};
            for (var n in props) {
                o[n] = props[n];
            }
            return o;
        };
        /**
         * @private
         *
         * @param o
         * @returns
         */
        Tween.prototype._addStep = function (o) {
            if (o.d > 0) {
                o.type = "step";
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        };
        /**
         * @private
         *
         * @param o
         * @returns
         */
        Tween.prototype._appendQueueProps = function (o) {
            var arr, oldValue, i, l, injectProps;
            for (var n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this._target[n];
                    //设置plugins
                    if (arr = Tween._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                }
                else {
                    oldValue = this._curQueueProps[n];
                }
            }
            for (var n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = Tween._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(this, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        };
        /**
         * @private
         *
         * @param o
         * @returns
         */
        Tween.prototype._addAction = function (o) {
            o.t = this.duration;
            o.type = "action";
            this._steps.push(o);
            return this;
        };
        /**
         * @private
         *
         * @param props
         * @param o
         */
        Tween.prototype._set = function (props, o) {
            for (var n in props) {
                o[n] = props[n];
            }
        };
        /**
         * 等待指定毫秒后执行下一个动画
         * @param duration {number} 要等待的时间，以毫秒为单位
         * @param passive {boolean} 等待期间属性是否会更新
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        Tween.prototype.wait = function (duration, passive) {
            if (duration == null || duration <= 0) {
                return this;
            }
            var o = this._cloneProps(this._curQueueProps);
            return this._addStep({ d: duration, p0: o, p1: o, v: passive });
        };
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
        Tween.prototype.to = function (props, duration, ease) {
            var _this = this;
            if (ease === void 0) { ease = undefined; }
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            engine.startTick(function () {
                console.log(_this._curQueueProps);
            });
            console.log(this._curQueueProps);
            this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
            //加入一步set，防止游戏极其卡顿时候，to后面的call取到的属性值不对
            return this.set(props);
        };
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
        Tween.prototype.call = function (callback, thisObj, params) {
            if (thisObj === void 0) { thisObj = undefined; }
            if (params === void 0) { params = undefined; }
            return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
        };
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
        Tween.prototype.set = function (props, target) {
            if (target === void 0) { target = null; }
            //更新当前数据，保证缓动流畅性
            this._appendQueueProps(props);
            return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
        };
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
        Tween.prototype.play = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [false]);
        };
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
        Tween.prototype.pause = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [true]);
        };
        /**
         * @method egret.Tween#tick
         * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        Tween.prototype.$tick = function (delta) {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        };
        return Tween;
    }());
    /**
     * 不做特殊处理
     * @constant {number} egret.Tween.NONE
     * @private
     */
    Tween.NONE = 0;
    /**
     * 循环
     * @constant {number} egret.Tween.LOOP
     * @private
     */
    Tween.LOOP = 1;
    /**
     * 倒序
     * @constant {number} egret.Tween.REVERSE
     * @private
     */
    Tween.REVERSE = 2;
    /**
     * @private
     * 保存所有Tween的列表
     */
    Tween._tweens = [];
    /**
     * @private
     */
    Tween.IGNORE = {};
    /**
     * @private
     * 插件
     */
    Tween._plugins = {};
    /**
     * @private
     * 初始化
     */
    Tween._inited = false;
    Tween._lastTime = 0;
    engine.Tween = Tween;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var Event = (function () {
        function Event(type, bubbles, cancelable) {
            this.bubbles = false;
            this.cancelable = false;
            this.type = type;
            if (bubbles != null)
                this.bubbles = bubbles;
            if (cancelable != null)
                this.cancelable = cancelable;
        }
        return Event;
    }());
    Event.ENTER_FRAME = "enterframe";
    engine.Event = Event;
    var MyTouchEvent = (function (_super) {
        __extends(MyTouchEvent, _super);
        function MyTouchEvent(x, y, type) {
            var _this = _super.call(this, type) || this;
            _this.stageX = x;
            _this.stageY = y;
            return _this;
            // this.type = type;
        }
        return MyTouchEvent;
    }(Event));
    // type: string;
    MyTouchEvent.TouchDown = "touchdown";
    MyTouchEvent.TouchUp = "touchup";
    MyTouchEvent.TouchClick = "touchclick";
    MyTouchEvent.TOUCH_BEGIN = "touchbegin";
    MyTouchEvent.TOUCH_END = "touchend";
    MyTouchEvent.TOUCH_MOVE = "touchmove";
    engine.MyTouchEvent = MyTouchEvent;
    var EventListen = (function () {
        function EventListen(type, func, isCapture) {
            this.isCapture = false;
            this.type = type;
            this.func = func;
            if (isCapture != null)
                this.isCapture = isCapture;
        }
        return EventListen;
    }());
    engine.EventListen = EventListen;
})(engine || (engine = {}));
var engine;
(function (engine) {
    // export type ticker_Listener_Type = (deltaTime: number) => void;
    var Ticker = (function () {
        function Ticker() {
            // ticker_Listeners: ticker_Listener_Type[] = []
            this.ticker_Listeners = [];
        }
        Object.defineProperty(Ticker, "Instance", {
            get: function () {
                if (Ticker._instance == null) {
                    Ticker._instance = new Ticker();
                }
                return Ticker._instance;
            },
            enumerable: true,
            configurable: true
        });
        // register(listener: ticker_Listener_Type) {
        Ticker.prototype.register = function (listener) {
            if (this.ticker_Listeners.indexOf(listener) == -1)
                this.ticker_Listeners.push(listener);
        };
        // unregister(listener: ticker_Listener_Type) {        
        Ticker.prototype.unregister = function (listener) {
            var index = this.ticker_Listeners.indexOf(listener);
            if (index == -1)
                console.error("Do not find listener which you want to remove in Ticker");
            else
                this.ticker_Listeners.splice(index);
        };
        Ticker.prototype.clear = function () {
            this.ticker_Listeners = [];
        };
        Ticker.prototype.notify = function (deltaTime) {
            this.ticker_Listeners.forEach(function (listener) {
                listener(deltaTime);
            });
        };
        return Ticker;
    }());
    engine.Ticker = Ticker;
    function startTick(func) {
        Ticker.Instance.register(func);
    }
    engine.startTick = startTick;
    function stopTick(func) {
        Ticker.Instance.unregister(func);
    }
    engine.stopTick = stopTick;
    function getTimer() {
        return Date.now();
    }
    engine.getTimer = getTimer;
    function MysetTimeout(func, time) {
        setTimeout(func, time);
    }
    engine.MysetTimeout = MysetTimeout;
})(engine || (engine = {}));
var math;
(function (math) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    math.Point = Point;
    var Rectangle = (function () {
        function Rectangle() {
            this.x = 0;
            this.y = 0;
            this.width = 1;
            this.height = 1;
        }
        Rectangle.prototype.isPointInRectangle = function (point) {
            if (point.x >= this.x &&
                point.x <= (this.x + this.width) &&
                point.y >= this.y &&
                point.y <= (this.y + this.height)) {
                return true;
            }
            else {
                return false;
            }
        };
        return Rectangle;
    }());
    math.Rectangle = Rectangle;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    math.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    math.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    math.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        return Matrix;
    }());
    math.Matrix = Matrix;
})(math || (math = {}));
var engine;
(function (engine) {
    var DisplayObject = (function () {
        function DisplayObject(type) {
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0; //360度角度值
            this.alpha = 1; //绝对透明度
            this.width = 0;
            this.height = 0;
            this.parent = null;
            this.type = "DisplayObject";
            this.localAlpha = 1; //控制渲染的透明度
            this.matrix = new math.Matrix();
            this.localMatrix = new math.Matrix();
            this.touchEnable = false;
            this.touchChildren = true;
            this.listenerList = [];
            this.type = type;
        }
        DisplayObject.prototype.update = function () {
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
        };
        //picture
        //  |---containner
        //          |-----stage
        DisplayObject.prototype.$dispatchPropagationEvent = function (Chain, touchEvent, isCapture) {
            if (this.touchEnable == true) {
                if (isCapture) {
                    var captureDisplayObjects = Chain;
                    captureDisplayObjects.reverse();
                    captureDisplayObjects.forEach(function (displayObject) {
                        displayObject.listenerList.forEach(function (listen) {
                            if (touchEvent.type == listen.type && listen.isCapture)
                                listen.func();
                        });
                    });
                    Chain.reverse(); //再次反转过来
                }
                var bubbleDisplayObjects = Chain;
                bubbleDisplayObjects.forEach(function (displayObject) {
                    displayObject.listenerList.forEach(function (listen) {
                        if (touchEvent.type == listen.type && !listen.isCapture)
                            listen.func();
                    });
                });
            }
        };
        DisplayObject.prototype.dispatchEvent = function (event) {
            this.listenerList.forEach(function (listen) {
                if (listen.type == event.type) {
                    listen.func();
                }
            });
        };
        DisplayObject.prototype.addEventListener = function (type, func, IsCatch) {
            var EventListener = new engine.EventListen(type, func, IsCatch);
            if (this.listenerList.indexOf(EventListener) == -1)
                this.listenerList.push(EventListener);
        };
        DisplayObject.prototype.removeEventListener = function (type, func, IsCatch) {
            // if(type==MyTouchEvent.ENTER_FRAME){
            //     Disobject_Frames.Instance.register(func);
            // }
            var EventListener = new engine.EventListen(type, func, IsCatch);
            var index = this.listenerList.indexOf(EventListener);
            if (index == -1)
                console.error("Cannot find that you want to remove event");
            this.listenerList.splice(index);
        };
        return DisplayObject;
    }());
    engine.DisplayObject = DisplayObject;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer(type) {
            if (type === void 0) { type = "DisplayObjectContainer"; }
            var _this = _super.call(this, type) || this;
            _this.DisplayObjects = [];
            return _this;
        }
        DisplayObjectContainer.prototype.addChild = function (child) {
            if (this.DisplayObjects.indexOf(child) == -1) {
                this.DisplayObjects.push(child);
                child.parent = this;
            }
        };
        DisplayObjectContainer.prototype.removeChild = function (child) {
            var index = this.DisplayObjects.indexOf(child);
            if (index == -1) {
                console.error("Do not find DisplayObject that you want to remove");
                return;
            }
            else {
                this.DisplayObjects.splice(index);
            }
        };
        DisplayObjectContainer.prototype.removeAllChild = function () {
            this.DisplayObjects = [];
        };
        // render(canvas: CanvasRenderingContext2D) {
        //     for (var child of this.DisplayObjects) {
        //         child.draw(canvas);
        //     }
        // }
        DisplayObjectContainer.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var _i = 0, _a = this.DisplayObjects; _i < _a.length; _i++) {
                var drawable = _a[_i];
                drawable.update();
            }
        };
        DisplayObjectContainer.prototype.hitTest = function (x, y) {
            var resultChain = [];
            for (var index = this.DisplayObjects.length - 1; index > -1; index--) {
                var child = this.DisplayObjects[index];
                if (child.type == "DisplayObjectContainer" && child.touchChildren) {
                    var tempChain = [];
                    tempChain = child.hitTest(x, y);
                    if (resultChain == null)
                        resultChain = tempChain;
                    else
                        resultChain = resultChain.concat(tempChain);
                    if (resultChain.length != 0) {
                        resultChain.push(this);
                        break;
                    }
                    continue;
                }
                if (child.touchEnable || child.parent.touchChildren) {
                    var result = child.hitTest(x, y);
                    if (result != null)
                        resultChain.push(result);
                }
            }
            if (resultChain.length > 0)
                return resultChain;
            else
                return [];
        };
        DisplayObjectContainer.prototype.dispatchEvent = function (event) {
            this.DisplayObjects.forEach(function (child) {
                child.dispatchEvent(event);
            });
            this.listenerList.forEach(function (listen) {
                if (listen.type == event.type) {
                    listen.func();
                }
            });
        };
        DisplayObjectContainer.prototype.swapChildren = function (from, to) {
            var fromIndex = this.DisplayObjects.indexOf(from);
            if (fromIndex == -1) {
                console.error("Do not find DisplayObject that you want to remove");
                return;
            }
            var toIndex = this.DisplayObjects.indexOf(to);
            if (toIndex == -1) {
                console.error("Do not find DisplayObject that you want to remove");
                return;
            }
            var tempDisplayObject = this.DisplayObjects[fromIndex];
            this.DisplayObjects[fromIndex] = this.DisplayObjects[toIndex];
            this.DisplayObjects[toIndex] = tempDisplayObject;
        };
        return DisplayObjectContainer;
    }(engine.DisplayObject));
    engine.DisplayObjectContainer = DisplayObjectContainer;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage(context2d) {
            var _this = _super.call(this, "Stage") || this;
            _this.DisplayObjects = [];
            _this.Isinstance = false;
            if (Stage.instance != null)
                console.error("Stage is INSTANCE");
            Stage.context2d = context2d;
            Stage.instance = _this;
            return _this;
        }
        Stage.getInstance = function () {
            if (Stage.instance == null) {
                Stage.instance = new Stage(Stage.context2d);
            }
            return Stage.instance;
        };
        return Stage;
    }(engine.DisplayObjectContainer));
    engine.Stage = Stage;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        // public isLoaded = false;
        function Bitmap(id) {
            var _this = _super.call(this, "Bitmap") || this;
            _this.img = null;
            if (id)
                _this.img = engine.ResourceManager.getRes(id);
            return _this;
            // this.img = document.createElement("img");
        }
        Object.defineProperty(Bitmap.prototype, "src", {
            set: function (id) {
                this.img = engine.ResourceManager.getRes(id);
            },
            enumerable: true,
            configurable: true
        });
        // public _src = "";
        // set src(value: string) {
        //     this._src = value;
        //     this.isLoaded = false;
        //     /**image没有读取，不起作用*/
        //     // this.width = this.img.naturalWidth;
        //     // this.height = this.img.naturalHeight;
        // }
        // render(canvas: CanvasRenderingContext2D) {
        //     if (this.isLoaded) {
        //         //  console.log(this.x);
        //         canvas.drawImage(this.img, 0, 0, this.img.width, this.img.height);
        //         // canvas.drawImage(this.img, 0, 0, this.width, this.height);
        //     }
        //     else {
        //         this.img.src = this._src;
        //         if (this.width == 0)
        //             this.width = this.img.naturalWidth;
        //         if (this.height == 0)
        //             this.height = this.img.naturalHeight;
        //         this.img.onload = () => {
        //             // canvas.drawImage(this.img, 0, 0, this.img.width, this.img.height);
        //             // canvas.drawImage(this.img, this.x, this.y, this.img.width, this.img.height);
        //             this.isLoaded = true;
        //         }
        //     }
        //     // console.log("Bitmap:" + this.width);
        //     // console.log(this.img.naturalWidth);
        //     // console.log(this.scaleX);
        // }
        Bitmap.prototype.hitTest = function (x, y) {
            var invertLocalMatrix = math.invertMatrix(this.localMatrix);
            var point = new math.Point(x, y);
            var pointInLocalMatrix = math.pointAppendMatrix(point, invertLocalMatrix);
            var rect = new math.Rectangle();
            rect.x = 0;
            rect.y = 0;
            // rect.width = this.img.width;
            // rect.height = this.img.height;
            rect.width = this.width;
            rect.height = this.height;
            if (rect.isPointInRectangle(pointInLocalMatrix))
                return this;
            else
                return null;
        };
        return Bitmap;
    }(engine.DisplayObject));
    engine.Bitmap = Bitmap;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super.call(this, "TextField") || this;
            _this.text = "";
            _this.color = "";
            _this.fontSize = 10;
            _this.fontName = "";
            return _this;
        }
        // render(canvas: CanvasRenderingContext2D) {
        //     canvas.fillStyle = this.color;
        //     canvas.globalAlpha = this.localAlpha;
        //     // console.log("textfield"+this.alpha);
        //     canvas.font = this.fontSize.toString() + "px " + this.fontName.toString();
        //     canvas.fillText(this.text, this.x, this.y + this.fontSize);
        // }
        TextField.prototype.hitTest = function (x, y) {
            var rect = new math.Rectangle();
            rect.x = rect.y = 0;
            rect.width = this.text.length * 20;
            rect.height = this.fontSize;
            var point = new math.Point(x, y);
            var invertLocalMatrix = math.invertMatrix(this.localMatrix);
            var pointInLocalMatrix = math.pointAppendMatrix(point, invertLocalMatrix);
            if (rect.isPointInRectangle(pointInLocalMatrix))
                return this;
            else
                return null;
        };
        return TextField;
    }(engine.DisplayObject));
    engine.TextField = TextField;
})(engine || (engine = {}));
var engine;
(function (engine) {
    function run(canvas) {
        // var canvas = document.getElementById("context") as HTMLCanvasElement;
        var context2d = canvas.getContext("2d");
        var stage = new engine.Stage(context2d);
        var canvasRenderer = new engine.CanvasRenderer(stage, context2d);
        var lastNow = Date.now();
        var enterFrame = function (callback) {
            engine.ResourceManager.load();
            var now = Date.now();
            var deltaTime = now - lastNow;
            eventDispose();
            engine.Ticker.Instance.notify(deltaTime);
            // console.log("deltaTime" + deltaTime);
            context2d.clearRect(0, 0, canvas.width, canvas.height);
            context2d.save();
            // stage.draw(context2d);
            stage.update();
            canvasRenderer.render();
            context2d.restore();
            lastNow = now;
            window.requestAnimationFrame(enterFrame);
            ;
        };
        window.requestAnimationFrame(enterFrame);
        engine.ResourceLoad.load("loading.png", function () {
        });
        //事件处理机制
        function eventDispose() {
            var event = new engine.Event(engine.Event.ENTER_FRAME);
            stage.dispatchEvent(event);
        }
        //MyTouchEvent的相应机制
        window.onmousedown = function (down) {
            var downX = down.x - 3;
            var downY = down.y - 3;
            var touchEvent = new engine.MyTouchEvent(downX, downY, engine.MyTouchEvent.TouchDown);
            var downChain = stage.hitTest(downX, downY);
            stage.$dispatchPropagationEvent(downChain, touchEvent, true);
            // stage.dispatchEvent(downChain, touchEvent);
            window.onmouseup = function (up) {
                var upX = down.x - 3;
                var upY = down.y - 3;
                var upChain = stage.hitTest(upX, upY);
                if (downChain[0] == upChain[0]) {
                    var touchEvent = new engine.MyTouchEvent(downX, downY, engine.MyTouchEvent.TouchClick);
                    var ChickChain = stage.hitTest(upX, upY);
                    stage.$dispatchPropagationEvent(ChickChain, touchEvent, true);
                    // stage.dispatchEvent(ChickChain, touchEvent);
                }
                stage.$dispatchPropagationEvent(upChain, touchEvent, true);
                // stage.dispatchEvent(upChain, touchEvent);
            };
        };
        // window.onmousedown = (down) => {
        //     ifMouseDown = true;
        //     var downX = down.x - 3;
        //     var downY = down.y - 3;
        //     var touchEvent = new MyTouchEvent(downX, downY, MyTouchEvent.TouchDown);
        //     var downChain = stage.hitTest(downX, downY);
        //     // stage.$dispatchPropagationEvent(downChain, touchEvent, true);
        //     // stage.dispatchEvent(downChain, touchEvent);
        //     window.onmouseup = (up) => {
        //         ifMouseDown = false;
        //         var upX = down.x - 3;
        //         var upY = down.y - 3;
        //         var upChain = stage.hitTest(upX, upY);
        //         if (downChain[0] == upChain[0]) {
        //             var touchEvent = new MyTouchEvent(downX, downY, MyTouchEvent.TouchClick);
        //             var ChickChain = stage.hitTest(upX, upY);
        //             stage.$dispatchPropagationEvent(ChickChain, touchEvent, true);
        //             // stage.dispatchEvent(ChickChain, touchEvent);
        //         }
        //         stage.$dispatchPropagationEvent(upChain, touchEvent, true);
        //         // stage.dispatchEvent(upChain, touchEvent);
        //     }
        // }
        var clickResult;
        var currentX;
        var currentY;
        var tempX;
        var tempY;
        var ifMouseDown = false;
        window.onmousemove = function (down) {
            var downX = down.x - 3;
            var downY = down.y - 3;
            var touchEvent = new engine.MyTouchEvent(downX, downY, engine.MyTouchEvent.TouchDown);
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
                temp.listenerList.forEach(function (listen) {
                    if (listen.type == engine.MyTouchEvent.TOUCH_BEGIN) {
                        console.log("begin");
                        listen.func();
                    }
                    if (listen.type == engine.MyTouchEvent.TOUCH_MOVE) {
                        console.log("move");
                        listen.func();
                    }
                    if (listen.type == engine.MyTouchEvent.TOUCH_END) {
                        console.log("end");
                        listen.func();
                    }
                });
            }
        };
        return stage;
    }
    engine.run = run;
})(engine || (engine = {}));
