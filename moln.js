const cloudCanvas = document.getElementById('cloud-canvas');
const ctx = cloudCanvas.getContext('2d');
function resizeCloudCanvas() {
    cloudCanvas.width = window.innerWidth;
    cloudCanvas.height = Math.ceil(window.innerHeight * 0.3);
    // Gör en transparent till vit gradient i canvasens nederkant för att mjuka upp övergången
    const fade = ctx.createLinearGradient(0, cloudCanvas.height - 150, 0, cloudCanvas.height);
    fade.addColorStop(0, 'rgba(255,255,255,0)');
    fade.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
    ctx.fillStyle = fade;
    ctx.fillRect(0, cloudCanvas.height - 150, cloudCanvas.width, 60);
}
resizeCloudCanvas();
window.addEventListener('resize', resizeCloudCanvas);

// Enkel molnklass med Bezierkurvor för "cartoon"-moln
class Cloud {
    constructor() {
        this.width = 44 + Math.random() * 38;
        this.height = 40 + Math.random() * 30;
        this.x = cloudCanvas.width + Math.random() * cloudCanvas.width;
        // Håll moln borta från botten
        const margin = 40 + this.height * 2.2;
        const maxY = Math.max(10, cloudCanvas.height - margin);
        this.y = 10 + Math.random() * (maxY - 10);
        this.speed = 0.04 + Math.random() * 0.06;
        this.opacity = 0.97 + Math.random() * 0.02;
    }
    update() {
        this.x -= this.speed;
        if (this.x < -this.width * 2) {
            this.x = cloudCanvas.width + this.width * 2;
            const margin = 40 + this.height * 4.4;
            const maxY = Math.max(10, cloudCanvas.height - margin);
            this.y = 30 + Math.random() * (maxY -50);
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        // Mjuk ellips med radial gradient
        const grad = ctx.createRadialGradient(
            this.x, this.y, this.width * 0.7,
            this.x, this.y, this.width
        );
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.7, 'rgba(255,255,255,0.7)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(120,170,255,0.13)';
        ctx.shadowBlur = 32;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}

const clouds = Array.from({length: 32}, () => new Cloud());

function animateClouds() {
    ctx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
    for (const c of clouds) {
        c.update();
        c.draw(ctx);
    }
    // Mjuk fade i nederkant
    const fade = ctx.createLinearGradient(0, cloudCanvas.height - 50, 0, cloudCanvas.height);
    fade.addColorStop(0, 'rgba(255,255,255,0)');
    fade.addColorStop(0.5, 'rgba(255,255,255,0.15)');
    fade.addColorStop(0.8, 'rgba(255,255,255,0.5)');
    fade.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, cloudCanvas.height - 120, cloudCanvas.width, 120);
    requestAnimationFrame(animateClouds);
}
animateClouds();
