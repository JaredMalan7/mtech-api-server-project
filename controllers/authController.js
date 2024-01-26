const jwt = require('jsonwebtoken')
const userData = require('../data/users.json')
const users = userData.users

console.log(users)

const getToken = (req, res) => {
    const { username, password } = req.body;
    console.log('Received request with body: ', req.body)

    // for now, this is the validation credentials
    const isValidUser = users.find(user => user.username === username && user.password === password)

    if (isValidUser) {

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.json({ token })
    } else {
        // Returns a 401 status code with an error message if authentication fails.
        res.status(401).json({ errorMessage: 'Invalid credentials' })
    }
}

module.exports = { getToken }
