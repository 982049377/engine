namespace engine {
    export class Bitmap extends DisplayObject {
        public img: engine.ResourceManager.ImageResource = null;
        // public isLoaded = false;
        constructor(id?: string) {
            super("Bitmap");
            if (id)
                this.img = engine.ResourceManager.getRes(id);
            // this.img = document.createElement("img");
        }
        // setx(targetx: number) {
        //     this.x = targetx - this.img.bitmapData.width / 2;
        // }
        // sety(targety:number) {
        //     this.y = targety - this.img.bitmapData.height / 2;
        // }
        public set src(id: string) {
            this.img = engine.ResourceManager.getRes(id);
            
        }
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
        hitTest(x: number, y: number) {
            var invertLocalMatrix = math.invertMatrix(this.localMatrix);
            var point = new math.Point(x, y);
            var pointInLocalMatrix = math.pointAppendMatrix(point, invertLocalMatrix);
            var rect = new math.Rectangle();
            rect.x = 0;
            rect.y = 0;
            // rect.width = this.img.width;
            // rect.height = this.img.height;
            rect.width = this.img.width;
            rect.height = this.img.height;
            if (rect.isPointInRectangle(pointInLocalMatrix))
                return this;
            else
                return null;
        }
    }
}