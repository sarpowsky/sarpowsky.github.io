// assets/js/components/linkedInCarousel.js
export default class LinkedInCarousel {
    constructor(containerId, posts) {
        this.container = document.getElementById(containerId);
        this.posts = posts;
        this.currentIndex = 0;
        this.initialize();
    }

    initialize() {
        if (!this.container) return;
        this.createCarouselStructure();
        this.setupEventListeners();
        this.showSlide(this.currentIndex);
        
        if (this.posts.length > 1) {
            this.startAutoRotate();
        }
    }

    createCarouselStructure() {
        const carousel = document.createElement('div');
        carousel.className = 'linkedin-carousel relative';
        
        this.slidesContainer = document.createElement('div');
        this.slidesContainer.className = 'linkedin-carousel-slides';
        
        this.posts.forEach(post => {
            const slide = document.createElement('div');
            slide.className = 'linkedin-carousel-slide';
            
            const content = document.createElement('div');
            content.className = 'linkedin-post-content';
            
            const title = document.createElement('h3');
            title.className = 'linkedin-post-title';
            title.textContent = post.title;
            
            const excerpt = document.createElement('p');
            excerpt.className = 'linkedin-post-excerpt';
            excerpt.textContent = post.excerpt;
            
            const date = document.createElement('div');
            date.className = 'linkedin-post-date';
            date.textContent = this.formatRelativeTime(post.date);
            
            content.appendChild(title);
            content.appendChild(excerpt);
            content.appendChild(date);
            
            // LinkedIn icon with theme-aware colors
            const icon = document.createElement('div');
            icon.className = 'linkedin-icon';
            icon.innerHTML = '<i data-feather="linkedin"></i>';
            
            slide.appendChild(icon);
            slide.appendChild(content);
            
            if (post.link) {
                const link = document.createElement('a');
                link.href = post.link;
                link.target = "_blank";
                link.className = 'linkedin-post-link';
                link.textContent = 'Read more';
                slide.appendChild(link);
            }
            
            this.slidesContainer.appendChild(slide);
        });
        
        carousel.appendChild(this.slidesContainer);
        
        if (this.posts.length > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-nav-btn prev-btn';
            prevBtn.innerHTML = '<i data-feather="chevron-left"></i>';
            prevBtn.addEventListener('click', () => this.prevSlide());
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-nav-btn next-btn';
            nextBtn.innerHTML = '<i data-feather="chevron-right"></i>';
            nextBtn.addEventListener('click', () => this.nextSlide());
            
            carousel.appendChild(prevBtn);
            carousel.appendChild(nextBtn);
            
            const indicators = document.createElement('div');
            indicators.className = 'carousel-indicators';
            
            this.posts.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = 'carousel-indicator';
                indicator.addEventListener('click', () => this.showSlide(index));
                indicators.appendChild(indicator);
            });
            
            carousel.appendChild(indicators);
            this.indicators = indicators.childNodes;
        }
        
        this.container.appendChild(carousel);
        
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    setupEventListeners() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.slidesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        this.slidesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, false);
    }

    handleSwipe(startX, endX) {
        if (startX - endX > 50) {
            this.nextSlide();
        } else if (endX - startX > 50) {
            this.prevSlide();
        }
    }

    formatRelativeTime(dateString) {
        const postDate = new Date(dateString);
        const now = new Date();
        
        // Calculate the difference in milliseconds
        const diffMs = now - postDate;
        
        // Convert to days
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays < 1) {
            return 'today';
        } else if (diffDays === 1) {
            return 'yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 14) {
            return '1 week ago';
        } else if (diffDays < 21) {
            return '2 weeks ago';
        } else if (diffDays < 28) {
            return '3 weeks ago';
        } else {
            // Calculate months
            const diffMonths = Math.floor(diffDays / 30);
            
            if (diffMonths < 1) {
                return '3+ weeks ago';
            } else if (diffMonths === 1) {
                return '1 month ago';
            } else {
                return `${diffMonths} months ago`;
            }
        }
    }

    showSlide(index) {
        const slides = this.slidesContainer.childNodes;
        
        if (index >= slides.length) {
            this.currentIndex = 0;
        } else if (index < 0) {
            this.currentIndex = slides.length - 1;
        } else {
            this.currentIndex = index;
        }
        
        const translateValue = -this.currentIndex * 100;
        this.slidesContainer.style.transform = `translateX(${translateValue}%)`;
        
        if (this.indicators) {
            Array.from(this.indicators).forEach((indicator, i) => {
                if (i === this.currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
    }

    nextSlide() {
        this.showSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.showSlide(this.currentIndex - 1);
    }

    startAutoRotate() {
        this.autoRotateTimer = setInterval(() => {
            this.nextSlide();
        }, 5000);
        
        this.container.addEventListener('mouseenter', () => {
            clearInterval(this.autoRotateTimer);
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.autoRotateTimer = setInterval(() => {
                this.nextSlide();
            }, 5000);
        });
    }

    static async fetchPosts() {
        try {
            // Load from local JSON file instead of API
            const response = await fetch('/assets/js/data/linkedin-posts.json');
            
            if (!response.ok) throw new Error('Failed to load LinkedIn posts');
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching LinkedIn posts:', error);
            return [];
        }
    }
}