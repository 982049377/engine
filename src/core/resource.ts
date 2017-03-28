namespace engine.RES {
    var __cache = {}
    export function getRes(name: string) {

        if (__cache[name]) {
            return __cache[name]
        }
        else {
            __cache[name] = new ImageResource(name);
            return __cache[name];
        }
    }

    export function loadRes(name) {
        var resource = getRes(name);
        resource.load();
    }

    export function loadConfig() {
       for(var index in __cache){
           __cache[index].load();
       }
    }


    class ImageResource {
        width = 0;

        height = 0;

        bitmapData: HTMLImageElement;

        private url: string;
        constructor(url: string) {
            this.url = url;
            this.bitmapData = document.createElement("img");
            this.bitmapData.src = "loading";
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