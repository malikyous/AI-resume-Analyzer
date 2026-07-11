import axios from 'axios'

const API_BASE = '/.netlify/functions'

export async function analyzeResume(resumeText) {
  const { data } = await axios.post(`${API_BASE}/analyze`, { resume_text: resumeText })
  return data
}

export async function checkHealth() {
  const { data } = await axios.get(`${API_BASE}/health`)
  return data
}
