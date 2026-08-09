const express = require('express'); // Express app
const router = express.Router();    // Router logic

// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');

// Define route for the trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList)     // GET method routes tripsList
    .post(tripsController.tripsAddTrip); // POST method routes tripsAddTrip

// Requires parameter for these routes to identify one specific trip by code
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)     // GET method routes tripsFindByCode
    .put(tripsController.tripsUpdateTrip)     // PUT method routes tripsUpdateTrip
    .delete(tripsController.tripsDeleteTrip); // DELETE method routes tripsDeleteTrip

module.exports = router;
