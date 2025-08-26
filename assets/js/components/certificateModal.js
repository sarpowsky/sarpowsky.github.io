// assets/js/components/certificateModal.js
export default class CertificateModal {
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
        modalOverlay.className = 'certificate-modal-overlay';
        modalOverlay.style.display = 'none';
        
        // Create modal content container
        const modalContent = document.createElement('div');
        modalContent.className = 'certificate-modal-content';
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.className = 'certificate-modal-close';
        closeButton.innerHTML = '<i data-feather="x"></i>';
        
        // Certificate image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'certificate-modal-image-container';
        
        const certificateImage = document.createElement('img');
        certificateImage.className = 'certificate-modal-image';
        certificateImage.alt = 'Certificate';
        
        imageContainer.appendChild(certificateImage);
        
        // Certificate info container
        const infoContainer = document.createElement('div');
        infoContainer.className = 'certificate-modal-info';
        
        const certificateName = document.createElement('h2');
        certificateName.className = 'certificate-modal-name';
        
        const certificateCompany = document.createElement('p');
        certificateCompany.className = 'certificate-modal-company';
        
        const certificateDate = document.createElement('p');
        certificateDate.className = 'certificate-modal-date';
        
        const certificateDescription = document.createElement('p');
        certificateDescription.className = 'certificate-modal-description';
        
        // Assemble info container
        infoContainer.appendChild(certificateName);
        infoContainer.appendChild(certificateCompany);
        infoContainer.appendChild(certificateDate);
        infoContainer.appendChild(certificateDescription);
        
        // Assemble modal content
        modalContent.appendChild(closeButton);
        modalContent.appendChild(imageContainer);
        modalContent.appendChild(infoContainer);
        
        // Assemble modal
        modalOverlay.appendChild(modalContent);
        
        // Add to DOM
        document.body.appendChild(modalOverlay);
        
        // Store references
        this.modal = modalOverlay;
        this.elements = {
            image: certificateImage,
            name: certificateName,
            company: certificateCompany,
            date: certificateDate,
            description: certificateDescription,
            closeButton: closeButton
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
        this.modal.querySelector('.certificate-modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    open(certificate) {
        // Populate modal with certificate data
        this.elements.image.src = certificate.image;
        this.elements.image.alt = certificate.name;
        this.elements.name.textContent = certificate.name;
        this.elements.company.textContent = certificate.company;
        this.elements.date.textContent = certificate.date;
        this.elements.description.textContent = certificate.description;

        // Show modal with animation
        this.modal.style.display = 'flex';
        this.isOpen = true;
        
        // Add animation classes
        setTimeout(() => {
            this.modal.classList.add('certificate-modal-open');
        }, 10);

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Refresh Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    close() {
        // Remove animation class
        this.modal.classList.remove('certificate-modal-open');
        this.isOpen = false;

        // Hide modal after animation
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);

        // Restore body scroll
        document.body.style.overflow = 'auto';
    }

    // Static method to handle image loading errors
    static handleImageError(img, certificate) {
        // Create a placeholder with certificate info
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Set background
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add border
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
        
        // Add certificate icon (simple representation)
        ctx.fillStyle = '#6b7280';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📜', canvas.width / 2, 100);
        
        // Add certificate name
        ctx.font = 'bold 16px Arial';
        ctx.fillText(certificate.name, canvas.width / 2, 150);
        
        // Add company
        ctx.font = '14px Arial';
        ctx.fillText(certificate.company, canvas.width / 2, 180);
        
        // Add date
        ctx.font = '12px Arial';
        ctx.fillText(certificate.date, canvas.width / 2, 210);
        
        // Replace image source with canvas data
        img.src = canvas.toDataURL();
    }
}