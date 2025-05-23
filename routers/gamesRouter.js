const express = require('express')
const router = express.Router()
const gamesController = require('../controllers/gamesController')


router.get('/:id', gamesController.show)

router.patch('/:id', gamesController.modify)



module.exports = router