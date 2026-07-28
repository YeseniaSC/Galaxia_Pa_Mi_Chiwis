const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);


// ==========================
// ESTRELLAS DE FONDO
// ==========================

const stars = [];

for (let i = 0; i < 2500; i++) {

    stars.push({
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 4000 - 2000,
        z: Math.random() * 2 + 0.2,
        size: Math.random() * 2,
        alpha: Math.random()
    });

}


// ==========================
// GALAXIAS ESPIRALES
// ==========================

class Galaxy {

    constructor(x,y,size,color){

        this.x=x;
        this.y=y;
        this.size=size;
        this.color=color;

        this.rotation=Math.random()*Math.PI*2;

        this.speed=(Math.random()*0.001)+0.0005;

        this.particles=[];


        for(let i=0;i<1800;i++){

            let radius=Math.random()*size;

            let angle=
            radius*0.04+
            Math.random()*0.8;


            this.particles.push({

                angle:angle,
                radius:radius,

                offset:(Math.random()-0.5)*40,

                size:Math.random()*2

            });

        }

    }


    draw(){

        this.rotation+=this.speed;


        this.particles.forEach(p=>{


            let spiral=
            p.angle+
            this.rotation+
            p.radius*0.002;


            let px =
            this.x+
            Math.cos(spiral)*
            (p.radius+p.offset);


            let py =
            this.y+
            Math.sin(spiral)*
            (p.radius+p.offset);


            let gradient =
            ctx.createRadialGradient(
                px,
                py,
                0,
                px,
                py,
                15
            );


            gradient.addColorStop(
                0,
                this.color
            );

            gradient.addColorStop(
                1,
                "transparent"
            );


            ctx.fillStyle=gradient;


            ctx.beginPath();

            ctx.arc(
                px,
                py,
                p.size,
                0,
                Math.PI*2
            );

            ctx.fill();


        });

    }

}


const galaxies=[

new Galaxy(
    window.innerWidth/2,
    window.innerHeight/2,
    260,
    "rgba(210,130,255,.8)"
),


new Galaxy(
    200,
    250,
    120,
    "rgba(80,170,255,.7)"
),


new Galaxy(
    w-250,
    h-200,
    150,
    "rgba(255,120,220,.7)"
)

];



// ==========================
// ESTRELLAS FUGACES
// ==========================

let shootingStars=[];


function createShootingStar(){


shootingStars.push({

x:-200,

y:Math.random()*h,

speed:
Math.random()*10+8,

length:
Math.random()*80+50,

size:
Math.random()*3+2

});


}



setInterval(()=>{

createShootingStar();

},1500);



// ==========================
// ANIMACION
// ==========================

let time=0;


function animate(){


requestAnimationFrame(animate);


time+=0.01;



ctx.fillStyle="black";

ctx.fillRect(
0,
0,
w,
h
);



// nebulosa

let nebula =
ctx.createRadialGradient(
w/2,
h/2,
50,
w/2,
h/2,
600
);


nebula.addColorStop(
0,
"rgba(120,50,220,.25)"
);

nebula.addColorStop(
0.5,
"rgba(40,100,255,.12)"
);

nebula.addColorStop(
1,
"transparent"
);


ctx.fillStyle=nebula;

ctx.fillRect(
0,
0,
w,
h
);



// estrellas

stars.forEach(s=>{


let twinkle =
(Math.sin(time+s.alpha)+1)/2;


ctx.fillStyle=
`rgba(255,255,255,${twinkle})`;


ctx.beginPath();

ctx.arc(
(w/2)+(s.x*s.z),
(h/2)+(s.y*s.z),
s.size,
0,
Math.PI*2
);

ctx.fill();


});



// galaxias

galaxies.forEach(g=>{

g.draw();

});



// estrellas fugaces

shootingStars.forEach((s,index)=>{


let gradient =
ctx.createLinearGradient(
s.x,
s.y,
s.x-s.length,
s.y-s.length*.3
);


gradient.addColorStop(
0,
"rgba(255,255,255,1)"
);

gradient.addColorStop(
1,
"transparent"
);


ctx.strokeStyle=gradient;

ctx.lineWidth=s.size;


ctx.beginPath();

ctx.moveTo(
s.x,
s.y
);


ctx.lineTo(
s.x-s.length,
s.y-s.length*.3
);


ctx.stroke();



s.x+=s.speed;

s.y+=s.speed*.25;



if(s.x>w+300){

shootingStars.splice(index,1);

}


});

}


animate();



// ==========================
// INICIO + MUSICA
// ==========================


document.getElementById("start").onclick=function(){


this.style.display="none";


document.getElementById("music").play();

setTimeout(()=>{
document.getElementById("message").style.opacity=1;
},3500);


};
