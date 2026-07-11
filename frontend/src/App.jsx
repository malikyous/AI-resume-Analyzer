import { useCallback, useEffect, useState } from 'react'
import { analyzeResume, deleteAnalysis, getAnalysis, getHistory } from './api'
import AnalysisResult from './components/AnalysisResult'
import HistoryPanel from './components/HistoryPanel'
import UploadZone from './components/UploadZone'

export default function App() {
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true)
      const res = await getHistory()
      setHistory(res.data || [])
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const handleUpload = async (file) => {
    setLoading(true)
    setError(null)
    try {
      const res = await analyzeResume(file)
      setResult(res.data)
      loadHistory()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectHistory = async (id) => {
    try {
      const res = await getAnalysis(id)
      setResult(res.data)
      setError(null)
    } catch {
      setError('Could not load analysis.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteAnalysis(id)
      if (result?.id === id) setResult(null)
      loadHistory()
    } catch {
      setError('Could not delete analysis.')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <div>
              <h1>AI Resume Analyzer</h1>
              <p>Upload PDF · Extract Skills · Find Weak Points · Generate Interview Questions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="layout">
            <aside className="sidebar">
              <HistoryPanel
                history={history}
                onSelect={handleSelectHistory}
                onDelete={handleDelete}
                loading={historyLoading}
              />
            </aside>

            <div className="content">
              <UploadZone onUpload={handleUpload} loading={loading} />

              {error && (
                <div className="alert error">{error}</div>
              )}

              <AnalysisResult data={result} />
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 All Rights Reserved.</p>
      </footer>
    </div>
  )
}
