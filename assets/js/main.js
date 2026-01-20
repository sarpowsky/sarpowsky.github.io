// assets/js/main.js
// ============================================================================
// MAIN APPLICATION ENTRY POINT
// ============================================================================
// This is the main JavaScript file for the portfolio homepage (index.html).
// It initializes all components and loads content dynamically from Contentful
// with automatic fallback to static data.
//
// CONTENT LOADING STRATEGY:
// -------------------------
// 1. Show page immediately with loading states
// 2. Fetch content from Contentful (or cache) in background
// 3. Update UI as content arrives
// 4. Fall back to static data if Contentful unavailable
//
// This approach provides:
//   - Fast initial page load
//   - Dynamic content from CMS
//   - Graceful degradation if API fails
// ============================================================================

// ---------------------------------------------------------------------------
// COMPONENT IMPORTS
// ---------------------------------------------------------------------------

import MatrixAnimation from './components/matrix.js';
import Navigation from './components/navigation.js';
import ThemeToggle from './components/themeToggle.js';
import Clock from './components/clock.js';
import CardEffects from './components/cardEffects.js';
import LinkedInCarousel from './components/linkedInCarousel.js';

// ---------------------------------------------------------------------------
// UTILITY IMPORTS
// ---------------------------------------------------------------------------

import { initDebugMode, debugLog, trackContentSource } from './utils/debugMode.js';

// ---------------------------------------------------------------------------
// CONTENT IMPORTS
// ---------------------------------------------------------------------------
// We import both static data (for immediate use) and async loaders (for CMS)

import {
    // Static data - used as immediate fallback
    profileData as staticProfileData,
    aboutData as staticAboutData,
    experienceData as staticExperienceData,
    projectsData as staticProjectsData,
    certificatesData as staticCertificatesData,

    // Async loaders - fetch from Contentful with fallback
    loadProfile,
    loadAbout,
    loadExperiences,
    loadProjects,
    loadCertificates,
    loadLinkedInPosts,

    // Utilities
    isContentfulConfigured,
    getContentSourceInfo
} from './data/content.js';

import ContentfulConfig from './config/contentful.config.js';

// ============================================================================
// MAIN APPLICATION CLASS
// ============================================================================

class App {
    constructor() {
        // Track loaded content for debugging
        this.contentSources = {};
        this.isContentLoaded = false;
        
        // Initialize the app
        this.initialize();
    }

    // -------------------------------------------------------------------------
    // INITIALIZATION
    // -------------------------------------------------------------------------

    async initialize() {
        // Phase 1: Initialize visual components immediately
        // (These don't depend on content data)
        this.initMatrix();
        this.initNavigation();
        this.initThemeToggle();
        this.initClock();
        
        // Phase 2: Load static content immediately for fast initial render
        this.loadStaticContent();
        
        // Phase 3: Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Phase 4: Fetch dynamic content from Contentful in background
        // This will update the UI once data arrives
        await this.loadDynamicContent();
        
        // Phase 5: Initialize widgets that depend on content
        await this.initWidgets();
        
        // Phase 6: Initialize interactive effects
        this.initCardEffects();
        
        // Phase 7: Setup utilities
        this.setupLazyLoading();
        this.setupErrorHandling();
        this.setupDebugMode();
        
        this.isContentLoaded = true;
        this.log('App initialization complete');
    }

    // -------------------------------------------------------------------------
    // COMPONENT INITIALIZATION
    // -------------------------------------------------------------------------

    initMatrix() {
        try {
            this.matrix = new MatrixAnimation('matrix-canvas');
            this.matrix.start();
        } catch (error) {
            console.error('Failed to initialize matrix animation:', error);
            document.body.style.backgroundColor = '#f0f0f0';
        }
    }

    initNavigation() {
        this.navigation = new Navigation();
    }

    initThemeToggle() {
        this.themeToggle = new ThemeToggle('mode-toggle');
    }

    initClock() {
        this.clock = new Clock('clock');
    }
    
    initCardEffects() {
        // Apply 3D effects to project cards after content is loaded
        setTimeout(() => {
            this.projectCards = new CardEffects('#projects .bg-gray');
        }, 1000);
    }

    // -------------------------------------------------------------------------
    // CONTENT LOADING
    // -------------------------------------------------------------------------

