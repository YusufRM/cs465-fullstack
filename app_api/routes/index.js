const express = require('express'); // Express app
const router = express.Router();    // Router logic
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    const headers = authHeader.split(' ');
    if (headers.length < 1) {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }

    const token = authHeader.split(' ')[1];

    if (token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            console.log('Token Validation Error!');
            return res.sendStatus(401);
        }
        req.auth = verified; // Set the auth param to the decoded object
        next(); // Only continue once the token has actually verified
    });
}

// Define routes for registration and login
router
    .route('/register')
    .post(authController.register);

router
    .route('/login')
    .post(authController.login);

// Define route for the trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList)                          // GET method routes tripsList
    .post(authenticateJWT, tripsController.tripsAddTrip);     // POST method routes tripsAddTrip

// Requires parameter for these routes to identify one specific trip by code
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)                          // GET method routes tripsFindByCode
    .put(authenticateJWT, tripsController.tripsUpdateTrip)         // PUT method routes tripsUpdateTrip
    .delete(authenticateJWT, tripsController.tripsDeleteTrip);     // DELETE method routes tripsDeleteTrip

module.exports = router;
