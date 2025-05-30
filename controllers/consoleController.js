const connect = require('../data/dbgames');

function playstationIndex(req, res) {

  const sql = `SELECT 
    *
FROM
    games
WHERE 
    games.platform = "Playstation 5"`;

  connect.query(sql, (err, results) => {
    if (err) {
      console.err(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results.map(result => ({
      ...result,
      imagePath: process.env.PUBLIC_PATH + 'cover-games/' + result.image
    })))

  });
}

function xboxIndex(req, res) {

  const sql = `SELECT 
    *
FROM
    games
WHERE 
    games.platform = "Xbox Series X"`;

  connect.query(sql, (err, results) => {
    if (err) {
      console.err(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results)

  });
}

function pcIndex(req, res) {

  const sql = `SELECT 
    *
FROM
    games
WHERE 
    games.platform = "PC"`;

  connect.query(sql, (err, results) => {
    if (err) {
      console.err(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results)

  });
}

function switchIndex(req, res) {

  const sql = `SELECT 
    *
FROM
    games
WHERE 
    games.platform = "Nintendo Switch"`;

  connect.query(sql, (err, results) => {
    if (err) {
      console.err(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results)

  });
}

module.exports = { playstationIndex, xboxIndex, pcIndex, switchIndex }