const r  = require('express').Router();
const c  = require('../controllers/categoryController');
const { role } = require('../middleware/auth');

/* чтение нужно POS, поэтому cashier + admin */
r.get('/',          role('cashier','admin'), c.getAll);

/* изменять может только администратор */
r.post('/',         role('admin'),           c.create);
r.put('/:id',       role('admin'),           c.update);
r.delete('/:id',    role('admin'),           c.remove);

module.exports = r;
