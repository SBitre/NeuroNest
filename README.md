# NeuroNest

An AI-powered productivity hub for tracking habits, managing tasks, monitoring mood, and getting personalized productivity insights.

**Author:** Sumukh Pitre
**Course:** Web Design and Development
**Institution:** Northeastern University

## Project Stages

- **Week 1–2:** HTML5 structure across 11 pages ✅
- **Week 2–3:** CSS3 styling — global theme + page-specific layouts ✅
- **Week 4–5:** JavaScript interactivity — LocalStorage persistence, working timer, theme toggle, form validation, dynamic stats ✅
- **Optional:** Gemini API integration for AI Assistant (Week 5+)

## Pages

`index.html` · `dashboard.html` · `habits.html` · `tasks.html` · `focus.html` · `mood.html` · `analytics.html` · `ai-assistant.html` · `goals.html` · `about.html` · `contact.html`

## File Structure
NeuroNest/

├── *.html              # 11 pages

├── css/

│   ├── styles.css      # Global theme + components

│   ├── dashboard.css   # grid-template-areas layout

│   ├── focus.css       # Timer ring

│   ├── analytics.css   # Stat cards + podium

│   ├── mood.css        # Emoji selector

│   └── tasks.css       # Priority badges

├── js/

│   ├── store.js        # LocalStorage data layer

│   ├── common.js       # Theme toggle + active nav

│   ├── dashboard.js

│   ├── habits.js

│   ├── tasks.js

│   ├── focus.js

│   ├── mood.js

│   ├── goals.js

│   ├── analytics.js

│   └── contact.js

└── docs/

├── Week1.md

├── Week2.md

├── Week3.md

└── Week4.md

## Running Locally

Open `index.html` in any modern browser, or use the VS Code "Live Server" extension for auto-reload during development.

## Reset Data

To clear all stored data, open browser DevTools console and run:
```js
NN.store.reset(); location.reload();
```