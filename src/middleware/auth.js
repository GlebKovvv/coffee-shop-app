const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const JWT_SECRET = (process.env.JWT_SECRET || 'secret').trim();

/* ────────── вспомогательный middleware ────────── */
function auth(req, res, next) {
  const tok =
    req.cookies.token ||                       // 1) HTTP-cookie
    (req.headers.authorization || '').replace('Bearer ', ''); // 2) fallback

  if (!tok) return res.status(401).json({ message: 'Токен не найден' });

  try {
    req.user = jwt.verify(tok, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Неверный токен' });
  }
}

/* ────────── проверка ролей ────────── */
auth.role = (...roles) => [
  auth,
  (req, res, next) =>
    roles.includes(req.user.role)
      ? next()
      : res.status(403).json({ message: 'Недостаточно прав' })
];

module.exports = auth;
