// assets/js/components/navigation.js
export default class Navigation {
    constructor() {
        this.sections = ['about', 'experience', 'projects', 'skills', 'devices'];
        this.initialize();
    }

    initialize() {
        // Add click event listeners to section buttons
        document.querySelectorAll('.section-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const sectionId = e.target.getAttribute('data-section');
                this.showSection(sectionId);
            });
        });

        // Add click event listeners to exit buttons
        document.querySelectorAll('.section-content button').forEach(button => {
            button.addEventListener('click', () => this.hideSection());
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }

    showSection(sectionId) {
        // Deactivate all buttons
        const buttons = document.querySelectorAll('.section-btn');
        buttons.forEach(button => button.classList.remove('active'));
        
        // Activate clicked button
        const activeButton = document.querySelector(`.section-btn[data-section="${sectionId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Hide all sections first
        this.hideAllSections();
        
        // Show the requested section
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            // Add a slight delay for skills section (for smoother transition)
            if (sectionId === 'skills') {
                setTimeout(() => {
                    sectionElement.classList.remove('hidden');
                }, 300);
            } else {
                sectionElement.classList.remove('hidden');
            }
        }
    }

    hideAllSections() {
        const sections = document.querySelectorAll('.section-content');
        sections.forEach(section => section.classList.add('hidden'));
    }

    hideSection() {
        this.hideAllSections();
        
        // Remove active class from all buttons
        const buttons = document.querySelectorAll('.section-btn');
        buttons.forEach(button => button.classList.remove('active'));
    }

    handleKeyNavigation(e) {
        if (e.key === 'Escape') {
            this.hideSection();
        } else if (e.key === 'ArrowRight') {
            this.navigateToNextSection();
        } else if (e.key === 'ArrowLeft') {
            this.navigateToPreviousSection();
        }
    }

    navigateToNextSection() {
        const currentSection = this.sections.find(s => 
            !document.getElementById(s).classList.contains('hidden'));
        
        if (currentSection) {
            const currentIndex = this.sections.indexOf(currentSection);
            const nextIndex = (currentIndex + 1) % this.sections.length;
            this.showSection(this.sections[nextIndex]);
        } else {
            // If no section is visible, show the first one
            this.showSection(this.sections[0]);
        }
    }

    navigateToPreviousSection() {
        const currentSection = this.sections.find(s => 
            !document.getElementById(s).classList.contains('hidden'));
        
        if (currentSection) {
            const currentIndex = this.sections.indexOf(currentSection);
            const prevIndex = (currentIndex - 1 + this.sections.length) % this.sections.length;
            this.showSection(this.sections[prevIndex]);
        } else {
            // If no section is visible, show the last one
            this.showSection(this.sections[this.sections.length - 1]);
        }
    }
}
