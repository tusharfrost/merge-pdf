# exampdfx.com PDF Merge Demo

A GitHub-ready static website for a PDF merge tool demo, branded for `exampdfx.com`.

## Pages

- `index.html` - landing page
- `merge-pdf.html` - live merge demo
- `about.html` - company story and positioning
- `contact.html` - demo contact form

## Included folders

- `css/` - site styling
- `vendor/` - local shared scripts
- `partials/` - header and footer templates
- `assets/` - logo and icon files

## Publish to GitHub Pages

1. Upload the full folder contents to a GitHub repository.
2. In GitHub, open `Settings -> Pages`.
3. Set the source to your main branch and the root folder.
4. Save and wait for the site to publish.

## Local preview

The site includes a fallback component loader, so it can still render header/footer if you open files directly.
For the best preview, serve it through a simple local web server or GitHub Pages.

## Demo note

The merge tool uses the browser and the `pdf-lib` CDN on the live page. If the CDN is unavailable, the UI still works as a branded demo experience.
