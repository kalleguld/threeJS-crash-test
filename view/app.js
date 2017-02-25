var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ThreeTest = (function () {
    function ThreeTest(elem) {
        this.run = true;
        this.numTests = 0;
        this.renderer = null;
        this.lights = [];
        this.content = elem;
    }
    ThreeTest.prototype.start = function () {
        if (!this.run) {
            this.run = true;
            this.loop();
        }
    };
    ThreeTest.prototype.stop = function () {
        this.run = false;
        console.debug("Stopped");
    };
    ThreeTest.prototype.loop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, light, texture, otherBoxes, ground;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.numTests++;
                        this.lights = [];
                        if (this.renderer == null)
                            this.renderer = ThreeTest.createRenderer(this.content);
                        this.scene = ThreeTest.createScene();
                        this.lights = ThreeTest.getLights();
                        for (_i = 0, _a = this.lights; _i < _a.length; _i++) {
                            light = _a[_i];
                            this.scene.add(light);
                        }
                        return [4 /*yield*/, ThreeTest.getTexture("img/212.jpg")];
                    case 1:
                        texture = _b.sent();
                        this.scene.add(ThreeTest.getBoxes(texture, 50));
                        otherBoxes = ThreeTest.getBoxes(texture, 50);
                        otherBoxes.rotateZ(Math.PI);
                        this.scene.add(otherBoxes);
                        return [4 /*yield*/, ThreeTest.getGround()];
                    case 2:
                        ground = _b.sent();
                        this.scene.add(ground);
                        this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
                        this.camera.position.set(0, 0, 25);
                        this.animate(300);
                        return [2 /*return*/];
                }
            });
        });
    };
    ThreeTest.createRenderer = function (parent) {
        var result = new THREE.WebGLRenderer({
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
    };
    ThreeTest.createScene = function () {
        return new THREE.Scene();
    };
    ThreeTest.getLights = function () {
        var result = [];
        var lightA = new THREE.SpotLight(0xff22ff, 2, 25);
        lightA.position.set(2, 2, 0);
        result.push(lightA);
        var lightB = new THREE.SpotLight(0x22ffff, 2, 25);
        lightB.position.set(-2, -2, 0);
        result.push(lightB);
        var lightC = new THREE.SpotLight(0xffff22, 2, 25);
        lightC.position.set(0, 0, 2);
        result.push(lightC);
        return result;
    };
    ThreeTest.getBoxes = function (texture, numBoxes) {
        var result = new THREE.Group();
        for (var i = 0; i < numBoxes; i++) {
            result.add(ThreeTest.getBox(i, texture));
        }
        return result;
    };
    ThreeTest.getBox = function (boxNum, texture) {
        var geo = new THREE.BoxGeometry(1, 1, 1);
        var tex = texture.clone();
        tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
        tex.repeat.set(boxNum / 10 + 1, boxNum / 10 + 1);
        tex.needsUpdate = true;
        var mat = new THREE.MeshPhongMaterial({
            map: tex,
        });
        var cube = new THREE.Mesh(geo, mat);
        cube.castShadow = cube.receiveShadow = true;
        cube.position.set(Math.sin(boxNum / 3) * 5, Math.cos(boxNum / 3) * 5, boxNum);
        return cube;
    };
    ThreeTest.getGround = function () {
        return __awaiter(this, void 0, void 0, function () {
            var geo, tex, mat, mesh;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        geo = new THREE.PlaneGeometry(5, 50, 5, 50);
                        return [4 /*yield*/, ThreeTest.getTexture("img/212.jpg")];
                    case 1:
                        tex = _a.sent();
                        mat = new THREE.MeshPhongMaterial({
                            map: tex,
                        });
                        mesh = new THREE.Mesh(geo, mat);
                        mesh.receiveShadow = true;
                        mesh.position.set(0, -6, 25);
                        mesh.rotateX(Math.PI / -2);
                        return [2 /*return*/, mesh];
                }
            });
        });
    };
    ThreeTest.prototype.animate = function (n) {
        var _this = this;
        if (!this.run)
            return;
        if (n < 0) {
            this.loop();
            return;
        }
        var step = 0.2;
        var zStep = 0.3 * step;
        //this.camera.position.z += zStep;
        for (var _i = 0, _a = this.lights; _i < _a.length; _i++) {
            var light = _a[_i];
            light.position.z += zStep;
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(function (c) { return _this.animate(n - step); });
    };
    ThreeTest.getTexture = function (url) {
        return new Promise(function (resolve, reject) {
            var loader = new THREE.TextureLoader();
            loader.load(url, resolve);
        });
    };
    return ThreeTest;
}());
window.onload = function () {
    var el = document.getElementById('content');
    var threeTest = new ThreeTest(el);
    threeTest.loop();
    window["threeTest"] = threeTest;
};
//# sourceMappingURL=app.js.map