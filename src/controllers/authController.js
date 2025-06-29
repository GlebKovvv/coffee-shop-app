const jwt   = require('jsonwebtoken');
const { staff } = require('../models');

const JWT_SECRET   = (process.env.JWT_SECRET || 'secret').trim();
const ADMIN_PASS   = (process.env.ADMIN_PASS || '').trim();
const CASHIER_PASS = (process.env.CASHIER_PASS || '').trim();

/* POST /api/auth/login */
exports.login = async (req, res) => {
    console.log('LOGIN-TRY', req.body);
  const { login, password } = req.body;

  const u = await staff.findOne({ where:{ login, active:true } });
  console.log('FOUND', u && u.toJSON());
  if (!u) return res.status(401).json({ message:'Неверный логин' });

  const ok =
    (u.role === 'admin'   && password === ADMIN_PASS)   ||
    (u.role === 'cashier' && password === CASHIER_PASS);

  if (!ok) return res.status(401).json({ message:'Неверный пароль' });

  const token = jwt.sign(
    { userid: u.staffid, role: u.role, name: u.name },
    JWT_SECRET, { expiresIn:'1d' }
  );

  /* ставим httpOnly-cookie на 24ч */
  res.cookie('token', token, {
    httpOnly : true,
    sameSite : 'strict',
    maxAge   : 24*60*60*1000
  });

  res.json({ role:u.role, name:u.fio });
};

/* GET /api/auth/me */
exports.me = (req, res) => res.json(req.user);

/* POST /api/auth/logout */
exports.logout = (_req, res) => {
  res.clearCookie('token');
  res.sendStatus(204);
};
