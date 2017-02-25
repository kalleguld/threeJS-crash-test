﻿class ThreeTest {
    content: HTMLElement;
    numTests = 1000;

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;


    constructor(elem: HTMLElement) {
        this.content = elem;
    }

    private static createRenderer(parent: HTMLElement) {
        let result = new THREE.WebGLRenderer({
            antialias: true,
        });

        result.setSize(parent.clientWidth, parent.clientHeight);
        parent.appendChild(result.domElement);
        return result;
    }

    public loop(): void {
        this.numTests--;
        if (this.numTests < 0)
            return;
        while (this.content.children.length > 0) {
            this.content.removeChild(this.content.firstChild);
        }
            
        this.renderer = ThreeTest.createRenderer(this.content);
        this.scene = ThreeTest.createScene();
        ThreeTest.addLights(this.scene);
        ThreeTest.populate(this.scene);
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
        this.camera.position.set(0, 0, 5);
        this.animate(100);
    }

    private static createScene(): THREE.Scene {
        return new THREE.Scene();
    }
    private static addLights(scene: THREE.Scene): void {
        scene.add(new THREE.AmbientLight(0x669966, 2));
    }
    private static populate(scene: THREE.Scene): void {
        for (let i = 0; i < 50; i++) {
            scene.add(ThreeTest.getBox(i));
        }
    }
    private static getBox(boxNum: number): THREE.Mesh {
        let geo = new THREE.BoxGeometry(1, 1, 1);
        let mat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        let cube = new THREE.Mesh(geo, mat);
        cube.position.set(Math.sin(boxNum / 3) * 5, Math.cos(boxNum / 3) * 5, boxNum);
        return cube;
    }

    private animate(n: number): void {
        if (n < 0) {
            this.loop();
            return;
        }
        this.camera.position.z += 0.3;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(c => this.animate(n - 1));
    }

}

window.onload = () => {
    var el = document.getElementById('content');
    var threeTest = new ThreeTest(el);
    threeTest.loop();
};