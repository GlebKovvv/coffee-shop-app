const r = require('express').Router();
const c = require('../controllers/inventoryController');

r.get('/',            c.list);
r.post('/',           c.create);
r.patch('/:id',       c.update);      // редактировать строку целиком
r.patch('/:id/add',   c.add);         // +Δ
r.patch('/:id/remove',c.remove);      // −Δ
r.delete('/:id',      c.delete);      // удалить позицию

module.exports = r;
