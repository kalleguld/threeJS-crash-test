class JsonLoad {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;

    load(canvasContainerId: string): void {
        let canvasContainer = document.getElementById(canvasContainerId);
        this.renderer = ThreeTest.createRenderer(canvasContainer);


        this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
        this.camera.position.set(0, 2, 10);

        let loader = new THREE.ObjectLoader();
        loader.load("/jsonScene.js", scene => {
            this.scene = <THREE.Scene>scene;
            this.renderer.render(this.scene, this.camera);
        });
        
    }
}

declare module THREE {
    class SceneLoader {
        load(url: string): THREE.Scene;
    }
}