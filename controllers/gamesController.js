


function index(req, res) {
    console.log('index')
}

function show(req, res) {
    console.log('show')
}

function store(req, res) {
    console.log('store')
}

function update(req, res) {
    console.log('update')
}

function modify(req, res) {
    console.log('modify')
}

function destroy(req, res) {
    console.log('destroy')
}

module.exports = { index, show, store, update, modify, destroy }