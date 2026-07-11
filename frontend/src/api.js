import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'multipart/form-data' },
})

export async function analyzeResume(file) {
  const formData = new FormData()
  formData.append('resume', file)
  const { data } = await api.post('/analyze', formData)
  return data
}

export async function getHistory(limit = 20) {
  const { data } = await axios.get(`${API_BASE}/history?limit=${limit}`)
  return data
}

export async function getAnalysis(id) {
  const { data } = await axios.get(`${API_BASE}/history/${id}`)
  return data
}

export async function deleteAnalysis(id) {
  const { data } = await axios.delete(`${API_BASE}/history/${id}`)
  return data
}

export async function checkHealth() {
  const { data } = await axios.get(`${API_BASE}/health`)
  return data
}
