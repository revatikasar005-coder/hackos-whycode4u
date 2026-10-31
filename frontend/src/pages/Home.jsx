import { Link } from 'react-router-dom'

const features = [
  { icon: '📝', title: 'Smart Registration', text: 'Duplicate email or phone gets flagged automatically.' },
  { icon: '👥', title: 'Team Management', text: 'Create teams, add members, keep a clear record.' },
  { icon: '📱', title: 'QR Check-in', text: 'Every participant gets a personal QR code.' },
  { icon: '🚀', title: 'Timestamped Submission', text: 'GitHub, video and PPT links with submission time.' },
  { icon: '⚖️', title: 'Fair Judging', text: 'Rubric-based scores with a full audit trail.' },
  { icon: '🏆', title: 'Live Leaderboard', text: 'Instant ranking and one-click CSV export.' },
]

export default function Home() {
  return (
    <div>
      <section
        className="text-white text-center px-6 py-20"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #7c3aed 100%)' }}
      >
        <p className="text-sm tracking-widest uppercase opacity-80">WhyCode4U Hackathon 2026</p>
        <h1 className="text-5xl md:text-6xl font-extrabold mt-3">HackOS</h1>
        <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto opacity-90">
          A reliable operating system for hackathon delivery: from registration to final results, in one place.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/register" className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-50">
            Get Started
          </Link>
          <Link to="/login" className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10">
            Login
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">Everything an organizer needs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-5 rounded-xl shadow-md border-t-4 border-indigo-500">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="font-bold mt-2 text-slate-800">{f.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}