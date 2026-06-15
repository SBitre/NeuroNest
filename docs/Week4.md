NeuroNest — Project Documentation (Week 4)
Author: Sumukh Pitre
Course: Web Design and Development
Date: June 15, 2026

1. WEEK 4 SCOPE
Week 4 introduces the JavaScript interactivity layer across all 11 pages,
turning the static HTML/CSS site into a working productivity application
with persistent state.

2. JAVASCRIPT ARCHITECTURE
- js/store.js — LocalStorage data store with versioned key, defaults seeding,
  CRUD helpers (get, set, reset, uid, todayKey). Single source of truth.
- js/common.js — Theme toggle (dark/light) and active nav highlighting,
  runs on every page.
- js/dashboard.js — Reads from store, renders dynamic today-stats and
  data-driven AI tip rotation.
- js/habits.js — Habit CRUD, weekly grid checkbox rendering, streak
  calculation across stored completion dates.
- js/tasks.js — Task CRUD with priority badges, due-date status icons,
  toggle completion with strikethrough.
- js/focus.js — Working Pomodoro timer: countdown logic, work/break
  alternation, multi-session tracking, settings persistence, sidebar
  stats from completed sessions.
- js/mood.js — Mood entry with required-field validation, dynamic
  history table rendering.
- js/goals.js — Daily goals with quick-remove + long-term goals with
  +/- progress increment buttons and dynamic progress bars.
- js/analytics.js — Computes weekly aggregates: focus hours, habit
  completion rate, mood average, top-3 performing days.
- js/contact.js — Inline form validation (name length, email regex,
  message length) with clear-on-input UX.

3. CORE JAVASCRIPT FEATURES USED
- DOM manipulation: querySelector, addEventListener, dataset attributes
- Event delegation on table tbody for dynamic checkbox/button handling
- LocalStorage API for client-side persistence (versioned key: neuronest:v1)
- JSON serialization and structuredClone for state copies
- Template literals for HTML rendering
- Arrow functions, destructuring, spread operators
- Date manipulation: toISOString, toLocaleDateString, weekday math
- Array methods: filter, map, reduce, sort, slice
- setInterval/clearInterval for timer logic
- Form submission preventDefault and validation
- IIFE pattern in store.js to encapsulate module
- window.NN global namespace for cross-file communication

4. LOCALSTORAGE SCHEMA
{
  habits: [{ id, name, frequency, category, completions: {date: true} }],
  tasks: [{ id, name, priority, due, category, done }],
  moods: [{ id, mood, energy, journal, createdAt }],
  goals: [{ id, name, target, progress, deadline, category }],
  dailyGoals: [string],
  focus: { sessions: [{ duration, completedAt }], settings: {} },
  theme: 'dark' | 'light'
}

5. THEME TOGGLE WIRING
The light theme palette was already defined in CSS as [data-theme="light"]
overrides on :root during Week 3. Week 4 wires the toggle:
common.js reads theme from store, sets data-theme on <html>, injects
a button into the header that flips the value and saves it. All CSS
variables cascade automatically — zero CSS changes needed for the toggle
itself, only minor light-theme polish for header/footer hardcoded rgba.

6. DATA-DRIVEN AI TIP
dashboard.js inspects current state (habit completion ratio, focus
minutes today, latest mood) and rotates the AI tip text accordingly.
Sets foundation for real LLM integration in Week 5+.

7. NEXT STEPS (Week 5)
- Integrate Google Gemini API for the AI Assistant page
- Add chart visualization on analytics (Chart.js or vanilla canvas)
- Browser notifications for habit reminders and timer completion
- Export data as CSV/JSON
- Keyboard shortcuts for power users