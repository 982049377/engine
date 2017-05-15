namespace engine {
    export class Twween {
        target: DisplayObject;
        constructor(target: DisplayObject) {
            this.target = target;
        }
        public static get(target: DisplayObject) {
            return new Twween(target);
        }
        tempProperties: any;
        targetProperties: any;
        time: number;
        degrees = -1;
        private stoptimes: number;
        to(properties: any, time: number) {
            this.time = time;
            this.tempProperties = properties;//只为获得属性
            this.targetProperties = properties;
            for (var property in properties) {
                this.tempProperties[property] = properties[property] - this.target[property];
            }
            
            engine.Ticker.Instance.register(this.tick);
        }
        private tick =(deltaTime)=>{
        // private tick(deltaTime) {
            if (this.degrees == -1) {
                this.degrees = this.time / deltaTime;
                this.stoptimes = this.degrees;
            }
            for (var property in this.targetProperties) {
                this.target[property] += this.tempProperties[property] / this.degrees;
            }
            this.stoptimes--;
            console.log(this.stoptimes);
            if (this.stoptimes <= 0) {
                console.log("移除");
                engine.Ticker.Instance.unregister(this.tick)
                this.degrees = -1;
            }
        }
    }


}