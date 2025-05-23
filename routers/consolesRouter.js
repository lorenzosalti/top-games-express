const express = require('express')
const router = express.Router()

const consoleController = require('../controllers/consoleController')



router.get('/playstation', consoleController.playstationIndex)

router.get('/xbox', consoleController.xboxIndex)

router.get('/pc', consoleController.pcIndex)

router.get('/switch', consoleController.switchIndex)


module.exports = router