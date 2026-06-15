/* Goals page - daily goals + long-term progress */
document.addEventListener('DOMContentLoaded', () => {
  const dailyList = document.querySelector('section ol');
  const form = document.querySelector('form');
  const longTermSection = document.querySelectorAll('section')[2];
  if (!form) return;

  const renderDaily = () => {
    if (!dailyList) return;
    const goals = NN.store.get().dailyGoals;
    dailyList.innerHTML = goals.map((g, i) =>
      `<li>${g} <button type="button" data-remove-daily="${i}" style="float:right;background:transparent;color:var(--text-muted);border:none;cursor:pointer;">×</button></li>`
    ).join('') || '<li style="color:var(--text-muted)">No daily goals set.</li>';
  };

  const renderLongTerm = () => {
    if (!longTermSection) return;
    const goals = NN.store.get().goals;
    const articles = goals.map(g => {
      const pct = Math.min(100, Math.round((g.progress / g.target) * 100));
      return `
        <article data-id="${g.id}">
          <h3>${g.name}
            <button type="button" data-delete-goal="${g.id}" style="float:right;background:transparent;color:var(--text-muted);border:none;cursor:pointer;font-size:1.2rem;">×</button>
          </h3>
          <progress value="${g.progress}" max="${g.target}">${pct}%</progress>
          <p style="margin-top:0.5rem;">
            <button type="button" data-progress="${g.id}" data-delta="-1" class="btn-ghost" style="padding:0.25rem 0.75rem;font-size:0.85rem;">−</button>
            <span style="margin:0 0.75rem;">${g.progress} / ${g.target}</span>
            <button type="button" data-progress="${g.id}" data-delta="1" style="padding:0.25rem 0.75rem;font-size:0.85rem;">+</button>
          </p>
        </article>
      `;
    }).join('');
    const h2 = longTermSection.querySelector('h2');
    longTermSection.innerHTML = '';
    longTermSection.appendChild(h2);
    longTermSection.insertAdjacentHTML('beforeend', articles);
  };

  document.body.addEventListener('click', e => {
    if (e.target.matches('[data-remove-daily]')) {
      const i = parseInt(e.target.dataset.removeDaily);
      NN.store.set(s => s.dailyGoals.splice(i, 1));
      renderDaily();
    }
    if (e.target.matches('[data-delete-goal]')) {
      if (!confirm('Delete this goal?')) return;
      const id = e.target.dataset.deleteGoal;
      NN.store.set(s => { s.goals = s.goals.filter(g => g.id !== id); });
      renderLongTerm();
    }
    if (e.target.matches('[data-progress]')) {
      const id = e.target.dataset.progress;
      const delta = parseInt(e.target.dataset.delta);
      NN.store.set(s => {
        const g = s.goals.find(g => g.id === id);
        if (g) g.progress = Math.max(0, Math.min(g.target, g.progress + delta));
      });
      renderLongTerm();
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('goal').value.trim();
    if (!name) { alert('Please enter a goal.'); return; }
    const deadline = document.getElementById('deadline').value;
    const category = document.getElementById('category-goal').value;

    NN.store.set(s => {
      s.goals.push({
        id: NN.store.uid(),
        name, deadline, category,
        target: 100, progress: 0
      });
    });
    form.reset();
    renderLongTerm();
  });

  renderDaily();
  renderLongTerm();
});