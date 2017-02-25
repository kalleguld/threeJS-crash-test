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
        this.renderer = ThreeTest.createRenderer(this.content);
        this.scene = ThreeTest.createScene();

        this.lights = ThreeTest.getLights();
        for (let light of this.lights) {
            this.scene.add(light);
        }

        let texture = await ThreeTest.getTexture("img/212.jpg");
        this.scene.add(ThreeTest.getBoxes(texture, 200));
        let otherBoxes = ThreeTest.getBoxes(texture, 200);
        otherBoxes.rotateZ(Math.PI);
        this.scene.add(otherBoxes);

        //let ground = await ThreeTest.getGround();
        //this.scene.add(ground);

        this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
        this.camera.position.set(0, 0, -7.5);
        this.startAnimate();
    }
    private static createRenderer(parent: HTMLElement) {
        let result = new THREE.WebGLRenderer({
            antialias: true,
        });
        result.shadowMap.type = THREE.PCFSoftShadowMap;
        result.shadowMap.enabled = true;
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
        let numLights = 12;
        for (let i = 0; i < numLights; i++) {
            let iPi = i / numLights * 2 * Math.PI;
            let color = new THREE.Vector3(
                0.5 + 0.5 * Math.sin(iPi),
                0.5 + 0.5 * Math.cos(iPi),
                1);
            let light = new THREE.SpotLight(ThreeTest.getHexColor(color), 6 / numLights, 25);
            //let light = new THREE.SpotLight(0xffffff, 2, 25);
            light.position.set(4 * Math.sin(iPi), 7 * Math.cos(iPi), 0);
            result.push(light);
        }

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
        let geo = new THREE.PlaneGeometry(5, 200, 5, 50);
        let tex = await ThreeTest.getTexture("img/212.jpg");
        tex.repeat.set(5, 200);
        tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
        let mat = new THREE.MeshPhongMaterial({
            map: tex,
        });
        let mesh = new THREE.Mesh(geo, mat);
        mesh.receiveShadow = true;
        mesh.position.set(0, -6, 25);
        mesh.rotateX(Math.PI / -2);
        return mesh;
    }

    private startAnimate() {
        let t = performance.now();
        this.animate(t, t);
    }
    private animate(
        startTime: number,
        currentTIme: number
    ): void {
        if (this.time(currentTIme - startTime)) {
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(c => this.animate(startTime, c));
        }
        else
            this.loop();
    }

    private time(currentTime: number): boolean {
        let endTime = 10000;
        if (currentTime > endTime) {
            return false;
        }
        let cameraZStart = 250;
        let cameraEnd = 0;
        let cameraPos = ThreeTest.polate(cameraZStart, cameraEnd, currentTime / endTime);
        this.camera.position.z = cameraPos;
        for (let light of this.lights) {
            light.position.z = cameraPos;
        }

        return true;
    }

    private static polate(start: number, stop: number, normalizedPos: number): number{
        return (start * (1-normalizedPos)) + (stop * normalizedPos);
    }
    private static getTexture(url: string): Promise<THREE.Texture> {
        return new Promise<THREE.Texture>((resolve, reject) => {
            let loader = new THREE.TextureLoader();
            loader.load(url, resolve);
        });
    }
    private static getHexColor(normalizedRgb: THREE.Vector3): number {
        let r = normalizedRgb.x * 255;
        let g = normalizedRgb.y * 255;
        let b = normalizedRgb.z * 255;
        return r * (2 << 16) + g * (2 << 8) + b;
    }
}


window.onload = () => {
    var el = document.getElementById('content');
    var threeTest = new ThreeTest(el);
    threeTest.loop();
    window["threeTest"] = threeTest;
};