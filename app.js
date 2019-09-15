var NUM_OF_PARTICLES = 1;
let g = -0.001;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth * 0.7, window.innerHeight);
document.body.appendChild(renderer.domElement);

// init scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth * 0.7 / window.innerHeight, 0.01, 3000);

const particleGeometry = new THREE.SphereGeometry(1, 1, 1);
const particleMaterial = new THREE.MeshBasicMaterial();

camera.position.z = 200;

let particles = [];

let labels = [];

let colliders = [];

function initLabels() {
    for (let i = 1; i < 8; i++) {
        labels.push(document.getElementById("elem" + i));
    }
}

let impulses = [0, 0, 0, 0, 0, 0];
let pressures = [0, 0, 0, 0, 0, 0];

let topMesh;

function TopMesh() {

    this.mass = 200;

    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, g, 0);

    this.floor = new THREE.BoxGeometry(50, 10, 50);

    this.material = new THREE.MeshPhongMaterial({
        color: 0x00FF00,
        transparent: true
    });
    this.material.opacity = 0.7;

    this.flag = false;

    this.mesh = new THREE.Mesh(this.floor, this.material);
    this.mesh.position.set(0, 45, 0);

    this.collisionBox = new THREE.Box3().setFromObject(this.mesh);
    colliders.push(this.collisionBox);

    this.update = function () {
        this.velocity.add(this.acceleration);
        this.mesh.position.add(this.velocity);
        this.collisionBox.setFromObject(this.mesh);

        for (let i = 0; i < 5; i++) {
            if (colliders[i].intersectsBox(this.collisionBox)) {
                if (!this.flag) {
                    this.flag = true;
                    this.velocity.set(0, 0, 0);
                }
                this.acceleration.set(0, pressures[2] * 25 / this.mass, 0);
            } else {
                this.acceleration.set(0, pressures[2] * 25 / this.mass + g, 0);
                this.flag = false;
            }
        }
    }

    //this.mesh.position.set(0, -15, 15);
    this.mesh.scale.set(0.9, 0.7, 1.0);

    scene.add(this.mesh);
}

function Particle() {
    this.mass = 0.1;
    this.velocity = new THREE.Vector3(10 * Math.random(), 10 * Math.random(), 10 * Math.random());

    this.mesh = new THREE.Mesh(particleGeometry, particleMaterial);
    this.collisionBox = new THREE.Box3().setFromObject(this.mesh);
    this.mesh.position.set(10 * Math.random(), 10 * Math.random(), 10 * Math.random());

    scene.add(this.mesh);

    this.impulse = function (v) {
        return Math.abs(this.mass * v)
    }

    this.update = function () {
        this.mesh.position.add(this.velocity);
        this.collisionBox.setFromObject(this.mesh);
        for (let i = 0; i < 6; i++) {
            if (this.collisionBox.intersectsBox(colliders[i])) {
                if (i == 0 || i == 5) {
                    this.velocity.y *= -1;
                    impulses[i] += 2 * this.impulse(this.velocity.y);
                }
                if (i == 1 || i == 2) {
                    this.velocity.x *= -1;
                    impulses[i] += 2 * this.impulse(this.velocity.x);
                }
                if (i == 3 || i == 4) {
                    this.velocity.z *= -1;
                    impulses[i] += 2 * this.impulse(this.velocity.z);
                }
            }
        }
    }
}

function createBoxes() {
    var floor = new THREE.BoxGeometry(50, 10, 50);
    var rlWall = new THREE.BoxGeometry(10, 50, 50);
    var udWall = new THREE.BoxGeometry(50, 50, 10);

    var material = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        transparent: true
    });
    material.opacity = 0.5;

    var floorMesh = new THREE.Mesh(floor, material);
    var rlMesh = new THREE.Mesh(rlWall, material);
    var lMesh = new THREE.Mesh(rlWall, material);

    var uMesh = new THREE.Mesh(udWall, material);
    var dMesh = new THREE.Mesh(udWall, material);

    floorMesh.position.set(0, -15, -15);
    rlMesh.position.set(30, 5, -15);
    lMesh.position.set(-30, 5, -15);
    uMesh.position.set(0, 5, -35);
    dMesh.position.set(0, 5, 10);

    floorMesh.updateMatrix();

    rlMesh.updateMatrix();
    lMesh.updateMatrix();
    uMesh.updateMatrix();
    dMesh.updateMatrix();

    scene.add(rlMesh);
    scene.add(lMesh);
    scene.add(uMesh);
    scene.add(dMesh);
    scene.add(floorMesh);

    colliders.push(new THREE.Box3().setFromObject(floorMesh));
    colliders.push(new THREE.Box3().setFromObject(rlMesh));
    colliders.push(new THREE.Box3().setFromObject(lMesh));
    colliders.push(new THREE.Box3().setFromObject(uMesh));
    colliders.push(new THREE.Box3().setFromObject(dMesh));

    topMesh = new TopMesh();
}

function createLight() {
    // a light
    var light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    light.position.set(0.75, 100, 0.25);
    scene.add(light);
}

function removeAllParticles() {
    while (particles.length > 0) {
        let particle = particles.pop();
        scene.remove(particle.mesh);
    }
}

function createParticles() {
    for (let i = 0; i < NUM_OF_PARTICLES; i++) {
        let particle = new Particle();
        particles.push(particle);
    }
}


function initInput() {
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth * 0.7 / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth * 0.7, window.innerHeight);
    }, false);

    const rangeInput = document.getElementById('rangeOfMass');
    const labelNumOfParticles = document.getElementById('numOfParticles');
    const buttonSubmit = document.getElementById('submitNumOfParticles');
    const particlesInput = document.getElementById('inputOfParticles')
    rangeInput.value = topMesh.mass;
    labelNumOfParticles.innerHTML = NUM_OF_PARTICLES;

    rangeInput.onchange = function () {
        topMesh.mass = rangeInput.value;
    }

    buttonSubmit.onclick = function () {
        removeAllParticles();
        NUM_OF_PARTICLES = particlesInput.value;
        createParticles();
    }

    const rangeOfAc = document.getElementById("rangeOfAc");
    rangeOfAc.onchange = function () {
        g = this.value / 1000 * (-1);
    }
}

function initImpulses() {
    const timerId = setInterval(() => {
        for (let i = 0; i < 6; i++) {
            pressures[i] = impulses[i] / 50 / 25;
            impulses[i] = 0;
        }
    }, 50);

    const timerVisId = setInterval(() => {
        for (let i = 0; i < 7; i++) {
            labels[i].value = pressures[i];
        }
        labels[6].value = pressures.reduce((a, b) => (a + b)) / pressures.length;
    }, 50);
}

createBoxes();
createLight();
createParticles();
initLabels();
initInput();
initImpulses();

requestAnimationFrame(function animate() {
    requestAnimationFrame(animate);
    //theta += 0.01;
    //camera.position.set(10 * Math.sin(theta), 10 * Math.cos(theta), 25);
    for (var i = particles.length - 1; i >= 0; i--) {
        if (particles[i])
            particles[i].update();
    }
    topMesh.update();
    renderer.render(scene, camera);
})