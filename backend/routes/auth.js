const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email, password required' });

  // Duplicate email/phone check
  const { data: dupEmail } = await supabase
    .from('users').select('id').eq('email', email).maybeSingle();
  if (dupEmail)
    return res.status(409).json({ error: 'Email already registered' });

  if (phone) {
    const { data: dupPhone } = await supabase
      .from('users').select('id').eq('phone', phone).maybeSingle();
    if (dupPhone)
      return res.status(409).json({ error: 'Phone already registered' });
  }

  const password_hash = await bcrypt.hash(password, 10);

  // Public register se sirf participant ban sakta hai (security)
  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, phone, password_hash, role: 'participant' })
    .select('id, name, email, phone, role, created_at')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Registered', user: data });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email and password required' });

  const { data: user } = await supabase
    .from('users').select('*').eq('email', email).maybeSingle();

  const ok = user && await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, role: user.role });
});

// GET /me
router.get('/me', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, phone, role, created_at')
    .eq('id', req.user.id).single();
  if (error) return res.status(404).json({ error: 'User not found' });
  res.json({ ...data, qr_user_id: data.id });
});

module.exports = router;