# CLAUDE.md - AI Assistant Guide for Xerion Lab

## Repository Overview

**Project Name**: Xerion Lab
**Type**: Static Website / Landing Page
**Company**: XERION LAB OÜ
**Purpose**: Corporate website showcasing AI services and solutions with EU compliance focus
**Primary Language**: HTML (with embedded CSS and JavaScript)
**Target Audience**: European enterprises seeking GDPR/EU AI Act compliant AI solutions

## Project Description

Xerion Lab is a single-page website presenting modular AI services including:
- Chatbots & AI Assistants
- Process Automation
- Predictive Dashboards
- AI Security Layer

The website emphasizes EU compliance (GDPR, EU AI Act, NIS2) and targets European enterprises with AI-driven solutions.

---

## Codebase Structure

```
Xerion-Lab/
├── index.html          # Main and only HTML file (single-page application)
└── .git/              # Git repository metadata
```

### File Inventory

**index.html** (164 lines)
- Single-page website with all content
- Embedded CSS styling (no external stylesheets)
- Embedded JavaScript (minimal, page fade-in effect)
- Sections: Hero, Services, AI Stack, Dashboard (KPIs), Custom Solutions, Contact Form, Footer
- External dependencies: None (fully self-contained)

---

## Current State & Known Issues

### Critical Issue: Incomplete HTML Structure

The `index.html` file is **missing its opening structure**:
- Missing: `<!DOCTYPE html>`
- Missing: `<html>` opening tag
- Missing: `<head>` section (meta tags, title, viewport settings)
- Missing: `<style>` opening tag (CSS starts mid-file)
- Missing: `<body>` opening tag

**Impact**: The website may not render correctly in browsers due to missing HTML5 structure and metadata.

**First Task for AI**: When making any edits to `index.html`, prepend the proper HTML structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Xerion Lab - EU-compliant AI solutions for European enterprises">
  <title>XERION LAB - Modular AI Solutions for EU Enterprises</title>
  <style>
    /* Existing CSS styles follow here */
  </style>
</head>
<body>
  <!-- Existing content starts here -->
```

---

## Development Workflow

### Git Branching Strategy

- **Feature Branches**: All development work happens on branches prefixed with `claude/`
- **Branch Naming**: `claude/claude-md-mip2idakt0xsalm9-[SESSION_ID]`
- **Current Branch**: `claude/claude-md-mip2idakt0xsalm9-01VUNjKKsqaottcJvRPtc1v3`
- **Main Branch**: Not specified (repository is new)

### Git Workflow Rules

1. **Always develop on the designated `claude/` branch**
2. **Never push to main/master without explicit permission**
3. **Commit messages should be clear and descriptive**
4. **Push command**: `git push -u origin <branch-name>`
5. **Branch name must start with `claude/` and match session ID** (403 error otherwise)

### Commit Conventions

- Use descriptive, action-oriented commit messages
- Examples:
  - "Add complete HTML structure to index.html"
  - "Update contact form with validation"
  - "Fix responsive layout for mobile devices"
  - "Add meta tags for SEO optimization"

### Network Retry Policy

For `git push`, `git fetch`, `git pull`:
- Retry up to 4 times on network errors
- Use exponential backoff: 2s, 4s, 8s, 16s

---

## Key Conventions & Guidelines

### HTML/CSS Conventions

1. **Single-File Architecture**: All HTML, CSS, and JS in one file
2. **No External Dependencies**: No frameworks, libraries, or external resources
3. **Semantic HTML**: Use proper section tags (`<section>`, `<header>`, `<footer>`)
4. **CSS Methodology**: Embedded in `<style>` tag, class-based styling
5. **Responsive Design**: Must work on desktop and mobile (viewport meta tag required)

### Styling Patterns

- **CSS Classes Used**:
  - `.container` - Main content wrapper
  - `.services-grid` - Grid layout for service cards
  - `.service-card` - Individual service display
  - `.kpi-grid` - Dashboard KPI display
  - `.contact-form` - Contact form styling
  - `.footer-links` - Footer navigation

### Content Guidelines

1. **Compliance-First**: Emphasize GDPR, EU AI Act, NIS2 compliance
2. **EU Focus**: All references to cloud hosting should be EU-based
3. **Professional Tone**: Business-to-business (B2B) language
4. **Email Contact**: contact@xerionlab.eu
5. **Company Legal Name**: XERION LAB OÜ

### Form Handling

- Contact form uses `mailto:` action (not ideal for production)
- GDPR consent checkbox required
- Fields: name, email, message

---

## Technical Stack

### Technologies

- **HTML5**: Markup (currently incomplete)
- **CSS3**: Styling (embedded)
- **Vanilla JavaScript**: Minimal interactivity

### Features

- Page fade-in animation on load
- Anchor navigation (internal links to sections)
- Responsive grid layouts
- Form validation (basic HTML5)

### External References

- `assets/ComplianceKit.pdf` - Referenced but not present in repository

---

## Development Tasks & Priorities

### Immediate Priorities (Critical)

1. **Fix HTML Structure**: Add missing DOCTYPE, html, head, body tags
2. **Add Meta Tags**: SEO, viewport, charset, description
3. **Add Page Title**: Descriptive title for browser tab/SEO
4. **Test Rendering**: Ensure page displays correctly

### High Priority

5. **Create Missing Assets**: `assets/ComplianceKit.pdf` (or remove references)
6. **Form Handling**: Replace mailto with proper backend/service
7. **Accessibility**: Add ARIA labels, alt text for icons (emoji icons)
8. **Mobile Testing**: Ensure responsive design works

### Medium Priority

9. **SEO Optimization**: Structured data, Open Graph tags
10. **Performance**: Optimize any images (currently none visible)
11. **Analytics**: Add tracking if needed
12. **Documentation**: README.md with project info

### Low Priority

13. **CSS Organization**: Consider external stylesheet if file grows
14. **JavaScript Enhancement**: Progressive enhancement features
15. **Multilingual Support**: The site mentions multilingual services but is English-only

---

## AI Assistant Guidelines

### When Working on This Repository

1. **Always check and fix the HTML structure first** before making content changes
2. **Preserve the single-file architecture** unless explicitly asked to restructure
3. **Maintain EU compliance focus** in all content additions
4. **Test changes locally** if possible before committing
5. **Ask before adding external dependencies** (libraries, frameworks, CDNs)
6. **Keep styling consistent** with existing CSS patterns
7. **Document any new sections** in this CLAUDE.md file

### Before Making Changes

- Read `index.html` completely to understand current state
- Check if HTML structure fix has been applied
- Verify current git branch is correct `claude/` branch
- Understand the business context (B2B AI services, EU market)

### After Making Changes

- Validate HTML structure (DOCTYPE through closing tags)
- Check for broken internal links
- Ensure GDPR compliance references remain intact
- Update CLAUDE.md if adding new sections or features
- Commit with clear, descriptive messages
- Push to correct `claude/` branch

### Common Tasks

**Adding a new section:**
```html
<section id="new-section" class="container">
  <h2>Section Title</h2>
  <p>Section content...</p>
