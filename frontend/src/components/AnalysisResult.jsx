function ScoreRing({ score }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444'
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="score-ring">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="score-value">
        <span className="score-number">{score ?? '—'}</span>
        <span className="score-label">Score</span>
      </div>
    </div>
  )
}

export default function AnalysisResult({ data }) {
  if (!data) return null

  return (
    <div className="results">
      <div className="results-header">
        <div>
          <h2>Analysis Results</h2>
          {data.candidate_name && <p className="candidate-name">{data.candidate_name}</p>}
          {data.email && <p className="candidate-email">{data.email}</p>}
        </div>
        <ScoreRing score={data.overall_score} />
      </div>

      {data.summary && (
        <div className="card summary-card">
          <h3>📝 Summary</h3>
          <p>{data.summary}</p>
        </div>
      )}

      <div className="results-grid">
        <div className="card">
          <h3>💡 Skills Detected</h3>
          <div className="tag-list">
            {(data.skills || []).map((skill, i) => (
              <span key={i} className="tag skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>⚠️ Weak Points</h3>
          <ul className="list weak-list">
            {(data.weak_points || []).map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h3>🎤 Interview Questions</h3>
        <ol className="list questions-list">
          {(data.interview_questions || []).map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
