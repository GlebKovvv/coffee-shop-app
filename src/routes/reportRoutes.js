const r=require('express').Router(),c=require('../controllers/reportController');
r.get('/sales',        c.sales);
r.get('/top-products', c.topProducts);
r.get('/low-stock',    c.lowStock);
r.get('/by-staff',     c.byStaff);
module.exports=r;
