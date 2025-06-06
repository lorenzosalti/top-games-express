
const connect = require('../data/dbgames');




function index(req, res) {

    const { search, orderBy, orderByDirection } = req.query;

    const queryParams = [];

    let sql = `
    SELECT games.*, GROUP_CONCAT(name_genre ORDER BY name_genre SEPARATOR ', ') AS genres_list FROM genre_game
    INNER JOIN genres
    ON genres.id = genre_game.id_genre
    INNER JOIN games
    ON games.id = genre_game.id_game`;

    if (search) {
        queryParams.push(`%${search}%`);

        sql += ` WHERE title LIKE ?`;
    }

    sql += ` GROUP BY games.id`;

    const validOrderByValues = ['title', 'price', 'created_at'];

    if (orderBy && validOrderByValues.includes(orderBy)) {
        sql += ` ORDER BY ${orderBy}`;
    }


    const validOrderDirectionValues = ['ASC', 'DESC'];

    if (orderBy && orderByDirection && validOrderDirectionValues.includes(orderByDirection)) {
        sql += ` ${orderByDirection}`;
    }

    connect.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error(err);
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
    SELECT games.*, GROUP_CONCAT(name_genre ORDER BY name_genre SEPARATOR ', ') AS genres_list FROM genre_game
    INNER JOIN genres
    ON genres.id = genre_game.id_genre
    INNER JOIN games
    ON games.id = genre_game.id_game
    WHERE id_game = ?;`;

    connect.query(sql, [id], (err, results) => {
        if (err) {

            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }

        const currentResult = results[0];

        const game = {
            ...currentResult,
            imagePath: process.env.PUBLIC_PATH + 'cover-games/' + currentResult.image
        };

        res.json(game);;


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