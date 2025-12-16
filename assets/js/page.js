// assets/js/page.js
// ============================================================================
// PAGE APPLICATION - For Individual Content Pages
// ============================================================================
// This file handles individual portfolio pages (about, experience, projects,
// skills, certificates). Each page loads its specific content from Contentful
// with automatic fallback to static data.
//
// PAGES HANDLED:
// --------------
// - /pages/about.html       → Loads about data
// - /pages/experience.html  → Loads experience data + modal
// - /pages/projects.html    → Loads projects data + card effects
// - /pages/skills.html      → Loads skills data with progress bars
// - /pages/certificates.html → Loads certificates + modal
//
// CONTENT LOADING STRATEGY:
// -------------------------
// 1. Initialize visual components (matrix, theme, clock)
// 2. Show loading state (optional)
// 3. Fetch content from Contentful (or cache)
// 4. Fall back to static data if unavailable
// 5. Render content and initialize interactive elements
// ============================================================================

// ---------------------------------------------------------------------------
// COMPONENT IMPORTS
// ---------------------------------------------------------------------------

import MatrixAnimation from './components/matrix.js';
import ThemeToggle from './components/themeToggle.js';
import Clock from './components/clock.js';
import CardEffects from './components/cardEffects.js';
import CertificateModal from './components/certificateModal.js';
import ExperienceModal from './components/experienceModal.js';

// ---------------------------------------------------------------------------
// UTILITY IMPORTS
// ---------------------------------------------------------------------------

import { 
    showLoading, 
    hideLoading, 
    showContentSourceIndicator 
} from './utils/loadingHelper.js';

// ---------------------------------------------------------------------------
// CONTENT IMPORTS
// ---------------------------------------------------------------------------

import { 
    // Static data - immediate fallback
    profileData as staticProfileData,
    aboutData as staticAboutData,
    experienceData as staticExperienceData,
    projectsData as staticProjectsData,
    skillsData as staticSkillsData,
    certificatesData as staticCertificatesData,
    
    // Async loaders - fetch from Contentful with fallback
    loadProfile,
    loadAbout,
    loadExperiences,
    loadProjects,
    loadSkills,
    loadCertificates,
    
    // Utilities
    isContentfulConfigured
} from './data/content.js';

import ContentfulConfig from './config/contentful.config.js';

// ============================================================================
// PAGE APPLICATION CLASS
// ============================================================================

class PageApp {
    constructor() {
        this.pageName = this.getPageName();
        this.contentSource = 'pending'; // Track where content came from
        this.initialize();
    }

    // -------------------------------------------------------------------------
    // INITIALIZATION
    // -------------------------------------------------------------------------

