/* Tasks page - add, complete, delete tasks */
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('.task-table tbody');
  const form = document.querySelector('.task-form');
  if (!tbody || !form) return;

  const statusIcon = task => {
    if (task.done) return '✅';
    if (!task.due) return '📅';
    const dueDate = new Date(task.due);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDate < today) return '⚠️';
    return '⏳';
  };

  const render = () => {
    const state = NN.store.get();
    if (!state.tasks.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">No tasks. Add one below.</td></tr>';
      return;
    }
    tbody.innerHTML = state.tasks.map(t => {
      const dueDisplay = t.due ? new Date(t.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
      const taskText = t.done ? `<del>${t.name}</del>` : t.name;
      return `
        <tr data-id="${t.id}">
          <td><input type="checkbox" data-toggle="${t.id}" ${t.done ? 'checked' : ''} title="Mark complete"></td>
          <td>${taskText}
            <button type="button" data-delete="${t.id}"
              style="float:right;padding:0.2rem 0.5rem;font-size:0.75rem;background:transparent;color:var(--text-muted);border:1px solid var(--glass-border);">×</button>
          </td>
          <td><span class="badge badge-${t.priority}">${t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}</span></td>
          <td>${dueDisplay}</td>
          <td>${t.category || '—'}</td>
        </tr>
      `;
    }).join('');
  };

  tbody.addEventListener('change', e => {
    if (!e.target.matches('[data-toggle]')) return;
    const id = e.target.dataset.toggle;
    NN.store.set(s => {
      const t = s.tasks.find(t => t.id === id);
      if (t) t.done = e.target.checked;
    });
    render();
  });

  tbody.addEventListener('click', e => {
    if (!e.target.matches('[data-delete]')) return;
    if (!confirm('Delete this task?')) return;
    const id = e.target.dataset.delete;
    NN.store.set(s => { s.tasks = s.tasks.filter(t => t.id !== id); });
    render();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('task-name').value.trim();
    if (!name) { alert('Please enter a task description.'); return; }

    const category = form.querySelector('input[name="task-category"]:checked')?.value || '';
    NN.store.set(s => {
      s.tasks.unshift({
        id: NN.store.uid(),
        name,
        priority: document.getElementById('task-priority').value,
        due: document.getElementById('task-due').value,
        category,
        notes: document.getElementById('task-notes').value.trim(),
        done: false,
        createdAt: Date.now()
      });
    });
    form.reset();
    render();
  });

  render();
});