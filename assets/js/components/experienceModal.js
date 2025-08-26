// assets/js/components/experienceModal.js
export default class ExperienceModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.initialize();
    }

    initialize() {
        // Create modal structure and inject into DOM
        this.createModal();
        this.setupEventListeners();
    }

    createModal() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'experience-modal-overlay';
        modalOverlay.style.display = 'none';
        
        // Create modal content container
        const modalContent = document.createElement('div');
        modalContent.className = 'experience-modal-content';
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'experience-modal-close';
        closeButton.innerHTML = '<i data-feather="x"></i>';
        
        // Header section
        const headerSection = document.createElement('div');
        headerSection.className = 'experience-modal-header';
        
        // Company logo
        const companyLogo = document.createElement('div');
        companyLogo.className = 'experience-modal-logo-container';
        
        const logo = document.createElement('img');
        logo.className = 'experience-modal-logo';
        logo.alt = 'Company Logo';
        
        companyLogo.appendChild(logo);
        
        // Title and company info
        const titleInfo = document.createElement('div');
        titleInfo.className = 'experience-modal-title-info';
        
        const jobTitle = document.createElement('h2');
        jobTitle.className = 'experience-modal-job-title';
        
        const companyName = document.createElement('h3');
        companyName.className = 'experience-modal-company';
        
        const locationDuration = document.createElement('p');
        locationDuration.className = 'experience-modal-location-duration';
        
        const experienceType = document.createElement('span');
        experienceType.className = 'experience-modal-type';
        
        titleInfo.appendChild(jobTitle);
        titleInfo.appendChild(companyName);
        titleInfo.appendChild(locationDuration);
        titleInfo.appendChild(experienceType);
        
        headerSection.appendChild(companyLogo);
        headerSection.appendChild(titleInfo);
        
        // Content sections container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'experience-modal-body';
        
        // Summary section
        const summarySection = document.createElement('div');
        summarySection.className = 'experience-modal-section';
        
        const summaryTitle = document.createElement('h4');
        summaryTitle.textContent = 'Overview';
        summaryTitle.className = 'experience-modal-section-title';
        
        const summaryText = document.createElement('p');
        summaryText.className = 'experience-modal-summary';
        
        summarySection.appendChild(summaryTitle);
        summarySection.appendChild(summaryText);
        
        // Responsibilities section
        const responsibilitiesSection = document.createElement('div');
        responsibilitiesSection.className = 'experience-modal-section';
        
        const respTitle = document.createElement('h4');
        respTitle.textContent = 'Key Responsibilities';
        respTitle.className = 'experience-modal-section-title';
        
        const respList = document.createElement('ul');
        respList.className = 'experience-modal-list';
        
        responsibilitiesSection.appendChild(respTitle);
        responsibilitiesSection.appendChild(respList);
        
        // Technologies section
        const techSection = document.createElement('div');
        techSection.className = 'experience-modal-section';
        
        const techTitle = document.createElement('h4');
        techTitle.textContent = 'Technologies & Tools';
        techTitle.className = 'experience-modal-section-title';
        
        const techContainer = document.createElement('div');
        techContainer.className = 'experience-modal-tech-tags';
        
        techSection.appendChild(techTitle);
        techSection.appendChild(techContainer);
        
        // Achievements section
        const achievementsSection = document.createElement('div');
        achievementsSection.className = 'experience-modal-section';
        
        const achievTitle = document.createElement('h4');
        achievTitle.textContent = 'Key Achievements';
        achievTitle.className = 'experience-modal-section-title';
        
        const achievList = document.createElement('ul');
        achievList.className = 'experience-modal-list';
        
        achievementsSection.appendChild(achievTitle);
        achievementsSection.appendChild(achievList);
        
        // Skills gained section
        const skillsSection = document.createElement('div');
        skillsSection.className = 'experience-modal-section';
        
        const skillsTitle = document.createElement('h4');
        skillsTitle.textContent = 'Skills Developed';
        skillsTitle.className = 'experience-modal-section-title';
        
        const skillsContainer = document.createElement('div');
        skillsContainer.className = 'experience-modal-skills-tags';
        
        skillsSection.appendChild(skillsTitle);
        skillsSection.appendChild(skillsContainer);
        
        // Assemble content container
        contentContainer.appendChild(summarySection);
        contentContainer.appendChild(responsibilitiesSection);
        contentContainer.appendChild(techSection);
        contentContainer.appendChild(achievementsSection);
        contentContainer.appendChild(skillsSection);
        
        // Assemble modal content
        modalContent.appendChild(closeButton);
        modalContent.appendChild(headerSection);
        modalContent.appendChild(contentContainer);
        
        // Assemble modal
        modalOverlay.appendChild(modalContent);
        
        // Add to DOM
        document.body.appendChild(modalOverlay);
        
        // Store references
        this.modal = modalOverlay;
        this.elements = {
            logo,
            jobTitle,
            companyName,
            locationDuration,
            experienceType,
            summaryText,
            respList,
            techContainer,
            achievList,
            skillsContainer,
            closeButton,
            achievementsSection,
            skillsSection
        };
    }

    setupEventListeners() {
        // Close modal when clicking overlay
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close modal when clicking close button
        this.elements.closeButton.addEventListener('click', () => {
            this.close();
        });

        // Close modal on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Prevent modal content clicks from closing modal
        this.modal.querySelector('.experience-modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    open(experience) {
        // Populate modal with experience data
        this.populateModal(experience);

        // Show modal with animation
        this.modal.style.display = 'flex';
        this.isOpen = true;
        
        // Add animation classes
        setTimeout(() => {
            this.modal.classList.add('experience-modal-open');
        }, 10);

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Refresh Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    populateModal(experience) {
        // Set logo with error handling
        this.elements.logo.src = experience.logo;
        this.elements.logo.alt = `${experience.company} Logo`;
        this.elements.logo.onerror = () => {
            this.createCompanyLogoPlaceholder(experience.company);
        };

        // Set title and company info
        this.elements.jobTitle.textContent = experience.title;
        this.elements.companyName.textContent = experience.company;
        this.elements.locationDuration.textContent = `${experience.location} • ${experience.duration}`;
        this.elements.experienceType.textContent = experience.type;

        // Set summary
        this.elements.summaryText.textContent = experience.description || experience.summary;

        // Populate responsibilities
        this.elements.respList.innerHTML = '';
        experience.responsibilities.forEach(responsibility => {
            const li = document.createElement('li');
            li.textContent = responsibility;
            this.elements.respList.appendChild(li);
        });

        // Populate technologies
        this.elements.techContainer.innerHTML = '';
        experience.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'experience-modal-tag tech-tag';
            tag.textContent = tech;
            this.elements.techContainer.appendChild(tag);
        });

        // Handle achievements section
        if (experience.achievements && experience.achievements.length > 0) {
            this.elements.achievementsSection.style.display = 'block';
            this.elements.achievList.innerHTML = '';
            experience.achievements.forEach(achievement => {
                const li = document.createElement('li');
                li.textContent = achievement;
                this.elements.achievList.appendChild(li);
            });
        } else {
            this.elements.achievementsSection.style.display = 'none';
        }

        // Populate skills gained
        if (experience.skills_gained && experience.skills_gained.length > 0) {
            this.elements.skillsSection.style.display = 'block';
            this.elements.skillsContainer.innerHTML = '';
            experience.skills_gained.forEach(skill => {
                const tag = document.createElement('span');
                tag.className = 'experience-modal-tag skill-tag';
                tag.textContent = skill;
                this.elements.skillsContainer.appendChild(tag);
            });
        } else {
            this.elements.skillsSection.style.display = 'none';
        }
    }

    createCompanyLogoPlaceholder(companyName) {
        // Create a simple company logo placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        // Set background
        const isDarkMode = document.body.classList.contains('dark-mode');
        ctx.fillStyle = isDarkMode ? '#374151' : '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add border
        ctx.strokeStyle = isDarkMode ? '#6b7280' : '#d1d5db';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
        
        // Add company initial or building icon
        ctx.fillStyle = isDarkMode ? '#9ca3af' : '#6b7280';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        
        // Use company initial if available, otherwise use building emoji
        const initial = companyName ? companyName.charAt(0).toUpperCase() : '🏢';
        ctx.fillText(initial, canvas.width / 2, canvas.height / 2 + 16);
        
        // Replace image source with canvas data
        this.elements.logo.src = canvas.toDataURL();
    }

    close() {
        // Remove animation class
        this.modal.classList.remove('experience-modal-open');
        this.isOpen = false;

        // Hide modal after animation
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);

        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}