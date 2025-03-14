// assets/js/main.js
import MatrixAnimation from './components/matrix.js';
import Navigation from './components/navigation.js';
import ThemeToggle from './components/themeToggle.js';
import Clock from './components/clock.js';
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
        document.querySelector('img.rounded-full').src = profileData.profileImage;
        
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
                link.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700';
                link.textContent = 'View Project';
                div.appendChild(link);
            } else if (project.note) {
                const note = document.createElement('p');
                note.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700';
                note.textContent = project.note;
                div.appendChild(note);
            }
            
            container.appendChild(div);
        });
    }

    loadSkillsSection() {
        const skillsSection = document.getElementById('skills');
        const title = skillsSection.querySelector('h2');
        const container = skillsSection.querySelector('.grid');
        
        title.textContent = skillsData.title;
        
        // Clear existing categories
        container.innerHTML = '';
        
        // Add skill categories
        skillsData.categories.forEach(category => {
            const div = document.createElement('div');
            div.className = 'bg-gray p-6 rounded-lg';
            
            const h3 = document.createElement('h3');
            h3.className = 'text-xl font-semibold mb-4';
            h3.textContent = category.name;
            
            const ul = document.createElement('ul');
            ul.className = 'list-disc list-inside text-gray-300';
            
            category.skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                ul.appendChild(li);
            });
            
            div.appendChild(h3);
            div.appendChild(ul);
            container.appendChild(div);
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
            img.src = device.image;
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
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});