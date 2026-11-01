const express = require('express');
const supabase = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /leaderboard (sab)
router.get('/', auth, async (req, res) => {
  const { data: teams, error } = await supabase
    .from('teams').select('id, name, track, scores(total)');
  if (error) return res.status(500).json({ error: error.message });

  const board = teams.map(t => {
    const totals = (t.scores || []).map(s => Number(s.total));
    const sum = totals.reduce((a, b) => a + b, 0);
    return {
      team_id: t.id, name: t.name, track: t.track,
      judges_count: totals.length,
      total_score: sum,
      average: totals.length ? Number((sum / totals.length).toFixed(2)) : 0
    };
  }).sort((a, b) => b.average - a.average)
    .map((t, i) => ({ rank: i + 1, ...t }));

  res.json(board);
});

module.exports = router;