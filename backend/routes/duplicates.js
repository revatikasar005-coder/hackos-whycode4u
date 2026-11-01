const express = require('express');
const supabase = require('../db');
const { auth, allow } = require('../middleware/auth');

const router = express.Router();

const normName = s => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
const emailBase = e => (e || '').toLowerCase().split('@')[0].replace(/[^a-z0-9]/g, '');

// GET /duplicates (organizer)
router.get('/', auth, allow('organizer'), async (req, res) => {
  const { data: users, error } = await supabase
    .from('users').select('id, name, email, phone, role, created_at');
  if (error) return res.status(500).json({ error: error.message });

  const groups = {};
  users.forEach(u => {
    const keys = [`name:${normName(u.name)}`];
    const base = emailBase(u.email);
    if (base) keys.push(`email:${base}`);
    keys.forEach(k => { (groups[k] = groups[k] || []).push(u); });
  });

  const seen = new Set();
  const result = [];
  Object.entries(groups).forEach(([key, list]) => {
    if (list.length < 2) return;
    const sig = list.map(u => u.id).sort().join(',');
    if (seen.has(sig)) return;
    seen.add(sig);
    result.push({ reason: key.startsWith('name:') ? 'similar name' : 'similar email', users: list });
  });

  res.json(result);
});

module.exports = router;