import * as pdfjsLib from 'pdfjs-dist'
// Vite-friendly way to point pdf.js at its worker bundle.
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

/**
 * Extracts text from a PDF file, page by page, preserving basic
 * paragraph breaks between pages.
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  let fullText = ''
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => item.str).join(' ')
    fullText += pageText.trim() + '\n\n'
  }

  return fullText.trim()
}
