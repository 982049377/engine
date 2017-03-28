namespace engine {
    export class Stage extends DisplayObjectContainer {
        DisplayObjects: DisplayObject[] = [];
        private static instance: Stage;
        static context2d: CanvasRenderingContext2D;
        private Isinstance: boolean = false;
        constructor(context2d: CanvasRenderingContext2D) {
            super("Stage");
            if (Stage.instance != null)
                console.error("Stage is INSTANCE");
            Stage.context2d = context2d;
            Stage.instance = this;
        }
        static getInstance() {
            if (Stage.instance == null) {
                Stage.instance = new Stage(Stage.context2d);
            }
            return Stage.instance;
        }
    }
}