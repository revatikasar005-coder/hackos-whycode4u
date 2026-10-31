import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { db } from '../db'

export default function Scanner() {
  const [online, setOnline] = useState(navigator.onLine)
  const [rows, setRows] = useState([])
  const [msg, setMsg] = useState('')
  const [manual, setManual] = useState('')

  const refresh = async () => setRows(await db.checkins.orderBy('id').reverse().toArray())

  const handleScan = async (userId) => {
    const id = String(userId).trim()
    if (!id) return
    const exists = await db.checkins.where('userId').equals(id).first()
    if (exists) {
      setMsg(id + ': Already checked in')
      return
    }
    await db.checkins.add({ userId: id, scannedAt: new Date().toLocaleString(), status: 'pending' })
    setMsg(id + ': Scan saved' + (navigator.onLine ? '' : ' (offline)'))
    refresh()
  }

  const syncNow = async () => {
    const pending = await db.checkins.where('status').equals('pending').toArray()
    if (!pending.length) return
    // Abhi fake sync. Baad mein yahan POST /checkin/bulk aayega (Anuma ki API).
    await db.checkins.where('status').equals('pending').modify({ status: 'synced' })
    setMsg(pending.length + ' scan(s) synced')
    refresh()
  }

  useEffect(() => {
    refresh()
    const goOnline = () => { setOnline(true); syncNow() }
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 220 }, false)
    scanner.render((text) => handleScan(text), () => {})
    return () => { scanner.clear().catch(() => {}) }
  }, [])

  const pendingCount = rows.filter((r) => r.status === 'pending').length
  const cardClass = 'bg-white p-4 rounded-xl shadow-md border-t-4 border-indigo-500'

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">QR Check-in Scanner</h1>
        <span className={'px-3 py-1 rounded-full text-sm font-semibold ' + (online ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
          {online ? 'Online' : 'Offline'}
        </span>
      </div>

      {msg && <p className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-2 rounded text-sm">{msg}</p>}

      <div className={cardClass}>
        <div id="qr-reader" />
      </div>

      <div className={cardClass + ' space-y-2'}>
        <p className="text-sm text-gray-600">Camera na chale to ID yahan type karo:</p>
        <div className="flex gap-2">
          <input className="flex-1 border border-slate-300 p-2 rounded-lg" placeholder="USER-001"
            value={manual} onChange={(e) => setManual(e.target.value)} />
          <button onClick={() => { handleScan(manual); setManual('') }}
            className="bg-indigo-600 text-white px-4 rounded-lg">Add</button>
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">Pending sync: {pendingCount}</h2>
          <button onClick={syncNow} disabled={!online || !pendingCount}
            className="bg-indigo-600 text-white px-4 py-1 rounded-lg disabled:bg-gray-400">
            Sync now
          </button>
        </div>
        {rows.map((r) => (
          <p key={r.id} className="text-sm border-b py-1">
            {r.userId} <span className="text-gray-500">({r.scannedAt})</span>{' '}
            <b className={r.status === 'synced' ? 'text-green-600' : 'text-orange-600'}>{r.status}</b>
          </p>
        ))}
      </div>
    </div>
  )
}