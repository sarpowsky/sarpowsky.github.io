// assets/js/components/navigation.js
import ParticleEffect from './particles.js';

export default class Navigation {
    constructor() {
        this.pages = ['about', 'experience', 'projects', 'skills', 'devices'];
        this.currentPage = null;
        this.previousPage = null;
        this.particles = new ParticleEffect();
        this.initialize();
    }

    initialize() {
        // Add click event listeners to section buttons
        document.querySelectorAll('.section-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const pageId = e.target.getAttribute('data-section');
                this.showPage(pageId);
            });
        });

        // Add click event listeners to back buttons
        document.querySelectorAll('.back-button').forEach(button => {
            button.addEventListener('click', () => this.goBack());
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Check localStorage for last viewed page
        this.checkLastPage();
    }
    
    checkLastPage() {
        const lastPage = localStorage.getItem('lastPage');
        if (lastPage && this.pages.includes(lastPage)) {
            setTimeout(() => {
                this.showPage(lastPage);
            }, 1000); // Delay to allow page to load first
        }
    }

    showPage(pageId) {
        // Save previous page
        this.previousPage = this.currentPage;
        this.currentPage = pageId;
        
        // Save to localStorage
        localStorage.setItem('lastPage', pageId);
        
        // Deactivate all buttons
        const buttons = document.querySelectorAll('.section-btn');
        buttons.forEach(button => button.classList.remove('active'));
        
        // Activate clicked button
        const activeButton = document.querySelector(`.section-btn[data-section="${pageId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Get the direction for the animation
        const direction = this.getAnimationDirection(pageId);
        
        // Hide main page
        const mainPage = document.getElementById('main-page');
        mainPage.classList.add('slide-left');
        
        setTimeout(() => {
            mainPage.classList.remove('active');
        }, 500);
        
        // Show the requested page
        const pageElement = document.getElementById(pageId);
        if (pageElement) {
            // Position new page
            pageElement.classList.add(direction === 'right' ? 'slide-right' : 'slide-left');
            
            // Force reflow to ensure the transition works
            void pageElement.offsetWidth;
            
            // Start animation
            pageElement.classList.add('active');
            
            // Add particle effects at page borders
            setTimeout(() => {
                this.particles.animateSectionTransition(pageElement);
            }, 100);
            
            setTimeout(() => {
                pageElement.classList.remove('slide-right', 'slide-left');
            }, 50);
        }
    }
    
    goBack() {
        const currentPage = document.getElementById(this.currentPage);
        
        if (currentPage) {
            // Add particle effects
            this.particles.animateSectionTransition(currentPage);
            
            // Animate current page out
            currentPage.classList.add('slide-right');
            
            setTimeout(() => {
                currentPage.classList.remove('active');
                currentPage.classList.remove('slide-right');
                
                // Show main page
                const mainPage = document.getElementById('main-page');
                mainPage.classList.remove('slide-left');
                mainPage.classList.add('active');
            }, 500);
        }
        
        // Remove from localStorage
        localStorage.removeItem('lastPage');
        
        // Reset page tracking
        this.previousPage = null;
        this.currentPage = null;
        
        // Remove active class from all buttons
        const buttons = document.querySelectorAll('.section-btn');
        buttons.forEach(button => button.classList.remove('active'));
    }
    
    getAnimationDirection(newPageId) {
        if (!this.previousPage) return 'right';
        
        const prevIndex = this.pages.indexOf(this.previousPage);
        const newIndex = this.pages.indexOf(newPageId);
        
        return newIndex > prevIndex ? 'right' : 'left';
    }

    handleKeyNavigation(e) {
        if (e.key === 'Escape') {
            this.goBack();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            this.navigateToNextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            this.navigateToPreviousPage();
        }
    }

    navigateToNextPage() {
        if (!this.currentPage) {
            this.showPage(this.pages[0]);
            return;
        }
        
        const currentIndex = this.pages.indexOf(this.currentPage);
        const nextIndex = (currentIndex + 1) % this.pages.length;
        this.showPage(this.pages[nextIndex]);
    }

    navigateToPreviousPage() {
        if (!this.currentPage) {
            this.showPage(this.pages[this.pages.length - 1]);
            return;
        }
        
        const currentIndex = this.pages.indexOf(this.currentPage);
        const prevIndex = (currentIndex - 1 + this.pages.length) % this.pages.length;
        this.showPage(this.pages[prevIndex]);
    }
}