const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
        return res.status(401).json({ errorMessage: 'Unauthorized' })
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        req.user = decoded
        console.log('Token decoded successfully:', decoded) // Log decoded token for debugging
        next()
    } catch (error) {
        console.error('Token verification error:', error.message)
        return res.status(401).json({ errorMessage: 'Invalid token' })
    }
}

module.exports = { verifyToken }