    getPageName() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop().split('.')[0];
        return pageName || 'index';
    }

    async initialize() {
        this.log(`Initializing page: ${this.pageName}`);
        
        // Phase 1: Initialize base components (visual, non-content dependent)
        this.initMatrix();
        this.initThemeToggle();
        this.initClock();
        
        // Phase 2: Initialize modals based on page type
        this.initModals();
        
        // Phase 3: Load page-specific content
        await this.loadPageContent();
        
        // Phase 4: Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Phase 5: Setup error handling
        this.setupErrorHandling();
        
        this.log(`Page initialization complete (source: ${this.contentSource})`);
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

    initThemeToggle() {
        this.themeToggle = new ThemeToggle('mode-toggle');
    }

    initClock() {
        this.clock = new Clock('clock');
    }
    
    initModals() {
        // Initialize modals based on current page
        if (this.pageName === 'certificates') {
            this.certificateModal = new CertificateModal();
            this.log('Certificate modal initialized');
        }
        
        if (this.pageName === 'experience') {
            this.experienceModal = new ExperienceModal();
            this.log('Experience modal initialized');
        }
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            if (event.error?.message?.includes('canvas') || 
                event.error?.message?.includes('animation')) {
                document.body.style.background = 'linear-gradient(to bottom, #121212, #1a1a1a)';
            }
        });
    }

    // -------------------------------------------------------------------------
    // CONTENT LOADING - ROUTER
    // -------------------------------------------------------------------------

    async loadPageContent() {
        // Route to the appropriate content loader based on page name
        switch (this.pageName) {
            case 'about':
                await this.loadAbout();
                break;
            case 'experience':
                await this.loadExperience();
                break;
            case 'projects':
                await this.loadProjects();
                break;
            case 'skills':
                await this.loadSkills();
                break;
            case 'certificates':
                await this.loadCertificates();
                break;
            default:
                this.log(`Unknown page: ${this.pageName}`);
        }
    }

    // -------------------------------------------------------------------------
    // ABOUT PAGE
    // -------------------------------------------------------------------------

    async loadAbout() {
        const container = document.querySelector('.content-card');
        if (!container) return;

        // Try loading from Contentful first
        let data = staticAboutData;
        
        if (isContentfulConfigured()) {
            try {
                const contentfulData = await loadAbout();
                if (contentfulData) {
                    data = contentfulData;
                    this.contentSource = 'contentful';
                }
            } catch (error) {
                this.log(`Error loading about from Contentful: ${error.message}`);
            }
        }
        
        if (this.contentSource !== 'contentful') {
            this.contentSource = 'static';
        }
        
        // Render the content
        const titleElement = container.querySelector('h2');
        if (titleElement) titleElement.textContent = data.title || '';
        
        const greetingElement = container.querySelector('h1');
        if (greetingElement) greetingElement.textContent = data.greeting || '';
        
        const subtitleElement = container.querySelector('p.text-xxl');
        if (subtitleElement) subtitleElement.textContent = data.subtitle || '';
        
        const paragraphs = container.querySelectorAll('p.text-xl');
        if (data.paragraphs) {
            data.paragraphs.forEach((text, index) => {
                if (paragraphs[index]) {
                    paragraphs[index].textContent = text;
                }
            });
        }
        
        // Add content loaded animation
        container.classList.add('content-loaded');
        
        // Show content source in debug mode
        if (ContentfulConfig.debug) {
            showContentSourceIndicator(this.contentSource, 'about');
        }
    }

    // -------------------------------------------------------------------------
    // EXPERIENCE PAGE
    // -------------------------------------------------------------------------

    async loadExperience() {
        const container = document.getElementById('experience-container');
        if (!container) {
            console.error('Experience container not found');
            return;
        }
        
        // Show skeleton loader while fetching content
        showLoading(container, 'skeleton', { skeletonType: 'experienceCard', count: 3 });
        
        // Try loading from Contentful first
        let data = staticExperienceData;
        
        if (isContentfulConfigured()) {
            try {
                const contentfulData = await loadExperiences();
                if (contentfulData) {
                    data = contentfulData;
                    this.contentSource = 'contentful';
                }
            } catch (error) {
                this.log(`Error loading experiences from Contentful: ${error.message}`);
            }
        }
        
        if (this.contentSource !== 'contentful') {
            this.contentSource = 'static';
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        // Check if we have experiences to display
        if (!data?.experiences || data.experiences.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No experience data available</p>';
            return;
        }
        
        // Render experience cards
        data.experiences.forEach((experience) => {
            const card = this.createExperienceCard(experience);
            container.appendChild(card);
        });
        
        // Add stagger animation to cards
        container.classList.add('stagger-fade-in');
        
        // Show content source in debug mode
        if (ContentfulConfig.debug) {
            showContentSourceIndicator(this.contentSource, 'experience');
        }
        
        // Initialize card effects after loading
        setTimeout(() => {
            this.experienceCards = new CardEffects('#experience-container .experience-card');
        }, 500);
    }

    createExperienceCard(experience) {
        const card = document.createElement('div');
        card.className = 'experience-card bg-gray rounded-lg cursor-pointer';
        
        const cardContent = document.createElement('div');
        cardContent.className = 'experience-card-content';
        
        // Card header with logo and basic info
        const header = document.createElement('div');
        header.className = 'experience-card-header';
        
        // Company logo
        const logo = document.createElement('img');
        logo.src = experience.logo || '/images/experience/default-company.png';
        logo.className = 'experience-card-logo';
        logo.alt = `${experience.company} Logo`;
        logo.loading = 'lazy';
        
        // Handle logo error with placeholder
        logo.addEventListener('error', () => {
            this.createExperienceLogoPlaceholder(logo, experience.company);
        });
        
        // Experience info
        const info = document.createElement('div');
        info.className = 'experience-card-info';
        
        const title = document.createElement('h3');
        title.className = 'experience-card-title';
        title.textContent = experience.title || '';
        
        const company = document.createElement('p');
        company.className = 'experience-card-company';
        company.textContent = `${experience.company || ''} • ${experience.location || ''}`;
        
        const duration = document.createElement('p');
        duration.className = 'experience-card-duration';
        duration.textContent = experience.duration || '';
        
        info.appendChild(title);
        info.appendChild(company);
        info.appendChild(duration);
        
        header.appendChild(logo);
        header.appendChild(info);
        
        // Summary
        const summary = document.createElement('p');
        summary.className = 'experience-card-summary';
        summary.textContent = experience.summary || '';
        
        // Experience type badge
        const typeBadge = document.createElement('span');
        typeBadge.className = 'experience-card-type';
        typeBadge.textContent = experience.type || '';
        
        // Assemble card
        cardContent.appendChild(header);
        cardContent.appendChild(summary);
        cardContent.appendChild(typeBadge);
        card.appendChild(cardContent);
        
        // Add click event to open modal
        card.addEventListener('click', () => {
            if (this.experienceModal) {
                this.experienceModal.open(experience);
            }
        });
        
        return card;
    }
    
    createExperienceLogoPlaceholder(img, companyName) {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        const isDarkMode = document.body.classList.contains('dark-mode');
        ctx.fillStyle = isDarkMode ? '#374151' : '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = isDarkMode ? '#6b7280' : '#d1d5db';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
        
        ctx.fillStyle = isDarkMode ? '#9ca3af' : '#6b7280';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        
        const initial = companyName ? companyName.charAt(0).toUpperCase() : '🏢';
        ctx.fillText(initial, canvas.width / 2, canvas.height / 2 + 12);
        
        img.src = canvas.toDataURL();
    }

    // -------------------------------------------------------------------------
    // PROJECTS PAGE
    // -------------------------------------------------------------------------

    async loadProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;
        
        // Show skeleton loader while fetching content
        showLoading(container, 'skeleton', { skeletonType: 'projectCard', count: 6 });
        
        // Try loading from Contentful first
        let data = staticProjectsData;
        
        if (isContentfulConfigured()) {
            try {
                const contentfulData = await loadProjects();
                if (contentfulData) {
                    data = contentfulData;
                    this.contentSource = 'contentful';
                }
            } catch (error) {
                this.log(`Error loading projects from Contentful: ${error.message}`);
            }
        }
        
        if (this.contentSource !== 'contentful') {
            this.contentSource = 'static';
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        if (!data?.projects) return;
        
        // Render projects
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
            
            // Add note or link button
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
        
        // Add stagger animation to cards
        container.classList.add('stagger-fade-in');
        
        // Show content source in debug mode
        if (ContentfulConfig.debug) {
            showContentSourceIndicator(this.contentSource, 'projects');
        }
        
        // Initialize card effects
        setTimeout(() => {
            this.projectCards = new CardEffects('#projects-container .bg-gray');
        }, 500);
    }

    // -------------------------------------------------------------------------
    // SKILLS PAGE
    // -------------------------------------------------------------------------

    async loadSkills() {
        const container = document.getElementById('skills-container');
        if (!container) return;
        
        // Show skeleton loader while fetching content
        showLoading(container, 'skeleton', { skeletonType: 'skillCategory', count: 4 });
        
        // Try loading from Contentful first
        let data = staticSkillsData;
        
        if (isContentfulConfigured()) {
            try {
                const contentfulData = await loadSkills();
                if (contentfulData) {
                    data = contentfulData;
                    this.contentSource = 'contentful';
                }
            } catch (error) {
                this.log(`Error loading skills from Contentful: ${error.message}`);
            }
        }
        
        if (this.contentSource !== 'contentful') {
            this.contentSource = 'static';
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        if (!data?.categories) return;
        
        // Render skill categories with progress bars
        data.categories.forEach(category => {
            const div = document.createElement('div');
            div.className = 'bg-gray p-6 rounded-lg';
            
            const h3 = document.createElement('h3');
            h3.className = 'text-xl font-semibold mb-4';
            h3.textContent = category.name || '';
            
            div.appendChild(h3);
            
            // Create skill bars
            if (category.skills) {
                category.skills.forEach(skill => {
                    const skillContainer = document.createElement('div');
                    skillContainer.className = 'mb-4';
                    
                    const skillName = document.createElement('div');
                    skillName.className = 'flex justify-between mb-1';
                    
                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'text-gray-300';
                    
                    // Handle both string and object skill formats
                    const skillNameText = typeof skill === 'string' ? skill : skill.name;
                    const skillLevel = typeof skill === 'string' ? 80 : skill.level;
                    
                    nameSpan.textContent = skillNameText;
                    
                    const levelSpan = document.createElement('span');
                    levelSpan.className = 'text-gray-400';
                    levelSpan.textContent = `${skillLevel}%`;
                    
                    skillName.appendChild(nameSpan);
                    skillName.appendChild(levelSpan);
                    
                    // Progress bar container
                    const progressContainer = document.createElement('div');
                    progressContainer.className = 'w-full bg-gray-700 rounded-full h-2.5';
                    
                    // Progress bar
                    const progressBar = document.createElement('div');
                    progressBar.className = 'bg-green-600 h-2.5 rounded-full';
                    progressBar.style.width = `${skillLevel}%`;
                    
                    progressContainer.appendChild(progressBar);
                    
                    skillContainer.appendChild(skillName);
                    skillContainer.appendChild(progressContainer);
                    
                    div.appendChild(skillContainer);
                });
            }
            
            container.appendChild(div);
        });
        
        // Add stagger animation to cards
        container.classList.add('stagger-fade-in');
        
        // Show content source in debug mode
        if (ContentfulConfig.debug) {
            showContentSourceIndicator(this.contentSource, 'skills');
        }
    }

    // -------------------------------------------------------------------------
    // CERTIFICATES PAGE
    // -------------------------------------------------------------------------

    async loadCertificates() {
        const container = document.getElementById('certificates-container');
        if (!container) return;
        
        // Show skeleton loader while fetching content
        showLoading(container, 'skeleton', { skeletonType: 'certificateCard', count: 6 });
        
        // Try loading from Contentful first
        let data = staticCertificatesData;
        
        if (isContentfulConfigured()) {
            try {
                const contentfulData = await loadCertificates();
                if (contentfulData) {
                    data = contentfulData;
                    this.contentSource = 'contentful';
                }
            } catch (error) {
                this.log(`Error loading certificates from Contentful: ${error.message}`);
            }
        }
        
        if (this.contentSource !== 'contentful') {
            this.contentSource = 'static';
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        if (!data?.certificates) return;
        
        // Render certificates
        data.certificates.forEach(certificate => {
            const div = document.createElement('div');
            div.className = 'certificate-card bg-gray p-0 rounded-lg cursor-pointer';
            
            // Certificate image
            const img = document.createElement('img');
            img.src = certificate.image || '';
            img.className = 'certificate-card-image w-full h-48 object-cover';
            img.alt = certificate.name || '';
            img.loading = 'lazy';
            
            // Handle image error with placeholder
            img.addEventListener('error', () => {
                CertificateModal.handleImageError(img, certificate);
            });
            
            // Certificate info container
            const infoDiv = document.createElement('div');
            infoDiv.className = 'certificate-card-info p-4';
            
            const name = document.createElement('h3');
            name.className = 'certificate-card-name text-lg font-semibold mb-2';
            name.textContent = certificate.name || '';
            
            const company = document.createElement('p');
            company.className = 'certificate-card-company text-blue-600 font-medium mb-1';
            company.textContent = certificate.company || '';
            
            const date = document.createElement('p');
            date.className = 'certificate-card-date text-sm text-gray-500';
            date.textContent = certificate.date || '';
            
            // Assemble info container
            infoDiv.appendChild(name);
            infoDiv.appendChild(company);
            infoDiv.appendChild(date);
            
            // Assemble card
            div.appendChild(img);
            div.appendChild(infoDiv);
            
            // Add click event to open modal
            div.addEventListener('click', () => {
                if (this.certificateModal) {
                    this.certificateModal.open(certificate);
                }
            });
            
            container.appendChild(div);
        });
        
        // Add stagger animation to cards
        container.classList.add('stagger-fade-in');
        
        // Show content source in debug mode
        if (ContentfulConfig.debug) {
            showContentSourceIndicator(this.contentSource, 'certificates');
        }
        
        // Initialize card effects
        setTimeout(() => {
            this.certificateCards = new CardEffects('#certificates-container .certificate-card');
        }, 500);
    }

    // -------------------------------------------------------------------------
    // LOGGING
    // -------------------------------------------------------------------------

    log(message) {
        if (ContentfulConfig.debug) {
            console.log(`📄 [Page:${this.pageName}] ${message}`);
        }
    }
}

// ============================================================================
// INITIALIZE PAGE APPLICATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    new PageApp();
});
