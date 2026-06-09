NeuroNest — Project Documentation (Week 3)
Author: Sumukh Pitre
Course: Web Design and Development
Date: June 9, 2026

1. WEEK 3 SCOPE
Week 3 deepened the CSS3 layer from Week 2 with page-specific layouts,
custom-styled form controls, a component-utility system, accessibility
improvements, and a print stylesheet.

2. CSS ARCHITECTURE
Refactored from a single stylesheet into a global stylesheet plus
page-specific stylesheets:
- css/styles.css — design tokens, reset, shared components
- css/dashboard.css — Dashboard
- css/focus.css — Focus timer
- css/analytics.css — Analytics
- css/mood.css — Mood tracker
- css/tasks.css — Task manager

3. NEW CSS3 FEATURES INTRODUCED (BEYOND WEEK 2)
- :has() relational selector — dims completed task rows in tasks.html
- :checked + sibling selector — fully custom mood-emoji radio buttons
- CSS Grid with grid-template-areas — Dashboard layout
- clamp() — fluid typography scale across all breakpoints
- aspect-ratio — consistent card sizing on feature/mood grids
- Multi-step @keyframes — neonPulse, shimmer, float, fadeInUp
- counter-reset / counter-increment — Top Days podium ranking
- background-clip: text — gradient text on stat values + headings
- Pseudo-element decorations — blockquote quote mark, stat-card glow
- transform: perspective() — subtle 3D tilt on article hover

4. ACCESSIBILITY ADDITIONS
- prefers-reduced-motion media query disables animations for users
  who need that
- :focus-visible rings with offset for keyboard navigation
- ARIA-friendly mood selector (radios visually hidden, not removed)
- Sufficient color contrast on neon text against dark background

5. THEMING SYSTEM
A complete light-theme palette is defined as [data-theme="light"]
overrides on :root, ready for a JS toggle in Week 4. All colors flow
from CSS variables, so theme switching will be one line of JS.

6. COMPONENT/UTILITY SYSTEM
Reusable utility classes:
- .btn, .btn-ghost, .btn-danger — button variants
- .badge, .badge-high, .badge-medium, .badge-low — priority pills
- .skeleton — shimmer loading state for Week 4 async content
- .stat-value, .podium, .mood-grid, .timer-ring — component classes

7. PAGE-SPECIFIC LAYOUTS
- Dashboard: 2-column grid-template-areas, collapses to single column < 640px
- Focus: large circular pulsing timer ring with gradient text display
- Analytics: stat-card grid with radial glow accents; podium-ranked top days
- Mood: emoji button grid with checked-state animation
- Tasks: priority badges; :has() dims completed rows

8. PRINT STYLESHEET
@media print hides nav/footer/buttons, removes glassmorphism, switches
to high-contrast black-on-white for clean printed reports.

9. NEXT WEEK (Week 4)
- JavaScript: working Pomodoro timer logic
- Form validation and dynamic task adding
- Light/dark theme toggle wired to existing CSS variables
- LocalStorage for habit/task/mood persistence