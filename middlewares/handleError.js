function handleError(err, req, res, next) {
    res.status(500);
    res.json({
        errorStatus: 500,
        errorMessage: err.message
    })
}

module.exports = handleError