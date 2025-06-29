const db = require('../models');
const Supplier = db.supplier;          // ← точное имя модели!

exports.list   = async (_req,res)=>
  res.json(await Supplier.findAll({ order:[['supplierid','ASC']] }));

exports.create = async (req,res)=>{
  if(!req.body.suppliername)
    return res.status(400).json({error:'suppliername required'});
  res.status(201).json(await Supplier.create(req.body));
};

exports.update = async (req,res)=>{
  const s = await Supplier.findByPk(req.params.id);
  if(!s) return res.status(404).json({error:'not found'});
  Object.assign(s, req.body);
  await s.save();
  res.json(s);
};

exports.remove = async (req,res)=>{
  const s = await Supplier.findByPk(req.params.id);
  if(!s) return res.status(404).json({error:'not found'});
  await s.destroy();
  res.json({success:true});
};
