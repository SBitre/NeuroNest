NeuroNest — Project Documentation (Week 5)
Author: Sumukh Pitre
Course: Web Design and Development
Date: June 22, 2026

1. WEEK 5 SCOPE
Week 5 completes the JavaScript layer with AI integration, data
visualization, export capabilities, keyboard navigation, and
first-time user onboarding. This is the final feature submission.

2. GEMINI AI INTEGRATION
- js/ai-assistant.js sends user questions to Google Gemini (gemini-2.5-flash)
  via REST API, with a context summary of the user's actual NeuroNest data
  (habits today, focus minutes this week, mood average, open tasks, goals).
- Responses appear in a streaming-style chat log below the form.
- Top 5 successful AI responses are saved to LocalStorage and displayed
  in the "Recent Suggestions" sidebar.
- The three "Personalized Insights" cards now compute dynamically:
  peak-hour from focus session timestamps, mood trend assessment,
  and the habit with the fewest completions.
- API key lives in js/config.js (gitignored) — never committed to GitHub.
- Error handling: graceful fallback if key missing, network error, or
  API rejects the request.
- Submit shortcut: Ctrl/Cmd+Enter.

3. CHART.JS VISUALIZATIONS (ANALYTICS PAGE)
Three interactive charts pull from LocalStorage:
- Focus minutes per day — line chart with cyan gradient fill
- Habits completed per day — purple bar chart capped at habits.length
- Mood score per day — pink line chart with spanGaps for missing days
Chart defaults configured to match the dark theme via CSS custom properties.

4. DATA EXPORT
js/utils.js provides:
- CSV export for habits, tasks, moods, focus sessions (each as separate file)
- Full JSON backup of entire LocalStorage state
- Export menu lives in the Analytics page header
- Pure client-side using Blob + URL.createObjectURL — no backend needed

5. KEYBOARD SHORTCUTS
Vim-style 'g' + letter navigation across all pages:
g d → Dashboard, g h → Habits, g t → Tasks, g f → Focus,
g m → Mood, g a → Analytics, g i → AI Assistant
Press ? from anywhere to toggle a help modal listing all shortcuts.
Input fields are excluded so shortcuts don't fire while typing.

6. ONBOARDING TOUR
js/onboarding.js shows a 7-step welcome tour on first visit to index
or dashboard. Tour state persists in LocalStorage as
onboardingComplete: true so it never reappears for returning users.
Tour can be re-triggered for testing by running:
  NN.store.set(s => delete s.onboardingComplete); location.reload();

7. NEW JAVASCRIPT TECHNIQUES IN WEEK 5
- async/await with fetch() for REST API calls
- Promise error handling with try/catch
- Blob API and URL.createObjectURL for file downloads
- CSV serialization with proper quote-escaping
- Notification API permission flow (foundation for Week 6+ reminders)
- Multi-key sequence detection (vim-style g+letter shortcuts)
- Modal/overlay pattern with scoped event listeners
- Dynamic chart rendering with Chart.js 4.x
- Computed insights from time-series data (peak hour detection,
  weakest habit identification, mood trend analysis)

8. SECURITY NOTES
- API key kept in js/config.js, excluded via .gitignore
- js/config.example.js committed as template
- Aware that any client-side API key is exposed at runtime — for a
  production app, the right architecture is a backend proxy that holds
  the key and forwards requests. This is acceptable for a personal
  demo project but documented as a known limitation.

9. KNOWN LIMITATIONS & FUTURE WORK
- API key exposed in client (needs backend proxy for production)
- No multi-device sync (would need user accounts + cloud DB)
- Notifications API requested but not yet wired to habit reminders
- Charts could add zoom/pan with chartjs-plugin-zoom
- AI Assistant could maintain conversation history across multiple turns

10. PROJECT COMPLETION SUMMARY
- Week 1: 11 HTML5 pages with semantic tags
- Week 2: Initial CSS3 with glassmorphism theme
- Week 3: Page-specific CSS, advanced selectors, a11y, print styles
- Week 4: Full JavaScript interactivity, LocalStorage, theme toggle
- Week 5: AI integration, charts, exports, shortcuts, onboarding ✅