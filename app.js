var NUM_OF_PARTICLES = 1;

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

let impulses = [0, 0, 0, 0, 0, 0];
let pressures = [0, 0, 0, 0, 0, 0];

function Particle() {
    this.mass = 0.1;
    this.velocity = new THREE.Vector3(10 * Math.random(), 10 * Math.random(), 10 * Math.random());

    this.mesh = new THREE.Mesh(particleGeometry, particleMaterial);
    this.mesh.position.set(10 * Math.random(), 10 * Math.random(), 30 + 10 * Math.random());

    scene.add(this.mesh);

    this.impulse = function(v) {
        return Math.abs(this.mass * v)
    }

    this.update = function() {
        this.mesh.position.add(this.velocity);
        if (this.mesh.position.x > 25) {
            this.velocity.x *= -1;
            impulses[0] += this.impulse(this.velocity.x);
        }

        if (this.mesh.position.x < -15) {
            this.velocity.x *= -1;
            impulses[1] += this.impulse(this.velocity.x);
        }

        if (this.mesh.position.y > 25) {
            this.velocity.y *= -1;
            impulses[2] += this.impulse(this.velocity.y);
        }

        if (this.mesh.position.y < -10) {
            this.velocity.y *= -1;
            impulses[3] += this.impulse(this.velocity.y);
        }

        if (this.mesh.position.z > 50) {
            this.velocity.z *= -1;
            impulses[4] += this.impulse(this.velocity.z);
        }

        if (this.mesh.position.z < -10) {
            this.velocity.z *= -1;
            impulses[5] += this.impulse(this.velocity.z);
        }
    }
}

function createBoxes() {
    var floor = new THREE.BoxGeometry(50, 10, 50);
    var rlWall = new THREE.BoxGeometry(10, 50, 50);
    var udWall = new THREE.BoxGeometry(50, 50, 10);

    var singleGeometry = new THREE.Geometry();

    var floorMesh = new THREE.Mesh(floor);
    var rlMesh = new THREE.Mesh(rlWall);
    var lMesh = new THREE.Mesh(rlWall);

    var uMesh = new THREE.Mesh(udWall);
    var dMesh = new THREE.Mesh(udWall);

    var topMesh = new THREE.Mesh(floor);

    floorMesh.position.set(0, 0, 0);
    rlMesh.position.set(30, 20, 0);
    lMesh.position.set(-30, 20, 0);
    uMesh.position.set(0, 20, -20);
    dMesh.position.set(0, 20, 20);
    topMesh.position.set(0, 40, 0);

    floorMesh.updateMatrix(); // as needed
    singleGeometry.merge(floorMesh.geometry, floorMesh.matrix);

    rlMesh.updateMatrix(); // as needed
    singleGeometry.merge(rlMesh.geometry, rlMesh.matrix);

    lMesh.updateMatrix();
    singleGeometry.merge(lMesh.geometry, lMesh.matrix);

    uMesh.updateMatrix();
    singleGeometry.merge(uMesh.geometry, uMesh.matrix);

    dMesh.updateMatrix();
    singleGeometry.merge(dMesh.geometry, dMesh.matrix);

    topMesh.updateMatrix();
    singleGeometry.merge(topMesh.geometry, topMesh.matrix);

    var material = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        transparent: true
    });
    material.opacity = 0.5;
    var mesh = new THREE.Mesh(singleGeometry, material);
    scene.add(mesh);

    mesh.position.set(0, -15, 15);
    mesh.scale.set(1.0, 1.1, 1.7);
}

function createLight() {
    // a light
    var light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    light.position.set(0.75, 100, 0.25);
    scene.add(light);
}

function initInput() {
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth * 0.7 / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth * 0.7, window.innerHeight);
    }, false);

    const rangeInput = document.getElementById('rangeOfParticles');
    const labelNumOfParticles = document.getElementById('numOfParticles');
    rangeInput.value = NUM_OF_PARTICLES;
    labelNumOfParticles.innerHTML = rangeInput.value;

    rangeInput.onchange = function() {
        if (NUM_OF_PARTICLES < rangeInput.value) {
            for (let i = 0; i < rangeInput.value - NUM_OF_PARTICLES; i++) {
                let particle = new Particle();
                particles.push(particle);
            }
        } else {
            for (let i = 0; i < NUM_OF_PARTICLES - rangeInput.value; i++) {
                let particle = particles.pop();
                scene.remove(particle.mesh);
            }
        }
        NUM_OF_PARTICLES = rangeInput.value;
        labelNumOfParticles.innerHTML = NUM_OF_PARTICLES;
    }
}

function createParticles() {
    for (let i = 0; i < NUM_OF_PARTICLES; i++) {
        let particle = new Particle();
        particles.push(particle);
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
        document.getElementById("elem1").value = pressures[0];
        document.getElementById("elem2").value = pressures[1];
        document.getElementById("elem3").value = pressures[2];
        document.getElementById("elem4").value = pressures[3];
        document.getElementById("elem5").value = pressures[4];
        document.getElementById("elem6").value = pressures[5];
    } ,50);
}

createBoxes();
createLight();
createParticles();
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
    renderer.render(scene, camera);
})