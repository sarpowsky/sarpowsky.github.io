// assets/js/components/themeToggle.js
export default class ThemeToggle {
    constructor(buttonId) {
        this.button = document.getElementById(buttonId);
        this.body = document.body;
        this.initialize();
    }

    initialize() {
        // Check for user preference from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }

        this.button.addEventListener('click', () => this.toggleTheme());
        
        // Initialize the icon based on current theme
        this.updateIcon();
    }

    toggleTheme() {
        if (this.body.classList.contains('dark-mode')) {
            this.setTheme('light');
        } else {
            this.setTheme('dark');
        }
    }

    setTheme(theme) {
        if (theme === 'dark') {
            this.body.classList.add('dark-mode');
            this.body.classList.remove('light-mode');
        } else {
            this.body.classList.add('light-mode');
            this.body.classList.remove('dark-mode');
        }
        
        // Save preference to localStorage
        localStorage.setItem('theme', theme);
        
        // Update the icon
        this.updateIcon();
    }

    updateIcon() {
        if (this.body.classList.contains('dark-mode')) {
            this.button.innerHTML = '<i data-feather="moon"></i>';
        } else {
            this.button.innerHTML = '<i data-feather="sun"></i>';
        }
        
        // Refresh Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}
