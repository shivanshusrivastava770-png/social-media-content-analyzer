import { useCallback, useState } from 'react'
import UploadZone from './components/UploadZone.jsx'
import ResultsPanel from './components/ResultsPanel.jsx'
import { extractPdfText } from './utils/extractText.js'
import { extractImageText } from './utils/ocr.js'
import { analyzeContent } from './utils/analyzer.js'

function App() {
  const [items, setItems] = useState([])

  const processFile = useCallback(async (file) => {
    const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setItems((prev) => [
      ...prev,
      { id, file, status: 'processing', progress: 0, text: '', analysis: null, error: null },
    ])

    try {
      let text = ''
      if (file.type === 'application/pdf') {
        text = await extractPdfText(file)
      } else if (file.type.startsWith('image/')) {
        text = await extractImageText(file, (progress) => {
          setItems((prev) => prev.map((it) => (it.id === id ? { ...it, progress } : it)))
        })
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or an image (PNG/JPG).')
      }

      const analysis = analyzeContent(text)
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: 'done', text, analysis, progress: 100 } : it)),
      )
    } catch (err) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, status: 'error', error: err.message || 'Failed to process file.' } : it,
        ),
      )
    }
  }, [])

  const handleFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList)
      const valid = files.filter((f) => f.type === 'application/pdf' || f.type.startsWith('image/'))
      const invalidCount = files.length - valid.length
      valid.forEach(processFile)
      return invalidCount
    },
    [processFile],
  )

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id))
  const clearAll = () => setItems([])

  return (
    <div className="app">
      <header className="header">
        <h1>Social Media Content Analyzer</h1>
        <p>Upload a PDF or a scanned image of a post/caption to extract the text and get engagement suggestions.</p>
      </header>

      <UploadZone onFiles={handleFiles} />

      {items.length > 0 && (
        <div className="toolbar">
          <button onClick={clearAll} className="btn-secondary">
            Clear all
          </button>
        </div>
      )}

      <div className="results-list">
        {items.map((item) => (
          <ResultsPanel key={item.id} item={item} onRemove={() => removeItem(item.id)} />
        ))}
      </div>

      {items.length === 0 && (
        <p className="empty-hint">No files yet — upload a PDF or image to get started.</p>
      )}
    </div>
  )
}

export default App
