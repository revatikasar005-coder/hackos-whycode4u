const express = require('express');
const supabase = require('../db');
const { auth, allow } = require('../middleware/auth');

const router = express.Router();

// GET /audit-logs (organizer)
router.get('/', auth, allow('organizer'), async (req, res) => {
  const { data, error } = await supabase
    .from('audit_logs').select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;