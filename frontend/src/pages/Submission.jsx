import { useState } from 'react'
import usePersistentState from '../usePersistentState'

export default function Submission() {
  const [form, setForm] = usePersistentState('submission_form', { github: '', video: '', ppt: '' })
  const [submittedAt, setSubmittedAt] = usePersistentState('submission_time', null)
  const [error, setError] = useState('')

  // Abhi fake deadline. Baad mein server se aayega.
  const deadlinePassed = false

  const inputClass =
    'w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.github.startsWith('https://github.com/')) {
      setError('GitHub link https://github.com/ se shuru hona chahiye')
      return
    }
    setError('')
    setSubmittedAt(new Date().toLocaleString())
  }

  const resetSubmission = () => {
    setForm({ github: '', video: '', ppt: '' })
    setSubmittedAt(null)
    setError('')
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500 space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Project Submission</h1>

        {submittedAt && (
          <p className="bg-green-100 text-green-800 p-2 rounded text-sm">
            Submitted at: {submittedAt}
          </p>
        )}
        {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</p>}
        {deadlinePassed && <p className="bg-red-100 text-red-700 p-2 rounded text-sm">Deadline nikal chuka hai.</p>}

        <input name="github" className={inputClass} placeholder="GitHub repo link"
          value={form.github} onChange={handleChange} />
        <input name="video" className={inputClass} placeholder="Demo video link"
          value={form.video} onChange={handleChange} />
        <input name="ppt" className={inputClass} placeholder="PPT / PDF link"
          value={form.ppt} onChange={handleChange} />

        <button
          disabled={deadlinePassed}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg font-semibold disabled:bg-gray-400"
        >
          Submit Project
        </button>

        {submittedAt && (
          <button type="button" onClick={resetSubmission} className="w-full text-sm text-red-600 hover:underline">
            Reset submission
          </button>
        )}
      </form>
    </div>
  )
}