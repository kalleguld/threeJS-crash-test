class ThreeTest {
    readonly content: HTMLElement;
    run = true;
    numTests = 0;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer = null;
    lights: THREE.SpotLight[] = [];

    constructor(elem: HTMLElement) {
        this.content = elem;
    }

    public start() {
        if (!this.run) {
            this.run = true;
            this.loop();
        }
    }
    public stop() {
        this.run = false;
        console.debug("Stopped");
    }

    public async loop(): Promise<void> {
        this.numTests++;
        

        this.lights = [];
        if (this.renderer == null)
            this.renderer = ThreeTest.createRenderer(this.content);
        this.scene = ThreeTest.createScene();

        this.lights = ThreeTest.getLights();
        for (let light of this.lights) {
            this.scene.add(light);
        }

        let texture = await ThreeTest.getTexture("img/212.jpg");
        this.scene.add(ThreeTest.getBoxes(texture, 50));
        let otherBoxes = ThreeTest.getBoxes(texture, 50);
        otherBoxes.rotateZ(Math.PI);
        this.scene.add(otherBoxes);

        let ground = await ThreeTest.getGround();
        this.scene.add(ground);

        this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
        this.camera.position.set(0, 0, 25);
        this.animate(300);
    }
    private static createRenderer(parent: HTMLElement) {
        let result = new THREE.WebGLRenderer({
            antialias: true,
        });
        result.shadowMapType = THREE.PCFSoftShadowMap;
        result.shadowMapEnabled = true;
        while (parent.children.length > 0) {
            parent.removeChild(parent.firstChild);
        }
        result.setSize(parent.clientWidth, parent.clientHeight);
        parent.appendChild(result.domElement);
        return result;
    }
    private static createScene(): THREE.Scene {
        return new THREE.Scene();
    }
    private static getLights(): THREE.SpotLight[] {
        let result = [];
        let lightA = new THREE.SpotLight(0xff22ff, 2, 25);
        lightA.position.set(2, 2, 0);
        result.push(lightA);
        let lightB = new THREE.SpotLight(0x22ffff, 2, 25);
        lightB.position.set(-2, -2, 0);
        result.push(lightB);
        let lightC = new THREE.SpotLight(0xffff22, 2, 25);
        lightC.position.set(0, 0, 2);
        result.push(lightC);

        return result;
    }
    private static getBoxes(texture: THREE.Texture, numBoxes: number): THREE.Group {
        let result = new THREE.Group();
        for (let i = 0; i < numBoxes; i++) {
            result.add(ThreeTest.getBox(i, texture));
        }
        return result;
    }
    private static getBox(boxNum: number, texture: THREE.Texture): THREE.Mesh {
        let geo = new THREE.BoxGeometry(1, 1, 1);
        let tex = texture.clone();
        tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
        tex.repeat.set(boxNum / 10 + 1, boxNum / 10 + 1);
        tex.needsUpdate = true;
        let mat = new THREE.MeshPhongMaterial({
            map: tex,
        });
        let cube = new THREE.Mesh(geo, mat);
        cube.castShadow = cube.receiveShadow = true;
        cube.position.set(Math.sin(boxNum / 3) * 5, Math.cos(boxNum / 3) * 5, boxNum);
        return cube;
    }
    private static async getGround(): Promise<THREE.Object3D> {
        let geo = new THREE.PlaneGeometry(5, 50, 5, 50);
        let tex = await ThreeTest.getTexture("img/212.jpg");
        let mat = new THREE.MeshPhongMaterial({
            map: tex,
        });
        let mesh = new THREE.Mesh(geo, mat);
        mesh.receiveShadow = true;
        mesh.position.set(0, -6, 25);
        mesh.rotateX(Math.PI / -2);
        return mesh;
    }

    private animate(n: number): void {
        if (!this.run)
            return;
        if (n < 0) {
            this.loop();
            return;
        }
        let step = 0.2;
        let zStep = 0.3 * step;
        //this.camera.position.z += zStep;
        for (let light of this.lights) {
            light.position.z += zStep;
            
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(c => this.animate(n - step));
    }


    private static getTexture(url: string): Promise<THREE.Texture> {
        return new Promise<THREE.Texture>((resolve, reject) => {
            let loader = new THREE.TextureLoader();
            loader.load(url, resolve);
        });
    }
}


window.onload = () => {
    var el = document.getElementById('content');
    var threeTest = new ThreeTest(el);
    threeTest.loop();
    window["threeTest"] = threeTest;
};