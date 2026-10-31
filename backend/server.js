require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
app.use('/', authRoutes);

// Phase 2 routes
app.use('/teams', require('./routes/teams'));
app.use('/submissions', require('./routes/submissions'));
app.use('/checkin', require('./routes/checkin'));

// Phase 3 routes
app.use('/scores', require('./routes/scores'));
app.use('/leaderboard', require('./routes/leaderboard'));
app.use('/judge', require('./routes/judge'));
app.use('/audit-logs', require('./routes/audit'));
app.use('/announcements', require('./routes/announcements'));
app.use('/duplicates', require('./routes/duplicates'));
app.get('/', (req, res) => {
  res.send('HackOS API running');
});

app.get('/health', async (req, res) => {
  const { error } = await supabase.from('users').select('id').limit(1);
  if (error) {
    return res.status(500).json({ status: 'error', db: 'not connected', message: error.message });
  }
  res.json({ status: 'ok', db: 'connected' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
});