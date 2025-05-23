const express = require('express')
const router = express.Router()

const orderController = require('../controllers/orderController')


router.get('/:id', orderController.orderShow)

router.post('/', orderController.orderStore)


module.exports = router