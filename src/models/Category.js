const db = require('../config/db');

exports.findAll = async () => {
  const { rows } = await db.query(
    'SELECT categoryid, name, description FROM menucategory ORDER BY categoryid'
  );
  return rows;
};

exports.create = async ({ name, description }) => {
  const { rows } = await db.query(
    'INSERT INTO menucategory (name, description) VALUES ($1,$2) RETURNING *',
    [name, description ?? null]
  );
  return rows[0];
};
