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
src/
main.jsx # React entry point
App.jsx # top-level state: uploaded files -> processing -> results
App.css # styling
components/
UploadZone.jsx # drag-and-drop / file picker
ResultsPanel.jsx # per-file extracted text + analysis display
utils/
extractText.js # PDF text extraction (pdf.js)
ocr.js # image OCR (tesseract.js)
analyzer.js # engagement scoring heuristics

## Approach (~150 words)

Each uploaded file is routed by MIME type: PDFs go through `pdf.js`, which
reads text content page-by-page; images go through `tesseract.js`, an
in-browser Tesseract OCR build, with progress reported back to the UI via its
logger callback. Both paths converge on a plain extracted-text string, which
is then run through a rule-based `analyzeContent()` function — no external
AI/ML API needed, so it works offline and has zero marginal cost per
analysis. The heuristics check things known to affect engagement: hashtag
count and density, presence of a question or call-to-action, mentions,
emoji use, link placement, and sentence length, producing a 0–100 score and
a list of plain-language suggestions. State is managed per-file (id, status,
progress, text, analysis, error) so multiple uploads can process and fail
independently without blocking each other, and each stage surfaces a
loading or error state in the UI.

## What I'd extend first

1. **Swap the heuristic scorer for an LLM call** (e.g. Claude/OpenAI via a
   thin serverless function) to get more nuanced, tone-aware suggestions —
   keep the current heuristics as an instant, zero-cost fallback.
2. **Multi-language OCR** — `tesseract.js` supports other language packs;
   detect language or let the user pick one.
3. **Persist results** (localStorage or a small backend) so a session
   survives a refresh, and allow exporting suggestions as a report.
4. **PDF image fallback** — if a PDF page has no extractable text (e.g. a
   scanned PDF), rasterize the page and run it through the OCR path too.
5. **Batch scoring dashboard** — once multiple files are analyzed, show an
   aggregate view comparing scores across posts.

## Notes

- No `node_modules`, `.env`, build output, or editor folders are committed
  (see `.gitignore`), per submission guidelines.
- No backend, so there's nothing to deploy for a live URL beyond the static
  build (`npm run build` output in `dist/`) — deploy that folder to any
  static host (Vercel, Netlify, GitHub Pages) for a hosted URL.
