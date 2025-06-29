const r = require('express').Router();
const c = require('../controllers/positionController');
r.get('/', c.list);
module.exports = r;
