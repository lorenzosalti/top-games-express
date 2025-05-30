const express = require('express');
const router = express.Router();
const mailingController = require('../controllers/mailingController');

router.post('/subscribe', mailingController.subscribe);

module.exports = router;