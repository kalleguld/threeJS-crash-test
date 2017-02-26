class ThreeTest {
    readonly content: HTMLElement;
    numTests = 0;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer = null;
    lights: THREE.SpotLight[] = [];
    boxCircle: THREE.Group;
    texture: THREE.Texture;
    textureUrls = ["img/1.jpg",
        "img/2.jpg",
        "img/3.jpg",
        "img/4.jpg",
        "img/5.jpg",
        "img/6.jpg",
        "img/7.jpg",
        "img/1.png",
        "img/2.png",
        "img/3.png",
        "img/4.png",
        "img/5.png",
    ]
    textures: THREE.Texture[];

    constructor(elem: HTMLElement) {
        this.content = elem;
    }
    

    public async loop(): Promise<void> {
        this.numTests++;
        
        this.renderer = ThreeTest.createRenderer(this.content);
        this.scene = new THREE.Scene();

        this.lights = ThreeTest.getLights();
        for (let light of this.lights) {
            this.scene.add(light);
        }
        //this.scene.add(new THREE.AmbientLight(0xffffff, 2));

        this.texture = await ThreeTest.getTexture("img/256.jpg");
        //this.scene.add(ThreeTest.getBoxSpiral(texture, 200));
        //let otherBoxes = ThreeTest.getBoxSpiral(texture, 200);
        //otherBoxes.rotateZ(Math.PI);
        //this.scene.add(otherBoxes);
        this.textures = await ThreeTest.getTextures(this.textureUrls);
        this.boxCircle = ThreeTest.getBoxCircle(this.textures, 25, 5);
        this.scene.add(this.boxCircle);

        let ground = await ThreeTest.getGround();
        this.scene.add(ground);

        this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
        this.camera.position.set(0, 2, 10);
        console.debug(this.scene.toJSON());
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
    private static getLights(): THREE.SpotLight[] {
        let result = [];
        let numLights = 5;
        for (let i = 0; i < numLights; i++) {
            let iPi = i / numLights * 2 * Math.PI;
            let color = new THREE.Vector3(
                0.5 + 0.5 * Math.sin(iPi),
                0.5 + 0.5 * Math.cos(iPi),
                1);
            let light = new THREE.SpotLight(ThreeTest.getHexColor(color), 6 / numLights, 25);
            //let light = new THREE.SpotLight(0xffffff, 2, 25);
            light.position.set(4 * Math.sin(iPi), 7 * Math.cos(iPi), 0);
            light.castShadow = true;
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            result.push(light);
        }

        return result;
    }

    private static getBoxCircle(textures: THREE.Texture[],
        numBoxes: number,
        radius: number
    ): THREE.Group {
        let result = new THREE.Group();
        for (let i = 0; i < numBoxes; i++) {
            let geo = new THREE.BoxGeometry(1, 1, 1);
            let mat = new THREE.MeshPhongMaterial({
                map: textures[i % textures.length]
            });
            let cube = new THREE.Mesh(geo, mat);
            cube.castShadow = true;
            let iPi = i / numBoxes * Math.PI * 2;
            cube.position.set(
                radius * Math.sin(iPi),
                0.5,
                radius * Math.cos(iPi))

            cube.rotateY(iPi);
            result.add(cube);
        }
        return result;
    }
    private static getBoxSpiral(texture: THREE.Texture, numBoxes: number): THREE.Group {
        let result = new THREE.Group();
        for (let i = 0; i < numBoxes; i++) {
            result.add(ThreeTest.getSingleSpiralBox(i, texture));
        }
        return result;
    }
    private static getSingleSpiralBox(boxNum: number, texture: THREE.Texture): THREE.Mesh {
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
        let geo = new THREE.PlaneGeometry(50, 50);
        let tex = await ThreeTest.getTexture("img/212.jpg");
        tex.repeat.set(50, 50);
        tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
        let mat = new THREE.MeshPhongMaterial({
            map: tex,
        });
        let mesh = new THREE.Mesh(geo, mat);
        mesh.receiveShadow = true;
        
        mesh.rotateX(Math.PI / -2);
        mesh.position.y = -0.5;
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
        let lifetime = 1000;
        //if (currentTime > lifetime)
        //    return false;
        //this.scene.remove(this.boxCircle);
        //let boxCircle = ThreeTest.getBoxCircle(this.textures,
        //    ThreeTest.polate(5, 35, currentTime / lifetime),
        //    5);
        //this.boxCircle = boxCircle;
        //this.scene.add(boxCircle);

        let i = 0;
        for (let box of this.boxCircle.children) {
            box.position.y = Math.abs(Math.sin(i/4 + (currentTime / 200)));
            i++;
        }

        //let iPi = (currentTime / 10000);
        //this.camera.position.x = 10 * Math.sin(iPi);
        //this.camera.position.z = 10 * Math.cos(iPi);

        return true;
    }

    //private time(currentTime: number): boolean {
    //    let endTime = 10000;
    //    if (currentTime > endTime) {
    //        return false;
    //    }
    //    let cameraZStart = 250;
    //    let cameraEnd = 0;
    //    let cameraPos = ThreeTest.polate(cameraZStart, cameraEnd, currentTime / endTime);
    //    this.camera.position.z = cameraPos;
    //    for (let light of this.lights) {
    //        light.position.z = cameraPos;
    //    }

    //    return true;
    //}

    private static polate(start: number, stop: number, normalizedPos: number): number{
        return (start * (1-normalizedPos)) + (stop * normalizedPos);
    }
    private static getTexture(url: string): Promise<THREE.Texture> {
        return new Promise<THREE.Texture>((resolve, reject) => {
            let loader = new THREE.TextureLoader();
            loader.load(url, resolve);
        });
    }
    private static getTextures(urls: string[]): Promise<THREE.Texture[]> {
        let promises = [];
        for (let url of urls) {
            promises.push(ThreeTest.getTexture(url));
        }
        return Promise.all(promises);
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