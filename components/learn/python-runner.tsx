'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Play, RefreshCcw, Eye } from 'lucide-react'

declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL?: string }) => Promise<PyodideLike>
  }
}

interface PyodideLike {
  runPythonAsync: (code: string) => Promise<unknown>
  globals: { get: (name: string) => unknown }
}

interface Props {
  task: string
  starter: string
  expected: string
  hint: string
}

const PYODIDE_VERSION = '0.26.4'
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

export function PythonRunner({ task, starter, expected, hint }: Props) {
  const [code, setCode] = useState(starter)
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'running' | 'error'>('idle')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const pyodideRef = useRef<PyodideLike | null>(null)

  const ensurePyodide = useCallback(async (): Promise<PyodideLike> => {
    if (pyodideRef.current) return pyodideRef.current
    setStatus('loading')
    setError('')
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script')
        s.src = `${PYODIDE_URL}pyodide.js`
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Impossible de charger Pyodide.'))
        document.head.appendChild(s)
      })
    }
    if (!window.loadPyodide) throw new Error('Pyodide indisponible.')
    pyodideRef.current = await window.loadPyodide({ indexURL: PYODIDE_URL })
    setStatus('ready')
    return pyodideRef.current
  }, [])

  async function run() {
    setError('')
    setOutput('')
    setSuccess(false)
    try {
      setStatus('running')
      const py = await ensurePyodide()
      // Capture stdout
      await py.runPythonAsync(`
import sys, io
_stdout = io.StringIO()
sys.stdout = _stdout
`)
      await py.runPythonAsync(code)
      const captured = await py.runPythonAsync(`
_out = _stdout.getvalue()
sys.stdout = sys.__stdout__
_out
`)
      const text = typeof captured === 'string' ? captured : String(captured ?? '')
      setOutput(text)
      setStatus('ready')
      const normalized = text.trim()
      if (normalized === expected.trim()) setSuccess(true)
    } catch (e) {
      setStatus('error')
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  function reset() {
    setCode(starter)
    setOutput('')
    setError('')
    setSuccess(false)
    setStatus('idle')
  }

  return (
    <div className="py-runner">
      <div className="py-task">
        <p className="legal-eyebrow">Mission</p>
        <p>{task}</p>
      </div>

      <div className="py-stage">
        <div className="py-editor">
          <div className="py-editor-head">
            <span>Python</span>
            <span className="py-status">
              {status === 'loading' && <><Loader2 size={12} className="auth-spin" /> Chargement de Python…</>}
              {status === 'ready' && <><Eye size={12} /> Prêt</>}
              {status === 'running' && <><Loader2 size={12} className="auth-spin" /> Exécution…</>}
              {status === 'idle' && <span>En attente</span>}
              {status === 'error' && <span>Erreur</span>}
            </span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={8}
            aria-label="Code Python"
          />
          <div className="py-actions">
            <button className="primary-button" onClick={run} disabled={status === 'loading' || status === 'running'}>
              <Play size={14} fill="currentColor" /> Exécuter
            </button>
            <button className="ghost-button" onClick={reset}>
              <RefreshCcw size={14} /> Réinitialiser
            </button>
          </div>
        </div>

        <div className="py-output">
          <div className="py-output-head">Sortie</div>
          <pre>{output || '—'}</pre>
          {success && <p className="py-success">✓ Bravo, résultat attendu atteint.</p>}
          {error && <p className="py-error">{error}</p>}
        </div>
      </div>

      <details className="py-hint">
        <summary>Indice</summary>
        <p>{hint}</p>
      </details>
    </div>
  )
}