const connect = require('../data/dbgames');

function mailingStore(req, res) {

  const sql = `SELECT * FROM mailing_list;`;

  connect.query(sql, (err, results) => {
    if (err) {
      console.err(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results)

  })
}

module.exports = { mailingStore }