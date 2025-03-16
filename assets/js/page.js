// assets/js/page.js - For individual pages
import MatrixAnimation from './components/matrix.js';
import ThemeToggle from './components/themeToggle.js';
import Clock from './components/clock.js';
import CardEffects from './components/cardEffects.js';
import { 
    projectsData, 
    skillsData, 
    devicesData 
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
            case 'projects':
                this.loadProjects();
                break;
            case 'skills':
                this.loadSkills();
                break;
            case 'devices':
                this.loadDevices();
                break;
        }
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
            
            if (project.link) {
                const link = document.createElement('a');
                link.href = project.link;
                link.target = '_blank';
                link.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block';
                link.textContent = 'View Project';
                link.style.opacity = '1';
                link.style.animation = 'none'; 
                div.appendChild(link);
            } else if (project.note) {
                const note = document.createElement('p');
                note.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700';
                note.textContent = project.note;
                note.style.opacity = '1';
                note.style.animation = 'none';
                div.appendChild(note);
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

    loadDevices() {
        const container = document.getElementById('devices-container');
        if (!container) return;
        
        // Add devices
        devicesData.devices.forEach(device => {
            const div = document.createElement('div');
            div.className = 'bg-gray p-6 rounded-lg';
            
            const h3 = document.createElement('h3');
            h3.className = 'text-xl font-semibold mb-4';
            h3.textContent = device.type;
            
            const img = document.createElement('img');
            img.src = device.image;
            img.className = 'rounded-full mb-6 w-40 h-40 object-cover, ImageBorder';
            img.alt = device.model;
            img.loading = 'lazy';
            
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
        
        // Initialize card effects
        setTimeout(() => {
            this.deviceCards = new CardEffects('#devices-container .bg-gray');
        }, 500);
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageApp();
});