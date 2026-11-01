const express = require('express');
const supabase = require('../db');
const { auth, allow } = require('../middleware/auth');
const { getDefaultEvent } = require('../utils/event');
const { logAudit } = require('../utils/audit');

const router = express.Router();

// POST /announcements (organizer)
router.post('/', auth, allow('organizer'), async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message)
    return res.status(400).json({ error: 'title and message required' });

  const event = await getDefaultEvent();
  if (!event) return res.status(500).json({ error: 'No event found' });

  const { data, error } = await supabase
    .from('announcements')
    .insert({ event_id: event.id, title, message })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });

  await logAudit({
    actor_id: req.user.id, action: 'ANNOUNCEMENT_CREATE',
    table_name: 'announcements', record_id: data.id,
    old_value: null, new_value: data
  });

  res.status(201).json(data);
});

// GET /announcements (sab)
router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('announcements').select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;