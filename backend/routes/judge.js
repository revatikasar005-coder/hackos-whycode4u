const express = require('express');
const supabase = require('../db');
const { auth, allow } = require('../middleware/auth');

const router = express.Router();

// GET /judge/teams (sirf us judge ko assigned teams)
router.get('/teams', auth, allow('judge'), async (req, res) => {
  const { data, error } = await supabase
    .from('judge_assignments')
    .select('teams(id, name, track, problem, submissions(github_url, video_url, ppt_url, submitted_at, is_locked))')
    .eq('judge_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(d => d.teams));
});

module.exports = router;