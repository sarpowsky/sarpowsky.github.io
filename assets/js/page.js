// assets/js/page.js - For individual pages
import MatrixAnimation from './components/matrix.js';
import ThemeToggle from './components/themeToggle.js';
import Clock from './components/clock.js';
import CardEffects from './components/cardEffects.js';
import CertificateModal from './components/certificateModal.js';
import ExperienceModal from './components/experienceModal.js';
import { 
    profileData,
    aboutData,
    experienceData,
    projectsData, 
    skillsData, 
    certificatesData 
} from './data/content.js';

class PageApp {
    constructor() {
        this.pageName = this.getPageName();
        this.initialize();
    }

    getPageName() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop().split('.')[0];
        return pageName || 'index';
    }

    initialize() {
        // Initialize base components
        this.initMatrix();
        this.initThemeToggle();
        this.initClock();
        
        // Initialize modals based on page
        if (this.pageName === 'certificates') {
            this.initCertificateModal();
        }
        if (this.pageName === 'experience') {
            this.initExperienceModal();
        }
        
        // Initialize page-specific content
        this.loadPageContent();
        
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Add error handling
        this.setupErrorHandling();
    }

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
    
    initCertificateModal() {
        // Initialize the certificate modal for the certificates page
        this.certificateModal = new CertificateModal();
    }
    
    initExperienceModal() {
        // Initialize the experience modal for the experience page
        console.log('Initializing experience modal...'); // Debug log
        this.experienceModal = new ExperienceModal();
        console.log('Experience modal initialized:', this.experienceModal); // Debug log
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            if (event.error.message.includes('canvas') || event.error.message.includes('animation')) {
                document.body.style.background = 'linear-gradient(to bottom, #121212, #1a1a1a)';
            }
        });
    }

    loadPageContent() {
        switch (this.pageName) {
            case 'about':
                this.loadAbout();
                break;
            case 'experience':
                this.loadExperience();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'skills':
                this.loadSkills();
                break;
            case 'certificates':
                this.loadCertificates();
                break;
        }
    }

    loadAbout() {
        const container = document.querySelector('.content-card');
        if (!container) return;
        
        // Get title element
        const titleElement = container.querySelector('h2');
        if (titleElement) titleElement.textContent = aboutData.title;
        
        // Get greeting element
        const greetingElement = container.querySelector('h1');
        if (greetingElement) greetingElement.textContent = aboutData.greeting;
        
        // Get subtitle element
        const subtitleElement = container.querySelector('p.text-xxl');
        if (subtitleElement) subtitleElement.textContent = aboutData.subtitle;
        
        // Update paragraphs
        const paragraphs = container.querySelectorAll('p.text-xl');
        if (paragraphs.length > 0) {
            aboutData.paragraphs.forEach((text, index) => {
                if (paragraphs[index]) {
                    paragraphs[index].textContent = text;
                }
            });
        }
    }

    loadExperience() {
        console.log('Loading experience section...'); // Debug log
        const container = document.getElementById('experience-container');
        if (!container) {
            console.error('Experience container not found');
            return;
        }
        
        console.log('Experience data:', experienceData); // Debug log
        
        // Clear existing content
        container.innerHTML = '';
        
        // Check if we have experiences to display
        if (!experienceData || !experienceData.experiences || experienceData.experiences.length === 0) {
            console.error('No experience data found');
            container.innerHTML = '<p class="text-center text-gray-500">No experience data available</p>';
            return;
        }
        
        // Add experience cards
        experienceData.experiences.forEach((experience, index) => {
            console.log('Creating card for experience:', experience.title); // Debug log
            
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
            title.textContent = experience.title;
            
            const company = document.createElement('p');
            company.className = 'experience-card-company';
            company.textContent = `${experience.company} • ${experience.location}`;
            
            const duration = document.createElement('p');
            duration.className = 'experience-card-duration';
            duration.textContent = experience.duration;
            
            info.appendChild(title);
            info.appendChild(company);
            info.appendChild(duration);
            
            header.appendChild(logo);
            header.appendChild(info);
            
            // Summary
            const summary = document.createElement('p');
            summary.className = 'experience-card-summary';
            summary.textContent = experience.summary;
            
            // Experience type badge
            const typeBadge = document.createElement('span');
            typeBadge.className = 'experience-card-type';
            typeBadge.textContent = experience.type;
            
            // Assemble card
            cardContent.appendChild(header);
            cardContent.appendChild(summary);
            cardContent.appendChild(typeBadge);
            
            card.appendChild(cardContent);
            
            // Add click event to open modal
            card.addEventListener('click', () => {
                console.log('Card clicked, opening modal for:', experience.title);
                if (this.experienceModal) {
                    this.experienceModal.open(experience);
                } else {
                    console.error('Experience modal not initialized');
                }
            });
            
            container.appendChild(card);
        });
        
        // Initialize card effects after loading
        setTimeout(() => {
            this.experienceCards = new CardEffects('#experience-container .experience-card');
        }, 500);
    }
    
    createExperienceLogoPlaceholder(img, companyName) {
        // Create a simple company logo placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        // Set background based on theme
        const isDarkMode = document.body.classList.contains('dark-mode');
        ctx.fillStyle = isDarkMode ? '#374151' : '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add border
        ctx.strokeStyle = isDarkMode ? '#6b7280' : '#d1d5db';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
        
        // Add company initial or building icon
        ctx.fillStyle = isDarkMode ? '#9ca3af' : '#6b7280';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        
        // Use company initial if available, otherwise use building emoji
        const initial = companyName ? companyName.charAt(0).toUpperCase() : '🏢';
        ctx.fillText(initial, canvas.width / 2, canvas.height / 2 + 12);
        
        // Replace image source with canvas data
        img.src = canvas.toDataURL();
    }

    loadProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;
        
        // Add projects
        projectsData.projects.forEach(project => {
            const div = document.createElement('div');
            div.className = 'bg-gray p-6 rounded-lg';
            
            const h3 = document.createElement('h3');
            h3.className = 'text-xl font-semibold mb-4';
            h3.textContent = project.title;
            
            const desc = document.createElement('p');
            desc.className = 'text-gray-400 mb-4';
            desc.textContent = project.description;
            
            div.appendChild(h3);
            div.appendChild(desc);
            
            // Check if project has a note property
            if (project.note) {
                const note = document.createElement('p');
                note.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700';
                note.textContent = project.note;
                note.style.opacity = '1';
                note.style.animation = 'none';
                div.appendChild(note);
            } 
            // Show 'View Project' button if link exists or is null (but property exists)
            // Default to '#' if link is null to ensure the button appears
            else if ('link' in project || project.link === null) {
                const link = document.createElement('a');
                link.href = project.link || '#';
                link.target = '_blank';
                link.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block';
                link.textContent = 'View Project';
                link.style.opacity = '1';
                link.style.animation = 'none';
                div.appendChild(link);
            }
            // Add default View Project button if neither note nor link property exists
            else {
                const link = document.createElement('a');
                link.href = '#';
                link.target = '_blank';
                link.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block';
                link.textContent = 'View Project';
                link.style.opacity = '1';
                link.style.animation = 'none';
                div.appendChild(link);
            }
            
            container.appendChild(div);
        });
        
        // Initialize card effects
        setTimeout(() => {
            this.projectCards = new CardEffects('#projects-container .bg-gray');
        }, 500);
    }

    loadSkills() {
        const container = document.getElementById('skills-container');
        if (!container) return;
        
        // Add skill categories with progress bars
        skillsData.categories.forEach(category => {
            const div = document.createElement('div');
            div.className = 'bg-gray p-6 rounded-lg';
            
            const h3 = document.createElement('h3');
            h3.className = 'text-xl font-semibold mb-4';
            h3.textContent = category.name;
            
            div.appendChild(h3);
            
            // Create skill bars
            category.skills.forEach(skill => {
                // Skill container
                const skillContainer = document.createElement('div');
                skillContainer.className = 'mb-4';
                
                // Skill name and percentage
                const skillName = document.createElement('div');
                skillName.className = 'flex justify-between mb-1';
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'text-gray-300';
                
                // Check if skill is string or object
                if (typeof skill === 'string') {
                    nameSpan.textContent = skill;
                    // Add a default level (80%)
                    const levelSpan = document.createElement('span');
                    levelSpan.className = 'text-gray-400';
                    levelSpan.textContent = '80%';
                    skillName.appendChild(levelSpan);
                } else {
                    nameSpan.textContent = skill.name;
                    // Add skill level percentage text
                    const levelSpan = document.createElement('span');
                    levelSpan.className = 'text-gray-400';
                    levelSpan.textContent = `${skill.level}%`;
                    skillName.appendChild(levelSpan);
                }
                
                skillName.appendChild(nameSpan);
                
                // Progress bar container
                const progressContainer = document.createElement('div');
                progressContainer.className = 'w-full bg-gray-700 rounded-full h-2.5';
                
                // Progress bar
                const progressBar = document.createElement('div');
                progressBar.className = 'bg-green-600 h-2.5 rounded-full';
                
                // Set the width directly
                if (typeof skill === 'string') {
                    progressBar.style.width = '80%'; // Default value
                } else {
                    progressBar.style.width = `${skill.level}%`;
                }
                
                progressContainer.appendChild(progressBar);
                
                // Assemble skill
                skillContainer.appendChild(skillName);
                skillContainer.appendChild(progressContainer);
                
                div.appendChild(skillContainer);
            });
            
            container.appendChild(div);
        });
    }

    loadCertificates() {
        const container = document.getElementById('certificates-container');
        if (!container) return;
        
        // Add certificates
        certificatesData.certificates.forEach(certificate => {
            const div = document.createElement('div');
            div.className = 'certificate-card bg-gray p-0 rounded-lg cursor-pointer';
            
            // Certificate image
            const img = document.createElement('img');
            img.src = certificate.image;
            img.className = 'certificate-card-image w-full h-48 object-cover';
            img.alt = certificate.name;
            img.loading = 'lazy';
            
            // Handle image loading errors with placeholder
            img.addEventListener('error', () => {
                CertificateModal.handleImageError(img, certificate);
            });
            
            // Certificate info container
            const infoDiv = document.createElement('div');
            infoDiv.className = 'certificate-card-info p-4';
            
            const name = document.createElement('h3');
            name.className = 'certificate-card-name text-lg font-semibold mb-2';
            name.textContent = certificate.name;
            
            const company = document.createElement('p');
            company.className = 'certificate-card-company text-blue-600 font-medium mb-1';
            company.textContent = certificate.company;
            
            const date = document.createElement('p');
            date.className = 'certificate-card-date text-sm text-gray-500';
            date.textContent = certificate.date;
            
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
        
        // Initialize card effects after loading
        setTimeout(() => {
            this.certificateCards = new CardEffects('#certificates-container .certificate-card');
        }, 500);
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageApp();
});