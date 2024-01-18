const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(bodyParser.json())

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})

// Routes
const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
