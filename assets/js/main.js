// assets/js/main.js
import MatrixAnimation from './components/matrix.js';
import Navigation from './components/navigation.js';
import ThemeToggle from './components/themeToggle.js';
import Clock from './components/clock.js';
import CardEffects from './components/cardEffects.js';
import LinkedInCarousel from './components/linkedInCarousel.js';
import GitHubCalendar from './components/gitHubCalendar.js';
import { 
    profileData, 
    aboutData, 
    experienceData, 
    projectsData, 
    skillsData, 
    certificatesData 
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
        
        // Initialize widgets
        this.initWidgets();
        
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
        // Apply 3D effects to project cards (certificates are handled on their own page)
        setTimeout(() => {
            this.projectCards = new CardEffects('#projects .bg-gray');
        }, 1000); // Delay to ensure cards are loaded
    }
    
    initWidgets() {
        this.initLinkedInCarousel();
        this.initGitHubCalendar();
    }

    async initLinkedInCarousel() {
        try {
            const posts = await LinkedInCarousel.fetchPosts();
            this.linkedInCarousel = new LinkedInCarousel('linkedin-carousel', posts);
        } catch (error) {
            console.error('Failed to initialize LinkedIn carousel:', error);
        }
    }

    initGitHubCalendar() {
        try {
            // Use the GitHub username from profileData
            const username = profileData.social.github.split('/').pop();
            this.gitHubCalendar = new GitHubCalendar('github-calendar', username);
        } catch (error) {
            console.error('Failed to initialize GitHub calendar:', error);
        }
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
        this.loadCertificatesSection();
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
        if (!aboutSection) return;
        
        const aboutTitle = aboutSection?.querySelector('h2');
        const aboutGreeting = aboutSection?.querySelector('h1');
        const aboutSubtitle = aboutSection?.querySelector('p.text-xxl');
        const paragraphs = aboutSection?.querySelectorAll('p.text-xl');
        
        if (aboutTitle) aboutTitle.textContent = aboutData.title;
        if (aboutGreeting) aboutGreeting.textContent = aboutData.greeting;
        if (aboutSubtitle) aboutSubtitle.textContent = aboutData.subtitle;
        
        aboutData.paragraphs.forEach((text, index) => {
            if (paragraphs[index]) {
                paragraphs[index].textContent = text;
            }
        });
    }

    loadExperienceSection() {
        const experienceSection = document.getElementById('experience');
        if (!experienceSection) return;
        
        const expTitle = experienceSection.querySelector('h2');
        const expItems = experienceSection.querySelectorAll('.bg-gray');
        
        if (expTitle) expTitle.textContent = experienceData.title;
        
        experienceData.experiences.forEach((exp, index) => {
            if (expItems[index]) {
                const title = expItems[index].querySelector('h3');
                const company = expItems[index].querySelector('p');
                const points = expItems[index].querySelector('ul');
                
                if (title) title.textContent = exp.title;
                if (company) company.textContent = exp.company;
                
                if (points) {
                    // Clear existing points
                    points.innerHTML = '';
                    
                    // Add new points
                    exp.points.forEach(point => {
                        const li = document.createElement('li');
                        li.textContent = point;
                        points.appendChild(li);
                    });
                }
            }
        });
    }

    loadProjectsSection() {
        const projectsSection = document.getElementById('projects');
        if (!projectsSection) return;
        
        const title = projectsSection.querySelector('h2');
        const container = projectsSection.querySelector('.grid');
        
        if (title) title.textContent = projectsData.title;
        if (!container) return;
        
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
        
        // Refresh card effects after loading
        if (this.projectCards) {
            this.projectCards.refreshCards('#projects .bg-gray');
        }
    }

    loadSkillsSection() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;
        
        const title = skillsSection.querySelector('h2');
        const container = skillsSection.querySelector('.grid');
        
        if (title) title.textContent = skillsData.title;
        if (!container) return;
        
        // Clear existing categories
        container.innerHTML = '';
        
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
                // Create skill container
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

    loadCertificatesSection() {
        // Certificates are handled on their dedicated page
        // This method is here for consistency and future expansion
        console.log('Certificates data available:', certificatesData.certificates.length, 'certificates');
    }
    
    generatePlaceholder(width, height) {
        // Generate a simple SVG placeholder
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23cccccc'/%3E%3C/svg%3E`;
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});