const express = require('express')
const router = express.Router()
const gamesController = require('../controllers/gamesController')


router.get('/', gamesController.index)

router.get('/:id', gamesController.show)

router.post('/', gamesController.store)

router.put('/:id', gamesController.update)

router.patch('/:id', gamesController.modify)

router.delete('/:id', gamesController.destroy)


module.exports = router