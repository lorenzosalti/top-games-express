
const connect = require('../data/dbgames');

function index(req, res) {
    const sql = `SELECT * FROM games;`;

    connect.query(sql, (err, results) => {
        if (err) {
            console.err(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(results);
    });
};



function show(req, res) {


    const { id } = req.params;

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
        res.json(results);

    });
}

function modify(req, res) {

    const { id } = req.params;

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
        res.json(results);

    });
}


module.exports = { index, show, modify };