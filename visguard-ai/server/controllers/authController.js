// controllers/authController.js
const supabase = require("../config/supabase");

const signupUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    res.status(201).json({ message: "Signup successful", user: data.user });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    res.status(200).json({ message: "Login successful", session: data.session, user: data.user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signupUser,
  loginUser,
};
