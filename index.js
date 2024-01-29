const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cardsController = require('./controllers/cardsController')
const authRoutes = require('./routes/auth')
const { verifyToken } = require('./middleware/authMiddleware')


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
app.get('/cards', verifyToken, cardsController.getAllCards)
app.post('/cards/create', verifyToken, cardsController.createCard)
app.put('/cards/:id', verifyToken, cardsController.updateCard)
app.delete('/cards/:id', verifyToken, cardsController.deleteCard)
app.get('/cards/types', verifyToken, cardsController.getAllTypes)
app.get('/cards/sets', verifyToken, cardsController.getAllSets)
app.get('/cards/rarities', verifyToken, cardsController.getAllRarities)
app.get('/cards/count', verifyToken, cardsController.getCardCount)
app.get('/cards/random', verifyToken, cardsController.getRandomCard)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

