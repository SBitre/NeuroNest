/* Shared utilities - CSV export, notifications, keyboard shortcuts */
(function () {
  const arrayToCSV = arr => {
    if (!arr.length) return '';
    const keys = Object.keys(arr[0]);
    const escape = v => {
      if (v === null || v === undefined) return '';
      const str = typeof v === 'object' ? JSON.stringify(v) : String(v);
      return `"${str.replace(/"/g, '""')}"`;
    };
    const header = keys.join(',');
    const rows = arr.map(obj => keys.map(k => escape(obj[k])).join(','));
    return [header, ...rows].join('\n');
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const exportCSV = (type) => {
    const state = NN.store.get();
    const date = new Date().toISOString().slice(0, 10);
    let data, filename;

    switch (type) {
      case 'habits':
        data = state.habits.map(h => ({
          name: h.name,
          frequency: h.frequency,
          category: h.category,
          totalCompletions: Object.keys(h.completions).length
        }));
        filename = `neuronest-habits-${date}.csv`;
        break;
      case 'tasks':
        data = state.tasks.map(t => ({
          name: t.name,
          priority: t.priority,
          due: t.due,
          category: t.category,
          done: t.done
        }));
        filename = `neuronest-tasks-${date}.csv`;
        break;
      case 'moods':
        data = state.moods.map(m => ({
          date: new Date(m.createdAt).toISOString().slice(0, 10),
          mood: m.mood,
          energy: m.energy,
          journal: m.journal
        }));
        filename = `neuronest-moods-${date}.csv`;
        break;
      case 'focus':
        data = state.focus.sessions.map(s => ({
          completedAt: new Date(s.completedAt).toISOString(),
          duration: s.duration
        }));
        filename = `neuronest-focus-${date}.csv`;
        break;
      case 'all':
        downloadFile(JSON.stringify(state, null, 2), `neuronest-backup-${date}.json`, 'application/json');
        return;
      default:
        return;
    }

    if (!data.length) {
      alert(`No ${type} data to export yet.`);
      return;
    }
    downloadFile(arrayToCSV(data), filename, 'text/csv');
  };

  // Browser notifications
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  };

  const notify = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification(title, { body, icon: '/favicon.ico' }); }
      catch (e) { console.log('Notification failed:', e); }
    }
  };

  // Keyboard shortcut handler
  const shortcuts = {
    'g h': '/NeuroNest/dashboard.html',
    'g t': 'tasks.html',
    'g f': 'focus.html',
    'g m': 'mood.html',
    'g a': 'analytics.html',
    'g i': 'ai-assistant.html',
    'g d': 'dashboard.html'
  };

  let keyBuffer = '';
  let keyTimer = null;
  document.addEventListener('keydown', e => {
    // Skip if typing in an input
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === '?') {
      e.preventDefault();
      showShortcutHelp();
      return;
    }

    keyBuffer += e.key;
    clearTimeout(keyTimer);
    keyTimer = setTimeout(() => { keyBuffer = ''; }, 800);

    for (const combo in shortcuts) {
      const stripped = combo.replace(/ /g, '');
      if (keyBuffer.endsWith(stripped)) {
        const dest = shortcuts[combo].split('/').pop();
        window.location.href = dest;
        keyBuffer = '';
        return;
      }
    }
  });

  const showShortcutHelp = () => {
    let modal = document.getElementById('shortcut-help');
    if (modal) { modal.remove(); return; }
    modal = document.createElement('div');
    modal.id = 'shortcut-help';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal">
        <h2>Keyboard Shortcuts</h2>
        <table style="width:100%">
          <tr><td><kbd>g</kbd> <kbd>d</kbd></td><td>Dashboard</td></tr>
          <tr><td><kbd>g</kbd> <kbd>h</kbd></td><td>Habits (Home)</td></tr>
          <tr><td><kbd>g</kbd> <kbd>t</kbd></td><td>Tasks</td></tr>
          <tr><td><kbd>g</kbd> <kbd>f</kbd></td><td>Focus</td></tr>
          <tr><td><kbd>g</kbd> <kbd>m</kbd></td><td>Mood</td></tr>
          <tr><td><kbd>g</kbd> <kbd>a</kbd></td><td>Analytics</td></tr>
          <tr><td><kbd>g</kbd> <kbd>i</kbd></td><td>AI Assistant</td></tr>
          <tr><td><kbd>?</kbd></td><td>Toggle this help</td></tr>
          <tr><td><kbd>Esc</kbd></td><td>Close modal</td></tr>
        </table>
        <button type="button" class="btn-ghost" onclick="document.getElementById('shortcut-help').remove()" style="margin-top:1rem">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.remove();
    });
    document.addEventListener('keydown', function esc(ev) {
      if (ev.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', esc);
      }
    });
  };

  window.NN = window.NN || {};
  window.NN.utils = { exportCSV, downloadFile, notify, requestNotificationPermission, showShortcutHelp };
})();