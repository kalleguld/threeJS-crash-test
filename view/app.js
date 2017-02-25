var ThreeTest = (function () {
    function ThreeTest(elem) {
        this.numTests = 1000;
        this.content = elem;
    }
    ThreeTest.createRenderer = function (parent) {
        var result = new THREE.WebGLRenderer({
            antialias: true,
        });
        result.setSize(parent.clientWidth, parent.clientHeight);
        parent.appendChild(result.domElement);
        return result;
    };
    ThreeTest.prototype.loop = function () {
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
    };
    ThreeTest.createScene = function () {
        return new THREE.Scene();
    };
    ThreeTest.addLights = function (scene) {
        scene.add(new THREE.AmbientLight(0x669966, 2));
    };
    ThreeTest.populate = function (scene) {
        for (var i = 0; i < 50; i++) {
            scene.add(ThreeTest.getBox(i));
        }
    };
    ThreeTest.getBox = function (boxNum) {
        var geo = new THREE.BoxGeometry(1, 1, 1);
        var mat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        var cube = new THREE.Mesh(geo, mat);
        cube.position.set(Math.sin(boxNum / 3) * 5, Math.cos(boxNum / 3) * 5, boxNum);
        return cube;
    };
    ThreeTest.prototype.animate = function (n) {
        var _this = this;
        if (n < 0) {
            this.loop();
            return;
        }
        this.camera.position.z += 0.3;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(function (c) { return _this.animate(n - 1); });
    };
    return ThreeTest;
}());
window.onload = function () {
    var el = document.getElementById('content');
    var threeTest = new ThreeTest(el);
    threeTest.loop();
};
//# sourceMappingURL=app.js.map