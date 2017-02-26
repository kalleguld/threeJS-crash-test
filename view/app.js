var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ThreeTest {
    constructor(elem) {
        this.run = true;
        this.numTests = 0;
        this.renderer = null;
        this.lights = [];
        this.content = elem;
    }
    start() {
        if (!this.run) {
            this.run = true;
            this.loop();
        }
    }
    stop() {
        this.run = false;
        console.debug("Stopped");
    }
    loop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.numTests++;
            this.lights = [];
            this.renderer = ThreeTest.createRenderer(this.content);
            this.scene = ThreeTest.createScene();
            this.lights = ThreeTest.getLights();
            for (let light of this.lights) {
                this.scene.add(light);
            }
            //this.scene.add(new THREE.AmbientLight(0xffffff, 2));
            this.texture = yield ThreeTest.getTexture("img/256.jpg");
            //this.scene.add(ThreeTest.getBoxSpiral(texture, 200));
            //let otherBoxes = ThreeTest.getBoxSpiral(texture, 200);
            //otherBoxes.rotateZ(Math.PI);
            //this.scene.add(otherBoxes);
            let ground = yield ThreeTest.getGround();
            this.scene.add(ground);
            this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
            this.camera.position.set(0, 2, 10);
            this.startAnimate();
        });
    }
    static createRenderer(parent) {
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
    static createScene() {
        return new THREE.Scene();
    }
    static getLights() {
        let result = [];
        let numLights = 45;
        for (let i = 0; i < numLights; i++) {
            let iPi = i / numLights * 2 * Math.PI;
            let color = new THREE.Vector3(0.5 + 0.5 * Math.sin(iPi), 0.5 + 0.5 * Math.cos(iPi), 1);
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
    static getBoxCircle(textures, numBoxes, radius) {
        let result = new THREE.Group();
        for (let i = 0; i < numBoxes; i++) {
            let geo = new THREE.BoxGeometry(1, 1, 1);
            let mat = new THREE.MeshPhongMaterial({
                map: textures[i % textures.length]
            });
            let cube = new THREE.Mesh(geo, mat);
            cube.castShadow = true;
            let iPi = i / numBoxes * Math.PI * 2;
            cube.position.set(radius * Math.sin(iPi), 0.5, radius * Math.cos(iPi));
            result.add(cube);
        }
        return result;
    }
    static getBoxSpiral(texture, numBoxes) {
        let result = new THREE.Group();
        for (let i = 0; i < numBoxes; i++) {
            result.add(ThreeTest.getSingleSpiralBox(i, texture));
        }
        return result;
    }
    static getSingleSpiralBox(boxNum, texture) {
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
    static getGround() {
        return __awaiter(this, void 0, void 0, function* () {
            let geo = new THREE.PlaneGeometry(50, 50);
            let tex = yield ThreeTest.getTexture("img/212.jpg");
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
        });
    }
    startAnimate() {
        let t = performance.now();
        this.animate(t, t);
    }
    animate(startTime, currentTIme) {
        if (this.time(currentTIme - startTime)) {
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(c => this.animate(startTime, c));
        }
        else
            this.loop();
    }
    time(currentTime) {
        let lifetime = 20000;
        if (currentTime > lifetime)
            return false;
        this.scene.remove(this.boxCircle);
        let boxCircle = ThreeTest.getBoxCircle([this.texture], ThreeTest.polate(5, 35, currentTime / lifetime), 5);
        this.boxCircle = boxCircle;
        this.scene.add(boxCircle);
        let i = 0;
        for (let box of this.boxCircle.children) {
            box.position.y = Math.abs(Math.sin(i / 4 + (currentTime / 200)));
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
    static polate(start, stop, normalizedPos) {
        return (start * (1 - normalizedPos)) + (stop * normalizedPos);
    }
    static getTexture(url) {
        return new Promise((resolve, reject) => {
            let loader = new THREE.TextureLoader();
            loader.load(url, resolve);
        });
    }
    static getHexColor(normalizedRgb) {
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
//# sourceMappingURL=app.js.map