const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/getToken', authController.getToken)

module.exports = router