const express = require('express');
const router = express.Router();

router.post('/suggest', async (req, res) => {
  try {
    const about = (req.body.about || '').slice(0, 500);
    if (!about) return res.status(400).json({ error: 'Pehle apne baare mein likho' });

    const prompt =
      'You help sponsors pick a prize-pool sponsorship amount for a student hackathon. ' +
      'Amount must be between 5 and 500 USD. Sponsor says: "' + about + '". ' +
      'Reply in 2 short sentences explaining your suggestion, and end with exactly: AMOUNT: <number>';

    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(500).json({ error: JSON.stringify(data) });

    const m = text.match(/AMOUNT:\s*(\d+)/i);
    const amount = m ? Math.min(500, Math.max(5, parseInt(m[1], 10))) : 25;
    res.json({ suggestion: text.replace(/AMOUNT:\s*\d+/i, '').trim(), amount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;