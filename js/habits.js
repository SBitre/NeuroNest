/* Habits page - add, complete, delete habits with streak calculation */
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('tbody');
  const form = document.querySelector('form');
  if (!tbody || !form) return;

  const todayStr = NN.store.todayKey();

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
  };

  const calcStreak = completions => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (completions[key]) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  const render = () => {
    const state = NN.store.get();
    const weekDates = getWeekDates();
    tbody.innerHTML = state.habits.map(h => {
      const cells = weekDates.map(d => {
        if (d > todayStr) return '<td>—</td>';
        const done = h.completions[d];
        return `<td><input type="checkbox" data-id="${h.id}" data-date="${d}" ${done ? 'checked' : ''}></td>`;
      }).join('');
      return `
        <tr>
          <td>${h.name}
            <button type="button" data-delete="${h.id}"
              style="float:right;padding:0.2rem 0.5rem;font-size:0.75rem;background:transparent;color:var(--text-muted);border:1px solid var(--glass-border);">×</button>
          </td>
          ${cells}
          <td>${calcStreak(h.completions)} 🔥</td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="9" style="text-align:center;color:var(--text-muted)">No habits yet. Add one below.</td></tr>';
  };

  tbody.addEventListener('change', e => {
    if (!e.target.matches('input[type="checkbox"]')) return;
    const { id, date } = e.target.dataset;
    NN.store.set(s => {
      const habit = s.habits.find(h => h.id === id);
      if (!habit) return;
      if (e.target.checked) habit.completions[date] = true;
      else delete habit.completions[date];
    });
    render();
  });

  tbody.addEventListener('click', e => {
    if (!e.target.matches('[data-delete]')) return;
    if (!confirm('Delete this habit?')) return;
    const id = e.target.dataset.delete;
    NN.store.set(s => { s.habits = s.habits.filter(h => h.id !== id); });
    render();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('habit-name').value.trim();
    if (!name) { alert('Please enter a habit name.'); return; }

    const category = form.querySelector('input[name="category"]:checked')?.value || '';
    NN.store.set(s => {
      s.habits.push({
        id: NN.store.uid(),
        name,
        frequency: document.getElementById('frequency').value,
        reminder: document.getElementById('reminder').value,
        category,
        createdAt: Date.now(),
        completions: {}
      });
    });
    form.reset();
    render();
  });

  render();
});