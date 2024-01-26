const fs = require('fs')
const path = require('path')
const { verifyToken } = require('../middleware/authMiddleware')

const cardsFilePath = path.join(__dirname, '../data/cards.json')

//Retrieve all cards with optional query parameters for filtering
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

// Create a new card at the /cards/create endpoint
const createCard = (req, res) => {
    try {
        const token = req.header('Authorization')

        verifyToken(req, res, () => {
            const decoded = req.user

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
        })
    } catch (error) {
        console.error('Error creating card:', error)
        res.status(500).json({ errorMessage: 'Internal Server Error' })
    }
}


// Update an existing card using the /cards/:id (PUT) endpoint
const updateCard = (req, res) => {
    try {
        verifyToken(req, res, () => {
            const decoded = req.user

            // Reads cards data from the file
            const cardsData = fs.readFileSync(cardsFilePath, 'utf-8')
            const { cards } = JSON.parse(cardsData)

            const { id } = req.params
            const cardIndex = cards.findIndex(card => card.id === parseInt(id))

            if (cardIndex === -1) {
                return res.status(404).json({ errorMessage: 'Card not found' })
            }

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

            // Creates an updated card object
            const updatedCard = {
                id: parseInt(id),
                name,
                set,
                cardNumber,
                type,
                power,
                toughness,
                rarity,
                cost
            }

            // Checks if a card with the same id already exists
            const existingCard = cards.find(card => card.id === updatedCard.id)
            if (existingCard && existingCard.id !== parseInt(id)) {
                return res.status(400).json({ errorMessage: 'Card with the same id already exists' })
            }

            // Updates the card in the array
            cards[cardIndex] = updatedCard

            // Writes the updated cards data back to the file
            fs.writeFileSync(cardsFilePath, JSON.stringify({ cards }, null, 2), 'utf-8')

            res.json(updatedCard)
        })
    } catch (error) {
        console.error('Error updating card:', error.message)
        res.status(401).json({ errorMessage: 'Invalid token or internal server error' })
    }
}



// Delete an existing card using the /cards/:id (DELETE) endpoint



// Create, update, and delete endpoints are protected; accessible only with a valid JWT.



// All endpoints return either an errorMessage or a successMessage along with the created/updated/deleted object.


// Get Types: GET /types - Retrieve a list of all card types available.
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
    updateCard,
}