</section>
```

**Adding navigation link:**
```html
<!-- In header/footer -->
<a href="#new-section">New Section</a>
```

**Styling new components:**
```css
/* Add to embedded <style> tag */
.new-component {
  /* styles */
}
```

---

## Deployment Considerations

### Hosting Requirements

- **Static hosting** (no server-side processing needed)
- **EU-based servers** (align with company compliance messaging)
- Suggested platforms: Netlify, Vercel, GitHub Pages, or EU cloud providers

### Domain & SSL

- Domain: xerionlab.eu (implied from email)
- SSL required (standard for contact forms)

### File Structure for Deployment

```
/
├── index.html          # Main page
└── assets/
    └── ComplianceKit.pdf   # Download resource (to be created)
```

---

## Testing Checklist

Before considering work complete:

- [ ] HTML validates (W3C validator)
- [ ] All internal links work
- [ ] Contact form submits correctly
- [ ] Page loads without console errors
- [ ] Responsive design works on mobile
- [ ] All sections display correctly
- [ ] Footer copyright year is current (2025)
- [ ] GDPR checkbox functions properly
- [ ] External links open correctly

---

## Contact & Support

**Company**: XERION LAB OÜ
**Email**: contact@xerionlab.eu
**Location**: EU (Estonia, based on OÜ designation)
**Repository Owner**: Cristob777

---

## Version History

- **v1.0** (2025-12-02): Initial CLAUDE.md creation
  - Documented incomplete HTML structure issue
  - Established development workflows
  - Defined conventions and guidelines

---

## Notes for Future Development

### Potential Enhancements

1. **Backend Integration**: Replace mailto form with proper API
2. **CMS Integration**: Allow non-technical content updates
3. **Analytics Dashboard**: Track visitor engagement
4. **Blog Section**: Content marketing for AI/compliance topics
5. **Case Studies**: Showcase successful implementations
6. **Multi-language**: Add language switcher for EU market
7. **Dark Mode**: Toggle for user preference
8. **Interactive Demos**: Show AI capabilities
9. **Resource Library**: Whitepapers, guides, compliance docs
10. **Client Portal**: Login area for existing customers

### Scalability Considerations

If the site grows beyond single-page:
- Split into multiple HTML pages
- Extract CSS to external stylesheet(s)
- Extract JS to external file(s)
- Implement build process (e.g., npm, webpack)
- Add templating system
- Consider static site generator (Hugo, Jekyll, 11ty)

---

## Quick Reference Commands

```bash
# Check current branch
git branch

# View file structure
ls -la

# Check git status
git status

# Stage and commit changes
git add index.html CLAUDE.md
git commit -m "Descriptive message"

# Push to feature branch
git push -u origin claude/claude-md-mip2idakt0xsalm9-01VUNjKKsqaottcJvRPtc1v3

# View recent commits
git log --oneline -10
```

---

**Last Updated**: 2025-12-02
**Maintained By**: AI Assistants working on Xerion-Lab repository
**Status**: Active Development
