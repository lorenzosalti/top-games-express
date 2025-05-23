

function playstationIndex(req, res) {

  res.send('playstation')
}

function xboxIndex(req, res) {

  res.send('xbox')
}

function pcIndex(req, res) {

  res.send('pc')
}

function switchIndex(req, res) {

  res.send('switch')
}

module.exports = { playstationIndex, xboxIndex, pcIndex, switchIndex }