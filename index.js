// index.js

const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cardsController = require('./controllers/cardsController')
const authRoutes = require('./routes/auth')


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})

// Routes
app.use('/auth', authRoutes)
app.get('/cards', cardsController.getAllCards)
app.post('/cards/create', cardsController.createCard)
app.get('/types', cardsController.getAllTypes)
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

