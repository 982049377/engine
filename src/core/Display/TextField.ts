namespace engine {
    export class TextField extends DisplayObject {
        text = "";
        color = "";
        fontSize = 10;
        fontName = "";
        constructor(){
            super("TextField");
        }
        // render(canvas: CanvasRenderingContext2D) {
        //     canvas.fillStyle = this.color;
        //     canvas.globalAlpha = this.localAlpha;
        //     // console.log("textfield"+this.alpha);
        //     canvas.font = this.fontSize.toString() + "px " + this.fontName.toString();
        //     canvas.fillText(this.text, this.x, this.y + this.fontSize);
        // }
        hitTest(x: number, y: number) {
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
        }
    }
}