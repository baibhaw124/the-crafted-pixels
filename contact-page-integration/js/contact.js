(() => {
  const form = document.querySelector('#contact-form');
  const note = document.querySelector('#form-note');
  if (!form || !note) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Replace with the inbox that should receive enquiries.
    const recipient = 'YOUR_EMAIL@example.com';
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subjectText = String(data.get('subject') || '').trim();
    const message = String(data.get('message') || '').trim();

    if (recipient === 'YOUR_EMAIL@example.com') {
      note.textContent = 'Set your destination email in js/contact.js first.';
      return;
    }

    const subject = encodeURIComponent(subjectText || `Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}
Email: ${email}

${message}`);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    note.textContent = 'Your email app will open with your message ready to send.';
  });
})();
