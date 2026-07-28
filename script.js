import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165/build/three.module.js';

// Escena
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 45;

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// ===============================
// ESTRELLAS
// ===============================

const starsGeometry = new THREE.BufferGeometry();

const starsVertices = [];

for (let i = 0; i < 9000; i++) {

    starsVertices.push(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
    );

}

starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starsVertices, 3)
);

const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.4
});

const starField = new THREE.Points(
    starsGeometry,
    starsMaterial
);

scene.add(starField);

// ===============================
// GALAXIA
// ===============================

const galaxyGeometry = new THREE.BufferGeometry();

const galaxyVertices = [];

for (let i = 0; i < 25000; i++) {

    const radius = Math.random() * 25;
    const angle = radius * 2;

    galaxyVertices.push(

        Math.cos(angle) * radius + (Math.random() - 0.5),
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius + (Math.random() - 0.5)

    );

}

galaxyGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(galaxyVertices, 3)
);

const galaxyMaterial = new THREE.PointsMaterial({
    color: 0xaa88ff,
    size: 0.15
});

const galaxy = new THREE.Points(
    galaxyGeometry,
    galaxyMaterial
);

scene.add(galaxy);

// ===============================
// ESTRELLA FUGAZ
// ===============================

const shootingGeometry = new THREE.SphereGeometry(0.25, 16, 16);

const shootingMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
});

const shootingStar = new THREE.Mesh(
    shootingGeometry,
    shootingMaterial
);

shootingStar.position.set(-60, 25, -5);

scene.add(shootingStar);

// ===============================
// INICIO
// ===============================

let started = false;
let timer = 0;

const overlay = document.getElementById("overlay");
const mensaje = document.getElementById("mensaje");
const music = document.getElementById("music");

overlay.addEventListener("click", () => {

    started = true;

    overlay.style.display = "none";

    music.play().catch(err => {
        console.log(err);
    });

});

// ===============================
// ANIMACIÓN
// ===============================

function animate() {

    requestAnimationFrame(animate);

    galaxy.rotation.y += 0.001;

    starField.rotation.y += 0.0002;

    if (started) {

        timer++;

        if (timer > 180) {

            shootingStar.position.x += 0.55;
            shootingStar.position.y -= 0.18;

        }

        if (timer > 480) {

            mensaje.style.opacity = 1;

        }

    }

    renderer.render(scene, camera);

}

animate();

// ===============================
// RESPONSIVE
// ===============================

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});
