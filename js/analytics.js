/* Analytics - aggregates + Chart.js visualizations */
document.addEventListener('DOMContentLoaded', () => {
  const state = NN.store.get();
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  // === Aggregate stats (same as Week 4) ===
  const weekSessions = state.focus.sessions.filter(s => s.completedAt >= weekAgo.getTime());
  const totalFocusMin = weekSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalH = Math.floor(totalFocusMin / 60);
  const totalM = totalFocusMin % 60;

  const weekDates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    weekDates.push(d.toISOString().slice(0, 10));
  }

  let habitsDone = 0;
  const habitsPossible = state.habits.length * 7;
  state.habits.forEach(h => {
    weekDates.forEach(d => { if (h.completions[d]) habitsDone++; });
  });

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

  // === Top performing days ===
  const dayStats = weekDates.map(d => {
    const habits = state.habits.filter(h => h.completions[d]).length;
    const focus = state.focus.sessions
      .filter(s => new Date(s.completedAt).toISOString().slice(0, 10) === d)
      .reduce((sum, s) => sum + s.duration, 0);
    return { date: d, habits, focus, score: habits * 10 + focus };
  });

  const top3 = dayStats.slice().sort((a, b) => b.score - a.score).slice(0, 3);
  const podium = document.querySelector('.podium');
  if (podium) {
    podium.innerHTML = top3.filter(d => d.score > 0).map(d => {
      const dayName = new Date(d.date).toLocaleDateString('en-US', { weekday: 'long' });
      return `<li>${dayName} — ${(d.focus / 60).toFixed(1)}h focus, ${d.habits}/${state.habits.length} habits</li>`;
    }).join('') || '<li style="color:var(--text-muted)">No data yet this week.</li>';
  }

  // === Charts ===
  if (typeof Chart === 'undefined') return;

  Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
  Chart.defaults.borderColor = 'rgba(255,255,255,0.08)';

  const dayLabels = weekDates.map(d =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short' })
  );

  // Focus minutes per day - line chart
  const focusByDay = weekDates.map(d =>
    state.focus.sessions
      .filter(s => new Date(s.completedAt).toISOString().slice(0, 10) === d)
      .reduce((sum, s) => sum + s.duration, 0)
  );

  const focusCanvas = document.getElementById('chart-focus');
  if (focusCanvas) {
    new Chart(focusCanvas, {
      type: 'line',
      data: {
        labels: dayLabels,
        datasets: [{
          label: 'Focus minutes',
          data: focusByDay,
          borderColor: '#00f0ff',
          backgroundColor: 'rgba(0, 240, 255, 0.15)',
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#00f0ff',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 30 } }
        }
      }
    });
  }

  // Habits completed per day - bar chart
  const habitsByDay = weekDates.map(d =>
    state.habits.filter(h => h.completions[d]).length
  );

  const habitsCanvas = document.getElementById('chart-habits');
  if (habitsCanvas) {
    new Chart(habitsCanvas, {
      type: 'bar',
      data: {
        labels: dayLabels,
        datasets: [{
          label: 'Habits completed',
          data: habitsByDay,
          backgroundColor: 'rgba(177, 77, 255, 0.5)',
          borderColor: '#b14dff',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: state.habits.length || 1, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  // Mood over time - line chart
  const moodByDay = weekDates.map(d => {
    const dayMoods = state.moods.filter(m =>
      new Date(m.createdAt).toISOString().slice(0, 10) === d
    );
    if (!dayMoods.length) return null;
    const avg = dayMoods.reduce((s, m) => s + (moodScores[m.mood] || 5), 0) / dayMoods.length;
    return avg;
  });

  const moodCanvas = document.getElementById('chart-mood');
  if (moodCanvas) {
    new Chart(moodCanvas, {
      type: 'line',
      data: {
        labels: dayLabels,
        datasets: [{
          label: 'Mood score',
          data: moodByDay,
          borderColor: '#ff4dcb',
          backgroundColor: 'rgba(255, 77, 203, 0.15)',
          tension: 0.4,
          fill: true,
          spanGaps: true,
          pointBackgroundColor: '#ff4dcb',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 10 }
        }
      }
    });
  }
});