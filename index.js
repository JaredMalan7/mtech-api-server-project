//This is the entry point
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

//middleare
app.use(bodyParser.json())

//routes
const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

// Start Server

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})