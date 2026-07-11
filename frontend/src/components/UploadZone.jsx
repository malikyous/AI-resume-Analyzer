import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadZone({ onUpload, loading }) {
  const [file, setFile] = useState(null)

  const onDrop = useCallback((accepted) => {
    if (accepted.length) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: loading,
  })

  const handleSubmit = () => {
    if (file) onUpload(file)
  }

  return (
    <div className="upload-section">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${loading ? 'disabled' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-icon">📄</div>
        {isDragActive ? (
          <p>Drop your PDF here...</p>
        ) : (
          <>
            <p><strong>Drag & drop your resume PDF</strong></p>
            <p className="muted">or click to browse</p>
          </>
        )}
      </div>

      {file && (
        <div className="file-preview">
          <span>📎 {file.name}</span>
          <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!file || loading}
      >
        {loading ? (
          <>
            <span className="spinner" /> Analyzing...
          </>
        ) : (
          'Analyze Resume with AI'
        )}
      </button>
    </div>
  )
}
