import { useState } from 'react'

const rubric = [
  { key: 'innovation', label: 'Innovation & relevance', max: 20 },
  { key: 'technical', label: 'Technical implementation', max: 30 },
  { key: 'usability', label: 'Usability & accessibility', max: 20 },
  { key: 'responsible', label: 'Responsible use of data/AI', max: 15 },
  { key: 'demo', label: 'Quality of demonstration', max: 15 },
]

const teams = [
  { id: 1, name: 'Code Queens' },
  { id: 2, name: 'Byte Force' },
  { id: 3, name: 'Null Pointers' },
  { id: 4, name: 'Pixel Pirates' },
]

const judgeName = 'Judge 1'

const totalOf = (values) =>
  rubric.reduce((sum, r) => sum + (Number(values[r.key]) || 0), 0)

export default function JudgePage() {
  const [selected, setSelected] = useState(teams[0].id)
  const [drafts, setDrafts] = useState({})
  const [saved, setSaved] = useState({})
  const [audit, setAudit] = useState([])

  const current = drafts[selected] || saved[selected] || {}

  const handleChange = (r, value) => {
    const clamped = Math.min(r.max, Math.max(0, Number(value) || 0))
    setDrafts({ ...drafts, [selected]: { ...current, [r.key]: clamped } })
  }

  const handleSave = () => {
    const newTotal = totalOf(current)
    const oldTotal = saved[selected] ? totalOf(saved[selected]) : null
    const team = teams.find((t) => t.id === selected)

    setSaved({ ...saved, [selected]: current })
    setAudit([
      {
        id: Date.now(),
        time: new Date().toLocaleString(),
        judge: judgeName,
        team: team.name,
        oldTotal,
        newTotal,
      },
      ...audit,
    ])
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Judge Scoring ({judgeName})</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-2">Assigned teams</h2>
          {teams.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={
                'w-full text-left p-2 rounded mb-1 ' +
                (selected === t.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100')
              }
            >
              {t.name}
              {saved[t.id] && <span className="float-right">{totalOf(saved[t.id])}/100</span>}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow space-y-3">
          <h2 className="font-bold">
            Score: {teams.find((t) => t.id === selected).name}
          </h2>

          {rubric.map((r) => (
            <div key={r.key} className="flex items-center justify-between gap-4">
              <label className="text-sm">
                {r.label} <span className="text-gray-500">(max {r.max})</span>
              </label>
              <input
                type="number"
                min="0"
                max={r.max}
                className="w-20 border p-1 rounded text-right"
                value={current[r.key] ?? ''}
                onChange={(e) => handleChange(r, e.target.value)}
              />
            </div>
          ))}

          <div className="flex items-center justify-between border-t pt-3">
            <p className="font-bold">Total: {totalOf(current)} / 100</p>
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save score
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h2 className="font-bold mb-2">Audit log</h2>
        {audit.length === 0 ? (
          <p className="text-sm text-gray-500">Abhi koi score save nahi hua.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Time</th>
                <th>Judge</th>
                <th>Team</th>
                <th>Old total</th>
                <th>New total</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-2">{a.time}</td>
                  <td>{a.judge}</td>
                  <td>{a.team}</td>
                  <td>{a.oldTotal ?? '-'}</td>
                  <td>{a.newTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}