import { currentUser, announcements, schedule, submission } from '../data'

export default function ParticipantDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Hi, {currentUser.name}!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Team</p>
          <p className="font-semibold">{currentUser.teamName}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Check-in</p>
          <p className="font-semibold">{currentUser.checkedIn ? 'Done' : 'Pending'}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Submission</p>
          <p className="font-semibold">{submission.status}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-2">Announcements</h2>
        {announcements.map((a) => (
          <div key={a.id} className="border-b py-2 last:border-0">
            <p className="font-semibold">{a.title}</p>
            <p className="text-sm text-gray-600">{a.message}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-2">Schedule</h2>
        {schedule.map((s) => (
          <div key={s.time} className="flex gap-4 py-1">
            <span className="w-24 text-gray-500">{s.time}</span>
            <span>{s.event}</span>
          </div>
        ))}
      </div>
    </div>
  )
}