import { useState } from 'react'

const stats = { registered: 120, checkedIn: 84, teams: 32, submissionsPending: 14 }

const initialTeams = [
  { id: 1, name: 'Code Queens', members: 3, checkedIn: true, submitted: true },
  { id: 2, name: 'Byte Force', members: 4, checkedIn: true, submitted: false },
  { id: 3, name: 'Null Pointers', members: 3, checkedIn: false, submitted: false },
  { id: 4, name: 'Pixel Pirates', members: 2, checkedIn: true, submitted: true },
]

export default function OrganizerDashboard() {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Welcome', message: 'Check-in opens at 9 AM.' },
  ])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const addAnnouncement = (e) => {
    e.preventDefault()
    if (!title || !message) return
    setAnnouncements([{ id: Date.now(), title, message }, ...announcements])
    setTitle('')
    setMessage('')
  }

  const percent = Math.round((stats.checkedIn / stats.registered) * 100)

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Organizer Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Registered</p>
          <p className="text-2xl font-bold">{stats.registered}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Checked-in</p>
          <p className="text-2xl font-bold">{stats.checkedIn}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Teams</p>
          <p className="text-2xl font-bold">{stats.teams}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Submissions pending</p>
          <p className="text-2xl font-bold">{stats.submissionsPending}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <p className="font-semibold mb-2">Check-in progress: {percent}%</p>
        <div className="w-full bg-gray-200 rounded h-3">
          <div className="bg-blue-600 h-3 rounded" style={{ width: percent + '%' }}></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h2 className="font-bold mb-2">Teams</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Team</th>
              <th>Members</th>
              <th>Check-in</th>
              <th>Submission</th>
            </tr>
          </thead>
          <tbody>
            {initialTeams.map((t) => (
              <tr key={t.id} className="border-b last:border-0">
                <td className="py-2 font-medium">{t.name}</td>
                <td>{t.members}</td>
                <td>{t.checkedIn ? 'Done' : 'Pending'}</td>
                <td>{t.submitted ? 'Submitted' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-bold">Announcements</h2>
        <form onSubmit={addAnnouncement} className="space-y-2">
          <input className="w-full border p-2 rounded" placeholder="Title"
            value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full border p-2 rounded" placeholder="Message"
            value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
        </form>
        {announcements.map((a) => (
          <div key={a.id} className="border-t pt-2">
            <p className="font-semibold">{a.title}</p>
            <p className="text-sm text-gray-600">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}