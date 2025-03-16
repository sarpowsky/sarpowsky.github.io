# _sarpowsky Portfolio Website 

A modern, interactive personal portfolio website with Matrix-inspired animation, responsive design, and dynamic content loading.

## Features

- Interactive Matrix-inspired background animation
- Dark/light theme toggle with persistent preferences
- Responsive design for all device sizes
- Dynamic content loading with smooth transitions
- Interactive 3D card effects
- LinkedIn post carousel
- GitHub contribution calendar
- Modular component architecture
- Keyboard navigation support
- Performance optimizations (lazy loading, reduced animations for users who prefer reduced motion)

## Technologies

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (ES6 Modules)
- Feather Icons
- GitHub Actions (for automated contribution data updates)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio-website.git
   cd portfolio-website
   ```

2. Install dependencies (optional - only needed for development):
   ```bash
   # If using npm to manage dependencies
   npm install
   ```

3. Start a local development server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or with npm if configured
   npm start
   ```

4. Open http://localhost:8000 in your browser

## Project Structure

```
├── assets/
│   ├── css/
│   │   ├── components/          # Component-specific styles
│   │   ├── responsive.css       # Responsive design styles
│   │   └── styles.css           # Main stylesheet
│   ├── js/
│   │   ├── components/          # JavaScript components
│   │   ├── data/                # Data files
│   │   ├── main.js              # Main JavaScript file
│   │   └── page.js              # Page-specific JavaScript
│   └── images/                  # Images (not included in repo)
├── pages/                       # HTML pages
├── .github/                     # GitHub Actions workflows
├── index.html                   # Main entry point
└── README.md                    # Project documentation
```

## Customization

### Updating Personal Information

Edit the data files in `assets/js/data/content.js` to customize:

- Profile information
- About section content
- Experience details
- Projects
- Skills
- Devices

### Modifying the Theme

Adjust theme colors and styles in `assets/css/components/theme.css`.

### Changing the Background Animation

Modify the Matrix animation in `assets/js/components/matrix.js`.

## Deployment

Deploy to any static hosting provider:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

### GitHub Pages Example:

1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the branch to deploy (usually `main` or `master`)

## Performance Considerations

- The site includes optimizations for performance:
  - CSS and JS minification (recommended for production)
  - Lazy loading of images
  - Reduced animations for users who prefer reduced motion
  - Efficient canvas rendering with FPS limiting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Sarp Can Karaman - [LinkedIn](https://www.linkedin.com/in/sarp-can-karaman-8437761b6/)
