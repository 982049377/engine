namespace egret {
	/**
     * Tween是Egret的动画缓动类
     * @see http://edn.egret.com/cn/docs/page/576 Tween缓动动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
     * @language zh_CN
	 */
    export class MyTween {
		/**
         * 不做特殊处理
		 * @constant {number} egret.Tween.NONE
         * @private
		 */
        private static NONE = 0;
		/**
         * 循环
		 * @constant {number} egret.Tween.LOOP
         * @private
		 */
        private static LOOP = 1;
		/**
         * 倒序
		 * @constant {number} egret.Tween.REVERSE
         * @private
		 */
        private static REVERSE = 2;

        /**
         * @private
         * 保存所有Tween的列表
         */
        private static _tweens: MyTween[] = [];
        /**
         * @private
         */
        private static IGNORE = {};
        /**
         * @private
         * 插件
         */
        // private static _plugins = {};
        /**
         * @private
         * 初始化
         */
        private static _inited = false;

        /**
         * @private
         */
        private _target: any = null;
        /**
         * @private
         */
        private _useTicks: boolean = false;
        /**
         * @private全局暂停
         */
        private ignoreGlobalPause: boolean = false;
        /**
         * 对象的循环
         * @private
         */
        private loop: boolean = false;
        /**
         * 
         * @private
         * 插件缓存数据
         */
        private pluginData = null;
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
        private _steps: any[] = null;
        /**
         * @private
         */
        private paused: boolean = false;
        /**
         * @private 持续时间
         */
        private duration: number = 0;
        /**
         * @private
         */
        private _prevPos: number = -1;
        /**
         * @private
         */
        private position: number = null;
        /**
         * @private
         */
        private _prevPosition: number = 0;
        /**
         * @private
         */
        private _stepPosition: number = 0;
        /**
         * @private
         */
        private passive: boolean = false;
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
        public static get(target: any, props?: {
                                                 loop?: boolean, onChange?: Function, onChangeObj?: any, useTicks?: boolean,
                                                 ignoreGlobalPause?: boolean, pause?: boolean, position?: number
                                                }, pluginData: any = null, override: boolean = false): MyTween {
            if (override) {
                MyTween.removeTweens(target);
            }
            return new MyTween(target, props, pluginData);
        }

		/**
         * 删除一个对象上的全部 Tween 动画
		 * @param target  需要移除 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public static removeTweens(target: any): void {
            if (!target.tween_count) {
                return;
            }
            let tweens: MyTween[] = MyTween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        }
        /**
         * 暂停某个对象的所有 Tween
         * @param target 要暂停 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static pauseTweens(target: any): void {
            if (!target.tween_count) {
                return;
            }
            let tweens: egret.MyTween[] = egret.MyTween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                }
            }
        }
        /**
         * 继续播放某个对象的所有缓动
         * @param target 要继续播放 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static resumeTweens(target: any): void {
            if (!target.tween_count) {
                return;
            }
            let tweens: egret.MyTween[] = egret.MyTween._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = false;
                }
            }
        }

        /**
         * @private
         * 
         * @param delta 
         * @param paused 
         */
        private static tick(timeStamp: number, paused = false): boolean {
            let delta = timeStamp - MyTween._lastTime;
            MyTween._lastTime = timeStamp;

            let tweens: MyTween[] = MyTween._tweens.concat();
            for (let i = tweens.length - 1; i >= 0; i--) {
                let tween: MyTween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.$tick(tween._useTicks ? 1 : delta);
            }

            return false;
        }

        private static _lastTime: number = 0;
        /**
         * @private
         * 
         * @param tween 
         * @param value 
         */
        private static _register(tween: MyTween, value: boolean): void {
            let target: any = tween._target;
            let tweens: MyTween[] = MyTween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
                if (!MyTween._inited) {
                    MyTween._lastTime = egret.getTimer();
                    sys.$ticker.$startTick(MyTween.tick, null);
                    MyTween._inited = true;
                }
            } else {
                if (target) {
                    target.tween_count--;
                }
                let i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        return;
                    }
                }
            }
        }
		/**
         * 删除所有 Tween
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public static removeAllTweens(): void {
            let tweens: MyTween[] = MyTween._tweens;
            for (let i = 0, l = tweens.length; i < l; i++) {
                let tween: MyTween = tweens[i];
                tween.paused = true;
                tween._target.tweenjs_count = 0;
            }
            tweens.length = 0;
        }

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
        constructor(target: any, props?: any, pluginData?: any) {
            // super();
            this.initialize(target, props, pluginData);
        }

        /**
         * @private
         * 
         * @param target 
         * @param props 
         * @param pluginData 
         */
        private initialize(target: any, props: any, pluginData: any): void {
            this._target = target;
            if (props) {
                this._useTicks = props.useTicks;//帧动画
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                // props.onChange && this.addEventListener("change", props.onChange, props.onChangeObj);
                if (props.override) {
                    MyTween.removeTweens(target);
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
                MyTween._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position, MyTween.NONE);
            }
        }

        /**
         * @private
         * 
         * @param value 
         * @param actionsMode 
         * @returns 
         */
        public setPosition(value: number, actionsMode: number = 1): boolean {
            if (value < 0) {
                value = 0;
            }

            //正常化位置
            let t: number = value;
            let end: boolean = false;
            if (t >= this.duration) {
                if (this.loop) {
                    var newTime = t % this.duration;
                    if (t > 0 && newTime === 0) {
                        t = this.duration;
                    } else {
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

            let prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;

            if (this._target) {
                if (this._steps.length > 0) {
                    // 找到新的tween
                    let l = this._steps.length;
                    let stepIndex = -1;
                    for (let i = 0; i < l; i++) {
                        if (this._steps[i].type == "step") {
                            stepIndex = i;
                            if (this._steps[i].t <= t && this._steps[i].t + this._steps[i].d >= t) {
                                break;
                            }
                        }
                    }
                    for (let i = 0; i < l; i++) {
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
                                let step = this._steps[stepIndex];
                                this._updateTargetProps(step, Math.min((this._stepPosition = t - step.t) / step.d, 1));
                            }
                        }
                    }
                }
            }

            // this.dispatchEventWith("change");
            return end;
        }

        /**
         * @private
         * 
         * @param startPos 
         * @param endPos 
         * @param includeStart 
         */
        private _runAction(action: any, startPos: number, endPos: number, includeStart: boolean = false) {
            let sPos: number = startPos;
            let ePos: number = endPos;
            if (startPos > endPos) {
                //把所有的倒置
                sPos = endPos;
                ePos = startPos;
            }
            let pos = action.t;
            if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                action.f.apply(action.o, action.p);
            }
        }

        /**
         * @private
         * 
         * @param step 
         * @param ratio 
         */
        private _updateTargetProps(step: any, ratio: number) {
            let p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            } else {
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

            for (let n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                    v = ratio == 1 ? v1 : v0;
                } else {
                    v = v0 + (v1 - v0) * ratio;
                }

                let ignore = false;
                // if (arr = MyTween._plugins[n]) {
                //     for (let i = 0, l = arr.length; i < l; i++) {
                //         let v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                //         if (v2 == MyTween.IGNORE) {
                //             ignore = true;
                //         }
                //         else {
                //             v = v2;
                //         }
                //     }
                // }
                if (!ignore) {
                    this._target[n] = v;
                }
            }

        }

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
        public setPaused(value: boolean): MyTween {
            this.paused = value;
            MyTween._register(this, !value);
            return this;
        }

        /**
         * @private
         * 
         * @param props 
         * @returns 
         */
        private _cloneProps(props: any): any {
            let o = {};
            for (let n in props) {
                o[n] = props[n];
            }
            return o;
        }

        /**
         * @private
         * 
         * @param o 
         * @returns 
         */
        private _addStep(o): MyTween {
            if (o.d > 0) {
                o.type = "step";
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        }

        /**
         * @private
         * 
         * @param o 
         * @returns 
         */
        private _appendQueueProps(o): any {
            let arr, oldValue, i, l, injectProps;
            for (let n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this._target[n];
                    //设置plugins
                    // if (arr = MyTween._plugins[n]) {
                    //     for (i = 0, l = arr.length; i < l; i++) {
                    //         oldValue = arr[i].init(this, n, oldValue);
                    //     }
                    // }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                } else {
                    oldValue = this._curQueueProps[n];
                }
            }

            for (let n in o) {
                oldValue = this._curQueueProps[n];
                // if (arr = MyTween._plugins[n]) {
                //     injectProps = injectProps || {};
                //     for (i = 0, l = arr.length; i < l; i++) {
                //         if (arr[i].step) {
                //             arr[i].step(this, n, oldValue, o[n], injectProps);
                //         }
                //     }
                // }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        }

        /**
         * @private
         * 
         * @param o 
         * @returns 
         */
        private _addAction(o): MyTween {
            o.t = this.duration;
            o.type = "action";
            this._steps.push(o);
            return this;
        }

        /**
         * @private
         * 
         * @param props 
         * @param o 
         */
        private _set(props: any, o): void {
            for (let n in props) {
                o[n] = props[n];
            }
        }

		/**
         * 等待指定毫秒后执行下一个动画
		 * @param duration {number} 要等待的时间，以毫秒为单位
		 * @param passive {boolean} 等待期间属性是否会更新
		 * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
		 */
        public wait(duration: number, passive?: boolean): MyTween {
            if (duration == null || duration <= 0) {
                return this;
            }
            let o = this._cloneProps(this._curQueueProps);
            return this._addStep({ d: duration, p0: o, p1: o, v: passive });
        }
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

        public to(props: any, duration?: number, ease: Function = undefined) {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
            //加入一步set，防止游戏极其卡顿时候，to后面的call取到的属性值不对
            return this.set(props);
        }

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
        public call(callback: Function, thisObj: any = undefined, params: any[] = undefined): MyTween {
            return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
        }

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
        public set(props: any, target = null): MyTween {
            //更新当前数据，保证缓动流畅性
            this._appendQueueProps(props);
            return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
        }

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
        public play(tween?: MyTween): MyTween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [false]);
        }

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
        public pause(tween?: MyTween): MyTween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [true]);
        }

		/**
		 * @method egret.Tween#tick
		 * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public $tick(delta: number): void {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        }
    }
}