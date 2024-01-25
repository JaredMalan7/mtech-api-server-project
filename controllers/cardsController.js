const fs = require('fs')
const path = require('path')
const { verifyToken } = require('../middleware/authMiddleware')

const cardsFilePath = path.join(__dirname, '../data/cards.json')

//Retrieve all cards with optional query parameters for filtering (8 points).
const getAllCards = (req, res) => {
    try {
        const cardsData = fs.readFileSync(cardsFilePath, 'utf-8')
        const { cards } = JSON.parse(cardsData)

        // Parse query parameters
        const { set, type, rarity } = req.query

        // Apply filtering based on query parameters
        const filteredCards = cards.filter(card => {
            return (!set || card.set === set) && (!type || card.type === type) && (!rarity || card.rarity === rarity)
        })

        res.json(filteredCards)
    } catch (error) {
        console.error('Error reading cards file:', error)
        res.status(500).json({ errorMessage: 'Internal Server Error' })
    }
}


const createCard = (req, res) => {
    try {
        const cardsData = fs.readFileSync(cardsFilePath, 'utf-8')
        const { cards } = JSON.parse(cardsData)

        const {
            name,
            set,
            cardNumber,
            type,
            power,
            toughness,
            rarity,
            cost
        } = req.body

        // Generate id based on the index of the last card in the array
        const id = cards.length > 0 ? cards[cards.length - 1].id + 1 : 1

        const newCard = {
            id,
            name,
            set,
            cardNumber,
            type,
            power,
            toughness,
            rarity,
            cost
        }

        // Check if a card with the same id already exists
        const existingCard = cards.find(card => card.id === id)
        if (existingCard) {
            return res.status(400).json({ errorMessage: 'Card with the same id already exists' })
        }

        cards.push(newCard)

        // Update the cards file with the new data
        fs.writeFileSync(cardsFilePath, JSON.stringify({ cards }, null, 2), 'utf-8')

        res.json(newCard)
    } catch (error) {
        console.error('Error creating card:', error)
        res.status(500).json({ errorMessage: 'Internal Server Error' })
    }
}


const getAllTypes = (req, res) => {
    try {
        const cardsData = fs.readFileSync(cardsFilePath, 'utf-8')
        const { cards } = JSON.parse(cardsData)

        const typesSet = new Set()

        // Extract all unique types from the cards data
        cards.forEach(card => {
            if (card.type) {
                typesSet.add(card.type)
            }
        })

        const types = Array.from(typesSet)

        res.json(types)
    } catch (error) {
        console.error('Error retrieving types:', error)
        res.status(500).json({ errorMessage: 'Internal Server Error' })
    }
}


module.exports = {
    getAllCards,
    createCard,
    getAllTypes,
}