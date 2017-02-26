class JsonLoad {
    load(canvasContainerId) {
        let canvasContainer = document.getElementById(canvasContainerId);
        this.renderer = ThreeTest.createRenderer(canvasContainer);
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
        this.camera.position.set(0, 2, 10);
        let loader = new THREE.ObjectLoader();
        loader.load("/jsonScene.js", scene => {
            this.scene = scene;
            this.renderer.render(this.scene, this.camera);
        });
    }
}
//# sourceMappingURL=JsonLoad.js.map