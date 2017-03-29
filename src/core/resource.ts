namespace engine.RES {
    var ImageJson = [
        { id: "loading", url: "loading.png", width: 200, height: 200 },
    ]
    var __cache = {}
    export function getRes(id: string): ImageResource {

        if (__cache[id]) {
            return __cache[id]
        }
        else {
            __cache[id] = new ImageResource(id);
            return __cache[id];
        }
    }

    export function loadRes(id): ImageResource {
        var resource = getRes(id);
        resource.load();
        return resource;
    }

    export function load() {
        for (var index in __cache) {
            __cache[index].load();
        }
    }


    export function addImageJson(id: string, url: string, width: number, height: number) {
        ImageJson.forEach(element => {
            if (element.id == id)
                return;
        });
        var tempElement = { id: id, url: url, width: width, height: height }
        ImageJson.push(tempElement);
    }

    export class ImageResource {
        width = 0;

        height = 0;

        public isLoaded = false;

        bitmapData: HTMLImageElement;
        private static loadImage: HTMLImageElement;
        private static loadImageIsLoad = false;
        private url: string;
        constructor(id: string) {
            ImageJson.forEach(element => {
                if (element.id == id) {
                    this.width = element.width;
                    this.height = element.height;
                    this.url = element.url;
                    this.isLoaded = false;
                }
            });
            if (this.width == 0 && this.height == 0) {
                console.error("没有所需的Json数据文件");
                return;
            }
            // // this.url = url;
            this.bitmapData = document.createElement("img");
            if (ImageResource.loadImageIsLoad == false) {
                ImageResource.loadImage = document.createElement("img");
                ImageResource.loadImage.src = "..\..\loading.png";
                console.log(ImageResource.loadImage.src);
                ImageResource.loadImage.onload = () => {
                    this.bitmapData = ImageResource.loadImage;
                    ImageResource.loadImageIsLoad = true;
                }
            } else
                this.bitmapData = ImageResource.loadImage;
            this.load();
        }
        load() {
            var realResource = document.createElement("img");
            realResource.src = this.url;
            realResource.onload = () => {
                this.bitmapData = realResource;
                this.isLoaded = true;
            }
        }
    }
}