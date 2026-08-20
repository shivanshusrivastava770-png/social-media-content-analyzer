# Social Media Content Analyzer

**Live demo:** https://social-media-content-analyzer-eight-beta.vercel.app

Upload a PDF or a scanned image of a social media post/caption. The app
extracts the text (PDF parsing or OCR) and returns an engagement-readiness
score plus concrete suggestions for improving the post.

Everything runs **client-side in the browser** — no backend server, no API
keys, no data leaves the user's machine.

## Features

- Drag-and-drop or click-to-browse upload, multiple files at once
- PDF text extraction via `pdf.js`
- OCR for images (PNG/JPG/scanned docs) via `tesseract.js`
- Heuristic engagement analysis: hashtag/mention/emoji counts, call-to-action
  detection, question detection, link usage, sentence length, and a 0–100 score
- Loading state per file (OCR shows live progress %)
- Per-file error handling (unsupported type, empty/unreadable text, parse failure)

## Tech stack

- **React 18 + Vite** — fast dev server, no backend needed
- **pdf.js** (`pdfjs-dist`) — PDF text extraction
- **Tesseract.js** — in-browser OCR
- Plain CSS (no UI framework, to keep dependencies minimal)

## How to run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Project structure
