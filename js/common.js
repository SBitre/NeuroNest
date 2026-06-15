/* Theme toggle + active nav highlight */
(function () {
  // Apply theme immediately (before paint) to prevent flash
  try {
    const raw = localStorage.getItem('neuronest:v1');
    const theme = raw ? (JSON.parse(raw).theme || 'dark') : 'dark';
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Inject theme toggle button into header
    const header = document.querySelector('header');
    if (header) {
      const btn = document.createElement('button');
      btn.className = 'theme-toggle';
      btn.setAttribute('aria-label', 'Toggle light/dark theme');
      btn.type = 'button';

      const updateIcon = () => {
        const t = document.documentElement.dataset.theme;
        btn.textContent = t === 'dark' ? '☀️' : '🌙';
      };

      btn.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        NN.store.set(s => { s.theme = next; });
        updateIcon();
      });

      updateIcon();
      header.appendChild(btn);
    }

    // Active nav link
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  });
})();