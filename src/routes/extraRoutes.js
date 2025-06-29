const r = require('express').Router();
const c = require('../controllers/extraController');

r.get('/',       c.getAll);
r.post('/',      c.create);
r.put('/:id',    c.update);
r.delete('/:id', c.remove);

module.exports = r;
