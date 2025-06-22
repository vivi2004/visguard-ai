const jwt = require('jsonwebtoken');

function verifySupabaseUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.SUPABASE_JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: 'SUPABASE_JWT_SECRET not set' });
  }

  try {
    const decoded = jwt.verify(token, secret); // ✅ secure verification
    if (!decoded?.sub) {
      return res.status(401).json({ error: 'Unauthorized: missing user ID' });
    }

    req.user = { id: decoded.sub };
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = verifySupabaseUser;