    /**
     * Loads static content immediately for fast initial render
     * This ensures the page looks good even before Contentful responds
     */
    loadStaticContent() {
        this.log('Loading static content for initial render...');
        
        // Use static data for immediate display
        this.loadProfileUI(staticProfileData);
        this.loadAboutSectionUI(staticAboutData);
        this.loadExperienceSectionUI(staticExperienceData);
        this.loadProjectsSectionUI(staticProjectsData);
    }

    /**
     * Fetches content from Contentful and updates the UI
     * Falls back gracefully to static data if unavailable
     */
    async loadDynamicContent() {
        // Check if Contentful is configured
        if (!isContentfulConfigured()) {
            this.log('Contentful not configured - using static data only');
            return;
        }

        this.log('Fetching dynamic content from Contentful...');

        try {
            // Fetch all content in parallel for better performance
            const [
                profile,
                about,
                experiences,
                projects,
                certificates
            ] = await Promise.all([
                loadProfile(),
                loadAbout(),
                loadExperiences(),
                loadProjects(),
                loadCertificates()
            ]);

            // Update UI with dynamic content (only if different from static)
            if (profile && profile !== staticProfileData) {
                this.loadProfileUI(profile);
                this.contentSources.profile = 'contentful';
            }
            
            if (about && about !== staticAboutData) {
                this.loadAboutSectionUI(about);
                this.contentSources.about = 'contentful';
            }
            
            if (experiences && experiences !== staticExperienceData) {
                this.loadExperienceSectionUI(experiences);
                this.contentSources.experiences = 'contentful';
            }
            
            if (projects && projects !== staticProjectsData) {
                this.loadProjectsSectionUI(projects);
                this.contentSources.projects = 'contentful';
            }

            this.log('Dynamic content loaded successfully');

        } catch (error) {
            console.error('Error loading dynamic content:', error);
            this.log('Falling back to static content');
        }
    }

    // -------------------------------------------------------------------------
    // WIDGET INITIALIZATION
    // -------------------------------------------------------------------------

    async initWidgets() {
        await this.initLinkedInCarousel();
    }

    async initLinkedInCarousel() {
        try {
            // First try to load from Contentful
            let posts = await loadLinkedInPosts();

            // If Contentful didn't return posts, fall back to JSON file
            if (!posts || posts.length === 0) {
                posts = await LinkedInCarousel.fetchPosts();
                this.contentSources.linkedInPosts = 'json-file';
            } else {
                this.contentSources.linkedInPosts = 'contentful';
            }

            if (posts && posts.length > 0) {
                this.linkedInCarousel = new LinkedInCarousel('linkedin-carousel', posts);
            }
        } catch (error) {
            console.error('Failed to initialize LinkedIn carousel:', error);
        }
    }

    // -------------------------------------------------------------------------
    // UI UPDATE METHODS
    // -------------------------------------------------------------------------

    loadProfileUI(data) {
        if (!data) return;

        // Update name
        const nameEl = document.querySelector('h1');
        if (nameEl) nameEl.textContent = data.name || '';

        // Update title/description
        const titleEl = document.querySelector('p.text-l.mb-6');
        if (titleEl) titleEl.textContent = data.title || '';

        // Update profile image with lazy loading
        const profileImg = document.querySelector('img.rounded-full');
        if (profileImg && data.profileImage) {
            profileImg.setAttribute('data-src', data.profileImage);
            profileImg.src = this.generatePlaceholder(200, 200);
        }

        // Update social links
        const socialLinks = document.querySelectorAll('.social-icon');
        if (socialLinks.length >= 4 && data.social) {
            if (data.social.github) socialLinks[0].href = data.social.github;
            if (data.social.linkedin) socialLinks[1].href = data.social.linkedin;
            if (data.social.instagram) socialLinks[2].href = data.social.instagram;
            if (data.social.spotify) socialLinks[3].href = data.social.spotify;
        }

        // Update contact buttons (resume and email)
        const contactButtons = document.querySelectorAll('.contact-btn');
        contactButtons.forEach(btn => {
            // Update resume download link
            if (btn.hasAttribute('download') && data.resumeUrl) {
                btn.href = data.resumeUrl;
            }
            // Update email mailto link
            if (btn.href && btn.href.startsWith('mailto:') && data.email) {
                btn.href = `mailto:${data.email}`;
            }
        });
    }

