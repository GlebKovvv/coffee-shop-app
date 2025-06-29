const r = require('express').Router();
const c = require('../controllers/orderController');

r.get('/',        c.getAll);     // ?status=new|completed…
r.get('/active',  c.getActive);  // список активных
r.post('/',       c.create);     // создать заказ
r.put('/:id/complete', c.complete); // завершить заказ

module.exports = r;
