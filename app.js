// init renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// init scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 3000);
camera.position.z = 20;
//var controls = new THREE.OrbitControls(camera)

function createBoxes() {
    var floor = new THREE.BoxGeometry(5, 1, 5);
    var rlWall = new THREE.BoxGeometry(1, 5, 5);

    var singleGeometry = new THREE.Geometry();

    var floorMesh = new THREE.Mesh(floor);
    var rlMesh = new THREE.Mesh(rlWall);
    var lMesh = new THREE.Mesh(rlWall);

    floorMesh.position.set(0,0,0);
    rlMesh.position.set(3,2,0);
    lMesh.position.set(-3,2,0);

    floorMesh.updateMatrix(); // as needed
    singleGeometry.merge(floorMesh.geometry, floorMesh.matrix);

    rlMesh.updateMatrix(); // as needed
    singleGeometry.merge(rlMesh.geometry, rlMesh.matrix);

    lMesh.updateMatrix();
    singleGeometry.merge(lMesh.geometry, lMesh.matrix);

    var material = new THREE.MeshPhongMaterial({
        color: 0xFF0000
    });
    var mesh = new THREE.Mesh(singleGeometry, material);
    scene.add(mesh);
}

function createLight() {
    // a light
    var light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    light.position.set(0.75, 10, 0.25);
    scene.add(light);
}

createBoxes();
createLight();

let theta = 0;
// render
requestAnimationFrame(function animate() {
    requestAnimationFrame(animate);
    theta += 0.001;
    camera.position.set(10 * Math.sin(theta), 10 * Math.cos(theta), 20);
    renderer.render(scene, camera);
})