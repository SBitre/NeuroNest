/* Dashboard - dynamic stats from store */
document.addEventListener('DOMContentLoaded', () => {
  const state = NN.store.get();
  const today = NN.store.todayKey();

  // Welcome timestamp
  const timeEl = document.querySelector('.area-welcome time');
  if (timeEl) {
    const now = new Date();
    timeEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    timeEl.setAttribute('datetime', today);
  }

  // Habits today
  const habitsCompleted = state.habits.filter(h => h.completions[today]).length;
  const habitsTotal = state.habits.length;
  const habitsCard = document.querySelectorAll('.progress-cards article')[0];
  if (habitsCard) {
    habitsCard.querySelector('progress').value = habitsCompleted;
    habitsCard.querySelector('progress').max = habitsTotal || 1;
    habitsCard.querySelector('p').textContent = `${habitsCompleted} / ${habitsTotal} habits done`;
  }

  // Focus time today
  const todaySessions = state.focus.sessions.filter(s =>
    new Date(s.completedAt).toISOString().slice(0, 10) === today
  );
  const focusMin = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const focusCard = document.querySelectorAll('.progress-cards article')[1];
  if (focusCard) {
    focusCard.querySelector('meter').value = focusMin;
    focusCard.querySelector('p').textContent = `${focusMin} minutes of deep work`;
  }

  // Mood score (most recent)
  const moodValues = { great: 10, good: 8, okay: 5, low: 3, stressed: 2 };
  const latestMood = state.moods.sort((a, b) => b.createdAt - a.createdAt)[0];
  const moodCard = document.querySelectorAll('.progress-cards article')[2];
  if (moodCard && latestMood) {
    const score = moodValues[latestMood.mood] || 5;
    moodCard.querySelector('meter').value = score;
    moodCard.querySelector('p').textContent = `Latest: ${latestMood.mood.charAt(0).toUpperCase() + latestMood.mood.slice(1)}`;
  }

  // AI tip rotation based on data
  const aiTipEl = document.querySelector('.area-ai mark');
  if (aiTipEl) {
    const tips = [];
    if (habitsCompleted < habitsTotal / 2) tips.push("You've got habits remaining today — try knocking out the easiest one first.");
    if (focusMin < 60) tips.push('Less than an hour of focus today. Block 25 minutes for a Pomodoro?');
    if (latestMood && (latestMood.mood === 'low' || latestMood.mood === 'stressed')) tips.push('Mood seems off. A short walk or 5-min meditation can help reset.');
    if (focusMin > 180) tips.push('Strong focus day! Make sure to take real breaks.');
    if (!tips.length) tips.push('Your focus drops after 2 PM. Try scheduling deep work earlier.');
    aiTipEl.textContent = tips[0];
  }
});