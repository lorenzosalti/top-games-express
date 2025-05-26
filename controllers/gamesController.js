const connect = require('../data/dbgames');

function show(req, res) {
    res.send('Game Show')
}

function modify(req, res) {
    res.send('Game Modify')
}


module.exports = { show, modify }