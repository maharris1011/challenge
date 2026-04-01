import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getLanguages, runBatch, RunResult, Language } from '../api/client'

export default function Dashboard() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [power, setPower] = useState(3)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<RunResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const { data: languages = [], isLoading: loadingLanguages } = useQuery({
    queryKey: ['languages'],
    queryFn: getLanguages,
  })

  const toggleLanguage = (key: string) => {
    setSelectedLanguages(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const toggleAll = () => {
    if (selectedLanguages.length === languages.length) {
      setSelectedLanguages([])
    } else {
      setSelectedLanguages(languages.map(l => l.key))
    }
  }

  const handleRun = async () => {
    if (selectedLanguages.length === 0) return

    setIsRunning(true)
    setError(null)
    setResults([])

    try {
      const batch = await runBatch(selectedLanguages, power)
      setResults(batch.runs)
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Run failed')
    } finally {
      setIsRunning(false)
    }
  }

  const chartData = results.map(r => ({
    language: r.language,
    time: r.executionMs,
    status: r.status,
  }))

  const getBarColor = (status: string) => {
    if (status === 'success') return '#10b981'
    if (status === 'timeout') return '#f59e0b'
    return '#ef4444'
  }

  if (loadingLanguages) {
    return <div className="text-gray-400">Loading languages...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Configure Run</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Power (1–9)</label>
            <input
              type="number"
              min="1"
              max="9"
              value={power}
              onChange={e => setPower(parseInt(e.target.value) || 1)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-32 text-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Languages</label>
              <button
                onClick={toggleAll}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {selectedLanguages.length === languages.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {languages.map((lang: Language) => (
                <label
                  key={lang.key}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(lang.key)}
                    onChange={() => toggleLanguage(lang.key)}
                    className="rounded"
                  />
                  <span>{lang.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={selectedLanguages.length === 0 || isRunning}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded font-medium"
          >
            {isRunning ? 'Running...' : `Run ${selectedLanguages.length} Language${selectedLanguages.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {isRunning && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-gray-400">Executing batch run...</span>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Execution Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="language" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#f3f4f6',
                  }}
                  formatter={(value: any) => [`${value} ms`, 'Execution Time']}
                />
                <Bar dataKey="time">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Results</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="pb-3 font-medium">Language</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Time (ms)</th>
                    <th className="pb-3 font-medium">Numbers Found</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => (
                    <tr key={result.id} className="border-b border-gray-800/50">
                      <td className="py-3">{result.language}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            result.status === 'success'
                              ? 'bg-green-900/30 text-green-400'
                              : result.status === 'timeout'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {result.status}
                        </span>
                      </td>
                      <td className="py-3">{result.executionMs.toFixed(2)}</td>
                      <td className="py-3 font-mono text-xs">
                        {result.numbersFound.length > 0
                          ? `[${result.numbersFound.join(', ')}]`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
