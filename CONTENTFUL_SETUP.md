# Contentful Content Model Setup

This document defines the content models for your portfolio website in Contentful.

## Overview

The portfolio uses Contentful as a headless CMS to manage dynamic content. Content is fetched via the Content Delivery API (read-only) and transformed to match the app's expected data structures.

## Content Models

### 1. Profile (Singleton)

**Content Type ID:** `profile`

Stores your main profile information displayed on the homepage.

| Field Name | Field ID | Type | Required | Description |
|------------|----------|------|----------|-------------|
| Name | `name` | Short text | Yes | Your display name |
| Title | `title` | Short text | Yes | Professional title/tagline |
| Profile Image | `profileImage` | Media (Image) | No | Your profile photo |
| GitHub | `github` | Short text (URL) | No | GitHub profile URL |
| LinkedIn | `linkedin` | Short text (URL) | No | LinkedIn profile URL |
| Instagram | `instagram` | Short text (URL) | No | Instagram profile URL |
| Spotify | `spotify` | Short text (URL) | No | Spotify profile URL |
| Email | `email` | Short text | No | Contact email address |
| Resume | `resume` | Media (PDF) | No | Downloadable resume file |

**Validation:**
- `github`, `linkedin`, `instagram`, `spotify`: URL pattern validation
- `email`: Email pattern validation

---

### 2. About (Singleton)

**Content Type ID:** `about`

Stores the content for your About/Hi page.

| Field Name | Field ID | Type | Required | Description |
|------------|----------|------|----------|-------------|
| Greeting | `greeting` | Short text | Yes | Main greeting (e.g., "Hi, I'm...") |
| Subtitle | `subtitle` | Short text | No | Secondary text below greeting |
| Paragraphs | `paragraphs` | Long text (List) | Yes | Array of bio paragraphs |

---

### 3. Experience (Collection)

**Content Type ID:** `experience`

Stores work experience entries for the Experience page.

| Field Name | Field ID | Type | Required | Description |
|------------|----------|------|----------|-------------|
| Order | `order` | Integer | Yes | Display order (lower = first) |
| Title | `title` | Short text | Yes | Job title |
| Company | `company` | Short text | Yes | Company name |
| Location | `location` | Short text | Yes | Work location |
| Duration | `duration` | Short text | Yes | Employment period |
| Type | `type` | Short text | Yes | Employment type (Internship, Full-time, etc.) |
| Logo | `logo` | Media (Image) | No | Company logo |
| Summary | `summary` | Short text | No | Brief one-line summary |
| Description | `description` | Long text (Markdown) | No | Detailed description with markdown support |
| Responsibilities | `responsibilities` | Long text (List) | No | Array of responsibility items |
| Technologies | `technologies` | Short text (List) | No | Array of technology tags |
| Achievements | `achievements` | Long text (List) | No | Array of key achievements |
| Skills Gained | `skillsGained` | Short text (List) | No | Array of skills developed |

**Markdown Support:** The `description` field supports markdown formatting for rich text content.

---

### 4. Project (Collection)

**Content Type ID:** `project`

Stores portfolio projects for the Projects page.

| Field Name | Field ID | Type | Required | Description |
|------------|----------|------|----------|-------------|
| Order | `order` | Integer | Yes | Display order |
| Title | `title` | Short text | Yes | Project name |
| Description | `description` | Long text | Yes | Project description |
| Image | `image` | Media (Image) | No | Project screenshot/image |
| GitHub URL | `githubUrl` | Short text (URL) | No | GitHub repository link |
| Demo URL | `demoUrl` | Short text (URL) | No | Live demo link |
| Technologies | `technologies` | Short text (List) | No | Array of technology tags |

---

### 5. Certificate (Collection)

**Content Type ID:** `certificate`

Stores certifications and achievements for the Certificates page.

| Field Name | Field ID | Type | Required | Description |
|------------|----------|------|----------|-------------|
| Order | `order` | Integer | Yes | Display order |
| Title | `title` | Short text | Yes | Certificate name |
| Issuer | `issuer` | Short text | Yes | Issuing organization |
| Date | `date` | Date | Yes | Issue date |
| Image | `image` | Media (Image) | No | Certificate image |
| Credential URL | `credentialUrl` | Short text (URL) | No | Verification link |
| Description | `description` | Long text | No | Additional details |

---

### 6. LinkedIn Post (Collection)

**Content Type ID:** `linkedInPost`

Stores LinkedIn post highlights for the homepage carousel.

