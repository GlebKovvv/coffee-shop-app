const r = require('express').Router();
const c = require('../controllers/authController');
const auth = require('../middleware/auth');

r.post('/login',  c.login);
r.post('/logout', c.logout);
r.get ('/me',     auth, c.me);

module.exports = r;
