// assets/js/main.js
import MatrixAnimation from './components/matrix.js';
import Navigation from './components/navigation.js';
import ThemeToggle from './components/themeToggle.js';
import Clock from './components/clock.js';
import CardEffects from './components/cardEffects.js';
import ParticleEffect from './components/particles.js';
import { 
    profileData, 
    aboutData, 
    experienceData, 
    projectsData, 
    skillsData, 
    devicesData 
} from './data/content.js';

class App {
    constructor() {
        this.initialize();
    }

    initialize() {
        // Initialize components
        this.initMatrix();
        this.initNavigation();
        this.initThemeToggle();
        this.initClock();
        
        // Load content
        this.loadContent();
        
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Initialize Card Effects
        this.initCardEffects();
        
        // Add intersection observer for lazy loading
        this.setupLazyLoading();
        
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
        // Apply 3D effects to project and device cards
        setTimeout(() => {
            this.projectCards = new CardEffects('#projects .bg-gray');
            this.deviceCards = new CardEffects('#devices .bg-gray');
        }, 1000); // Delay to ensure cards are loaded
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            // Implement graceful fallback for critical features
            if (event.error.message.includes('canvas') || event.error.message.includes('animation')) {
                // Fallback for matrix animation
                document.body.style.background = 'linear-gradient(to bottom, #121212, #1a1a1a)';
            }
        });
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.lazyLoadImages();
        } else {
            // Fallback for browsers that don't support IntersectionObserver
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
        
        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    loadAllImages() {
        // Fallback method for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }

    loadContent() {
        this.loadProfile();
        this.loadAboutSection();
        this.loadExperienceSection();
        this.loadProjectsSection();
        this.loadSkillsSection();
        this.loadDevicesSection();
    }

    loadProfile() {
        // Load profile data
        document.querySelector('h1').textContent = profileData.name;
        document.querySelector('p.text-l.mb-6').textContent = profileData.title;
        
        // Use lazy loading for profile image
        const profileImg = document.querySelector('img.rounded-full');
        profileImg.setAttribute('data-src', profileData.profileImage);
        profileImg.src = this.generatePlaceholder(200, 200);
        
        // Load social links
        const socialLinks = document.querySelectorAll('.social-icon');
        socialLinks[0].href = profileData.social.github;
        socialLinks[1].href = profileData.social.linkedin;
        socialLinks[2].href = profileData.social.instagram;
        socialLinks[3].href = profileData.social.spotify;
    }

    loadAboutSection() {
        const aboutSection = document.getElementById('about');
        const aboutTitle = aboutSection.querySelector('h2');
        const aboutGreeting = aboutSection.querySelector('h1');
        const aboutSubtitle = aboutSection.querySelector('p.text-xxl');
        const paragraphs = aboutSection.querySelectorAll('p.text-xl');
        
        aboutTitle.textContent = aboutData.title;
        aboutGreeting.textContent = aboutData.greeting;
        aboutSubtitle.textContent = aboutData.subtitle;
        
        aboutData.paragraphs.forEach((text, index) => {
            if (paragraphs[index]) {
                paragraphs[index].textContent = text;
            }
        });
    }

    loadExperienceSection() {
        const experienceSection = document.getElementById('experience');
        const expTitle = experienceSection.querySelector('h2');
        const expItems = experienceSection.querySelectorAll('.bg-gray');
        
        expTitle.textContent = experienceData.note;
        
        experienceData.experiences.forEach((exp, index) => {
            if (expItems[index]) {
                const title = expItems[index].querySelector('h3');
                const company = expItems[index].querySelector('p');
                const points = expItems[index].querySelector('ul');
                
                title.textContent = exp.title;
                company.textContent = exp.company;
                
                // Clear existing points
                points.innerHTML = '';
                
                // Add new points
                exp.points.forEach(point => {
                    const li = document.createElement('li');
                    li.textContent = point;
                    points.appendChild(li);
                });
            }
        });
    }

    loadProjectsSection() {
        const projectsSection = document.getElementById('projects');
        const title = projectsSection.querySelector('h2');
        const container = projectsSection.querySelector('.grid');
        
        title.textContent = projectsData.title;
        
        // Clear existing projects
        container.innerHTML = '';
        
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
            
            if (project.link) {
                const link = document.createElement('a');
                link.href = project.link;
                link.target = '_blank';
                link.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block';
                link.textContent = 'View Project';
                link.style.opacity = '1'; // Ensure opacity is set to 1
                link.style.animation = 'none'; // Disable any animations
                div.appendChild(link);
            } else if (project.note) {
                const note = document.createElement('p');
                note.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700';
                note.textContent = project.note;
                note.style.opacity = '1'; // Ensure opacity is set to 1
                note.style.animation = 'none'; // Disable any animations
                div.appendChild(note);
            }
            
            container.appendChild(div);
        });
        
        // Refresh card effects after loading
        if (this.projectCards) {
            this.projectCards.refreshCards('#projects .bg-gray');
        }
    }

    loadSkillsSection() {
        const skillsSection = document.getElementById('skills');
        const title = skillsSection.querySelector('h2');
        const container = skillsSection.querySelector('.grid');
        
        title.textContent = skillsData.title;
        
        // Clear existing categories
        container.innerHTML = '';
        
        // Add skill categories with animated progress bars
        skillsData.categories.forEach(category => {
            const div = document.createElement('div');
            div.className = 'bg-gray p-6 rounded-lg';
            
            const h3 = document.createElement('h3');
            h3.className = 'text-xl font-semibold mb-4';
            h3.textContent = category.name;
            
            div.appendChild(h3);
            
            // Create skill bars instead of bullet points
            category.skills.forEach(skill => {
                // Create skill container
                const skillContainer = document.createElement('div');
                skillContainer.className = 'mb-4';
                
                // Skill name
                const skillName = document.createElement('div');
                skillName.className = 'flex justify-between mb-1';
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'text-gray-300';
                nameSpan.textContent = skill;
                
                skillName.appendChild(nameSpan);
                
                // Progress bar container
                const progressContainer = document.createElement('div');
                progressContainer.className = 'w-full bg-gray-700 rounded-full h-2.5';
                
                // Progress bar (animated)
                const progressBar = document.createElement('div');
                progressBar.className = 'bg-blue-600 h-2.5 rounded-full skill-progress';
                progressBar.style.width = '0%';
                
                // Random skill level between 70% and 95%
                const skillLevel = Math.floor(Math.random() * 26) + 70;
                
                // Set data attribute for animation
                progressBar.setAttribute('data-width', `${skillLevel}%`);
                
                progressContainer.appendChild(progressBar);
                
                // Assemble skill
                skillContainer.appendChild(skillName);
                skillContainer.appendChild(progressContainer);
                
                div.appendChild(skillContainer);
            });
            
            container.appendChild(div);
        });
        
        // Set up animation for skill bars
        this.setupSkillAnimations();
    }
    
    setupSkillAnimations() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    
                    // Animate progress bar
                    setTimeout(() => {
                        bar.style.transition = 'width 1s ease-in-out';
                        bar.style.width = width;
                    }, 200);
                    
                    // Stop observing after animation
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.1 });
        
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    loadDevicesSection() {
        const devicesSection = document.getElementById('devices');
        const title = devicesSection.querySelector('h2');
        const container = devicesSection.querySelector('.grid');
        
        title.textContent = devicesData.title;
        
        // Clear existing devices
        container.innerHTML = '';
        
        // Add devices
        devicesData.devices.forEach(device => {
            const div = document.createElement('div');
            div.className = 'bg-gray p-6 rounded-lg';
            
            const h3 = document.createElement('h3');
            h3.className = 'text-xl font-semibold mb-4';
            h3.textContent = device.type;
            
            const img = document.createElement('img');
            // Use data-src for lazy loading
            img.setAttribute('data-src', device.image);
            // Use placeholder until image loads
            img.src = this.generatePlaceholder(200, 200);
            img.className = 'rounded-full mb-6 w-40 h-40 object-cover, ImageBorder';
            img.alt = device.model;
            
            const model = document.createElement('h1');
            model.className = 'text-xl text-gray-500 mb-4';
            model.textContent = device.model;
            
            const desc = document.createElement('p');
            desc.className = 'text-sm text-gray-400 mb-4';
            desc.textContent = '-' + device.description;
            
            div.appendChild(h3);
            div.appendChild(img);
            div.appendChild(model);
            div.appendChild(desc);
            
            container.appendChild(div);
        });
        
        // Refresh card effects after loading
        if (this.deviceCards) {
            this.deviceCards.refreshCards('#devices .bg-gray');
        }
    }
    
    generatePlaceholder(width, height) {
        // Generate a simple SVG placeholder
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23cccccc'/%3E%3C/svg%3E`;
    }
}

// Add CSS for skill progress bars
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .skill-progress {
    width: 0;
    transition: width 1s ease-in-out;
  }
`;
document.head.appendChild(styleSheet);

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});