| Field Name | Field ID | Type | Required | Description |
|------------|----------|------|----------|-------------|
| Title | `title` | Short text | Yes | Post title/headline |
| Excerpt | `excerpt` | Long text | Yes | Post summary/preview text |
| Date | `date` | Date | Yes | Post date |
| Link | `link` | Short text (URL) | Yes | Link to original LinkedIn post |
| Image | `image` | Media (Image) | No | Post image (if any) |

---

### 7. Skill Category (Collection)

**Content Type ID:** `skillCategory`

Stores skill categories with individual skills for the Skills section.

| Field Name | Field ID | Type | Required | Description |
|------------|----------|------|----------|-------------|
| Order | `order` | Integer | Yes | Display order |
| Category Name | `name` | Short text | Yes | Category title |
| Icon | `icon` | Short text | No | Feather icon name |
| Skills | `skills` | JSON | Yes | Array of skill objects |

**Skills JSON Structure:**
```json
[
  { "name": "Python", "level": 70 },
  { "name": "JavaScript", "level": 65 }
]
```

---

## Setup Instructions

### Step 1: Create Content Types in Contentful

1. Log into your Contentful space
2. Go to **Content model** in the top navigation
3. Click **Add content type** for each model defined above
4. Set the **Content type ID** exactly as specified (case-sensitive)
5. Add all fields with the correct field IDs and types

### Step 2: Configure Field Validations

For URL fields, add URL validation:
- Pattern: `^https?://.*`
- Custom error message: "Please enter a valid URL"

For email fields, add email validation:
- Pattern: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

### Step 3: Upload Assets

For the Resume PDF:
1. Go to **Media** in Contentful
2. Click **Add asset**
3. Upload your resume PDF file
4. Publish the asset
5. Link it in your Profile entry's `resume` field

### Step 4: Create Content Entries

1. Go to **Content** in Contentful
2. Create entries for each content type
3. For singleton types (Profile, About), create exactly one entry
4. For collection types, create as many entries as needed
5. **Publish** all entries to make them available via the API

### Step 5: Configure API Access

Update your `assets/js/config/contentful.config.js`:

```javascript
const ContentfulConfig = {
    spaceId: 'YOUR_SPACE_ID',
    accessToken: 'YOUR_CDA_ACCESS_TOKEN',
    environment: 'master',
    // ... other settings
};
```

Find your credentials in Contentful: **Settings > API keys**

---

## Updating Profile Transformer for New Fields

After adding `email` and `resume` fields to the Profile content type, update the transformer:

**File:** `assets/js/services/transformers/profileTransformer.js`

```javascript
export function transformProfile(entry) {
    if (!entry || !entry.fields) {
        console.warn('Profile transformer received invalid entry');
        return null;
    }

    const fields = entry.fields;

    const profileImageUrl = contentfulService.getAssetUrl(fields.profileImage)
        || '../images/profile-picture.png';

    // Get resume URL from Contentful asset
    const resumeUrl = contentfulService.getAssetUrl(fields.resume)
        || 'assets/resume.pdf';

    return {
        name: fields.name || 'Name Not Set',
        title: fields.title || '',
        profileImage: profileImageUrl,

        // Contact info
        email: fields.email || 'your.email@example.com',
        resumeUrl: resumeUrl,

        // Social links
        social: {
            github: fields.github || 'https://github.com',
            linkedin: fields.linkedin || 'https://linkedin.com',
            instagram: fields.instagram || '',
            spotify: fields.spotify || ''
        }
    };
}
```

---

## Cache Configuration

Cache TTL (time-to-live) settings in `contentful.config.js`:

| Content Type | Default TTL | Rationale |
|--------------|-------------|-----------|
| Profile | 24 hours | Rarely changes |
| About | 24 hours | Rarely changes |
| Experience | 12 hours | Occasional updates |
| Project | 6 hours | More frequent updates |
| Certificate | 12 hours | Occasional updates |
| LinkedIn Post | 1 hour | Most dynamic content |

To force refresh content, call:
```javascript
import { refreshAllContent } from './services/contentFetchers.js';
await refreshAllContent();
```

---

## Troubleshooting

### Content not appearing
1. Ensure entries are **published** in Contentful
2. Check browser console for API errors
3. Verify API credentials are correct
4. Enable debug mode: `debug: true` in config

### Images not loading
1. Check that assets are published in Contentful
2. Verify HTTPS URLs (Contentful assets are always HTTPS)
3. Check for CORS issues in browser console

### Cache issues
Clear the cache via browser console:
```javascript
localStorage.clear();
```

Or use the built-in function:
```javascript
import { clearAllCache } from './services/contentFetchers.js';
clearAllCache();
```
