const express = require('express')
const router = express.Router()

const orderController = require('../controllers/orderController')

router.get('/', orderController.orderIndex)

router.get('/discount', orderController.discountIndex)

router.get('/:id', orderController.orderShow)

router.post('/', orderController.orderStore)

router.post('/customer', orderController.customerStore)


module.exports = router