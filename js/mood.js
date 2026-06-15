/* Mood page - log mood + render history from store */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const historyBody = document.querySelectorAll('tbody')[document.querySelectorAll('tbody').length - 1];
  if (!form) return;

  const moodMap = {
    great: '😄 Great', good: '🙂 Good', okay: '😐 Okay',
    low: '😔 Low', stressed: '😰 Stressed'
  };

  const renderHistory = () => {
    if (!historyBody) return;
    const moods = NN.store.get().moods
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);
    if (!moods.length) {
      historyBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No entries yet.</td></tr>';
      return;
    }
    historyBody.innerHTML = moods.map(m => {
      const date = new Date(m.createdAt);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `
        <tr>
          <td><time datetime="${date.toISOString().slice(0, 10)}">${label}</time></td>
          <td>${moodMap[m.mood] || m.mood}</td>
          <td>${m.energy}</td>
          <td>${m.journal || '—'}</td>
        </tr>
      `;
    }).join('');
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const mood = form.querySelector('input[name="mood"]:checked')?.value;
    if (!mood) { alert('Please select a mood.'); return; }

    const energy = parseInt(document.getElementById('energy').value);
    const journal = document.getElementById('journal').value.trim();

    NN.store.set(s => {
      s.moods.unshift({
        id: NN.store.uid(),
        mood, energy, journal,
        createdAt: Date.now()
      });
    });
    form.reset();
    document.getElementById('energy').value = 5;
    renderHistory();
    alert('Mood saved! 💙');
  });

  renderHistory();
});