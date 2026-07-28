const canvas=document.getElementById("space");
const ctx=canvas.getContext("2d");

let w,h;

function resize(){

w=canvas.width=window.innerWidth;
h=canvas.height=window.innerHeight;

}

resize();

window.addEventListener("resize",resize);


// ----------------------------
// ESTRELLAS
// ----------------------------

let stars=[];


for(let i=0;i<1800;i++){

stars.push({

x:Math.random()*w,
y:Math.random()*h,

size:Math.random()*2,

alpha:Math.random(),

speed:Math.random()*0.02

});

}



// ----------------------------
// NEBULOSA
// ----------------------------

let nebula={
    x:w/2,
    y:h/2,
    r:300
};



// ----------------------------
// ESTRELLA FUGAZ
// ----------------------------

let shooting=null;



function createShooting(){

shooting={

x:-200,

y:Math.random()*h/2,

speed:12,

trail:[]

};

}



function draw(){


ctx.clearRect(0,0,w,h);


// fondo

let gradient=ctx.createRadialGradient(
w/2,
h/2,
0,
w/2,
h/2,
w
);


gradient.addColorStop(0,"#24104f");
gradient.addColorStop(.5,"#090018");
gradient.addColorStop(1,"black");


ctx.fillStyle=gradient;

ctx.fillRect(0,0,w,h);



// nebulosa

let neb=ctx.createRadialGradient(
w/2,
h/2,
20,
w/2,
h/2,
400
);


neb.addColorStop(0,"rgba(255,100,220,.25)");
neb.addColorStop(.5,"rgba(80,120,255,.12)");
neb.addColorStop(1,"transparent");


ctx.fillStyle=neb;

ctx.fillRect(0,0,w,h);




// estrellas

stars.forEach(s=>{


s.alpha+=s.speed;


let glow=(Math.sin(s.alpha)+1)/2;


ctx.fillStyle=
`rgba(255,255,255,${glow})`;


ctx.beginPath();

ctx.arc(
s.x,
s.y,
s.size,
0,
Math.PI*2
);

ctx.fill();



});



// estrella fugaz

if(shooting){


shooting.trail.push({
x:shooting.x,
y:shooting.y
});


if(shooting.trail.length>30)
shooting.trail.shift();



for(let i=0;i<shooting.trail.length;i++){

let p=shooting.trail[i];


ctx.fillStyle=
`rgba(255,255,255,${i/40})`;


ctx.beginPath();

ctx.arc(
p.x,
p.y,
3,
0,
Math.PI*2
);

ctx.fill();

}


ctx.fillStyle="white";

ctx.beginPath();

ctx.arc(
shooting.x,
shooting.y,
5,
0,
Math.PI*2
);

ctx.fill();



shooting.x+=shooting.speed;
shooting.y+=shooting.speed*.3;



if(shooting.x>w+200){

shooting=null;

}

}


requestAnimationFrame(draw);

}


draw();



// ----------------------------
// INICIO
// ----------------------------


let started=false;


document.getElementById("start").onclick=function(){


started=true;


this.style.display="none";


document.getElementById("music").play();



setInterval(()=>{

createShooting();

},4000);



setTimeout(()=>{

document.getElementById("message").style.opacity=1;


},8000);



};
