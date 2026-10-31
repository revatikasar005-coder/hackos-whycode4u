const supabase = require('../db');

async function getDefaultEvent() {
  const { data } = await supabase
    .from('events').select('*').order('start_time').limit(1).maybeSingle();
  return data;
}

module.exports = { getDefaultEvent };