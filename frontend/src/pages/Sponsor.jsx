import { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:5000';
const PRESETS = [10, 25, 50, 100];

const css = `
.sp-wrap { max-width: 560px; margin: 40px auto; padding: 0 16px 60px; }
.sp-head { text-align: center; margin-bottom: 24px; }
.sp-head h2 { font-size: 2rem; margin: 0 0 8px; }
.sp-head p { margin: 0; opacity: 0.75; }
.sp-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 22px;
  margin-bottom: 18px;
  backdrop-filter: blur(8px);
}
.sp-step { font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.6; margin-bottom: 6px; }
.sp-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 12px; }
.sp-card textarea { width: 100%; min-height: 80px; box-sizing: border-box; margin-bottom: 12px; }
.sp-ai-reply {
  margin-top: 14px; padding: 12px 14px; border-radius: 12px;
  background: rgba(236,72,153,0.12); border: 1px solid rgba(236,72,153,0.35);
  line-height: 1.5;
}
.sp-chips { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.sp-chip {
  flex: 1; min-width: 70px; padding: 10px 0; border-radius: 12px; cursor: pointer;
  background: rgba(255,255,255,0.06); color: inherit; font-weight: 700;
  border: 1px solid rgba(255,255,255,0.18); box-shadow: none;
}
.sp-chip.active { background: linear-gradient(135deg, #ec4899, #8b5cf6); border-color: transparent; color: #fff; }
.sp-total { text-align: center; font-size: 2.4rem; font-weight: 800; margin: 6px 0 16px; }
.sp-total small { font-size: 1rem; opacity: 0.6; font-weight: 500; }
.sp-success {
  text-align: center; padding: 26px 20px; border-radius: 20px; margin-bottom: 18px;
  background: linear-gradient(135deg, rgba(34,197,94,0.18), rgba(16,185,129,0.1));
  border: 1px solid rgba(34,197,94,0.5);
}
.sp-check {
  width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 12px;
  background: #22c55e; color: #fff; font-size: 2rem; line-height: 64px; font-weight: 800;
}
.sp-success h3 { margin: 0 0 6px; font-size: 1.4rem; }
.sp-success p { margin: 0; opacity: 0.85; }
.sp-error {
  padding: 12px 14px; border-radius: 12px; margin-bottom: 18px;
  background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.45);
}
.sp-foot { text-align: center; font-size: 0.8rem; opacity: 0.55; margin-top: 8px; }
`;

export default function Sponsor() {
  const [amount, setAmount] = useState(10);
  const [status, setStatus] = useState('');
  const [about, setAbout] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [paidAmount, setPaidAmount] = useState(null);
  const amountRef = useRef(amount);
  const btnRef = useRef(null);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cfg = await (await fetch(`${API}/paypal/config`)).json();
      if (!window.paypal) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = `https://www.paypal.com/sdk/js?client-id=${cfg.clientId}&currency=USD`;
          s.onload = resolve;
          s.onerror = reject;
          document.body.appendChild(s);
        });
      }
      if (cancelled || !btnRef.current) return;
      btnRef.current.innerHTML = '';

      window.paypal
        .Buttons({
          createOrder: async () => {
            setStatus('');
            setPaidAmount(null);
            const r = await fetch(`${API}/paypal/create-order`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: amountRef.current }),
            });
            const d = await r.json();
            if (!d.id) throw new Error(d.error || 'Order nahi bana');
            return d.id;
          },
          onApprove: async (data) => {
            try {
              const r = await fetch(`${API}/paypal/capture-order/${data.orderID}`, {
                method: 'POST',
              });
              const d = await r.json();
              if (d.status === 'COMPLETED') {
                setPaidAmount(amountRef.current);
              } else {
                const reason = d.details?.[0]?.issue || d.message || d.error || '';
                setStatus(`Payment status: ${d.status || 'unknown'} ${reason}`);
              }
            } catch (e) {
              setStatus('Error: ' + e.message);
            }
          },
          onError: (err) => setStatus('Error: ' + err),
        })
        .render(btnRef.current);
    }

    load().catch((e) => setStatus('Error: ' + e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  async function askAI() {
    if (!about.trim()) {
      setAiReply('Pehle apni company ya budget ke baare mein likho.');
      return;
    }
    setAiLoading(true);
    setAiReply('');
    try {
      const r = await fetch(`${API}/ai/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ about }),
      });
      const d = await r.json();
      if (d.error) {
        setAiReply('Error: ' + d.error);
      } else {
        setAiReply(d.suggestion);
        setAmount(d.amount);
      }
    } catch (e) {
      setAiReply('Error: ' + e.message);
    }
    setAiLoading(false);
  }

  return (
    <div className="sp-wrap">
      <style>{css}</style>

      <div className="sp-head">
        <h2>Sponsor the Prize Pool</h2>
        <p>Back the next generation of builders. Every dollar goes to the hackathon prize pool.</p>
      </div>

      {paidAmount && (
        <div className="sp-success">
          <div className="sp-check">✓</div>
          <h3>Thank you for sponsoring!</h3>
          <p>${paidAmount} has been added to the prize pool via PayPal.</p>
        </div>
      )}

      {status && <div className="sp-error">{status}</div>}

      <div className="sp-card">
        <div className="sp-step">Step 1 · Optional</div>
        <div className="sp-title">Let AI suggest an amount</div>
        <textarea
          placeholder="e.g. We are a small startup with a $200 marketing budget"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
        <button onClick={askAI} disabled={aiLoading}>
          {aiLoading ? 'Thinking...' : 'Ask AI for amount'}
        </button>
        {aiReply && <div className="sp-ai-reply">{aiReply}</div>}
      </div>

      <div className="sp-card">
        <div className="sp-step">Step 2</div>
        <div className="sp-title">Choose your amount</div>
        <div className="sp-chips">
          {PRESETS.map((p) => (
            <button
              key={p}
              className={`sp-chip ${Number(amount) === p ? 'active' : ''}`}
              onClick={() => setAmount(p)}
            >
              ${p}
            </button>
          ))}
        </div>
        <input
          type="number"
          min="1"
          max="1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
        <div className="sp-total">
          ${Number(amount) || 0} <small>USD</small>
        </div>
      </div>

      <div className="sp-card">
        <div className="sp-step">Step 3</div>
        <div className="sp-title">Pay securely with PayPal</div>
        <div ref={btnRef} />
        <div className="sp-foot">Sandbox mode · test payments only, no real money</div>
      </div>
    </div>
  );
}