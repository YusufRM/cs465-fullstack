const mongoose = require('mongoose');
require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    const q = await Model
        .find({})
        .exec();

    if (!q) {
        // Database returned no data
        return res
            .status(404)
            .json({ message: 'No trips found in the database' });
    } else {
        // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({ code: req.params.tripCode })
        .exec();

    if (!q || !q.length) {
        // Database returned no matching trip
        return res
            .status(404)
            .json({ message: 'Trip not found' });
    } else {
        // Return resulting trip
        return res
            .status(200)
            .json(q);
    }
};

// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    const q = await Model.create({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    if (!q) {
        // Database returned no data
        return res
            .status(400)
            .json({ message: 'Could not add trip' });
    } else {
        // Return resulting new trip
        return res
            .status(201)
            .json(q);
    }
};

// PUT: /trips/:tripCode - Updates an existing Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    const q = await Model
        .findOneAndUpdate(
            { 'code': req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true }
        )
        .exec();

    if (!q) {
        // Database returned no data
        return res
            .status(400)
            .json({ message: 'Trip not found, could not update' });
    } else {
        // Return resulting updated trip
        return res
            .status(201)
            .json(q);
    }
};

// DELETE: /trips/:tripCode - Deletes an existing Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsDeleteTrip = async (req, res) => {
    const q = await Model
        .findOneAndDelete({ 'code': req.params.tripCode })
        .exec();

    if (!q) {
        // Database returned no data
        return res
            .status(400)
            .json({ message: 'Trip not found, could not delete' });
    } else {
        // Return the trip that was deleted
        return res
            .status(200)
            .json(q);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};
