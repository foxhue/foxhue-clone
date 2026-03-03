# Foxhue Clone — Webflow Recreation Experiment

## Overview
A code-only recreation of the Foxhue 2026 Webflow site, built to test how closely we can replicate a Webflow-designed page using hand-written HTML, CSS, and JavaScript.

**Reference**: https://foxhue-2026.webflow.io/
**Clone**: https://foxhue.github.io/foxhue-clone/

## Repo Structure
```
foxhue-clone/
├── CLAUDE.md
├── .github/
│   └── workflows/
│       └── pages.yml         ← GitHub Pages deployment
├── index.html                ← single-page site (~37KB)
├── styles.css                ← all styles with CSS custom properties (~30KB)
└── script.js                 ← GSAP/Lenis animations and interactions (~18KB)
```

## Tech Stack
- **HTML/CSS/JS** — no build tools, no frameworks
- **GSAP 3.13** + **ScrollTrigger** — scroll-driven animations, text reveals, stacking cards
- **Lenis 1.3.4** — smooth scroll with lerp
- **Google Fonts** — Anton (display), DM Sans (body), Playfair Display (accent)

### CDN Dependencies
```html
<script src="https://unpkg.com/lenis@1.3.4/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
```

## Brand Tokens
```css
--color-primary: #E8220B;        /* red */
--color-primary-dark: #C41B08;
--color-primary-light: #FF4D35;
--color-bg: #FFFFFF;
--color-bg-cream: #F0E8DC;
--color-bg-dark: #0A0A0A;
--color-text: #1A1A1A;
--font-display: 'Anton', sans-serif;
--font-body: 'DM Sans', sans-serif;
--font-accent: 'Playfair Display', serif;
```

## Page Sections
| Section | Description |
|---------|-------------|
| Preloader | Character-by-character "STUDIO" reveal |
| Hero | Full-viewport intro with animated headline |
| About | "Inside the Studio" with content cards |
| Process | Workflow/methodology showcase |
| Works | Portfolio/case studies with stacking card effect |
| Marquee | Dark background scrolling text band |
| Services | Service offerings grid |
| Play Reel | Video/showreel CTA section |
| Trusted | Client logos or trust indicators |
| Testimonials | Client quotes carousel |
| CTA | Contact call-to-action |
| Footer | Site footer with links |

## Animation Techniques
- **Clip-masked text reveals** — characters animate in on scroll
- **Stacking cards** — portfolio items stack as user scrolls
- **Floating badges** — decorative elements with parallax
- **Character stagger** — menu links animate letter-by-letter
- **Smooth scroll** — Lenis handles momentum and lerp

## Deployment
- **Branch**: `main`
- **GitHub Pages**: Deployed via `.github/workflows/pages.yml`
- **URL**: https://foxhue.github.io/foxhue-clone/

## Architecture Notes
- Single-page, no routing — all content in `index.html`
- No build step — edit and push
- CSS custom properties at `:root` level for easy theming
- All animations in `script.js`, initialised on `DOMContentLoaded`
- No local images — all visuals are CSS gradients and decorative elements
