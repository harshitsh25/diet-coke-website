# Smooth Scroll Canvas Frame Animation

A premium, high-performance scroll-driven frame animation website dedicated to **Diet Coke**. It features a canvas-based frame-rendering engine that preloads 240 high-resolution frames, drawing them dynamically using smooth linear interpolation (lerp) scroll physics.

## 🚀 Key Features

* **Sleek Canvas Render**: Instead of standard video tags, frames are preloaded and rendered directly on an HTML5 `<canvas>` using high-DPI scaling (Retina resolution).
* **Smooth Lerped Physics**: Integrates linear interpolation (lerp) inside a `requestAnimationFrame` loop. As you scroll, the animation glides smoothly with custom inertia, creating an elastic feel.
* **Auto-Contrast Navigation Bar**: Transparent fixed navigation bar that transitions to a blurred glassmorphic white background when scrolling past the canvas area, dynamically shifting text and SVG logo colors.
* **Official Brand Assets**: Employs the official "Diet Coke" script logo centered with custom red neon glows, and the official corporate SVG logo in the navigation menu.
* **Responsive Bento Layouts**: Dynamic article sections, bento grids, and CTA sections styled with Tailwind CSS stitched below the main canvas.

---

## 🛠️ Tech Stack

1. **HTML5 Canvas**: Handles instant rendering of preloaded image frames.
2. **JavaScript (ES6+)**: Powers frame preloading, canvas cover scaling, active menu highlighting, scroll percentage mapping, and physics loop.
3. **Tailwind CSS & Vanilla CSS**: Provides modern layouts, CSS variables, keyframe spinner animations, and glassmorphic trackers.

---

## 💻 Local Development

To run the site locally, you need a simple HTTP server to avoid CORS issues when preloading images.

### Option 1: Python (Recommended)
If you have Python installed, run this command in your project directory:
```bash
python3 -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Node.js / npm
Install and run `http-server` globally or via `npx`:
```bash
npx http-server -p 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🌐 Deployment Options

This website is fully static, making it extremely flexible and cheap to host!

### 1. GitHub Pages (Super Simple)
Since all paths are relative, you can host it directly on GitHub Pages:
1. Go to your GitHub Repository -> **Settings** -> **Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose the `main` branch and `/ (root)` folder, then click **Save**.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/` in a few minutes!

### 2. Vercel / Netlify / Cloudflare Pages
1. Push this project to GitHub.
2. Log into Vercel or Netlify and import your repository.
3. Leave all build command and directory configurations blank (since it's a static site).
4. Deploy!
