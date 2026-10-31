import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { db } from './db'

// offline/.env mein likho: VITE_API_URL=http://localhost:5000
// Khali chhodoge to demo mode (fake sync) chalega.
const API = import.meta.env.VITE_API_URL || ''

const box = { background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 4px #0002', marginBottom: 16 }
const btn = { padding: 8, marginRight: 8 }

function Scanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 220 }, false)
    scanner.render((text) => onScan(text.trim()), () => {})
    return () => {
      scanner.clear().catch(() => {})
    }
  }, [])
  return <div id="reader" />
}

export default function App() {
  const [online, setOnline] = useState(navigator.onLine)
  const [rows, setRows] = useState([])
  const [userId, setUserId] = useState('USER-001')
  const [qr, setQr] = useState('')
  const [msg, setMsg] = useState('')
  const [camera, setCamera] = useState(false)
  const syncing = useRef(false)

  const refresh = async () => setRows(await db.checkins.orderBy('id').reverse().toArray())

  const makeQr = async () => {
    if (!userId.trim()) return
    setQr(await QRCode.toDataURL(userId.trim()))
  }

  const saveScan = async (rawId) => {
    const id = (rawId || '').trim()
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
    if (syncing.current) return
    syncing.current = true
    try {
      const pending = await db.checkins.where('status').equals('pending').toArray()
      if (!pending.length) {
        setMsg('Nothing to sync')
        return
      }

      if (API) {
        const res = await fetch(API + '/checkin/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pending.map((c) => ({ userId: c.userId, scannedAt: c.scannedAt }))),
        })
        if (!res.ok) throw new Error('Server error ' + res.status)
      } else {
        await new Promise((r) => setTimeout(r, 500)) // demo mode
      }

      await db.checkins
        .where('id')
        .anyOf(pending.map((c) => c.id))
        .modify({ status: 'synced' })
      setMsg(pending.length + ' scan(s) synced' + (API ? '' : ' (demo mode)'))
    } catch (e) {
      setMsg('Sync fail: ' + e.message + '. Scans pending hain, internet aane par phir try hoga.')
    } finally {
      syncing.current = false
      refresh()
    }
  }

  const exportCsv = () => {
    const esc = (v) => '"' + String(v).replace(/"/g, '""') + '"'
    const lines = ['userId,scannedAt,status', ...rows.map((r) => [r.userId, r.scannedAt, r.status].map(esc).join(','))]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'attendance.csv'
    a.click()
    URL.revokeObjectURL(url)
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
      <h1>HackOS Offline Check-in</h1>
      <p>
        Status: <b style={{ color: online ? 'green' : 'crimson' }}>{online ? 'Online' : 'Offline'}</b>
        {' | '}Pending: <b>{pendingCount}</b>
        {' | '}Mode: <b>{API ? 'Live server' : 'Demo'}</b>
      </p>

      {msg && <p style={{ background: '#ccfbf1', padding: 8, borderRadius: 8 }}>{msg}</p>}

      <div style={box}>
        <h3>1. QR banao</h3>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} style={{ padding: 8 }} />
        <button onClick={makeQr} style={{ ...btn, marginLeft: 8 }}>Generate QR</button>
        {qr && <div><img src={qr} alt="QR" width="160" /></div>}
      </div>

      <div style={box}>
        <h3>2. Scan karo (local database mein save hoga)</h3>
        <button onClick={() => setCamera((c) => !c)} style={btn}>
          {camera ? 'Camera band karo' : 'Camera scanner chalu karo'}
        </button>
        <button onClick={() => saveScan(userId)} style={btn}>Test scan: {userId}</button>
        {camera && <Scanner onScan={saveScan} />}
      </div>

      <div style={box}>
        <h3>3. Sync (pending: {pendingCount})</h3>
        <button onClick={syncNow} disabled={!online || !pendingCount} style={btn}>Sync now</button>
        <button onClick={exportCsv} disabled={!rows.length} style={btn}>Export CSV</button>
        {rows.map((r) => (
          <p key={r.id} style={{ borderBottom: '1px solid #ddd', margin: '6px 0' }}>
            {r.userId} - <b>{r.status}</b>
          </p>
        ))}
      </div>
    </div>
  )
}