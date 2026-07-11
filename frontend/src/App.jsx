import { useState } from 'react'
import { analyzeResume } from './api'
import AnalysisResult from './components/AnalysisResult'
import UploadZone from './components/UploadZone'
import { extractTextFromPDF } from './utils/pdfParser'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async (file) => {
    setLoading(true)
    setError(null)
    try {
      const resumeText = await extractTextFromPDF(file)
      if (!resumeText || resumeText.length < 50) {
        throw new Error('Could not extract enough text from PDF. Try a text-based PDF.')
      }
      const res = await analyzeResume(resumeText)
      setResult(res.data)
    } catch (err) {
      setError(err.message || 'Failed to analyze resume. Please try again.')
    } finally {
      setLoading(false)
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
          <div className="content">
            <UploadZone onUpload={handleUpload} loading={loading} />

            {error && (
              <div className="alert error">{error}</div>
            )}

            <AnalysisResult data={result} />
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 All Rights Reserved.</p>
      </footer>
    </div>
  )
}
