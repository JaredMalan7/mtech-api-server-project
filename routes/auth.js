const express = require('express')
const router = express.Router()
const { getToken } = require('../controllers/authController')

router.post('/getToken', (req, res, next) => {
    getToken(req, res, next)
})

module.exports = router