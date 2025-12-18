# _sarpowsky Portfolio

A modern, interactive portfolio website showcasing professional experience, projects, and skills with a unique Matrix-inspired aesthetic and dynamic content management via Contentful CMS.

## ✨ Features

- **Matrix Animation Background**: Dynamic, interactive canvas-based animation with responsive performance optimizations
- **Theme Switching**: Seamless dark/light mode toggle with persistent user preferences
- **Responsive Design**: Fully optimized layout adaptations for all device sizes
- **Dynamic Content**: Content managed via Contentful CMS with automatic fallback to static data
- **Interactive Elements**:
  - 3D card effects with tilt and perspective transforms
  - Animated section transitions with particle effects
  - Keyboard navigation support
  - Skeleton loading states
- **Content Components**:
  - LinkedIn posts carousel with auto-rotation
  - GitHub contribution visualization
  - Skills progress visualization
  - Projects showcase with dynamic loading
  - Certificates gallery with modal view
  - Experience timeline with detailed modals
- **Accessibility Features**: Reduced motion support, high-contrast compatibility, and keyboard navigation
- **Performance Optimized**: Efficient rendering, lazy loading, caching, and reduced animations for resource conservation

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | JavaScript ES6 Modules, HTML5, CSS3 |
| Styling | Tailwind CSS, Custom CSS Components |
| CMS | Contentful (Headless CMS) |
| Animation | HTML5 Canvas, CSS Animations |
| Icons | Feather Icons |
| Hosting | GitHub Pages |

## 📁 Project Structure

```
portfolio/
├── index.html                 # Main landing page
├── pages/                     # Individual content pages
│   ├── about.html
│   ├── experience.html
│   ├── projects.html
│   ├── skills.html
│   └── certificates.html
├── assets/
│   ├── css/
│   │   ├── styles.css         # Main stylesheet (imports all components)
│   │   ├── responsive.css     # Responsive breakpoints
│   │   └── components/        # Modular CSS components
│   │       ├── theme.css
│   │       ├── layout.css
│   │       ├── matrix.css
│   │       ├── animations.css
│   │       ├── loading.css
│   │       └── ...
│   └── js/
│       ├── main.js            # Main page application
│       ├── page.js            # Individual pages application
│       ├── config/
│       │   └── contentful.config.js
│       ├── services/
│       │   ├── contentfulService.js
│       │   ├── contentFetchers.js
│       │   └── cacheService.js
│       ├── transformers/      # Contentful data transformers
│       ├── components/        # UI components
│       ├── utils/             # Utility functions
│       └── data/              # Static fallback data
├── images/                    # Static images
└── .github/
    └── workflows/             # GitHub Actions
```

## 🚀 Quick Start

### Prerequisites

- A modern web browser
- (Optional) Node.js 16+ for local development
- (Optional) Contentful account for CMS features

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sarpowsky/sarpowsky.github.io.git
   cd sarpowsky.github.io
   ```

2. **Start a local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Content Management

The portfolio supports two content modes:

1. **Static Mode** (Default): Content loads from static JavaScript files in `assets/js/data/`
2. **CMS Mode**: Content loads from Contentful with automatic fallback to static

To enable CMS mode, see [CONTENTFUL_SETUP.md](./CONTENTFUL_SETUP.md).

## ⚙️ Configuration

### Environment Variables

Create a `contentful.config.js` file (or update the existing one):

```javascript
// assets/js/config/contentful.config.js
const ContentfulConfig = {
    spaceId: 'YOUR_SPACE_ID',
    accessToken: 'YOUR_ACCESS_TOKEN',
    environment: 'master',
    debug: false  // Set to true for development
};

export default ContentfulConfig;
```

### Debug Mode

Enable debug mode to see content source indicators and detailed logging:

```javascript
// In contentful.config.js
debug: true
```

This will show:
- Content source badges (Contentful/Static/Cached)
- Console logs for all content operations
- Cache statistics

## 📝 Content Types

| Type | Description | Contentful Model |
|------|-------------|-----------------|
| Profile | Name, title, social links | `profile` |
| About | Greeting, bio paragraphs | `about` |
| Experience | Work history with details | `experience` |
| Project | Portfolio projects | `project` |
| Skill | Skill categories and levels | `skill` |
| Certificate | Certifications and achievements | `certificate` |
| LinkedIn Post | Social media updates | `linkedInPost` |

## 🎨 Customization

### Theme Colors

Edit `assets/css/components/theme.css`:

```css
/* Dark mode colors */
body.dark-mode {
    background-color: #121212;
    color: #e0e0e0;
}

/* Light mode colors */
body.light-mode {
    background-color: #f4f4f4;
    color: #333;
}
```

### Matrix Animation

Adjust in `assets/js/components/matrix.js`:

```javascript
this.dropSpeed = 0.5;  // Character fall speed
this.FRAME_THRESHOLD = 1000 / 30;  // FPS cap
```

### Skill Levels

Update in `assets/js/data/skillsData.js`:

```javascript
{
    name: "Python",
    level: 70  // Percentage (40-70 recommended for students)
}
```

## 🔧 Development

### Adding New Content Types

1. Create transformer in `assets/js/transformers/`
2. Add fetcher function in `assets/js/services/contentFetchers.js`
3. Add static fallback in `assets/js/data/`
4. Update `assets/js/data/content.js` exports

### Updating Static Content

Edit files in `assets/js/data/`:
- `profileData.js` - Profile information
- `aboutData.js` - About section
- `experienceData.js` - Work experience
- `projectsData.js` - Projects
- `skillsData.js` - Skills and levels
- `certificatesData.js` - Certificates

## 🐛 Troubleshooting

### Content not loading

1. Check browser console for errors
2. Verify Contentful credentials in config
3. Enable debug mode to see content source
4. Clear localStorage cache: `localStorage.clear()`

### Matrix animation lag

1. Reduce FPS in matrix.js
2. Check for memory leaks in DevTools
3. Disable other animations temporarily

### Images not displaying

1. Check image paths in data files
2. Verify images exist in `/images/` directory
3. Check for CORS issues if using external URLs

## 📄 License

MIT License - See [LICENSE.md](./LICENSE.md) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📬 Contact

- GitHub: [@sarpowsky](https://github.com/sarpowsky)
- LinkedIn: [Sarp Can Karaman](https://www.linkedin.com/in/sarp-can-karaman/)

---

Built with ❤️ by Sarp Can Karaman
