namespace engine.ResourceManager {
    var ImageJson = [
        { id: "loading.png", url: "loading.png", width: 200, height: 200 },
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
        id: string;
        public isLoaded = false;
        public bitmapData: HTMLImageElement;
        private static loadImage: HTMLImageElement;
        private static loadImageIsLoad = false;
        private url: string;
        constructor(id: string) {
            ImageJson.forEach(element => {
                if (element.id == id) {
                    this.id = id;
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
                ImageResource.loadImage.onload = () => {
                    this.bitmapData = ImageResource.loadImage;
                    ImageResource.loadImageIsLoad = true;
                }
            } else
                this.bitmapData = ImageResource.loadImage
            this.load();
        }
        load() {
            if (engine.ResourceLoad.get(this.id) != null) {
                this.bitmapData = engine.ResourceLoad.get(this.id);
                this.isLoaded = true;
                return;
            }
            var realResource = document.createElement("img");
            realResource.src = this.url;
            realResource.onload = () => {
                this.bitmapData = realResource;
                this.width = realResource.width;
                this.height = realResource.height;
                this.isLoaded = true;
            }
        }

    }
}