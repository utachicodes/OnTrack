'use client'

import { useCallback, useRef, useState } from 'react'
import { AlertCircle, Check, ChevronRight, Loader2, Play, RefreshCcw } from 'lucide-react'

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
  const [code, setCode]     = useState(starter)
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ready'|'running'|'error'>('idle')
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const pyodideRef = useRef<PyodideLike | null>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  const lineCount = code.split('\n').length

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
    setError(''); setOutput(''); setSuccess(false)
    try {
      setStatus('running')
      const py = await ensurePyodide()
      await py.runPythonAsync(`import sys, io\n_stdout = io.StringIO()\nsys.stdout = _stdout`)
      await py.runPythonAsync(code)
      const captured = await py.runPythonAsync(`_out = _stdout.getvalue()\nsys.stdout = sys.__stdout__\n_out`)
      const text = typeof captured === 'string' ? captured : String(captured ?? '')
      setOutput(text); setStatus('ready')
      if (expected && text.trim() === expected.trim()) setSuccess(true)
    } catch (e) {
      setStatus('error')
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  function reset() {
    setCode(starter); setOutput(''); setError(''); setSuccess(false); setStatus('idle')
  }

  /** Tab key inserts 4 spaces instead of focusing next element */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.currentTarget
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const next = code.substring(0, start) + '    ' + code.substring(end)
      setCode(next)
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4
      })
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      run()
    }
  }

  const busy = status === 'loading' || status === 'running'

  return (
    <div className="py-runner">
      {/* Task banner */}
      <div className="py-task">
        <ChevronRight size={13} className="py-task-icon" />
        <div>
          <p className="py-task-label">Mission</p>
          <p className="py-task-text">{task}</p>
        </div>
      </div>

      <div className="py-stage">
        {/* Editor pane */}
        <div className="py-editor">
          <div className="py-editor-head">
            <span className="py-lang-dot" />
            <span className="py-lang-name">Python 3</span>
            <span className="py-shortcut">Ctrl+Enter pour exécuter</span>
            <span className={`py-status py-status--${status}`}>
              {status === 'loading' && <><Loader2 size={11} className="auth-spin" /> Chargement…</>}
              {status === 'ready'   && <><span className="py-dot-ready" />Prêt</>}
              {status === 'running' && <><Loader2 size={11} className="auth-spin" /> Exécution…</>}
              {status === 'idle'    && 'En attente'}
              {status === 'error'   && <><AlertCircle size={11} /> Erreur</>}
            </span>
          </div>

          <div className="py-code-wrap">
            {/* Line numbers */}
            <div className="py-lines" aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <textarea
              ref={taRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              aria-label="Code Python"
              className="py-textarea"
              rows={Math.max(8, lineCount + 1)}
            />
          </div>

          <div className="py-actions">
            <button className="primary-button" onClick={run} disabled={busy}>
              {busy
                ? <Loader2 size={14} className="auth-spin" />
                : <Play size={14} fill="currentColor" />}
              {busy ? 'Exécution…' : 'Exécuter'}
            </button>
            <button className="ghost-button" onClick={reset} disabled={busy}>
              <RefreshCcw size={13} /> Réinitialiser
            </button>
          </div>
        </div>

        {/* Output pane */}
        <div className="py-output">
          <div className="py-output-head">
            Sortie
            {success && <span className="py-badge-ok"><Check size={10} /> Correct</span>}
          </div>
          <pre className={`py-pre${error ? ' py-pre--error' : ''}`}>
            {error || output || (status === 'idle' ? '— Lance le code pour voir la sortie.' : '…')}
          </pre>
        </div>
      </div>

      {/* Hint */}
      <button className="py-hint-toggle" onClick={() => setHintOpen(h => !h)}>
        {hintOpen ? 'Masquer l\'indice' : 'Voir un indice'}
      </button>
      {hintOpen && <pre className="py-hint-body">{hint}</pre>}
    </div>
  )
}
