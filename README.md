# ⌨️ Typer Flow

A clean, minimalist typing speed test built with **pure HTML, CSS, and JavaScript** — no frameworks, no backend, no build step. Just open it in a browser.

Test your typing speed, track your accuracy, and beat your personal best — all client-side.

---

## ✨ Features

- 📝 **Random Text Generator** — fresh word sets or quotes for every test
- ⌨️ **Seamless Typing Area** — live character-by-character feedback (correct / incorrect / untyped)
- ⏱️ **Configurable Timer** — 15 / 30 / 60 / 120 second tests
- 🔤 **Two Modes** — *Words* (25 / 50 / 100 random common words) or *Quote* (full passages)
- ⚡ **Live Stats** — real-time WPM and accuracy while you type
- 🎯 **Net & Raw WPM** — see both your clean speed and your raw (error-inclusive) speed
- 📊 **Results Screen** — WPM, accuracy, correct/incorrect characters, total time, and a WPM-over-time chart (drawn with native `<canvas>`)
- 🏆 **Personal Best Tracking** — stored locally in your browser via `localStorage`
- 🕘 **Recent Test History** — your last several results, saved locally
- 🔊 **Sound Toggle** — optional keystroke/error sound effects
- 🌗 **Dark / Light Theme Toggle**
- 🏠 **Landing Page** — a professional intro page with an aesthetic desk/keyboard background, project info, and social links
- 📱 **Fully Responsive** — works on mobile, tablet, and desktop
- 🔁 **Instant Restart** — new text and a clean slate in one click (or `Tab` + `Enter`)

---

## 🖥️ Tech Stack

| Layer      | Tech                                   |
|------------|-----------------------------------------|
| Structure  | HTML5                                   |
| Styling    | CSS3 (custom properties, glassmorphism) |
| Logic      | Vanilla JavaScript (ES6, no libraries)  |
| Storage    | Browser `localStorage`                  |
| Fonts      | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |

No npm, no bundler, no framework — the entire app runs by opening a static HTML file.

---

## 📁 Project Structure

```
typer-flow/
├── index.html              # Typing test app
├── landing.html             # Landing / intro page
├── css/
│   ├── style.css            # Styles for the typing test app
│   └── landing.css          # Styles for the landing page
├── js/
│   ├── app.js                # App state & event handling
│   ├── textGenerator.js      # Word pool & quote bank, random picker
│   ├── timer.js               # Countdown timer logic
│   ├── stats.js                # WPM & accuracy calculations
│   └── storage.js              # localStorage (history, personal best, theme, sound)
├── assets/
│   ├── logo.svg              # App logo
│   └── desk-keyboard-bg.png  # Background photo (landing page + app backdrop)
└── README.md
```

---

## 🚀 Getting Started

No installation or build step required.

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-username>/typer-flow.git
   cd typer-flow
   ```
2. **Open it**
   - Simply double-click `landing.html` (or `index.html`) to open it in your browser, **or**
   - Serve it locally for a cleaner experience (recommended, avoids any `file://` quirks):
     ```bash
     # Python
     python3 -m http.server 5500

     # Node (npx, no install needed)
     npx serve .
     ```
     Then visit `http://localhost:5500`.

That's it — no dependencies to install.

---

## 🧮 How Stats Are Calculated

- **Net WPM** (your real speed): `(correct characters / 5) / minutes elapsed`
- **Raw WPM** (including mistakes): `(total typed characters / 5) / minutes elapsed`
- **Accuracy**: `(correct characters / total typed characters) × 100`

---

## 🗺️ Roadmap / Ideas

- [ ] Multiplayer / race mode
- [ ] More language/word-set options
- [ ] Exportable stats (CSV/JSON)
- [ ] Optional cloud sync for history (would require a backend)

---

## 🙌 Credits

Built by Sai Tele as a personal front-end project — a minimal, ad-free, account-free alternative to typing test sites, focused on clean UI and smooth interactions.

- 💼 LinkedIn: https://www.linkedin.com/in/sai-tele
- 📸 Instagram: https://www.instagram.com/sai.tele15/
- 🐙 GitHub: https://github.com/saitele325
- 🌐 Portfolio: https://saitele325.github.io/portfolio

> *Replace the links above with your real profile URLs before publishing.*

---

## 📄 License

This project is licensed under the **MIT License** — a short, permissive license. In plain terms:

- ✅ You're free to **use, copy, modify, merge, publish, and distribute** this code, for personal or commercial projects.
- ✅ You can even **sell** software that includes it.
- ⚠️ The only real requirement: keep the original **copyright notice and license text** included in any copy or substantial portion of the code.
- 🚫 It comes with **no warranty** — the software is provided "as is," and the author isn't liable for any issues arising from its use.
