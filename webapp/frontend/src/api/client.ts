import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5 min max — per-request timeout is passed to backend
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

export const runLanguage = (language: string, power: number, timeout?: number) =>
  api.post<RunResult>('/run', { language, power, timeout }, {
    timeout: timeout ? (timeout + 10) * 1000 : 300000,
  }).then(r => r.data)

export const runBatch = (languages: string[], power: number, label?: string, timeout?: number) =>
  api.post<BatchResult>('/batch', { languages, power, label, timeout }, {
    timeout: timeout ? (timeout + 10) * 1000 : 300000,
  }).then(r => r.data)

export const cancelRun = () =>
  api.post<{ cancelled: boolean; reason?: string }>('/cancel').then(r => r.data)

export const getRuns = (filters?: { language?: string; power?: number }) =>
  api.get<RunResult[]>('/runs', { params: filters }).then(r => r.data)

export const getBatchRuns = () =>
  api.get<BatchResult[]>('/batch-runs').then(r => r.data)

export const getRun = (id: string) =>
  api.get<RunResult>(`/runs/${id}`).then(r => r.data)
