const express = require('express');
const supabase = require('../db');
const { auth, allow } = require('../middleware/auth');
const { getDefaultEvent } = require('../utils/event');

const router = express.Router();

// POST /submissions (participant)
router.post('/', auth, allow('participant'), async (req, res) => {
  const { github_url, video_url, ppt_url } = req.body;

  const { data: tm } = await supabase
    .from('team_members').select('team_id')
    .eq('user_id', req.user.id).is('left_at', null).maybeSingle();
  if (!tm) return res.status(400).json({ error: 'You are not in a team' });

  const event = await getDefaultEvent();
  const now = new Date(); // server ka time

  if (now > new Date(event.submission_deadline)) {
    await supabase.from('submissions')
      .update({ is_locked: true }).eq('team_id', tm.team_id);
    return res.status(403).json({ error: 'Submission deadline is over' });
  }

  const { data: existing } = await supabase
    .from('submissions').select('is_locked').eq('team_id', tm.team_id).maybeSingle();
  if (existing?.is_locked)
    return res.status(403).json({ error: 'Submission is locked' });

  const { data, error } = await supabase
    .from('submissions')
    .upsert(
      { team_id: tm.team_id, github_url, video_url, ppt_url,
        submitted_at: now.toISOString() },
      { onConflict: 'team_id' }
    )
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;