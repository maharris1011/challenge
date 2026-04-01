import { RunResult } from '../api/client'

interface RunResultCardProps {
  run: RunResult
  isExpanded: boolean
  onToggleExpand: () => void
}

export default function RunResultCard({ run, isExpanded, onToggleExpand }: RunResultCardProps) {
  const statusColors = {
    success: 'bg-green-900/30 text-green-400 border-green-800',
    timeout: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    error: 'bg-red-900/30 text-red-400 border-red-800',
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={onToggleExpand}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-6 flex-1">
          <div className="flex-shrink-0 w-32">
            <div className="text-xs text-gray-500">
              {new Date(run.createdAt).toLocaleString()}
            </div>
          </div>
          
          <div className="flex-shrink-0 w-24 font-semibold">
            {run.language}
          </div>

          <div className="flex-shrink-0 w-20">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium border ${
                statusColors[run.status]
              }`}
            >
              {run.status}
            </span>
          </div>

          <div className="flex-shrink-0 w-24 text-sm">
            <span className="text-gray-400">Power:</span> {run.power}
          </div>

          <div className="flex-shrink-0 w-32 text-sm">
            <span className="text-gray-400">Time:</span> {run.executionMs.toFixed(2)}ms
          </div>

          <div className="flex-1 text-sm font-mono text-xs truncate">
            {run.numbersFound.length > 0 ? (
              <span>
                <span className="text-gray-400">Found:</span> [{run.numbersFound.join(', ')}]
              </span>
            ) : (
              <span className="text-gray-500">No numbers found</span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 ml-4">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-800 px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Exit Code:</span> {run.exitCode}
            </div>
            <div>
              <span className="text-gray-400">Git SHA:</span>{' '}
              <span className="font-mono text-xs">{run.gitSha.slice(0, 8)}</span>
            </div>
            <div>
              <span className="text-gray-400">Platform:</span> {run.platform}
            </div>
            <div>
              <span className="text-gray-400">Run ID:</span>{' '}
              <span className="font-mono text-xs">{run.id}</span>
            </div>
          </div>

          {run.stdout && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Standard Output</h4>
              <pre className="bg-gray-950 border border-gray-800 rounded p-3 text-xs font-mono overflow-x-auto">
                {run.stdout}
              </pre>
            </div>
          )}

          {run.stderr && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-gray-400">Standard Error</h4>
              <pre className="bg-gray-950 border border-red-900/30 rounded p-3 text-xs font-mono overflow-x-auto text-red-300">
                {run.stderr}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
