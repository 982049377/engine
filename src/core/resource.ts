namespace engine.RES {
    var ImageJson = [
        { name: "loading", url: "loading.png", width: 200, height: 200 },
    ]
    var __cache = {}
    export function getRes(name: string) : ImageResource{

        if (__cache[name]) {
            return __cache[name]
        }
        else {
            __cache[name] = new ImageResource(name);
            return __cache[name];
        }
    }

    export function loadRes(name) : ImageResource{
        var resource = getRes(name);
        resource.load();
        return resource;
    }

    export function load() {
        for (var index in __cache) {
            __cache[index].load();
        }
    }


    export function addImageJson(name: string, url: string, width: number, height: number) {
        ImageJson.forEach(element => {
            if (element.name == name)
                return;
        });
        var tempElement = { name: name, url: url, width: width, height: height }
        ImageJson.push(tempElement);
    }

    export class ImageResource {
        width = 0;

        height = 0;

        bitmapData: HTMLImageElement;
        private static loadImage: HTMLImageElement;
        private url: string;
        constructor(name: string) {
            ImageJson.forEach(element => {
                if (element.name == name) {
                    this.width = element.width;
                    this.height = element.height;
                    this.url = element.url;
                }
            });
            // // this.url = url;
            this.bitmapData = document.createElement("img");
            ImageResource.loadImage = document.createElement("img");
            ImageResource.loadImage.src = "loading.png";
            console.log(ImageResource.loadImage.src);
            ImageResource.loadImage.onload = () => {
                this.bitmapData = ImageResource.loadImage;
            }
            this.bitmapData = ImageResource.loadImage;
        }
        load() {
            var realResource = document.createElement("img");
            realResource.src = this.url;
            realResource.onload = () => {
                this.bitmapData = realResource;
            }
        }
    }
}