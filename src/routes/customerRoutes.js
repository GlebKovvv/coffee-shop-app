const r = require('express').Router();
const c = require('../controllers/customerController');

r.get('/',        c.list);
r.get('/search',  c.searchByPhone);
r.post('/',       c.create);
r.put('/:id',     c.update);
r.delete('/:id',  c.remove);

module.exports = r;
