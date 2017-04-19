namespace engine {

    export class Twween {
        target: any;
        private _curQueueProps;
        private _steps;
        constructor(target: any) {
            this.init(target);
        }

        private init(target: any) {
            this.target = target;
            this._curQueueProps = {};
            this._steps = [];
        }

        public static get(target: any) {
            return new Twween(target);
        }


        private _cloneProps(props: any): any {
            let o = {};
            for (let n in props) {
                o[n] = props[n];
            }
            return o;
        }
private duration;
        public to(props: any, duration?: number) {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            this.duration = duration;
            var p0 = this._cloneProps(this._curQueueProps);
            var p1 = this._cloneProps(this._appendQueueProps(props));
            this._addStep({ during: duration || 0, p0, p1 });
            return this.set(props);
        }

        private _addStep(o): Twween {
            if (o.during > 0) {
                o.type = "step";
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.during;
            }
            return this;
        }


        public _appendQueueProps(props: any) {
            for (let n in props) {
                this._curQueueProps[n] = props[n];
            }
            return this._curQueueProps;
        }

    }


}