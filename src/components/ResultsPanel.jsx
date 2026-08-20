function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function scoreClass(score) {
  if (score >= 70) return 'good'
  if (score >= 40) return 'ok'
  return 'poor'
}

function ResultsPanel({ item, onRemove }) {
  const { file, status, progress, text, analysis, error } = item

  return (
    <div className="result-card">
      <div className="result-header">
        <div>
          <strong>{file.name}</strong>
          <span className="file-meta"> · {(file.size / 1024).toFixed(1)} KB</span>
        </div>
        <button onClick={onRemove} className="btn-icon" aria-label="Remove file">
          ✕
        </button>
      </div>

      {status === 'processing' && (
        <div className="status-block">
          <div className="spinner" />
          <span>
            {file.type === 'application/pdf'
              ? 'Extracting text from PDF…'
              : `Running OCR… ${progress}%`}
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="status-block error">
          <span>⚠ {error}</span>
        </div>
      )}

      {status === 'done' && (
        <>
          {text.trim().length === 0 ? (
            <p className="warning">No text could be extracted from this file.</p>
          ) : (
            <>
              <div className="score-row">
                <div className={`score-badge ${scoreClass(analysis.score)}`}>{analysis.score}/100</div>
                <span className="score-label">Engagement readiness score</span>
              </div>

              <div className="stats-grid">
                <Stat label="Words" value={analysis.stats.wordCount} />
                <Stat label="Hashtags" value={analysis.stats.hashtagCount} />
                <Stat label="Mentions" value={analysis.stats.mentionCount} />
                <Stat label="Emojis" value={analysis.stats.emojiCount} />
                <Stat label="Links" value={analysis.stats.linkCount} />
                <Stat label="Has question" value={analysis.stats.hasQuestion ? 'Yes' : 'No'} />
              </div>

              <details className="extracted-text">
                <summary>View extracted text</summary>
                <pre>{text}</pre>
              </details>

              <div className="suggestions">
                <h4>Suggestions</h4>
                <ul>
                  {analysis.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ResultsPanel
