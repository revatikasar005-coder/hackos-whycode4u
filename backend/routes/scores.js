const express = require('express');
const supabase = require('../db');
const { auth, allow } = require('../middleware/auth');
const { logAudit } = require('../utils/audit');

const router = express.Router();

// POST /scores (judge): create ya update, dono ka audit log
router.post('/', auth, allow('judge'), async (req, res) => {
  const { team_id, criteria } = req.body;
  if (!team_id || !criteria || typeof criteria !== 'object')
    return res.status(400).json({ error: 'team_id and criteria required' });

  const total = Object.values(criteria)
    .reduce((sum, v) => sum + Number(v || 0), 0);

  const { data: old } = await supabase
    .from('scores').select('*')
    .eq('team_id', team_id).eq('judge_id', req.user.id).maybeSingle();

  const { data, error } = await supabase
    .from('scores')
    .upsert(
      { team_id, judge_id: req.user.id, criteria_json: criteria,
        total, updated_at: new Date().toISOString() },
      { onConflict: 'team_id,judge_id' }
    )
    .select().single();
  if (error) return res.status(500).json({ error: error.message });

  await logAudit({
    actor_id: req.user.id,
    action: old ? 'SCORE_UPDATE' : 'SCORE_CREATE',
    table_name: 'scores',
    record_id: data.id,
    old_value: old || null,
    new_value: data
  });

  res.status(old ? 200 : 201).json(data);
});

module.exports = router;