    loadAboutSectionUI(data) {
        const aboutSection = document.getElementById('about');
        if (!aboutSection || !data) return;
        
        const aboutTitle = aboutSection.querySelector('h2');
        const aboutGreeting = aboutSection.querySelector('h1');
        const aboutSubtitle = aboutSection.querySelector('p.text-xxl');
        const paragraphs = aboutSection.querySelectorAll('p.text-xl');
        
        if (aboutTitle) aboutTitle.textContent = data.title || '';
        if (aboutGreeting) aboutGreeting.textContent = data.greeting || '';
        if (aboutSubtitle) aboutSubtitle.textContent = data.subtitle || '';
        
        if (data.paragraphs) {
            data.paragraphs.forEach((text, index) => {
                if (paragraphs[index]) {
                    paragraphs[index].textContent = text;
                }
            });
        }
    }

    loadExperienceSectionUI(data) {
        const experienceSection = document.getElementById('experience');
        if (!experienceSection || !data) return;
        
        const expTitle = experienceSection.querySelector('h2');
        const expItems = experienceSection.querySelectorAll('.bg-gray');
        
        if (expTitle) expTitle.textContent = data.title || '';
        
        if (data.experiences) {
            data.experiences.forEach((exp, index) => {
                if (expItems[index]) {
                    const title = expItems[index].querySelector('h3');
                    const company = expItems[index].querySelector('p');
                    const points = expItems[index].querySelector('ul');
                    
                    if (title) title.textContent = exp.title || '';
                    if (company) company.textContent = exp.company || '';
                    
                    if (points && exp.points) {
                        points.innerHTML = '';
                        exp.points.forEach(point => {
                            const li = document.createElement('li');
                            li.textContent = point;
                            points.appendChild(li);
                        });
                    }
                }
            });
        }
    }

    loadProjectsSectionUI(data) {
        const projectsSection = document.getElementById('projects');
        if (!projectsSection || !data) return;
        
        const title = projectsSection.querySelector('h2');
        const container = projectsSection.querySelector('.grid');
        
        if (title) title.textContent = data.title || '';
        if (!container || !data.projects) return;
        
        // Clear existing projects
        container.innerHTML = '';
        
        // Add projects
        data.projects.forEach(project => {
            const div = document.createElement('div');
            div.className = 'bg-gray p-6 rounded-lg';
            
            const h3 = document.createElement('h3');
            h3.className = 'text-xl font-semibold mb-4';
            h3.textContent = project.title || '';
            
            const desc = document.createElement('p');
            desc.className = 'text-gray-400 mb-4';
            desc.textContent = project.description || '';
            
            div.appendChild(h3);
            div.appendChild(desc);
            
            // Add note or link
            if (project.note) {
                const note = document.createElement('p');
                note.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700';
                note.textContent = project.note;
                note.style.opacity = '1';
                note.style.animation = 'none';
                div.appendChild(note);
            } else {
                const link = document.createElement('a');
                link.href = project.link || '#';
                link.target = '_blank';
                link.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block';
                link.textContent = 'View Project';
                link.style.opacity = '1';
                link.style.animation = 'none';
                div.appendChild(link);
            }
            
            container.appendChild(div);
        });
        
        // Refresh card effects after updating
        if (this.projectCards) {
            this.projectCards.refreshCards('#projects .bg-gray');
        }
    }

    // -------------------------------------------------------------------------
    // UTILITY METHODS
    // -------------------------------------------------------------------------
    
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            if (event.error?.message?.includes('canvas') || 
                event.error?.message?.includes('animation')) {
                document.body.style.background = 'linear-gradient(to bottom, #121212, #1a1a1a)';
            }
        });
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.lazyLoadImages();
        } else {
            this.loadAllImages();
        }
    }
    
    lazyLoadImages() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
    
    generatePlaceholder(width, height) {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23cccccc'/%3E%3C/svg%3E`;
    }

    setupDebugMode() {
        // Initialize the debug mode utilities
        initDebugMode();
        
        if (!ContentfulConfig.debug) return;
        
        // Expose app instance for debugging
        window.__portfolioApp = this;
        
        // Track content sources for each type
        Object.entries(this.contentSources).forEach(([type, source]) => {
            trackContentSource(type, source);
        });
        
        // Log content source summary
        debugLog('App', 'Content Sources:', this.contentSources);
        debugLog('App', 'Content Info:', getContentSourceInfo());
    }

    log(message) {
        if (ContentfulConfig.debug) {
            debugLog('App', message);
        }
    }
}

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
