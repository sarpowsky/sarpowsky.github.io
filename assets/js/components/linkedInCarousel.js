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
            date.textContent = post.date;
            
            content.appendChild(title);
            content.appendChild(excerpt);
            content.appendChild(date);
            
            const icon = document.createElement('div');
            icon.className = 'linkedin-icon';
            icon.innerHTML = '<i data-feather="linkedin"></i>';
            
            slide.appendChild(icon);
            slide.appendChild(content);
            
            if (post.link) {
                const link = document.createElement('a');
                link.href = post.link;
                link.target = '_blank';
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
        // Mock data (would be replaced with actual LinkedIn API integration)
        return [
            {
                title: "New Project Launch",
                excerpt: "Excited to announce the launch of our latest project. Stay tuned for more updates!",
                date: "2 days ago",
                link: "https://linkedin.com"
            },
            {
                title: "DevOps Best Practices",
                excerpt: "Here are some DevOps best practices I've learned over the years...",
                date: "1 week ago",
                link: "https://linkedin.com"
            },
            {
                title: "Back-end Development Tips",
                excerpt: "These back-end development tips have saved me countless hours...",
                date: "2 weeks ago",
                link: "https://linkedin.com"
            }
        ];
    }
}