        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        const fontSize = 10;
        const columns = canvas.width / fontSize;

        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function drawMatrix(textColor, backgroundColor) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = textColor;
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                // Add a slight probability check to reduce density
                if (Math.random() > 0.7) {  // Reduced from 1 to 0.7 to make it sparser
                    const text = chars.charAt(Math.floor(Math.random() * chars.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                }

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {  // Increased probability slightly
                    drops[i] = 0;
                }
                drops[i] += 0.5;  // Reduced speed from 1 to 0.5
            }
        }
        // Improved matrix animation performance
        let lastRender = 0;
        const FRAME_THRESHOLD = 1000 / 30; // Cap at 30 FPS

        function animateMatrix(timestamp) {
            if (!lastRender || timestamp - lastRender >= FRAME_THRESHOLD) {
                const isDarkMode = document.body.classList.contains('dark-mode');
                const textColor = isDarkMode ? '#00FF41' : '#000000';
                const backgroundColor = isDarkMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
                
                drawMatrix(textColor, backgroundColor);
                lastRender = timestamp;
            }
            requestAnimationFrame(animateMatrix);
        }
        function showSection(sectionId) {
            
            const buttons = document.querySelectorAll('.section-btn');
            buttons.forEach(button => button.classList.remove('active'));
        
            
            const activeButton = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        
            // Hide all sections first
            const sections = document.querySelectorAll('.section-content');
            sections.forEach(section => section.classList.add('hidden'));
        
            // Show the specific section with a delay if it's the skills section
            if (sectionId === 'skills') {
                setTimeout(() => {
                    document.getElementById(sectionId).classList.remove('hidden');
                }, 300); // 300ms delay, adjust as needed
            } else {
                document.getElementById(sectionId).classList.remove('hidden');
            }
        }
        function hideSection() {
            // Hide all section content
            const sections = document.querySelectorAll('.section-content');
            sections.forEach(section => section.classList.add('hidden'));
            
            // Remove active class from all buttons
            const buttons = document.querySelectorAll('.section-btn');
            buttons.forEach(button => button.classList.remove('active'));
        }
        //Clock
        function updateClock() {
            const clock = document.getElementById('clock');
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            clock.textContent = `${hours}:${minutes}:${seconds}`;
        }

        // Initialize the clock and update every second
        setInterval(updateClock, 1000);
        updateClock();

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            const sections = ['about', 'experience', 'projects', 'skills', 'devices'];
            if (e.key === 'Escape') {
                hideSection();
            } else if (e.key === 'ArrowRight') {
                const currentSection = sections.find(s => !document.getElementById(s).classList.contains('hidden'));
                const currentIndex = sections.indexOf(currentSection);
                const nextIndex = (currentIndex + 1) % sections.length;
                showSection(sections[nextIndex]);
            } else if (e.key === 'ArrowLeft') {
                const currentSection = sections.find(s => !document.getElementById(s).classList.contains('hidden'));
                const currentIndex = sections.indexOf(currentSection);
                const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
                showSection(sections[prevIndex]);
            }
        });

        // Add error handling
        function initializeCanvas() {
            try {
                const canvas = document.getElementById('matrix-canvas');
                if (!canvas) {
                    throw new Error('Canvas element not found');
                }
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw new Error('Could not get 2D context');
                }
                return { canvas, ctx };
            } catch (error) {
                console.error('Failed to initialize canvas:', error);
                // Fallback to simple background
                document.body.style.backgroundColor = '#f0f0f0';
            }
        }

       // Dark/Light Mode Toggle
        const modeToggle = document.getElementById('mode-toggle');
        const body = document.body;

        modeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            body.classList.toggle('light-mode');

            // Replace the icon directly
            if (body.classList.contains('dark-mode')) {
                modeToggle.innerHTML = '<i data-feather="moon"></i>';
            } else {
                modeToggle.innerHTML = '<i data-feather="sun"></i>';
            }

            // Refresh Feather icons to render the new icon
            feather.replace();
        });
        // Add event listeners to exit buttons
        document.querySelectorAll('.section-content button').forEach(button => {
            button.addEventListener('click', hideSection);
        });
    
        feather.replace();
        animateMatrix();