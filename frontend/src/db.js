import Dexie from 'dexie'

export const db = new Dexie('hackos_frontend')

db.version(1).stores({
  checkins: '++id, userId, scannedAt, status',
})