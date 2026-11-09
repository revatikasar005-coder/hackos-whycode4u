const express = require('express');
const router = express.Router();

const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // sandbox = fake paise

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64');

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('PayPal token nahi mila, keys check karo');
  return data.access_token;
}

// Frontend ko Client ID chahiye (ye secret nahi hai)
router.get('/config', (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Order banao
router.post('/create-order', async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount);
    if (!amount || amount < 1 || amount > 1000) {
      return res.status(400).json({ error: 'Amount 1 se 1000 USD ke beech ho' });
    }
    const token = await getAccessToken();
    const r = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          description: 'HackOS Prize Pool Sponsorship',
          amount: { currency_code: 'USD', value: amount.toFixed(2) },
        }],
      }),
    });
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Payment capture karo
router.post('/capture-order/:id', async (req, res) => {
  try {
    const token = await getAccessToken();
    const r = await fetch(`${PAYPAL_API}/v2/checkout/orders/${req.params.id}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
