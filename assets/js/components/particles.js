// assets/js/components/particles.js
export default class ParticleEffect {
    constructor() {
        this.particles = [];
        this.colors = ['#00ff41', '#00d636', '#00bd2d', '#00a325', '#00891d'];
    }
    
    createParticles(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            // Create a particle element
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position variation
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            
            // Position the particle
            particle.style.left = (x + offsetX) + 'px';
            particle.style.top = (y + offsetY) + 'px';
            
            // Random size
            const size = Math.random() * 4 + 2; // 2-6px
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random color
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            particle.style.backgroundColor = color;
            
            // Random direction
            const tx = (Math.random() - 0.5) * 100; // -50px to 50px
            const ty = (Math.random() - 0.5) * 100;
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            // Random duration
            const duration = Math.random() * 0.5 + 1; // 1-1.5s
            particle.style.animationDuration = duration + 's';
            
            // Add to document
            document.body.appendChild(particle);
            
            // Store for cleanup
            this.particles.push(particle);
            
            // Remove after animation
            setTimeout(() => {
                particle.remove();
                const index = this.particles.indexOf(particle);
                if (index > -1) {
                    this.particles.splice(index, 1);
                }
            }, duration * 1000);
        }
    }
    
    // Create particles on section transitions
    animateSectionTransition(sectionElement) {
        const rect = sectionElement.getBoundingClientRect();
        
        // Create particles at the edges of the section
        // Top edge
        for (let x = rect.left; x < rect.right; x += 50) {
            this.createParticles(x, rect.top, 3);
        }
        
        // Right edge
        for (let y = rect.top; y < rect.bottom; y += 50) {
            this.createParticles(rect.right, y, 3);
        }
        
        // Bottom edge
        for (let x = rect.right; x > rect.left; x -= 50) {
            this.createParticles(x, rect.bottom, 3);
        }
        
        // Left edge
        for (let y = rect.bottom; y > rect.top; y -= 50) {
            this.createParticles(rect.left, y, 3);
        }
    }
    
    // Clean up all particles
    cleanupParticles() {
        this.particles.forEach(particle => {
            particle.remove();
        });
        this.particles = [];
    }
}