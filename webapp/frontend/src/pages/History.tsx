import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getRuns, getLanguages } from '../api/client'
import RunResultCard from '../components/RunResultCard'

type HistoryTab = 'table' | 'compare'

export default function History() {
  const [tab, setTab] = useState<HistoryTab>('table')
  const [languageFilter, setLanguageFilter] = useState<string>('')
  const [powerFilter, setPowerFilter] = useState<string>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const { data: allLanguages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: getLanguages,
  })

  const filters = {
    ...(languageFilter && { language: languageFilter }),
    ...(powerFilter && { power: parseInt(powerFilter) }),
  }

  const { data: runs = [], isLoading } = useQuery({
    queryKey: ['runs', filters],
    queryFn: () => getRuns(filters),
  })

  const toggleLanguageSelection = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    )
  }

  const chartRuns = selectedLanguages.length > 0
    ? runs.filter(r => selectedLanguages.includes(r.language))
    : runs

  const languagesInChart = selectedLanguages.length > 0
    ? selectedLanguages
    : [...new Set(runs.map(r => r.language))]

  const chartData = chartRuns
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(run => ({
      time: new Date(run.createdAt).toLocaleString(),
      [run.language]: run.executionMs,
    }))
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.time === curr.time)
      if (existing) {
        Object.assign(existing, curr)
      } else {
        acc.push(curr)
      }
      return acc
    }, [] as any[])

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
    '#a855f7', '#22d3ee', '#fbbf24', '#fb923c'
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-800 pb-4">
        <button
          onClick={() => setTab('table')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            tab === 'table'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Table
        </button>
        <button
          onClick={() => setTab('compare')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            tab === 'compare'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Compare
        </button>
      </div>

      {tab === 'table' && (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Language</label>
                <select
                  value={languageFilter}
                  onChange={e => setLanguageFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                >
                  <option value="">All Languages</option>
                  {allLanguages.map(lang => (
                    <option key={lang.key} value={lang.key}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Power</label>
                <input
                  type="number"
                  min="1"
                  max="9"
                  placeholder="All"
                  value={powerFilter}
                  onChange={e => setPowerFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-32 text-white"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-gray-400">Loading history...</div>
          ) : runs.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center text-gray-400">
              No runs found
            </div>
          ) : (
            <div className="space-y-3">
              {runs.map(run => (
                <RunResultCard
                  key={run.id}
                  run={run}
                  isExpanded={expandedId === run.id}
                  onToggleExpand={() => setExpandedId(expandedId === run.id ? null : run.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'compare' && (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium mb-2">
              Select Languages to Compare
            </label>
            <div className="flex flex-wrap gap-2">
              {allLanguages.map(lang => (
                <button
                  key={lang.key}
                  onClick={() => toggleLanguageSelection(lang.key)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedLanguages.includes(lang.key)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            {selectedLanguages.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing all languages. Select specific languages for a cleaner view.
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="text-gray-400">Loading comparison data...</div>
          ) : chartData.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center text-gray-400">
              No data to compare
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Execution Time Over Time</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis
                    stroke="#9ca3af"
                    label={{
                      value: 'Time (ms)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#9ca3af',
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#f3f4f6',
                    }}
                  />
                  <Legend />
                  {languagesInChart.map((lang, index) => (
                    <Line
                      key={lang}
                      type="monotone"
                      dataKey={lang}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}
