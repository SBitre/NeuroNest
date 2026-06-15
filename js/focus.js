/* Focus page - Pomodoro timer */
document.addEventListener('DOMContentLoaded', () => {
  const display = document.querySelector('.timer-display');
  const ring = document.querySelector('.timer-ring');
  const buttons = document.querySelectorAll('.timer-controls button');
  if (!display || buttons.length < 3) return;

  const [startBtn, pauseBtn, resetBtn] = buttons;
  const workInput = document.getElementById('work');
  const breakInput = document.getElementById('break');
  const sessionsInput = document.getElementById('sessions');

  let remaining = 25 * 60;
  let interval = null;
  let isWork = true;
  let sessionsDone = 0;

  const state = NN.store.get();
  if (state.focus?.settings) {
    workInput.value = state.focus.settings.work;
    breakInput.value = state.focus.settings.break;
    sessionsInput.value = state.focus.settings.sessions;
    remaining = state.focus.settings.work * 60;
  }

  const format = sec => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const render = () => {
    display.textContent = format(remaining);
    document.title = `${format(remaining)} | ${isWork ? 'Focus' : 'Break'} - NeuroNest`;
  };

  const tick = () => {
    remaining--;
    if (remaining > 0) { render(); return; }

    clearInterval(interval);
    interval = null;
    startBtn.textContent = 'Start';

    if (isWork) {
      const duration = parseInt(workInput.value);
      NN.store.set(s => s.focus.sessions.push({ duration, completedAt: Date.now() }));
      sessionsDone++;
      isWork = false;
      remaining = parseInt(breakInput.value) * 60;
      ring.style.borderColor = 'var(--neon-purple)';
      renderSidebar();
      alert(`Focus session complete! Take a ${breakInput.value} min break.`);
    } else {
      isWork = true;
      remaining = parseInt(workInput.value) * 60;
      ring.style.borderColor = 'var(--neon-cyan)';
      if (sessionsDone >= parseInt(sessionsInput.value)) {
        alert(`All ${sessionsInput.value} sessions complete! 🎉`);
        sessionsDone = 0;
      } else {
        alert('Break over. Ready for next session.');
      }
    }
    render();
  };

  startBtn.addEventListener('click', () => {
    if (interval) return;
    interval = setInterval(tick, 1000);
    startBtn.textContent = 'Running...';
  });

  pauseBtn.addEventListener('click', () => {
    clearInterval(interval);
    interval = null;
    startBtn.textContent = 'Start';
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(interval);
    interval = null;
    isWork = true;
    remaining = parseInt(workInput.value) * 60;
    ring.style.borderColor = 'var(--neon-cyan)';
    startBtn.textContent = 'Start';
    render();
  });

  [workInput, breakInput, sessionsInput].forEach(input => {
    input.addEventListener('change', () => {
      NN.store.set(s => {
        s.focus.settings = {
          work: parseInt(workInput.value),
          break: parseInt(breakInput.value),
          sessions: parseInt(sessionsInput.value)
        };
      });
      if (!interval && isWork) {
        remaining = parseInt(workInput.value) * 60;
        render();
      }
    });
  });

  function renderSidebar() {
    const todayStr = NN.store.todayKey();
    const all = NN.store.get().focus.sessions;
    const today = all.filter(s => new Date(s.completedAt).toISOString().slice(0, 10) === todayStr);
    const sidebar = document.querySelector('aside ul');
    if (!sidebar) return;
    const totalMin = today.reduce((sum, s) => sum + s.duration, 0);
    const longest = today.length ? Math.max(...today.map(s => s.duration)) : 0;
    sidebar.innerHTML = `
      <li>Sessions completed: <strong>${today.length}</strong></li>
      <li>Total focus time: <strong>${totalMin} min</strong></li>
      <li>Longest streak: <strong>${longest} min</strong></li>
    `;
  }

  renderSidebar();
  render();
});