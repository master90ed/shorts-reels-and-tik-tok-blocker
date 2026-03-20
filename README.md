# 🚫 Shorts & Reels Blocker

Block YouTube Shorts, Instagram Reels, and TikTok — automatically, on mobile.

---

## 📱 What It Does

| Platform | Blocked |
|---|---|
| ▶️ YouTube | Shorts shelf, nav tab, redirects `/shorts/` → `/watch` |
| 📸 Instagram | Reels tab, Reels feed cards, redirects `/reels/` → `/` |
| 🎵 TikTok | Entire video feed hidden |

---

## 🚀 Quick Install (Mobile)

1. Install **[Firefox for Android](https://play.google.com/store/apps/details?id=org.mozilla.firefox)**
2. Install **[Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)** addon inside Firefox
3. Open the install page on your phone:

```
https://<your-username>.github.io/shorts-blocker/install.html
```

4. Tap **⚡ Install Script** — Tampermonkey opens automatically
5. Tap **Install** — done ✅

---

## 📂 Project Structure

```
shorts-blocker/
├── index.html              # VPN-style toggle UI
├── app.js                  # Toggle logic + per-platform state
├── shorts-blocker.user.js  # Tampermonkey userscript (the blocker)
├── install.html            # One-tap install page
├── .github/
│   └── workflows/
│       └── pages.yml       # Auto-deploy to GitHub Pages
└── README.md               # This file
```

---

## 🌐 Deploy to GitHub Pages

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/shorts-blocker.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select `GitHub Actions`
4. Click **Save**

Your install page will be live at:
```
https://<your-username>.github.io/shorts-blocker/install.html
```

---

## ⚙️ Also Works On

- **Kiwi Browser** (Android) — supports Chrome extensions including Tampermonkey
- **Firefox Desktop** — same Tampermonkey install steps

---

## 🛠 How It Works

The userscript (`shorts-blocker.user.js`) is injected by Tampermonkey on every page load. It:

- Injects CSS to hide Shorts/Reels UI elements
- Uses `MutationObserver` to catch dynamically loaded content
- Redirects short-form video URLs to normal pages
- Runs at `document-start` so content is hidden before it renders

---

## 📄 License

MIT — free to use, modify, and share.
