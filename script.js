const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

let w, h;

function resize() {
    // usa el tamaño real de la ventana visible (mejor que window.innerWidth en móvil)
    w = canvas.width = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    h = canvas.height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
}

resize();
window.addEventListener("resize", resize);
window.addEventListener("orientationchange", () => setTimeout(resize, 200));
if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resize);
}


// ==========================
// ESTRELLAS DE FONDO (capa lejana, fija)
// ==========================

const stars = [];

for (let i = 0; i < 1500; i++) {
    stars.push({
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 4000 - 2000,
        z: Math.random() * 2 + 0.2,
        size: Math.random() * 1.3 + 0.2,
        alpha: Math.random()
    });
}


// ==========================
// ESTRELLAS VOLADORAS (capa cercana, con perspectiva real 3D)
// ==========================

const FOCAL = 300;      // "distancia focal" de la cámara
const FLY_SPEED = 1.6;  // qué tan rápido se acercan
const flyStars = [];
const FLY_COUNT = 500;

function initFlyStar(s) {
    s.x = (Math.random() - 0.5) * w * 2;
    s.y = (Math.random() - 0.5) * h * 2;
    s.z = Math.random() * w + 200;
    return s;
}

for (let i = 0; i < FLY_COUNT; i++) {
    flyStars.push(initFlyStar({}));
}

function drawFlyStars() {
    flyStars.forEach(s => {
        const prevK = FOCAL / s.z;
        const prevX = s.x * prevK + w / 2;
        const prevY = s.y * prevK + h / 2;

        s.z -= FLY_SPEED;

        if (s.z <= 1) {
            initFlyStar(s);
            return;
        }

        const k = FOCAL / s.z;
        const px = s.x * k + w / 2;
        const py = s.y * k + h / 2;

        if (px < 0 || px > w || py < 0 || py > h) {
            initFlyStar(s);
            return;
        }

        const depthRatio = 1 - s.z / (w + 200);
        const size = Math.max(0.3, depthRatio * 2.5);
        const alpha = Math.min(1, depthRatio * 1.3);

        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.5})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
    });
}


// ==========================
// GALAXIAS ESPIRALES (más densas y realistas)
// ==========================

class Galaxy {

    constructor(xRatio, yRatio, size, color, armCount = 3) {

        this.xRatio = xRatio; // posición relativa (0 a 1) para que se adapte a cualquier pantalla
        this.yRatio = yRatio;
        this.x = w * xRatio;
        this.y = h * yRatio;
        this.size = size;
        this.color = color;
        this.armCount = armCount;

        this.rotation = Math.random() * Math.PI * 2;
        this.speed = (Math.random() * 0.0006) + 0.0003;
        this.tilt = 0.45;

        this.particles = [];

        const count = Math.floor(size * 18);

        for (let i = 0; i < count; i++) {

            const radius = Math.pow(Math.random(), 1.7) * size;

            const arm = Math.floor(Math.random() * this.armCount);
            const armOffset = (Math.PI * 2 / this.armCount) * arm;

            const angle = armOffset + Math.log(radius + 1) * 2.4 + (Math.random() - 0.5) * 0.6;

            const scatter = (Math.random() - 0.5) * (size * 0.05 + radius * 0.06);

            this.particles.push({
                angle,
                radius,
                offset: scatter,
                size: Math.random() * 1.1 + 0.15,
                brightness: Math.random()
            });
        }
    }

    updatePosition() {
        // recalcula posición si cambia el tamaño de pantalla
        this.x = w * this.xRatio;
        this.y = h * this.yRatio;
    }

    draw() {

        this.rotation += this.speed;

        const core = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 0.35
        );
        core.addColorStop(0, "rgba(255,248,225,0.55)");
        core.addColorStop(1, "transparent");
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.35, 0, Math.PI * 2);
        ctx.fill();

        this.particles.forEach(p => {

            const spiral = p.angle + this.rotation;
            const r = p.radius + p.offset;

            const px = this.x + Math.cos(spiral) * r;
            const py = this.y + Math.sin(spiral) * r * this.tilt;

            const distRatio = p.radius / this.size;
            const alpha = Math.max(0.04, (1 - distRatio) * 0.85 * p.brightness);

            let fill;
            if (distRatio < 0.18) {
                fill = `rgba(255,244,214,${alpha})`;
            } else {
                fill = this.color.replace(/[\d.]+\)\s*$/, `${alpha})`);
            }

            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}


// posiciones en proporción (0 a 1) de la pantalla, así se adaptan a cualquier tamaño
const galaxies = [

    new Galaxy(0.5, 0.35, 220, "rgba(210,130,255,1)", 4),   // centro-arriba
    new Galaxy(0.2, 0.18, 100, "rgba(80,170,255,1)", 3),    // arriba izquierda
    new Galaxy(0.75, 0.55, 130, "rgba(255,120,220,1)", 3)   // media pantalla derecha

];



// ==========================
// ESTRELLAS FUGACES
// ==========================

let shootingStars = [];

function createShootingStar() {
    shootingStars.push({
        x: -200,
        y: Math.random() * h,
        speed: Math.random() * 10 + 8,
        length: Math.random() * 80 + 50,
        size: Math.random() * 3 + 2
    });
}

setInterval(() => {
    createShootingStar();
}, 1500);



// ==========================
// ANIMACION
// ==========================

let time = 0;

function animate() {

    requestAnimationFrame(animate);

    time += 0.01;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    // nebulosa
    const nebula = ctx.createRadialGradient(
        w / 2, h / 2, 50,
        w / 2, h / 2, Math.max(w, h) * 0.6
    );
    nebula.addColorStop(0, "rgba(120,50,220,.25)");
    nebula.addColorStop(0.5, "rgba(40,100,255,.12)");
    nebula.addColorStop(1, "transparent");
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, w, h);

    // estrellas lejanas (fondo)
    stars.forEach(s => {
        const twinkle = (Math.sin(time + s.alpha) + 1) / 2;
        ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
        ctx.beginPath();
        ctx.arc(
            (w / 2) + (s.x * s.z),
            (h / 2) + (s.y * s.z),
            s.size,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    // galaxias
    galaxies.forEach(g => {
        g.updatePosition();
        g.draw();
    });

    // estrellas acercándose (perspectiva)
    drawFlyStars();

    // estrellas fugaces
    shootingStars.forEach((s, index) => {

        const gradient = ctx.createLinearGradient(
            s.x, s.y,
            s.x - s.length, s.y - s.length * .3
        );
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(1, "transparent");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.size;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length, s.y - s.length * .3);
        ctx.stroke();

        s.x += s.speed;
        s.y += s.speed * .25;

        if (s.x > w + 300) {
            shootingStars.splice(index, 1);
        }
    });
}

animate();



// ==========================
// INICIO + MUSICA
// ==========================

document.getElementById("start").onclick = function () {
    this.style.display = "none";
    document.getElementById("music").play();
    document.getElementById("message").style.opacity = 1;
};
