import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const WORDS = ['QR check-in', 'team management', 'fair judging', 'live leaderboard']

const stats = [
  { to: 3, l: '🎭 User roles' },
  { to: 10, l: '🖥️ Screens' },
  { to: 8, l: '⚡ Core features' },
  { to: 5, l: '🏁 Steps to the win' },
]

const problems = [
  { icon: '🐌', title: 'Slow manual check-in', text: 'Long queues and paper lists at the venue waste everyone’s time.' },
  { icon: '📶', title: 'Weak venue internet', text: 'Most tools fail exactly when hundreds of people connect at once.' },
  { icon: '🗂️', title: 'Scattered tools', text: 'Forms, sheets and chats for registration, teams and scores, nothing connected.' },
  { icon: '🕵️', title: 'No transparency', text: 'Participants cannot see how scores were given or changed.' },
]

const features = [
  { icon: '📱', title: 'QR Check-in', text: 'Each participant gets a personal QR code, scanned in about a second.' },
  { icon: '📴', title: 'Offline First', text: 'The scanner queues scans on the device and syncs them when the network returns.' },
  { icon: '👥', title: 'Team Management', text: 'Create a team, track its status and submit progress checkpoints.' },
  { icon: '📤', title: 'Project Submission', text: 'Auto-save keeps work safe even if the browser closes.' },
  { icon: '⚖️', title: 'Fair Judging', text: 'Judges score teams in a structured way, with changes recorded.' },
  { icon: '🧾', title: 'Audit Trail', text: 'Organizers can review who did what and when.' },
  { icon: '🏅', title: 'Live Leaderboard', text: 'Rankings update as scores come in, so everyone sees the same result.' },
  { icon: '🔐', title: 'Role-based Access', text: 'Participants, organizers and judges only see their own screens.' },
]

const steps = [
  { n: '01', icon: '📝', title: 'Register', text: 'Sign up and create or join a team.' },
  { n: '02', icon: '📲', title: 'Check in', text: 'Scan the QR code at the venue.' },
  { n: '03', icon: '📤', title: 'Submit', text: 'Send progress and the final project.' },
  { n: '04', icon: '⚖️', title: 'Judge', text: 'Judges score, every action is logged.' },
  { n: '05', icon: '🏆', title: 'Win', text: 'The leaderboard shows results instantly.' },
]

const roles = [
  { icon: '🧑‍💻', title: 'Participant', points: ['Register and manage the team', 'Get a personal check-in QR', 'Submit work and track progress'] },
  { icon: '🛠️', title: 'Organizer', points: ['Scan QR codes at the venue', 'Monitor check-ins', 'Review the audit log'] },
  { icon: '🧑‍⚖️', title: 'Judge', points: ['See submitted projects', 'Give structured scores', 'Watch the leaderboard update'] },
]

const tech = ['⚛️ React', '🎨 Tailwind CSS', '🧭 React Router', '💾 Dexie (IndexedDB)', '⚡ Vite', '▲ Vercel', '🐙 GitHub', '🔌 REST APIs']

const privacy = [
  { icon: '🛡️', title: 'Minimal data', text: 'Only the details needed for the event are collected.' },
  { icon: '🔒', title: 'Role-based screens', text: 'Each role can only open its own pages.' },
  { icon: '🧾', title: 'Accountable actions', text: 'Important actions are recorded in the audit trail.' },
]

const faqs = [
  { q: '📴 Does QR check-in work without internet?', a: 'Yes. Scans are stored in the browser on the device and are meant to sync once the connection is back.' },
  { q: '🎭 Who can see what?', a: 'Participants, organizers and judges each get their own screens. Pages are protected by role.' },
  { q: '⚖️ How are scores kept fair?', a: 'Judges use a structured scoring form, and the audit log records important actions.' },
  { q: '🔐 Is my data safe?', a: 'HackOS collects only what the event needs. See the privacy section above for the approach.' },
]

const future = [
  'Real-time sync with the backend for every screen',
  'Email and SMS notifications for teams',
  'Analytics dashboard for organizers',
  'Multi-event support and custom judging rubrics',
]

