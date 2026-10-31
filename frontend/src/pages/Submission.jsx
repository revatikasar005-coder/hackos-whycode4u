import { useState } from 'react'

export default function Submission() {
  const [form, setForm] = useState({ github: '', video: '', ppt: '' })
  const [submittedAt, setSubmittedAt] = useState(null)
  const [error, setError] = useState('')

  // Abhi fake deadline. Baad mein server se aayega.
  const deadlinePassed = false

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

  return (
    <div className="max-w-xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-bold">Project Submission</h1>

        {submittedAt && (
          <p className="bg-green-100 text-green-800 p-2 rounded text-sm">
            Submitted at: {submittedAt}
          </p>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {deadlinePassed && <p className="text-red-600 text-sm">Deadline nikal chuka hai.</p>}

        <input name="github" className="w-full border p-2 rounded" placeholder="GitHub repo link"
          value={form.github} onChange={handleChange} />
        <input name="video" className="w-full border p-2 rounded" placeholder="Demo video link"
          value={form.video} onChange={handleChange} />
        <input name="ppt" className="w-full border p-2 rounded" placeholder="PPT / PDF link"
          value={form.ppt} onChange={handleChange} />

        <button disabled={deadlinePassed}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-gray-400">
          Submit Project
        </button>
      </form>
    </div>
  )
}