// assets/js/components/clock.js
export default class Clock {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.initialize();
    }

    initialize() {
        // Initial update
        this.updateClock();
        
        // Update every second
        this.timer = setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        this.element.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Cleanup method to prevent memory leaks
    destroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
