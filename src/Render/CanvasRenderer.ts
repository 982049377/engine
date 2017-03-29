namespace engine {
    export class CanvasRenderer {

        constructor(private stage: Stage, private context2D: CanvasRenderingContext2D) {

        }

        render() {
            let stage = this.stage;
            let context2D = this.context2D;
            this.renderContainer(stage);
        }

        renderContainer(stage: DisplayObjectContainer) {
            for (let child of stage.DisplayObjects) {
                this.context2D.globalAlpha = child.localAlpha;
                let m = child.localMatrix;
                this.context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);

                if (child.type == "Bitmap") {
                    // if (child.x == 0) {
                    //     console.log("..................");
                    // }
                    this.renderBitmap(child as Bitmap);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child as TextField);
                }
                else if (child.type == "DisplayObjectContainer" || child.type == "Stage") {
                    this.renderContainer(child as DisplayObjectContainer);
                }
                // console.log(child.type + this.context2D.globalAlpha);
            }
        }
        
        renderBitmap(bitmap: Bitmap) {
            // this.context2D.drawImage(bitmap.img.bitmapData, 0, 0);
             console.log("in render bitmap");
            if (bitmap.img.isLoaded) {
                this.context2D.drawImage(bitmap.img.bitmapData, 0, 0, bitmap.img.width, bitmap.img.height);
                console.log("render bitmap");
            }
            else {
                // bitmap.img.bitmapData.src = bitmap._src;
                if (bitmap.width == 0)
                    bitmap.width = bitmap.img.width;
                if (bitmap.height == 0)
                    bitmap.height = bitmap.img.height;
                bitmap.img.bitmapData.onload = () => {
                    bitmap.img.isLoaded = true;
                }
            }
        }

        renderTextField(textField: TextField) {
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
        }
    }

}