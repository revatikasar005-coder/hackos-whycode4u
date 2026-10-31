const express = require('express');
const supabase = require('../db');
const { auth, allow } = require('../middleware/auth');
const { getDefaultEvent } = require('../utils/event');

const router = express.Router();

// POST /teams (participant team banata hai)
router.post('/', auth, allow('participant'), async (req, res) => {
  const { name, track, problem } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  const event = await getDefaultEvent();
  if (!event) return res.status(500).json({ error: 'No event found' });

  const { data: existing } = await supabase
    .from('team_members').select('id')
    .eq('user_id', req.user.id).is('left_at', null).maybeSingle();
  if (existing) return res.status(409).json({ error: 'Already in a team' });

  const { data: team, error } = await supabase
    .from('teams')
    .insert({ event_id: event.id, name, track, problem, leader_id: req.user.id })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('team_members')
    .insert({ team_id: team.id, user_id: req.user.id });

  res.status(201).json(team);
});

// POST /teams/:id/members (sirf leader)
router.post('/:id/members', auth, allow('participant'), async (req, res) => {
  const { email, action } = req.body;
  const teamId = req.params.id;

  const { data: team } = await supabase
    .from('teams').select('*').eq('id', teamId).maybeSingle();
  if (!team) return res.status(404).json({ error: 'Team not found' });
  if (team.leader_id !== req.user.id)
    return res.status(403).json({ error: 'Only leader can change members' });

  const { data: member } = await supabase
    .from('users').select('id').eq('email', email).maybeSingle();
  if (!member) return res.status(404).json({ error: 'User not found' });

  if (action === 'add') {
    const { data: busy } = await supabase
      .from('team_members').select('id')
      .eq('user_id', member.id).is('left_at', null).maybeSingle();
    if (busy) return res.status(409).json({ error: 'User already in a team' });

    await supabase.from('team_members')
      .insert({ team_id: teamId, user_id: member.id });
    return res.status(201).json({ message: 'Member added' });
  }

  if (action === 'remove') {
    await supabase.from('team_members')
      .update({ left_at: new Date().toISOString() })
      .eq('team_id', teamId).eq('user_id', member.id).is('left_at', null);
    return res.json({ message: 'Member removed' });
  }

  res.status(400).json({ error: "action must be 'add' or 'remove'" });
});

// GET /teams (organizer, judge)
router.get('/', auth, allow('organizer', 'judge'), async (req, res) => {
  const { data, error } = await supabase
    .from('teams').select('*, team_members(user_id, joined_at, left_at)');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;