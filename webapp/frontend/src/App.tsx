import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import History from './pages/History'

type Tab = 'dashboard' | 'history'

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard')

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">
            Challenge 3 — Narcissistic Numbers
          </h1>
          <nav className="flex gap-4">
            <button
              onClick={() => setTab('dashboard')}
              className={`px-3 py-1 rounded text-sm ${
                tab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Run
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-3 py-1 rounded text-sm ${
                tab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              History
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'dashboard' ? <Dashboard /> : <History />}
      </main>
    </div>
  )
}
