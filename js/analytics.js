/* Analytics - compute weekly stats from store */
document.addEventListener('DOMContentLoaded', () => {
  const state = NN.store.get();
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  // Focus time this week
  const weekSessions = state.focus.sessions.filter(s => s.completedAt >= weekAgo.getTime());
  const totalFocusMin = weekSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalH = Math.floor(totalFocusMin / 60);
  const totalM = totalFocusMin % 60;

  // Habits this week
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    weekDates.push(d.toISOString().slice(0, 10));
  }
  let habitsDone = 0;
  const habitsPossible = state.habits.length * 7;
  state.habits.forEach(h => {
    weekDates.forEach(d => { if (h.completions[d]) habitsDone++; });
  });

  // Mood average
  const weekMoods = state.moods.filter(m => m.createdAt >= weekAgo.getTime());
  const moodScores = { great: 10, good: 8, okay: 5, low: 3, stressed: 2 };
  const moodAvg = weekMoods.length
    ? (weekMoods.reduce((s, m) => s + (moodScores[m.mood] || 5), 0) / weekMoods.length).toFixed(1)
    : 'N/A';

  const cards = document.querySelectorAll('.stats-grid article');
  if (cards[0]) {
    cards[0].querySelector('.stat-value').textContent = `${totalH}h ${totalM}m`;
    cards[0].querySelector('meter').value = totalFocusMin;
  }
  if (cards[1]) {
    cards[1].querySelector('.stat-value').textContent = `${habitsDone} / ${habitsPossible || 1}`;
    cards[1].querySelector('progress').value = habitsDone;
    cards[1].querySelector('progress').max = habitsPossible || 1;
  }
  if (cards[2]) {
    cards[2].querySelector('.stat-value').textContent = moodAvg === 'N/A' ? 'N/A' : `${moodAvg} / 10`;
    cards[2].querySelector('meter').value = moodAvg === 'N/A' ? 0 : parseFloat(moodAvg);
  }

  // Top performing days
  const dayStats = weekDates.map(d => {
    const habits = state.habits.filter(h => h.completions[d]).length;
    const focus = state.focus.sessions
      .filter(s => new Date(s.completedAt).toISOString().slice(0, 10) === d)
      .reduce((sum, s) => sum + s.duration, 0);
    return { date: d, habits, focus, score: habits * 10 + focus };
  }).sort((a, b) => b.score - a.score).slice(0, 3);

  const podium = document.querySelector('.podium');
  if (podium) {
    podium.innerHTML = dayStats.filter(d => d.score > 0).map(d => {
      const dayName = new Date(d.date).toLocaleDateString('en-US', { weekday: 'long' });
      return `<li>${dayName} — ${(d.focus / 60).toFixed(1)}h focus, ${d.habits}/${state.habits.length} habits</li>`;
    }).join('') || '<li style="color:var(--text-muted)">No data yet this week.</li>';
  }
});