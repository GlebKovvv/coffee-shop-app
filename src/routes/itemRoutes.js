const r = require('express').Router();
const c = require('../controllers/itemController');
const { role } = require('../middleware/auth');

r.get ('/',        role('cashier','admin'), c.list);   // список меню для POS
r.post('/',        role('admin'),           c.create);
r.put ('/:id',     role('admin'),           c.update);
r.delete('/:id',   role('admin'),           c.remove);

module.exports = r;
