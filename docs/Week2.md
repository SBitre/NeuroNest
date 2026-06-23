NeuroNest — Project Documentation (Week 2)
Author: Sumukh Pitre
Course: Web Design and Development
Date: June 2, 2026

1. WEEK 2 SCOPE
Week 2 focused on completing the HTML5 layer and introducing CSS3 styling
as defined in the original project plan.

2. HTML5 IMPROVEMENTS
- Fixed tasks.html (was an accidental duplicate of habits.html) and built
  out a real Task Manager page with priority, due dates, categories,
  and a completed-tasks history.
- Standardized navigation across all 11 pages so every page links to
  every other page.
- Added meta description tags and viewport meta to every page.
- Added <del> tag for completed/strikethrough items, plus more
  consistent use of <time>, <mark>, <address>.

3. CSS3 INTRODUCED
A single global stylesheet (css/styles.css) applied to all 11 pages.
Theme: futuristic dark with neon cyan/purple accents and glassmorphism cards.

Key CSS3 features used:
- CSS custom properties (variables) for the entire color palette
- Linear and radial gradients (background + buttons + headings)
- backdrop-filter: blur() for glassmorphism on header, sections, footer
- Flexbox for nav and forms
- CSS Grid (auto-fit + minmax) for the responsive features section
- Transitions on hover for sections, articles, buttons, nav links
- @keyframes animations (fadeInUp on section load, neonPulse)
- Pseudo-elements and pseudo-classes (:hover, :focus, ::-webkit-progress-value)
- Vendor-prefixed progress/meter styling for cross-browser consistency
- background-clip: text for gradient text effects on headings
- Media queries for mobile responsiveness (<= 768px)
- Sticky positioning on header
- accent-color for native form controls

4. DISTINGUISHED FEATURES
- Glassmorphic card system using backdrop-filter
- Gradient text headings via background-clip
- Neon glow hover states on nav and buttons
- Staggered fade-in animation on page load
- Custom-styled progress bars and meters
- Mobile-first responsive layout

5. NEXT WEEK (Week 3)
- Refine CSS responsiveness across all screen sizes
- Add subtle micro-interactions
- Begin planning JavaScript layer (timer, form validation, dynamic data)