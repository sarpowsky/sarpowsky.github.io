// assets/js/components/matrix.js
export default class MatrixAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.fontSize = 10;
        this.lastRender = 0;
        this.FRAME_THRESHOLD = 1000 / 30; // Cap at 30 FPS
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseRadius = 100; // Radius of mouse influence
        this.mouseIntensity = 50; // How much mouse affects the animation
        this.mouseActive = false;
        this.dropSpeed = 0.5; // Default speed
        this.initialize();
    }

    initialize() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.initializeDrops();
        
        // Add mouse movement tracking
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseenter', () => this.mouseActive = true);
        this.canvas.addEventListener('mouseleave', () => this.mouseActive = false);
        
        // Add click effect
        this.canvas.addEventListener('click', (e) => this.createRipple(e));
        
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
        
        // Initialize ripples array
        this.ripples = [];
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
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    createRipple(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ripples.push({
            x,
            y,
            radius: 10,
            maxRadius: 200,
            opacity: 1,
            speed: 5
        });
    }
    
    updateRipples() {
        for (let i = 0; i < this.ripples.length; i++) {
            const ripple = this.ripples[i];
            ripple.radius += ripple.speed;
            ripple.opacity -= 0.01;
            
            if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
                this.ripples.splice(i, 1);
                i--;
            }
        }
    }

    drawMatrix(backgroundColor) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ripples
        this.drawRipples();
        
        // Update ripples
        this.updateRipples();

        // Calculate how mouse position affects drops
        for (let i = 0; i < this.drops.length; i++) {
            const x = i * this.fontSize;
            
            // Modify drop speed based on mouse proximity if mouse is active
            if (this.mouseActive) {
                const distance = Math.sqrt(
                    Math.pow(x - this.mouseX, 2) + 
                    Math.pow(this.drops[i] * this.fontSize - this.mouseY, 2)
                );
                
                if (distance < this.mouseRadius) {
                    // Accelerate drops near the mouse
                    const acceleration = 1 - (distance / this.mouseRadius);
                    this.drops[i] += this.dropSpeed + (acceleration * this.mouseIntensity * 0.01);
                } else {
                    this.drops[i] += this.dropSpeed;
                }
            } else {
                this.drops[i] += this.dropSpeed;
            }
            
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
    
    drawRipples() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const rippleColor = isDarkMode ? 'rgba(0, 255, 70, ' : 'rgba(0, 0, 0, ';
        
        for (let i = 0; i < this.ripples.length; i++) {
            const ripple = this.ripples[i];
            
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = rippleColor + ripple.opacity + ')';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
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