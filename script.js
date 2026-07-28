import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165/build/three.module.js';

const scene=new THREE.Scene();

const camera=new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.z=45;

const renderer=new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document.body.appendChild(renderer.domElement);

//////////////////////////////

// estrellas

const starsGeometry=new THREE.BufferGeometry();

const stars=[];

for(let i=0;i<9000;i++){

stars.push(

(Math.random()-0.5)*300,
(Math.random()-0.5)*300,
(Math.random()-0.5)*300

);

}

starsGeometry.setAttribute(
'position',
new THREE.Float32BufferAttribute(stars,3)
);

const starsMaterial=new THREE.PointsMaterial({

color:0xffffff,
size:0.4

});

const starField=new THREE.Points(
starsGeometry,
starsMaterial
);

scene.add(starField);

//////////////////////////////

// galaxia

const galaxyGeometry=new THREE.BufferGeometry();

const galaxy=[];

for(let i=0;i<25000;i++){

const radius=Math.random()*25;

const angle=radius*2;

galaxy.push(

Math.cos(angle)*radius+(Math.random()-0.5),

(Math.random()-0.5)*2,

Math.sin(angle)*radius+(Math.random()-0.5)

);

}

galaxyGeometry.setAttribute(

'position',

new THREE.Float32BufferAttribute(galaxy,3)

);

const galaxyMaterial=new THREE.PointsMaterial({

color:0xaa88ff,
size:0.15

});

const galaxy=new THREE.Points(
galaxyGeometry,
galaxyMaterial
);

scene.add(galaxy);

//////////////////////////////

// estrella fugaz

const shootingGeometry=new THREE.SphereGeometry(.25,16,16);

const shootingMaterial=new THREE.MeshBasicMaterial({

color:0xffffff

});

const shooting=new THREE.Mesh(
shootingGeometry,
shootingMaterial
);

scene.add(shooting);

shooting.position.set(-60,25,-5);

//////////////////////////////

let started=false;

document.getElementById("overlay").onclick=()=>{

started=true;

document.getElementById("overlay").style.display="none";

document.getElementById("music").play();

}

//////////////////////////////

let timer=0;

function animate(){

requestAnimationFrame(animate);

galaxy.rotation.y+=0.0008;

starField.rotation.y+=0.00015;

if(started){

timer++;

if(timer>250){

shooting.position.x+=.5;

shooting.position.y-=.18;

}

if(timer>520){

document.getElementById("mensaje").style.opacity=1;

}

}

renderer.render(scene,camera);

}

animate();

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

});