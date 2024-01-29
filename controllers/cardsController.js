const fs = require('fs')
const path = require('path')
const { verifyToken } = require('../middleware/authMiddleware')

const cardsFilePath = path.join(__dirname, '../data/cards.json')

//Retrieve all cards with optional query parameters for filtering
const getAllCards = (req, res) => {
    try {
        //Reads from the file
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

            //Reads from the file
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

            // Generates id based on the index of the last card in the array
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

            // Checks if a card with the same id already exists
            const existingCard = cards.find(card => card.id === id)
            if (existingCard) {
                return res.status(400).json({ errorMessage: 'Card with the same id already exists' })
            }

            cards.push(newCard)

            // Updates the cards file by writing the new data back to the file
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
const deleteCard = (req, res) => {
    try {
        verifyToken(req, res, () => {
            const decoded = req.user

            // Reads cards data from the file
            const cardsData = fs.readFileSync(cardsFilePath, 'utf-8')
            let { cards } = JSON.parse(cardsData)

            const { id } = req.params
            const cardIndex = cards.findIndex(card => card.id === parseInt(id))

            if (cardIndex === -1) {
                return res.status(404).json({ errorMessage: 'Card not found' })
            }

            // Removes the card from the array
            const deletedCard = cards.splice(cardIndex, 1)[0]

            // Writes the updated cards data back to the file
            fs.writeFileSync(cardsFilePath, JSON.stringify({ cards }, null, 2), 'utf-8')

            res.json({ successMessage: 'Card deleted successfully', deletedCard })
        })
    } catch (error) {
        console.error('Error deleting card:', error.message)
        res.status(401).json({ errorMessage: 'Invalid token or internal server error' })
    }
}

//Additional Features
//Get Sets: GET /sets - Retrieve a list of all card sets available.
const getAllSets = (req, res) => {
    try {
        const cardsData = fs.readFileSync(cardsFilePath, 'utf-8')
        const { cards } = JSON.parse(cardsData)

        const setsSet = new Set()

        // Extract all unique sets from the cards data
        cards.forEach(card => {
            if (card.set) {
                setsSet.add(card.set)
            }
        })

        const sets = Array.from(setsSet)

        res.json(sets)
    } catch (error) {
        console.error('Error retrieving sets:', error)
        res.status(500).json({ errorMessage: 'Internal Server Error' })
    }
}

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

// Get Rarities: GET /rarities - Retrieve a list of all card rarities available.
const getAllRarities = (req, res) => {
    try {
        const cardsData = fs.readFileSync(cardsFilePath, 'utf-8')
        const { cards } = JSON.parse(cardsData)

        const raritiesSet = new Set()

        // Extract all unique rarities from the cards data
        cards.forEach(card => {
            if (card.rarity) {
                raritiesSet.add(card.rarity)
            }
        })

        const rarities = Array.from(raritiesSet)

        res.json(rarities)
    } catch (error) {
        console.error('Error retrieving rarities:', error)
        res.status(500).json({ errorMessage: 'Internal Server Error' })
    }
}

// Get Card Count: GET /cards/count - Retrieve the total number of cards.
const getCardCount = (req, res) => {
    try {
        const cardsData = fs.readFileSync(cardsFilePath, 'utf-8')
        const { cards } = JSON.parse(cardsData)

        const cardCount = cards.length

        res.json({ cardCount })
    } catch (error) {
        console.error('Error retrieving card count:', error)
        res.status(500).json({ errorMessage: 'Internal Server Error' })
    }
}


// Get Random Card: GET /cards/random - Retrieve information about a randomly selected card.
const getRandomCard = (req, res) => {
    try {
        const cardsData = fs.readFileSync(cardsFilePath, 'utf-8')
        const { cards } = JSON.parse(cardsData)

        const randomIndex = Math.floor(Math.random() * cards.length)
        const randomCard = cards[randomIndex]

        res.json(randomCard)
    } catch (error) {
        console.error('Error retrieving random card:', error)
        res.status(500).json({ errorMessage: 'Internal Server Error' })
    }
}

module.exports = {
    getAllCards,
    getAllTypes,
    getAllSets,
    getAllRarities,
    getCardCount,
    getRandomCard,
    createCard,
    updateCard,
    deleteCard,

}