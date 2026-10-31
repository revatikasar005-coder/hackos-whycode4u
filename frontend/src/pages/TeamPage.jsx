import { useState } from 'react'

export default function TeamPage() {
  const [teamName, setTeamName] = useState('')
  const [track, setTrack] = useState('Track 3')
  const [created, setCreated] = useState(false)
  const [members, setMembers] = useState([{ id: 1, name: 'Revati (Leader)', email: 'revati@example.com' }])
  const [mName, setMName] = useState('')
  const [mEmail, setMEmail] = useState('')
  const [error, setError] = useState('')

  const createTeam = (e) => {
    e.preventDefault()
    if (!teamName.trim()) {
      setError('Team ka naam daalo')
      return
    }
    setError('')
    setCreated(true)
  }

  const addMember = (e) => {
    e.preventDefault()
    if (!mName || !mEmail) {
      setError('Member ka naam aur email dono daalo')
      return
    }
    if (members.length >= 4) {
      setError('Ek team mein maximum 4 members ho sakte hain')
      return
    }
    if (members.some((m) => m.email.toLowerCase() === mEmail.toLowerCase())) {
      setError('Ye member pehle se team mein hai')
      return
    }
    setError('')
    setMembers([...members, { id: Date.now(), name: mName, email: mEmail }])
    setMName('')
    setMEmail('')
  }

  const removeMember = (id) => setMembers(members.filter((m) => m.id !== id || m.id === 1))

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Team</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</p>}

      {!created ? (
        <form onSubmit={createTeam} className="bg-white p-6 rounded-xl shadow space-y-3">
          <h2 className="font-bold">Team banao</h2>
          <input className="w-full border p-2 rounded" placeholder="Team name"
            value={teamName} onChange={(e) => setTeamName(e.target.value)} />
          <select className="w-full border p-2 rounded" value={track} onChange={(e) => setTrack(e.target.value)}>
            <option>Track 1 - Healthcare</option>
            <option>Track 2 - Environment</option>
            <option>Track 3 - Future of Hackathons</option>
          </select>
          <button className="w-full bg-blue-600 text-white p-2 rounded">Create team</button>
        </form>
      ) : (
        <>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Team</p>
            <p className="text-xl font-bold">{teamName}</p>
            <p className="text-sm text-gray-600">{track}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow space-y-3">
            <h2 className="font-bold">Members ({members.length}/4)</h2>
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between border-b py-2 last:border-0">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.email}</p>
                </div>
                {m.id !== 1 && (
                  <button onClick={() => removeMember(m.id)} className="text-red-600 text-sm">
                    Remove
                  </button>
                )}
              </div>
            ))}

            <form onSubmit={addMember} className="space-y-2 pt-2">
              <input className="w-full border p-2 rounded" placeholder="Member name"
                value={mName} onChange={(e) => setMName(e.target.value)} />
              <input className="w-full border p-2 rounded" placeholder="Member email"
                value={mEmail} onChange={(e) => setMEmail(e.target.value)} />
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Add member</button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}