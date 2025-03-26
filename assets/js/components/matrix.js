// assets/js/components/matrix.js
export default class MatrixAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.fontSize = 10;
        this.lastRender = 0;
        this.FRAME_THRESHOLD = 1000 / 30; // Cap at 30 FPS
        this.dropSpeed = 0.5; // Default speed
        this.initialize();
    }

    initialize() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.initializeDrops();
        
        // Watch for theme changes
        this.watchThemeChanges();
    }
    
    watchThemeChanges() {
        // Update colors when theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    this.updateDropColors();
                }
            });
        });
        
        observer.observe(document.body, { attributes: true });
    }
    
    updateDropColors() {
        // Update all drop colors to match the current theme
        for (let x = 0; x < this.columns; x++) {
            this.dropColors[x] = this.getMatrixColor();
        }
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
        
        // Initialize colors for each column
        this.dropColors = [];
        for (let x = 0; x < this.columns; x++) {
            this.dropColors[x] = this.getMatrixColor();
        }
    }
    
    getMatrixColor() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            // Green shades for dark mode
            const r = 0;
            const g = Math.floor(Math.random() * 150) + 100; // 100-250
            const b = Math.floor(Math.random() * 100); // 0-100
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            // Pure black for light mode
            return 'rgb(0, 0, 0)';
        }
    }

    drawMatrix(backgroundColor) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate how mouse position affects drops
        for (let i = 0; i < this.drops.length; i++) {
            const x = i * this.fontSize;
            
            // Standard drop speed
            this.drops[i] += this.dropSpeed;
            
            // Draw character with probability check to reduce density
            if (Math.random() > 0.7) {
                // Use the column's assigned color
                this.ctx.fillStyle = this.dropColors[i];
                
                // Change character
                const text = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
                
                // Draw text
                this.ctx.font = this.fontSize + 'px monospace';
                this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            }

            // Reset drop when it reaches bottom
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.95) {
                this.drops[i] = 0;
                // Occasionally change the color to match current theme
                if (Math.random() > 0.9) {
                    this.dropColors[i] = this.getMatrixColor();
                }
            }
        }
    }

    animate(timestamp) {
        if (!this.lastRender || timestamp - this.lastRender >= this.FRAME_THRESHOLD) {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const backgroundColor = isDarkMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
            
            this.drawMatrix(backgroundColor);
            this.lastRender = timestamp;
        }
        requestAnimationFrame(this.animate.bind(this));
    }

    start() {
        requestAnimationFrame(this.animate.bind(this));
    }
}