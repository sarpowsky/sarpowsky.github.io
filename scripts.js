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
        function animateMatrix() {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const textColor = isDarkMode ? '#00FF41' : '#000000';
            const backgroundColor = isDarkMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
            
            drawMatrix(textColor, backgroundColor);
            requestAnimationFrame(animateMatrix);
        }
        function showSection(sectionId) {
            // Show the specific section
            document.getElementById(sectionId).classList.remove('hidden');
            
            // Remove active class from all buttons
            const buttons = document.querySelectorAll('.section-btn');
            buttons.forEach(button => button.classList.remove('active'));
    
            // Add active class to the current button
            const activeButton = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
            if (activeButton) {
                activeButton.classList.add('active');
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