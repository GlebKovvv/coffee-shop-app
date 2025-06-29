const r = require('express').Router();
const c = require('../controllers/staffController');
const { role } = require('../middleware/auth');

/* список сотрудников (нужен POS) */
r.get('/',        role('cashier','admin'),  c.list);      // ← list, не getAll

/* CRUD — только администратор */
r.post('/',       role('admin'),            c.create);
r.put('/:id',     role('admin'),            c.update);
r.delete('/:id',  role('admin'),            c.remove);

module.exports = r;
