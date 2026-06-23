/* AI Assistant - Gemini integration with context from user's NeuroNest data */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const queryInput = document.getElementById('query');
  const insightsSection = document.querySelector('main section:first-of-type');
  const recentSidebar = document.querySelector('aside ul');

  if (!form || !queryInput) return;

  const apiKey = window.NN?.config?.GEMINI_API_KEY;
  const model = window.NN?.config?.GEMINI_MODEL || 'gemini-2.5-flash';

  // Render the question/answer area below the form
  let chatLog = document.createElement('div');
  chatLog.className = 'ai-chat-log';
  form.insertAdjacentElement('afterend', chatLog);

  const buildContextSummary = () => {
    const state = NN.store.get();
    const today = NN.store.todayKey();
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const habitsToday = state.habits.filter(h => h.completions[today]).length;
    const habitsTotal = state.habits.length;

    const weekSessions = state.focus.sessions.filter(s => s.completedAt >= weekAgo);
    const focusMinWeek = weekSessions.reduce((sum, s) => sum + s.duration, 0);

    const weekMoods = state.moods.filter(m => m.createdAt >= weekAgo);
    const moodScores = { great: 10, good: 8, okay: 5, low: 3, stressed: 2 };
    const moodAvg = weekMoods.length
      ? (weekMoods.reduce((s, m) => s + (moodScores[m.mood] || 5), 0) / weekMoods.length).toFixed(1)
      : 'no data';

    const openTasks = state.tasks.filter(t => !t.done);
    const highPriorityOpen = openTasks.filter(t => t.priority === 'high').length;

    return `User productivity context (last 7 days):
- Habits today: ${habitsToday}/${habitsTotal} completed
- Focus sessions this week: ${weekSessions.length} (${focusMinWeek} minutes total)
- Average mood: ${moodAvg}/10
- Open tasks: ${openTasks.length} (${highPriorityOpen} high priority)
- Long-term goals: ${state.goals.map(g => `${g.name} (${g.progress}/${g.target})`).join(', ') || 'none set'}`;
  };

  const callGemini = async userQuery => {
    if (!apiKey) {
      return {
        ok: false,
        text: '⚠️ No API key configured. Add your Gemini API key to js/config.js to enable AI responses. (See js/config.example.js for the template.)'
      };
    }

    const systemPrompt = `You are NeuroNest's productivity coach. Give concise, practical, encouraging advice based on the user's tracked data. Keep responses under 150 words. Use specific numbers from their data when relevant. Avoid generic platitudes.`;

    const context = buildContextSummary();
    const fullPrompt = `${systemPrompt}\n\n${context}\n\nUser question: ${userQuery}`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        return { ok: false, text: `API error (${response.status}): ${errText.slice(0, 200)}` };
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) return { ok: false, text: 'Empty response from Gemini.' };

      return { ok: true, text };
    } catch (err) {
      return { ok: false, text: `Network error: ${err.message}` };
    }
  };

  const renderMessage = (role, text, isLoading = false) => {
    const msg = document.createElement('article');
    msg.className = `ai-message ai-${role}`;
    if (isLoading) msg.classList.add('ai-loading');
    msg.innerHTML = `
      <h3>${role === 'user' ? '🙋 You asked' : '🧠 NeuroNest AI'}</h3>
      <p>${text}</p>
    `;
    chatLog.appendChild(msg);
    msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return msg;
  };

  const saveSuggestion = text => {
    NN.store.set(s => {
      if (!s.aiSuggestions) s.aiSuggestions = [];
      s.aiSuggestions.unshift({ text: text.slice(0, 200), createdAt: Date.now() });
      s.aiSuggestions = s.aiSuggestions.slice(0, 10);
    });
    renderRecentSidebar();
  };

  const renderRecentSidebar = () => {
    if (!recentSidebar) return;
    const suggestions = NN.store.get().aiSuggestions || [];
    if (!suggestions.length) {
      recentSidebar.innerHTML = `
        <li>Take a 5-minute walk after every 2 focus sessions.</li>
        <li>Replace afternoon coffee with herbal tea.</li>
        <li>Review weekly goals every Sunday evening.</li>
      `;
      return;
    }
    recentSidebar.innerHTML = suggestions.slice(0, 5).map(s => `<li>${s.text}</li>`).join('');
  };

  const renderDataDrivenInsights = () => {
    if (!insightsSection) return;
    const state = NN.store.get();
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    const articles = insightsSection.querySelectorAll('article');

    // Insight 1: peak focus hours from session times
    const sessions = state.focus.sessions.filter(s => s.completedAt >= weekAgo);
    const hourCounts = {};
    sessions.forEach(s => {
      const h = new Date(s.completedAt).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
    if (articles[0] && peakHour) {
      const h = parseInt(peakHour[0]);
      const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
      articles[0].querySelector('p').innerHTML =
        `Your focus sessions cluster around <mark>${label}</mark>. Consider scheduling your hardest work during that window.`;
    }

    // Insight 2: mood vs habit correlation
    const moods = state.moods.filter(m => m.createdAt >= weekAgo);
    const moodScores = { great: 10, good: 8, okay: 5, low: 3, stressed: 2 };
    if (articles[1] && moods.length >= 3) {
      const avg = moods.reduce((s, m) => s + (moodScores[m.mood] || 5), 0) / moods.length;
      const tone = avg >= 7 ? 'High mood average — keep doing what you\'re doing.'
                : avg >= 5 ? 'Mood is steady. Adding 1 more habit completion daily could lift it.'
                : 'Mood is running low. Prioritize sleep and short walks this week.';
      articles[1].querySelector('p').textContent = tone;
    }

    // Insight 3: habit suggestion based on weakest streak
    if (articles[2] && state.habits.length) {
      const weakest = state.habits
        .map(h => ({ name: h.name, count: Object.keys(h.completions).length }))
        .sort((a, b) => a.count - b.count)[0];
      articles[2].querySelector('p').innerHTML =
        `Your <strong>"${weakest.name}"</strong> habit has the fewest completions. A morning anchor could boost it.`;
    }
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const query = queryInput.value.trim();
    if (!query) { alert('Please enter a question.'); return; }
    if (query.length > 500) { alert('Question is too long (max 500 chars).'); return; }

    renderMessage('user', query);
    queryInput.value = '';
    const loadingMsg = renderMessage('assistant', 'Thinking...', true);

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Thinking...';

    const result = await callGemini(query);

    loadingMsg.remove();
    renderMessage('assistant', result.text);

    if (result.ok) saveSuggestion(result.text);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Ask AI';
  });

  // Keyboard shortcut: Cmd/Ctrl+Enter to submit
  queryInput.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });

  renderDataDrivenInsights();
  renderRecentSidebar();
});