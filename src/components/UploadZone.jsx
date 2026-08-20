import { useRef, useState } from 'react'

function UploadZone({ onFiles }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [warning, setWarning] = useState('')

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const invalidCount = onFiles(e.dataTransfer.files)
    setWarning(invalidCount > 0 ? `${invalidCount} file(s) skipped — only PDF and image files are supported.` : '')
  }

  const handleChange = (e) => {
    const invalidCount = onFiles(e.target.files)
    setWarning(invalidCount > 0 ? `${invalidCount} file(s) skipped — only PDF and image files are supported.` : '')
    e.target.value = ''
  }

  return (
    <div>
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        role="button"
        tabIndex={0}
      >
        <p className="drop-zone-title">Drag &amp; drop PDF or image files here</p>
        <p className="drop-zone-sub">or click to browse — PDF, PNG, JPG supported</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,image/*"
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>
      {warning && <p className="warning">{warning}</p>}
    </div>
  )
}

export default UploadZone
