/* Contact form validation */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  const showError = (field, msg) => {
    field.style.borderColor = '#ff7070';
    let err = field.parentElement.querySelector('.error-msg');
    if (!err) {
      err = document.createElement('small');
      err.className = 'error-msg';
      err.style.color = '#ff7070';
      err.style.display = 'block';
      err.style.marginTop = '0.25rem';
      field.parentElement.appendChild(err);
    }
    err.textContent = msg;
  };

  const clearError = field => {
    field.style.borderColor = '';
    const err = field.parentElement.querySelector('.error-msg');
    if (err) err.remove();
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    [name, email, message].forEach(clearError);

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'Name must be at least 2 characters.');
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (message.value.trim().length < 10) {
      showError(message, 'Message must be at least 10 characters.');
      valid = false;
    }

    if (valid) {
      alert('Message sent! (Demo — no backend wired yet.)');
      form.reset();
    }
  });

  [document.getElementById('name'), document.getElementById('email'), document.getElementById('message')]
    .forEach(field => field && field.addEventListener('input', () => clearError(field)));
});