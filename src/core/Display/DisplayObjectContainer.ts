namespace engine {
    export class DisplayObjectContainer extends DisplayObject {
        DisplayObjects: DisplayObject[] = [];
        constructor(type: string = "DisplayObjectContainer") {
            super(type);
        }
        addChild(child: DisplayObject) {
            if (this.DisplayObjects.indexOf(child) == -1) {
                this.DisplayObjects.push(child);
                child.parent = this;
            }
        }
        removeChild(child: DisplayObject) {
            var index = this.DisplayObjects.indexOf(child)
            if (index == -1) {
                console.error("Do not find DisplayObject that you want to remove");
                return;
            }
            else {
                this.DisplayObjects.splice(index);
            }
        }
        removeAllChild() {
            this.DisplayObjects = [];
        }
        // render(canvas: CanvasRenderingContext2D) {
        //     for (var child of this.DisplayObjects) {
        //         child.draw(canvas);
        //     }
        // }
        update() {
            super.update();
            for (let drawable of this.DisplayObjects) {
                drawable.update();
            }
        }
        hitTest(x: number, y: number) {
            var resultChain: DisplayObject[] = [];
            for (var index = this.DisplayObjects.length - 1; index > -1; index--) {
                let child = this.DisplayObjects[index];
                if (child.touchEnable) {
                    var result = child.hitTest(x, y);
                    if (result != null)
                        resultChain.push(result);
                }
            }
            if (resultChain != null)
                resultChain.push(this);
            return resultChain;
        }
        dispatchEvent(event: Event) {
            this.DisplayObjects.forEach(child => {
                child.dispatchEvent(event);
            });
            this.listenerList.forEach(listen => {
                if (listen.type == event.type) {
                    listen.func();
                }
            });
        }
        swapChildren(from: DisplayObject, to: DisplayObject) {
            var fromIndex = this.DisplayObjects.indexOf(from)
            if (fromIndex == -1) {
                console.error("Do not find DisplayObject that you want to remove");
                return;
            }
            var toIndex = this.DisplayObjects.indexOf(to)
            if (toIndex == -1) {
                console.error("Do not find DisplayObject that you want to remove");
                return;
            }
            var tempDisplayObject = this.DisplayObjects[fromIndex];
            this.DisplayObjects[fromIndex] = this.DisplayObjects[toIndex];
            this.DisplayObjects[toIndex] = tempDisplayObject;
        }
    }
}