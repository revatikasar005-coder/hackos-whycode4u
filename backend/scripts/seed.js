require('dotenv').config();
const bcrypt = require('bcrypt');
const supabase = require('../db');

const PASSWORD = 'password123'; // sab seed users ka password

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);

  // Event (agar nahi hai to banao)
  let { data: event } = await supabase.from('events').select('*').limit(1).maybeSingle();
  if (!event) {
    const r = await supabase.from('events').insert({
      name: 'HackOS 2026', mode: 'offline',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 2 * 86400000).toISOString(),
      submission_deadline: new Date(Date.now() + 86400000).toISOString()
    }).select().single();
    event = r.data;
  }

  const mk = (name, email, phone, role) =>
    ({ name, email, phone, password_hash: hash, role });

  const users = [
    mk('Olivia Organizer', 'organizer@hackos.dev', '9000000001', 'organizer'),
    mk('Jay Judge', 'judge1@hackos.dev', '9000000002', 'judge'),
    mk('Jiya Judge', 'judge2@hackos.dev', '9000000003', 'judge'),
    mk('Jatin Judge', 'judge3@hackos.dev', '9000000004', 'judge'),
    mk('Vikram Volunteer', 'volunteer1@hackos.dev', '9000000005', 'volunteer'),
  ];

  const names = ['Aarav','Diya','Kabir','Meera','Rohan','Sara','Tara','Uday','Vani','Yash',
                 'Zoya','Arjun','Bhavna','Chetan','Esha','Farhan','Gauri','Harsh','Isha','Kiran'];
  names.forEach((n, i) => users.push(
    mk(`${n} Sharma`, `${n.toLowerCase()}@example.com`, `91000000${String(i).padStart(2,'0')}`, 'participant')));

  // Jaan-boojh ke duplicates (milte-julte naam/email)
  users.push(mk('Aarav Sharma', 'aarav.sharma@example.com', '9100000050', 'participant'));
  users.push(mk('Diya Sharma', 'diya@example.co', '9100000051', 'participant'));
  users.push(mk('Kabir  Sharma', 'kabir1@example.com', '9100000052', 'participant'));

  const { error: uErr } = await supabase.from('users').upsert(users, { onConflict: 'email' });
  if (uErr) throw uErr;

  const { data: all } = await supabase.from('users').select('id,email,role');
  const byRole = r => all.filter(u => u.role === r);
  const participants = all.filter(u => u.role === 'participant' && u.email.endsWith('@example.com')
    && !['aarav.sharma','kabir1'].some(x => u.email.startsWith(x)));
  const judges = byRole('judge');

  // 6 teams (har team me 3 participants)
  const teamNames = ['Byte Builders','Code Ninjas','Data Wizards','Pixel Pirates','Logic Lions','Cloud Climbers'];
  const tracks = ['AI','Web','Mobile','Data','Web','AI'];
  const { count } = await supabase.from('teams').select('*', { count: 'exact', head: true });
  let teams;
  if (!count) {
    const rows = teamNames.map((n, i) => ({
      event_id: event.id, name: n, track: tracks[i],
      problem: 'Hackathon problem ' + (i + 1),
      leader_id: participants[i * 3].id
    }));
    const r = await supabase.from('teams').insert(rows).select();
    teams = r.data;

    const members = [];
    teams.forEach((t, i) => {
      for (let k = 0; k < 3; k++)
        members.push({ team_id: t.id, user_id: participants[i * 3 + k].id });
    });
    await supabase.from('team_members').insert(members);

    await supabase.from('submissions').insert(teams.map((t, i) => ({
      team_id: t.id,
      github_url: `https://github.com/demo/team${i + 1}`,
      video_url: `https://youtu.be/demo${i + 1}`,
      ppt_url: `https://drive.google.com/demo${i + 1}`
    })));

    // Har judge ko saari teams assign
    const assigns = [];
    judges.forEach(j => teams.forEach(t => assigns.push({ judge_id: j.id, team_id: t.id })));
    await supabase.from('judge_assignments').insert(assigns);

    // Kuch fake scores
    const scores = [];
    teams.forEach((t, i) => judges.forEach((j, k) => {
      const c = { innovation: 5 + ((i + k) % 5), design: 5 + ((i * 2 + k) % 5), impact: 4 + ((i + k * 2) % 6) };
      scores.push({ team_id: t.id, judge_id: j.id, criteria_json: c,
        total: c.innovation + c.design + c.impact });
    }));
    await supabase.from('scores').insert(scores);
  } else {
    console.log('Teams pehle se hain, teams/scores skip kiye.');
  }

  console.log('Seed done.');
  console.log('Login password sabka:', PASSWORD);
  console.log('organizer@hackos.dev | judge1@hackos.dev | volunteer1@hackos.dev | aarav@example.com');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });