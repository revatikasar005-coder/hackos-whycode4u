import Dexie from 'dexie'

export const db = new Dexie('hackos')

db.version(1).stores({
  checkins: '++id, userId, scannedAt, status',
})