const team = [
  { name: 'Revati', role: 'Frontend & Deployment', emoji: '💻' },
  { name: 'Anuma', role: 'Backend & Database', emoji: '🗄️' },
  { name: 'Rutuja', role: 'Docs, Design & Sync', emoji: '📝' },
]

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('show')
        io.disconnect()
      }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms`, height: '100%' }}>
      {children}
    </div>
  )
}

function Typewriter({ words }) {
  const [i, setI] = useState(0)
  const [txt, setTxt] = useState('')
  const [del, setDel] = useState(false)

  useEffect(() => {
    const word = words[i]
    let delay = del ? 45 : 85
    if (!del && txt === word) delay = 1400
    if (del && txt === '') delay = 300
    const t = setTimeout(() => {
      if (!del && txt === word) setDel(true)
      else if (del && txt === '') {
        setDel(false)
        setI((i + 1) % words.length)
      } else setTxt(del ? word.slice(0, txt.length - 1) : word.slice(0, txt.length + 1))
    }, delay)
    return () => clearTimeout(t)
  }, [txt, del, i, words])

  return <span className="shimmer-text">{txt}<span className="cursor" /></span>
}

function CountUp({ to }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const el = ref.current
    let raf
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / 1200, 1)
        setN(Math.round(to * p))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to])
  return <span ref={ref}>{n}</span>
}

function SectionTitle({ title, sub }) {
  return (
    <Reveal>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', marginBottom: 8 }}>{title}</h2>
        {sub && <p style={{ maxWidth: 520, margin: '0 auto' }}>{sub}</p>}
      </div>
    </Reveal>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {faqs.map((f, idx) => (
        <div key={f.q} className="faq">
          <button type="button" className="faq-q" onClick={() => setOpen(open === idx ? -1 : idx)}>
            <span>{f.q}</span>
            <span>{open === idx ? '➖' : '➕'}</span>
          </button>
          {open === idx && <p className="faq-a">{f.a}</p>}
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: 340, height: 340, background: '#ff4fa3', top: -90, left: -90 }} />
      <div className="orb" style={{ width: 280, height: 280, background: '#ff8ac4', top: 220, right: -90, animationDelay: '2s' }} />
      <div className="orb" style={{ width: 300, height: 300, background: '#ff4fa3', top: 1500, left: -110, animationDelay: '4s' }} />

      <div style={{ position: 'relative', maxWidth: 1120, margin: '0 auto', padding: '0 20px 80px' }}>
        {/* HERO */}
        <section style={{ textAlign: 'center', padding: '72px 0 48px' }}>
          <span className="pill fade-up">🏆 Built by Code Queens</span>
          <h1 className="fade-up d1" style={{ fontSize: 'clamp(2.1rem, 6vw, 3.9rem)', fontWeight: 800, maxWidth: 820, margin: '18px auto 0' }}>
            Run your hackathon with smarter <Typewriter words={WORDS} />
          </h1>
          <p className="fade-up d2" style={{ maxWidth: 640, margin: '18px auto 0', fontSize: '1.05rem', color: '#d4d4d8' }}>
            🎟️ Registration, 👥 teams, 📱 QR check-in, ⚖️ judging and a 🏅 live leaderboard, all in one place.
            Works even when the internet doesn’t. 📴
          </p>
          <div className="btn-row center fade-up d3" style={{ marginTop: 30 }}>
            <Link to="/register"><button className="btn-lg btn-glow">🚀 Get Started</button></Link>
            <Link to="/login"><button className="btn-lg btn-outline">🔐 Login</button></Link>
          </div>
        </section>

        {/* STATS */}
        <section className="grid-auto fade-up d4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {stats.map((s) => (
            <div key={s.l} className="stat">
              <b className="shimmer-text"><CountUp to={s.to} /></b>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{s.l}</span>
            </div>
          ))}
        </section>

        {/* PROBLEM */}
        <section style={{ marginTop: 96 }}>
          <SectionTitle title="😩 The problem with running hackathons" sub="Events today juggle slow, disconnected tools." />
          <div className="grid-auto">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="glass" style={{ padding: 24, height: '100%' }}>
                  <div className="icon-box">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p style={{ margin: 0, fontSize: 14 }}>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SOLUTION */}
        <Reveal className="">
          <section className="glass glass-static" style={{ marginTop: 96, padding: '44px 28px', textAlign: 'center' }}>
            <span className="pill">💡 Our solution</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', marginTop: 16 }}>
              One platform. <span className="shimmer-text">Online or offline.</span>
            </h2>
            <p style={{ maxWidth: 680, margin: '8px auto 0', color: '#d4d4d8' }}>
              HackOS connects participants, organizers and judges in a single flow. The QR scanner keeps a
              local queue when the network drops, so the event never stops. ✨
            </p>
          </section>
        </Reveal>

        {/* FEATURES */}
        <section style={{ marginTop: 96 }}>
          <SectionTitle title="⚡ Everything an event needs" sub="Built for all three roles, from check-in to results." />
          <div className="grid-auto">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 4) * 80}>
                <div className="glass" style={{ padding: 24, height: '100%' }}>
                  <div className="icon-box">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p style={{ margin: 0, fontSize: 14 }}>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ marginTop: 96 }}>
          <SectionTitle title="🧭 How it works" sub="From sign-up to the winner’s podium in five steps." />
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="glass" style={{ padding: 24, height: '100%' }}>
                  <div className="shimmer-text" style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.1 }}>{s.n}</div>
                  <div style={{ fontSize: 26, margin: '8px 0' }}>{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p style={{ margin: 0, fontSize: 14 }}>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ROLES */}
        <section style={{ marginTop: 96 }}>
          <SectionTitle title="🎭 Built for every role" sub="Each user gets a focused workspace." />
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {roles.map((r, i) => (
              <Reveal key={r.title} delay={i * 100}>
                <div className="glass" style={{ padding: 28, height: '100%' }}>
                  <div className="icon-box">{r.icon}</div>
                  <h3 style={{ fontSize: '1.3rem' }}>{r.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', display: 'grid', gap: 10 }}>
                    {r.points.map((p) => (
                      <li key={p} style={{ display: 'flex', gap: 8, fontSize: 14, color: '#d4d4d8' }}>
                        <span>✅</span><span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TECH TICKER */}
        <section style={{ marginTop: 96 }}>
          <SectionTitle title="🛠️ Tech stack" />
          <div className="marquee">
            <div className="marquee-track">
              {[...tech, ...tech].map((t, i) => (
                <span key={t + i} className="pill" style={{ fontSize: 14, padding: '8px 18px' }}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* PRIVACY */}
        <section style={{ marginTop: 96 }}>
          <SectionTitle title="🛡️ Privacy & trust" sub="Designed so everyone can rely on the data." />
          <div className="grid-auto">
            {privacy.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div className="glass" style={{ padding: 24, height: '100%' }}>
                  <div className="icon-box">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p style={{ margin: 0, fontSize: 14 }}>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginTop: 96 }}>
          <SectionTitle title="❓ Frequently asked questions" />
          <Reveal><Faq /></Reveal>
        </section>

        {/* FUTURE */}
        <section style={{ marginTop: 96 }}>
          <SectionTitle title="🚀 Future scope" />
          <div className="grid-auto" style={{ maxWidth: 800, margin: '0 auto', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {future.map((f, i) => (
              <Reveal key={f} delay={i * 80}>
                <div className="glass" style={{ padding: 20, display: 'flex', gap: 12, alignItems: 'flex-start', height: '100%' }}>
                  <span style={{ fontSize: 22 }}>🌟</span>
                  <p style={{ margin: 0, fontSize: 14, color: '#d4d4d8' }}>{f}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section style={{ marginTop: 96 }}>
          <SectionTitle title="👑 Meet Team Code Queens" />
          <div className="grid-auto" style={{ maxWidth: 800, margin: '0 auto', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 100}>
                <div className="glass" style={{ padding: 24, textAlign: 'center', height: '100%' }}>
                  <div style={{
                    width: 68, height: 68, borderRadius: '50%', margin: '0 auto 12px',
                    background: 'var(--grad)', color: 'var(--on-pink)', fontSize: 30,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{m.emoji}</div>
                  <h3 style={{ marginBottom: 2 }}>{m.name}</h3>
                  <p style={{ margin: 0, fontSize: 13 }}>{m.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <Reveal>
          <section className="glass glass-static" style={{ marginTop: 96, padding: '52px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)' }}>🎬 Ready to see it in action?</h2>
            <p style={{ maxWidth: 520, margin: '0 auto 24px' }}>
              Explore the live leaderboard or log in as a participant, organizer or judge.
            </p>
            <div className="btn-row center">
              <Link to="/login"><button className="btn-lg btn-glow">🔐 Login to HackOS</button></Link>
              <Link to="/leaderboard"><button className="btn-lg btn-outline">🏅 View Leaderboard</button></Link>
            </div>
          </section>
        </Reveal>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '22px 0', textAlign: 'center', fontSize: 13, color: '#71717a' }}>
        © 2026 HackOS · Built with 💖 by IdeaForge_ra
        
      </footer>
    </div>
  )
}