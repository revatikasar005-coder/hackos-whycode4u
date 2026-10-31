const express = require('express');
const supabase = require('../db');
const { auth, allow } = require('../middleware/auth');
const { getDefaultEvent } = require('../utils/event');

const router = express.Router();

// POST /checkin (volunteer)
router.post('/', auth, allow('volunteer', 'organizer'), async (req, res) => {
  const { user_id, scanned_at, device_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  const event = await getDefaultEvent();
  if (!event) return res.status(500).json({ error: 'No event found' });

  const { data: dup } = await supabase
    .from('checkins').select('id')
    .eq('user_id', user_id).eq('event_id', event.id).maybeSingle();
  if (dup) return res.status(409).json({ error: 'Already checked in' });

  const { data, error } = await supabase
    .from('checkins')
    .insert({
      user_id, event_id: event.id, scanned_by: req.user.id,
      scanned_at: scanned_at || new Date().toISOString(), device_id
    })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// POST /checkin/bulk (offline sync)
router.post('/bulk', auth, allow('volunteer', 'organizer'), async (req, res) => {
  const list = req.body.checkins;
  if (!Array.isArray(list) || list.length === 0)
    return res.status(400).json({ error: 'checkins array required' });

  const event = await getDefaultEvent();
  if (!event) return res.status(500).json({ error: 'No event found' });

  const rows = list.map(c => ({
    user_id: c.user_id, event_id: event.id, scanned_by: req.user.id,
    scanned_at: c.scanned_at, device_id: c.device_id
  }));

  const { data, error } = await supabase
    .from('checkins')
    .upsert(rows, { onConflict: 'user_id,event_id', ignoreDuplicates: true })
    .select();
  if (error) return res.status(500).json({ error: error.message });

  res.json({
    received: list.length,
    inserted: data.length,
    skipped: list.length - data.length
  });
});

module.exports = router;