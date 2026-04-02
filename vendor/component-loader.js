const componentFallbacks = {
  "partials/header.html": `
    <header class="site-header">
      <div class="page-wrap nav-row">
        <a class="brand" href="index.html" aria-label="exampdfx.com homepage">
          <img src="assets/logo-mark.svg" alt="" width="34" height="34">
          <span>exampdfx.com</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-label="Open navigation">
          <span></span>
          <span></span>
        </button>
        <nav class="site-nav" aria-label="Primary">
          <a href="index.html" data-nav="home">Home</a>
          <a href="merge-pdf.html" data-nav="merge">Merge PDF</a>
          <a href="about.html" data-nav="about">About</a>
          <a href="contact.html" data-nav="contact">Contact</a>
        </nav>
      </div>
    </header>
  `,
  "partials/footer.html": `
    <footer class="site-footer">
      <div class="page-wrap footer-grid">
        <div>
          <a class="brand brand-footer" href="index.html">
            <img src="assets/logo-mark.svg" alt="" width="34" height="34">
            <span>exampdfx.com</span>
          </a>
          <p>Smart PDF workflows with a premium demo presentation and a GitHub-ready folder structure.</p>
        </div>
        <div>
          <h3>Pages</h3>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="merge-pdf.html">Merge PDF</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3>Demo Contact</h3>
          <ul class="footer-links">
            <li><a href="mailto:hello@exampdfx.com">hello@exampdfx.com</a></li>
            <li><a href="https://www.exampdfx.com">www.exampdfx.com</a></li>
          </ul>
        </div>
      </div>
      <div class="page-wrap footer-base">
        <span>&copy; <span data-year></span> exampdfx.com</span>
        <span>Merge PDF demo website</span>
      </div>
    </footer>
  `
};

async function injectComponent(target) {
  const source = target.dataset.include;
  if (!source) {
    return;
  }

  try {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Could not load ${source}`);
    }
    target.innerHTML = await response.text();
  } catch (error) {
    target.innerHTML = componentFallbacks[source] || "";
  }
}

async function loadComponents() {
  const includes = [...document.querySelectorAll("[data-include]")];
  await Promise.all(includes.map((item) => injectComponent(item)));
  document.dispatchEvent(new CustomEvent("components:loaded"));
}

loadComponents();
