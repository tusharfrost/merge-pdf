function wireContactForm() {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("contactFeedback");
  if (!form || !feedback) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      feedback.textContent = "Please complete all fields before submitting.";
      feedback.classList.remove("is-success");
      feedback.classList.add("is-error");
      return;
    }

    feedback.textContent = `Thanks, ${name}. Your demo message has been captured for presentation purposes.`;
    feedback.classList.remove("is-error");
    feedback.classList.add("is-success");
    form.reset();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", wireContactForm);
} else {
  wireContactForm();
}
