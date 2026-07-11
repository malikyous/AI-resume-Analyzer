export default function HistoryPanel({ history, onSelect, onDelete, loading }) {
  if (loading) {
    return <div className="history-panel"><p className="muted">Loading history...</p></div>
  }

  if (!history.length) {
    return (
      <div className="history-panel">
        <h3>📚 Past Analyses</h3>
        <p className="muted">No analyses yet. Upload a resume to get started.</p>
      </div>
    )
  }

  return (
    <div className="history-panel">
      <h3>📚 Past Analyses</h3>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <button className="history-content" onClick={() => onSelect(item.id)}>
              <span className="history-name">
                {item.candidate_name || item.filename}
              </span>
              <span className="history-meta">
                Score: {item.overall_score ?? '—'} · {new Date(item.created_at).toLocaleDateString()}
              </span>
            </button>
            <button
              className="btn-delete"
              onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
              title="Delete"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
