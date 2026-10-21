
(() => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");

  // Replace this with the email address that should receive enquiries.
  const destinationEmail = "YOUR_EMAIL@example.com";

  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (destinationEmail === "YOUR_EMAIL@example.com") {
      status.textContent =
        "Set your destination email in js/contact.js before using the form.";

      status.classList.add("is-visible");
      return;
    }

    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message
    ].join("\n");

    const mailto =
      `mailto:${destinationEmail}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    status.textContent =
      "Opening your email app to send this message.";

    status.classList.add("is-visible");

    window.location.href = mailto;
  });
})();
