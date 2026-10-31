import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { db } from './db'

const box = { background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 4px #0002', marginBottom: 16 }

export default function App() {
  const [online, setOnline] = useState(navigator.onLine)
  const [rows, setRows] = useState([])
  const [userId, setUserId] = useState('USER-001')
  const [qr, setQr] = useState('')
  const [msg, setMsg] = useState('')

  const refresh = async () => setRows(await db.checkins.orderBy('id').reverse().toArray())

  const makeQr = async () => setQr(await QRCode.toDataURL(userId.trim()))

  const addScan = async () => {
    const id = userId.trim()
    if (!id) return
    const exists = await db.checkins.where('userId').equals(id).first()
    if (exists) {
      setMsg(id + ': Already checked in')
      return
    }
    await db.checkins.add({ userId: id, scannedAt: new Date().toISOString(), status: 'pending' })
    setMsg(id + ': scan saved' + (navigator.onLine ? '' : ' (offline)'))
    refresh()
  }

  const syncNow = async () => {
    const pending = await db.checkins.where('status').equals('pending').toArray()
    if (!pending.length) {
      setMsg('Nothing to sync')
      return
    }
    // Abhi fake server. Baad mein yahan POST /checkin/bulk aayega (Anuma ki API).
    await new Promise((r) => setTimeout(r, 500))
    await db.checkins.where('status').equals('pending').modify({ status: 'synced' })
    setMsg(pending.length + ' scan(s) synced')
    refresh()
  }

  useEffect(() => {
    refresh()
    const goOnline = () => {
      setOnline(true)
      syncNow()
    }
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  const pendingCount = rows.filter((r) => r.status === 'pending').length

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <h1>Offline Check-in Test</h1>
      <p>
        Status:{' '}
        <b style={{ color: online ? 'green' : 'crimson' }}>{online ? 'Online' : 'Offline'}</b>
      </p>

      {msg && <p style={{ background: '#ccfbf1', padding: 8, borderRadius: 8 }}>{msg}</p>}

      <div style={box}>
        <h3>1. QR banao</h3>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} style={{ padding: 8 }} />
        <button onClick={makeQr} style={{ marginLeft: 8, padding: 8 }}>Generate QR</button>
        {qr && <div><img src={qr} alt="QR" width="160" /></div>}
      </div>

      <div style={box}>
        <h3>2. Scan save karo (local database mein)</h3>
        <button onClick={addScan} style={{ padding: 8 }}>Add scan for {userId}</button>
      </div>

      <div style={box}>
        <h3>3. Sync (pending: {pendingCount})</h3>
        <button onClick={syncNow} disabled={!online || !pendingCount} style={{ padding: 8 }}>
          Sync now
        </button>
        {rows.map((r) => (
          <p key={r.id} style={{ borderBottom: '1px solid #ddd', margin: '6px 0' }}>
            {r.userId} - <b>{r.status}</b>
          </p>
        ))}
      </div>
    </div>
  )
}