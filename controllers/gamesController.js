
const connect = require('../data/dbgames');




function index(req, res) {

    const sql = `
    SELECT games.*, GROUP_CONCAT(name_genre ORDER BY name_genre SEPARATOR ', ') AS genres FROM genre_game
    INNER JOIN genres
    ON genres.id = genre_game.id_genre
    INNER JOIN games
    ON games.id = genre_game.id_game
    GROUP BY games.id;`;

    connect.query(sql, (err, results) => {
        if (err) {
            console.err(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(results.map(result => ({
            ...result,
            imagePath: process.env.PUBLIC_PATH + 'cover-games/' + result.image
        })));
    });
};



function show(req, res) {

    const { id } = req.params;

    const sql = `
    SELECT games.*, GROUP_CONCAT(name_genre ORDER BY name_genre SEPARATOR ', ') AS genres FROM genre_game
    INNER JOIN genres
    ON genres.id = genre_game.id_genre
    INNER JOIN games
    ON games.id = genre_game.id_game
    WHERE id_game = ?;`;

    connect.query(sql, [id], (err, results) => {
        if (err) {
            console.err(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(results);
    });
}

// function modify(req, res) {

//     const { id } = req.params;

//     const sql = `
//     SELECT * FROM games
//     WHERE games.id = ?`;

//     connect.query(sql, [id], (err, results) => {
//         if (err) {
//             console.err(err);
//             return res.status(500).json({ error: 'Server error' });
//         }
//         res.json(results);

//     });
// }


module.exports = { index, show };