import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 90000, // 90s — longer than the 60s execution timeout
})

export interface Language {
  key: string
  name: string
}

export interface RunResult {
  id: string
  language: string
  power: number
  status: 'success' | 'timeout' | 'error'
  numbersFound: number[]
  executionMs: number
  stdout: string
  stderr: string
  exitCode: number
  gitSha: string
  platform: string
  createdAt: string
}

export interface BatchResult {
  batchId: string
  label: string
  power: number
  runs: RunResult[]
  createdAt: string
}

export const getLanguages = () =>
  api.get<Language[]>('/languages').then(r => r.data)

export const runLanguage = (language: string, power: number) =>
  api.post<RunResult>('/run', { language, power }).then(r => r.data)

export const runBatch = (languages: string[], power: number, label?: string) =>
  api.post<BatchResult>('/batch', { languages, power, label }).then(r => r.data)

export const getRuns = (filters?: { language?: string; power?: number }) =>
  api.get<RunResult[]>('/runs', { params: filters }).then(r => r.data)

export const getBatchRuns = () =>
  api.get<BatchResult[]>('/batch-runs').then(r => r.data)

export const getRun = (id: string) =>
  api.get<RunResult>(`/runs/${id}`).then(r => r.data)
