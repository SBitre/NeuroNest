# NeuroNest

An AI-powered productivity hub for tracking habits, managing tasks, monitoring mood, and getting personalized productivity insights powered by Google Gemini.

**Author:** Sumukh Pitre
**Course:** Web Design and Development
**Institution:** Northeastern University

## Features

- 11 fully interactive pages
- Dark/light theme toggle with persistence
- LocalStorage-backed habits, tasks, moods, goals, focus sessions
- Working Pomodoro timer with session logging
- Chart.js visualizations of weekly trends
- AI Assistant powered by Google Gemini with personalized context
- CSV/JSON data export
- Vim-style keyboard navigation (press `?` for help)
- First-visit onboarding tour
- Inline form validation
- Print stylesheet
- Mobile responsive
- Accessibility: `prefers-reduced-motion`, visible focus rings

## Project Stages

- **Week 1–2:** HTML5 structure across 11 pages ✅
- **Week 2–3:** CSS3 styling — global theme + page-specific layouts ✅
- **Week 4–5:** JavaScript — interactivity, LocalStorage, Gemini AI, charts, exports, shortcuts, onboarding ✅

## Setup (For Gemini AI)

1. Get a Gemini API key from https://aistudio.google.com/
2. Copy `js/config.example.js` to `js/config.js`
3. Paste your key into the `GEMINI_API_KEY` field
4. `js/config.js` is in `.gitignore` and will not be committed

Without an API key, the AI Assistant page still loads — it just shows an error message when you ask a question.

## File Structure
NeuroNest/

├── *.html              # 11 pages

├── css/

│   ├── styles.css      # Global theme + components

│   ├── dashboard.css

│   ├── focus.css

│   ├── analytics.css

│   ├── mood.css

│   ├── tasks.css

│   └── ai-assistant.css

├── js/

│   ├── config.example.js  # Template for API key

│   ├── store.js           # LocalStorage layer

│   ├── common.js          # Theme + active nav

│   ├── utils.js           # CSV/JSON export, shortcuts, notifications

│   ├── onboarding.js      # First-visit tour

│   ├── dashboard.js

│   ├── habits.js

│   ├── tasks.js

│   ├── focus.js

│   ├── mood.js

│   ├── goals.js

│   ├── analytics.js       # Includes Chart.js rendering

│   ├── contact.js

│   └── ai-assistant.js    # Gemini integration

└── docs/

├── Week1.md

├── Week2.md

├── Week3.md

├── Week4.md

└── Week5.md

## Keyboard Shortcuts

Press `?` anywhere to see the full list. Quick reference:
- `g d` Dashboard · `g h` Habits · `g t` Tasks · `g f` Focus
- `g m` Mood · `g a` Analytics · `g i` AI Assistant
- `Ctrl/Cmd + Enter` Submit AI question

## Reset Data

In the browser DevTools console:
```js
NN.store.reset(); location.reload();
```

## Running Locally

Open `index.html` in any modern browser, or use the VS Code "Live Server" extension.