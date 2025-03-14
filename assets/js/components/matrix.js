// assets/js/components/matrix.js
export default class MatrixAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.fontSize = 10;
        this.lastRender = 0;
        this.FRAME_THRESHOLD = 1000 / 30; // Cap at 30 FPS
        this.initialize();
    }

    initialize() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.initializeDrops();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / this.fontSize;
        this.initializeDrops();
    }

    initializeDrops() {
        this.drops = [];
        for (let x = 0; x < this.columns; x++) {
            this.drops[x] = 1;
        }
    }

    drawMatrix(textColor, backgroundColor) {
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = textColor;
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            // Add a slight probability check to reduce density
            if (Math.random() > 0.7) {
                const text = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
                this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            }

            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.95) {
                this.drops[i] = 0;
            }
            this.drops[i] += 0.5;
        }
    }

    animate(timestamp) {
        if (!this.lastRender || timestamp - this.lastRender >= this.FRAME_THRESHOLD) {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const textColor = isDarkMode ? '#00FF41' : '#000000';
            const backgroundColor = isDarkMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
            
            this.drawMatrix(textColor, backgroundColor);
            this.lastRender = timestamp;
        }
        requestAnimationFrame(this.animate.bind(this));
    }

    start() {
        requestAnimationFrame(this.animate.bind(this));
    }
}
