const supabase = require("../config/supabase");

async function logError(message, stack_trace) {
  await supabase.from("error_logs").insert([
    {
      message,
      stack_trace,
    },
  ]);
}

module.exports = {
  logError,
};
