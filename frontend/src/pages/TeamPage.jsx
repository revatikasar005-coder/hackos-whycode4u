import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePersistentState from '../usePersistentState'

const LEADER = { id: 1, name: 'Revati (Leader)', email: 'revati@example.com' }

export default function TeamPage() {
  const navigate = useNavigate()

  // Ye 4 refresh ke baad bhi save rahenge
  const [teamName, setTeamName] = usePersistentState('team_name', '')
  const [track, setTrack] = usePersistentState('team_track', 'Track 3 - Future of Hackathons')
  const [created, setCreated] = usePersistentState('team_created', false)
  const [members, setMembers] = usePersistentState('team_members', [LEADER])

  // Ye temporary hain, save karne ki zarurat nahi
  const [mName, setMName] = useState('')
  const [mEmail, setMEmail] = useState('')
  const [error, setError] = useState('')

  const inputClass =
    'w-full border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400'
  const cardClass = 'bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500'

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
    if (!mName.trim() || !mEmail.trim()) {
      setError('Member ka naam aur email dono daalo')
      return
    }
    if (members.length >= 4) {
      setError('Ek team mein maximum 4 members ho sakte hain')
      return
    }
    if (members.some((m) => m.email.toLowerCase() === mEmail.trim().toLowerCase())) {
      setError('Ye member pehle se team mein hai')
      return
    }
    setError('')
    setMembers([...members, { id: Date.now(), name: mName.trim(), email: mEmail.trim() }])
    setMName('')
    setMEmail('')
  }

  const removeMember = (id) => setMembers(members.filter((m) => m.id !== id))

  const resetTeam = () => {
    setTeamName('')
    setTrack('Track 3 - Future of Hackathons')
    setCreated(false)
    setMembers([LEADER])
    setError('')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Team</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</p>}

      {!created ? (
        <form onSubmit={createTeam} className={cardClass + ' space-y-3'}>
          <h2 className="font-bold text-slate-800">Team banao</h2>
          <input
            className={inputClass}
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <select className={inputClass} value={track} onChange={(e) => setTrack(e.target.value)}>
            <option>Track 1 - Healthcare</option>
            <option>Track 2 - Environment</option>
            <option>Track 3 - Future of Hackathons</option>
          </select>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg font-semibold">
            Create team
          </button>
        </form>
      ) : (
        <>
          <div className={cardClass + ' flex items-center justify-between'}>
            <div>
              <p className="text-gray-500 text-sm">Team</p>
              <p className="text-xl font-bold text-slate-800">{teamName}</p>
              <p className="text-sm text-gray-600">{track}</p>
            </div>
            <button onClick={resetTeam} className="text-sm text-red-600 hover:underline">
              Reset team
            </button>
          </div>

          <div className={cardClass + ' space-y-3'}>
            <h2 className="font-bold text-slate-800">Members ({members.length}/4)</h2>

            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between border-b py-2 last:border-0">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.email}</p>
                </div>
                {m.id !== 1 && (
                  <button onClick={() => removeMember(m.id)} className="text-red-600 text-sm hover:underline">
                    Remove
                  </button>
                )}
              </div>
            ))}

            <form onSubmit={addMember} className="space-y-2 pt-2">
              <input
                className={inputClass}
                placeholder="Member name"
                value={mName}
                onChange={(e) => setMName(e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Member email"
                value={mEmail}
                onChange={(e) => setMEmail(e.target.value)}
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold">
                Add member
              </button>
            </form>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg font-semibold mt-2"
            >
              Save team and go to Dashboard
            </button>
          </div>
        </>
      )}
    </div>
  )
}