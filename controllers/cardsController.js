const fs = require('fs')
const path = require('path')
const { verifyToken } = require('../middleware/authMiddleware')

const cardsFilePath = path.join(__dirname, '../data/cards.json')

//Retrieve all cards with optional query parameters for filtering (8 points).
const getAllCards = (req, res) => {
    try {
        const cardsData = fs.readFileSync(cardsFilePath)
        const cards = JSON.parse(cardsData)

        // Parse query parameters for filtering
        const { set, type, rarity } = req.query

        // Filtering only needs to support equality matches.
        const filteredCards = cards.filter(card => {
            return (!set || card.set === set) && (!type || card.type === type) && (!rarity || card.rarity === rarity)
        })

        res.json(filteredCards)
    } catch (error) {
        console.error('Error reading cards file:', error)
        res.status(500).json({ errorMessage: 'Internal Server Error' })
    }
}

module.exports = {
    getAllCards,
}