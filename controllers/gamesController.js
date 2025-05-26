
const connect = require('../data/dbgames');

function show(req, res) {


    const { id } = req.params

    const sql = `SELECT 
    *
FROM
    games
WHERE
    games.id = ?`;

    connect.query(sql, [id], (err, results) => {
        if (err) {
            console.err(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(results)

    });
}

function modify(req, res) {

    const { id } = req.params

    const sql = `SELECT 
    *
FROM
    games
WHERE
    games.id = ?`;

    connect.query(sql, [id], (err, results) => {
        if (err) {
            console.err(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(results)

    })
}


module.exports = { show, modify }