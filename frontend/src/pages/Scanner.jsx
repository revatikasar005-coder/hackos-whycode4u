import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

const KEY = 'pendingCheckins'
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

export default function Scanner() {
  const [online, setOnline] = useState(navigator.onLine)
  const [pending, setPending] = useState(load)
  const [synced, setSynced] = useState([])
  const [msg, setMsg] = useState('')
  const [manual, setManual] = useState('')
  const pendingRef = useRef(pending)
  const syncedRef = useRef(synced)
  pendingRef.current = pending
  syncedRef.current = synced

  const savePending = (list) => {
    setPending(list)
    localStorage.setItem(KEY, JSON.stringify(list))
  }

  const handleScan = (userId) => {
    const id = String(userId).trim()
    if (!id) return
    const dup = pendingRef.current.some((c) => c.userId === id) || syncedRef.current.some((c) => c.userId === id)
    if (dup) {
      setMsg(id + ': Already checked in')
      return
    }
    savePending([{ userId: id, scannedAt: new Date().toLocaleString() }, ...pendingRef.current])
    setMsg(id + ': Scan saved' + (navigator.onLine ? '' : ' (offline)'))
  }

  const syncNow = () => {
    if (!pendingRef.current.length) return
    // Abhi fake sync. Baad mein yahan POST /checkin/bulk aayega (Anuma ki API).
    setSynced([...pendingRef.current.map((c) => ({ ...c, syncedAt: new Date().toLocaleString() })), ...syncedRef.current])
    savePending([])
    setMsg('Sync complete')
  }

  useEffect(() => {
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

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">QR Check-in Scanner</h1>
        <span className={'px-3 py-1 rounded-full text-sm font-semibold ' + (online ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
          {online ? 'Online' : 'Offline'}
        </span>
      </div>

      {msg && <p className="bg-teal-50 border border-teal-200 text-teal-800 p-2 rounded text-sm">{msg}</p>}

      <div className="bg-white p-4 rounded-xl shadow-md border-t-4 border-teal-500">
        <div id="qr-reader" />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md border-t-4 border-teal-500 space-y-2">
        <p className="text-sm text-gray-600">Camera na chale to ID yahan type karo (testing ke liye):</p>
        <div className="flex gap-2">
          <input className="flex-1 border p-2 rounded" placeholder="USER-001" value={manual} onChange={(e) => setManual(e.target.value)} />
          <button onClick={() => { handleScan(manual); setManual('') }} className="bg-teal-600 text-white px-4 rounded">Add</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md border-t-4 border-teal-500">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">Pending sync: {pending.length}</h2>
          <button onClick={syncNow} disabled={!online || !pending.length} className="bg-teal-600 text-white px-4 py-1 rounded disabled:bg-gray-400">
            Sync now
          </button>
        </div>
        {pending.map((c) => (
          <p key={c.userId} className="text-sm border-b py-1">{c.userId} <span className="text-gray-500">({c.scannedAt})</span></p>
        ))}
        <h2 className="font-bold mt-3">Synced: {synced.length}</h2>
        {synced.map((c) => (
          <p key={c.userId} className="text-sm border-b py-1">{c.userId} <span className="text-gray-500">(synced {c.syncedAt})</span></p>
        ))}
      </div>
    </div>
  )
}