const supabase = require('../db');

async function logAudit({ actor_id, action, table_name, record_id, old_value, new_value }) {
  const { error } = await supabase.from('audit_logs').insert({
    actor_id, action, table_name, record_id,
    old_value: old_value || null,
    new_value: new_value || null
  });
  if (error) console.error('Audit log error:', error.message);
}

module.exports = { logAudit };