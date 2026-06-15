/* NeuroNest data store - LocalStorage wrapper */
(function () {
  const KEY = 'neuronest:v1';
  const DEFAULTS = {
    habits: [
      { id: 'h1', name: 'Drink 8 glasses of water', frequency: 'daily', category: 'health', createdAt: 0, completions: {} },
      { id: 'h2', name: 'Read 30 minutes', frequency: 'daily', category: 'learning', createdAt: 0, completions: {} },
      { id: 'h3', name: 'Exercise', frequency: 'daily', category: 'health', createdAt: 0, completions: {} },
      { id: 'h4', name: 'Meditate', frequency: 'daily', category: 'mindfulness', createdAt: 0, completions: {} }
    ],
    tasks: [
      { id: 't1', name: 'Finish CSS3 styling for NeuroNest', priority: 'high', due: '2026-06-04', category: 'study', done: false, createdAt: 0 },
      { id: 't2', name: 'Apply to 5 co-op postings', priority: 'medium', due: '2026-06-05', category: 'career', done: false, createdAt: 0 },
      { id: 't3', name: 'Review AWS SAA practice exam', priority: 'medium', due: '2026-06-07', category: 'study', done: false, createdAt: 0 }
    ],
    moods: [
      { id: 'm1', mood: 'good', energy: 7, journal: 'Productive day', createdAt: Date.parse('2026-05-27') },
      { id: 'm2', mood: 'great', energy: 9, journal: 'Finished project', createdAt: Date.parse('2026-05-26') },
      { id: 'm3', mood: 'okay', energy: 5, journal: 'Tired', createdAt: Date.parse('2026-05-25') }
    ],
    goals: [
      { id: 'g1', name: 'Read 12 books this year', target: 12, progress: 4, category: 'personal', deadline: '2026-12-31' },
      { id: 'g2', name: 'Run a 5K', target: 100, progress: 60, category: 'health', deadline: '2026-09-30' }
    ],
    dailyGoals: ['Complete NeuroNest Week 4 submission', 'Finish 2 focus sessions', 'Exercise for 30 minutes'],
    focus: {
      sessions: [
        { duration: 25, completedAt: Date.now() - 3600000 },
        { duration: 25, completedAt: Date.now() - 7200000 },
        { duration: 25, completedAt: Date.now() - 10800000 }
      ],
      settings: { work: 25, break: 5, sessions: 4 }
    },
    theme: 'dark'
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(DEFAULTS);
      const parsed = JSON.parse(raw);
      return { ...structuredClone(DEFAULTS), ...parsed };
    } catch (e) {
      console.error('Store load failed:', e);
      return structuredClone(DEFAULTS);
    }
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.error('Store save failed:', e); }
  }

  function set(updater) {
    const state = load();
    updater(state);
    save(state);
    return state;
  }

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const todayKey = () => new Date().toISOString().slice(0, 10);

  window.NN = window.NN || {};
  window.NN.store = {
    get: load,
    set,
    reset: () => localStorage.removeItem(KEY),
    uid,
    todayKey
  };
})();