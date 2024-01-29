# MTech Card Management API

The MTech Card Management API is a RESTful API for managing collectible card information. It allows users to perform operations such as creating, updating, and deleting cards, as well as retrieving various details about the cards.

## Features

- Create new cards with specific details (name, set, cardNumber, type, power, toughness, rarity, cost).
- Update existing cards with the latest information.
- Delete cards based on their unique identifier.
- Retrieve filtered card lists based on set, type, and rarity.
- Get a list of available card types.
- Get a list of available card sets.
- Get a list of available card rarities.
- Retrieve the total number of cards.
- Get information about a randomly selected card.

## Setup

To set up the MTech Card Management API locally, follow these steps:

1. Clone the repository:

git clone https://github.com/your-username/api-server-project.git

2. Navigate to he project directory

cd api-server-project

3. install dependencies:

# Node:
npm install

# Install body-parser
npm install body-parser

# Install cors
npm install cors

# Install dotenv
npm install dotenv

# Install express
npm install express

# Install express-jwt
npm install express-jwt

# Install jsonwebtoken
npm install jsonwebtoken


4. create an .env file in the project root and copy and paste the following:

PORT=3000
JWT_SECRET=your_secret_key

(Replace your_secret_key with a strong and secure secret key for JWT token generation.)

5. Start the server:

nodemon index.js

6. install the REST extension to your VScode either in VScode directly or following the link below:

Name: REST Client
Id: humao.rest-client
Description: REST Client for Visual Studio Code
Version: 0.25.1
Publisher: Huachao Mao
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=humao.rest-client

7. got to the .rest file now and test all the features that this api has by first sending the first request from the .rest file:

POST http://localhost:3000/auth/getToken HTTP/1.1
Content-Type: application/json

{
"username": "Jared",
"password": "mypassword"
}

8. you will receive a token that you will use to send other requests when authentication is required. Tokens are set to last One Hour, so you DO NOT need to request one every time you want to test other requests. Replace the word "YourToken" for the token you received from the first request, for example:

GET http://localhost:3000/cards HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkphcmVkIiwiaWF0IjoxNzA2MjUyOTgyLCJleHAiOjE3MDYyNTY1ODJ9.PzNE3vzw7ZRL3A82sZBEQpbt4bODDO-YYF3TzqdSXX8

this long code next to the word Bearer is an example of how the token look like. You will the token everywhere you the see the "YourToken" in each Request from the .rest file in order to authenticate the request.