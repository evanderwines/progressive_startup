# PROGRESSIVE Studio Website

A minimalist, high-performance static website for PROGRESSIVE Studio, an independent software craft, system architecture, and product inquiry practice.

## Project Structure

The project follows a clean, modular, and maintainable static asset hierarchy:

```text
progressive_startup/
├── index.html              # Main website entry point (Home)
├── pages/                  # Secondary application pages
│   ├── capabilities.html   # Practice capabilities & services
│   ├── contact.html        # Inquiry dispatch & contact interface
│   └── our_team.html       # Studio team profiles & philosophy
├── assets/                 # Static project resources
│   ├── images/             # Studio identity logos & profile photography
│   │   ├── evan.jpg
│   │   ├── joni.jpg
│   │   ├── logo-small.png
│   │   ├── logo.png
│   │   ├── mark.jpg
│   │   ├── profile-evan.png
│   │   ├── profile-joni.jpg
│   │   ├── profile-winfred.jpg
│   │   ├── raw-logo-small.png
│   │   ├── raw-logo.png
│   │   └── winfred.jpg
│   ├── css/
│   │   └── site.css        # Minimalist interaction & motion enhancements
│   └── js/
│       └── site.js         # Zero-dependency navigation & contact logic
└── README.md               # Project documentation & local development guide
```

### Path Conventions
- **Root Entry Point (`index.html`)**: References subpages via `pages/<name>.html` and assets via `assets/...`.
- **Subpages (`pages/*.html`)**: Reference the root home page via `../index.html`, sibling subpages directly via `<name>.html`, and assets via `../assets/...`.
- **Assets (`assets/`)**: Grouped by content type (`images`, `css`, `js`) for clarity and future scalability.

---

## Running Locally

You can preview and run the website locally using any standard HTTP server.

### Option 1: Node.js / NPX (Recommended)
From the project root (`progressive_startup`):
```bash
npx serve .
```
Or with `http-server`:
```bash
npx http-server . -p 8080 -c-1
```
Then open `http://localhost:3000` (or `http://localhost:8080`) in your browser.

### Option 2: Python 3
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: VS Code / Antigravity Live Server
Right-click on `index.html` and choose **"Open with Live Server"**.

### Option 4: Direct Browser Preview
You can also open `index.html` directly in any modern web browser (double-click `index.html`).

---

## Static Web Hosting & Deployment

This project contains zero build steps and is ready for instant deployment on static hosting platforms:
- **Netlify**: Set publish directory to `.` (root).
- **Vercel**: Deploy as a static project with root directory.
- **GitHub Pages**: Deploy from the `main` branch root.
- **Cloudflare Pages / AWS S3**: Upload the project directory directly.
