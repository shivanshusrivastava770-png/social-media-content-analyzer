import { createWorker } from 'tesseract.js'

/**
 * Runs OCR on an image file and returns the extracted text.
 * @param {File} file
 * @param {(progress: number) => void} [onProgress] called with 0-100
 * @returns {Promise<string>}
 */
export async function extractImageText(file, onProgress) {
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (onProgress && m.status === 'recognizing text') {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })

  try {
    const { data } = await worker.recognize(file)
    return (data.text || '').trim()
  } finally {
    await worker.terminate()
  }
}
