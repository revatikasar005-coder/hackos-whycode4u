import { useState } from 'react'

// Fake data. Baad mein Anuma ki GET /audit-logs API se aayega.
const logs = [
  { id: 1, time: '31-10-2026 10:15 AM', actor: 'Judge 1', action: 'SCORE_CREATED', record: 'Code Queens', oldValue: '-', newValue: '82' },
  { id: 2, time: '31-10-2026 10:40 AM', actor: 'Judge 1', action: 'SCORE_UPDATED', record: 'Code Queens', oldValue: '82', newValue: '89' },
  { id: 3, time: '31-10-2026 11:05 AM', actor: 'Judge 2', action: 'SCORE_CREATED', record: 'Byte Force', oldValue: '-', newValue: '80' },
  { id: 4, time: '31-10-2026 11:30 AM', actor: 'Organizer', action: 'TEAM_MEMBER_ADDED', record: 'Null Pointers', oldValue: '2 members', newValue: '3 members' },
  { id: 5, time: '31-10-2026 12:10 PM', actor: 'Organizer', action: 'DUPLICATE_MERGED', record: 'Revati S / Revati Sharma', oldValue: '2 records', newValue: '1 record' },
  { id: 6, time: '31-10-2026 12:45 PM', actor: 'Volunteer 1', action: 'CHECKIN_SYNCED', record: 'USER-014', oldValue: 'pending', newValue: 'synced' },
]

export default function AuditLog() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')

  const actions = ['ALL', ...new Set(logs.map((l) => l.action))]

  const shown = logs.filter((l) => {
    const matchAction = actionFilter === 'ALL' || l.action === actionFilter
    const text = (l.actor + ' ' + l.record).toLowerCase()
    return matchAction && text.includes(search.toLowerCase())
  })

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Audit Log</h1>
      <p className="text-sm text-gray-600">
        Ye log sirf padh sakte hain. Isme koi entry edit ya delete nahi ho sakti.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Actor ya team search karo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          {actions.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Time</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Record</th>
              <th>Old</th>
              <th>New</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="py-2 whitespace-nowrap">{l.time}</td>
                <td>{l.actor}</td>
                <td className="font-mono text-xs">{l.action}</td>
                <td>{l.record}</td>
                <td>{l.oldValue}</td>
                <td className="font-semibold">{l.newValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && (
          <p className="text-sm text-gray-500 py-4">Koi entry nahi mili.</p>
        )}
      </div>
    </div>
  )
}