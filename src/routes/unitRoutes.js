const r = require('express').Router();
const c = require('../controllers/unitController');

r.get('/', c.list);          // GET /api/units

module.exports = r;
