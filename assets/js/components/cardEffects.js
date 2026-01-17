// assets/js/components/cardEffects.js
export default class CardEffects {
    constructor(selector) {
        this.cards = document.querySelectorAll(selector);
        this.initialize();
    }
    
    initialize() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Skip animation for users who prefer reduced motion
            return;
        }
        
        this.cards.forEach(card => {
            // Add tilt class to enable 3D effects
            card.classList.add('card-tilt');
            
            // Add event listeners
            card.addEventListener('mousemove', e => this.handleMouseMove(e, card));
            card.addEventListener('mouseenter', e => this.handleMouseEnter(e, card));
            card.addEventListener('mouseleave', e => this.handleMouseLeave(e, card));
        });
    }
    
    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX * 5; // Reduced to 5deg max rotation
        const deltaY = (y - centerY) / centerY * 5; // Reduced to 5deg max rotation
        
        card.style.transform = `perspective(1000px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) scale3d(1.02, 1.02, 1.02)`;
    }
    
    handleMouseEnter(e, card) {
        // Smooth transition on enter - consistent 0.3s duration
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

        // Add subtle shadow effect - theme-aware shadow
        const isDarkMode = document.body.classList.contains('dark-mode');
        card.style.boxShadow = isDarkMode
            ? '0 10px 20px rgba(0, 0, 0, 0.3)'
            : '0 10px 20px rgba(0, 0, 0, 0.12)';
    }

    handleMouseLeave(e, card) {
        // Reset transformations - consistent 0.3s duration
        card.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

        // Theme-aware default shadow
        const isDarkMode = document.body.classList.contains('dark-mode');
        card.style.boxShadow = isDarkMode
            ? '0 4px 6px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px rgba(0, 0, 0, 0.08)';
    }
    
    // Call this when new cards are added to the DOM
    refreshCards(selector) {
        this.cards = document.querySelectorAll(selector);
        this.initialize();
    }
}