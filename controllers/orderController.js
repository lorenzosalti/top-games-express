const connect = require('../data/dbgames');


function orderIndex(req, res) {
  const sql = `SELECT 
    *
FROM
    orders`;

  connect.query(sql, (err, results) => {
    if (err) {
      console.err(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results)

  })
}

function orderShow(req, res) {
  const { id } = req.params

  const sql = `SELECT 
    *
FROM
    orders
    WHERE
    orders.id = ?`;

  connect.query(sql, [id], (err, results) => {
    if (err) {
      console.err(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results)

  })
}

function orderStore(req, res) {
  const { id } = req.params

  const sql = `SELECT 
    *
FROM
    orders
    WHERE
    orders.id = ?`;

  connect.query(sql, [id], (err, results) => {
    if (err) {
      console.err(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results)

  })
}

module.exports = { orderIndex, orderShow, orderStore }
