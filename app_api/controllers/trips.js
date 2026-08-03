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

module.exports = {
    tripsList,
    tripsFindByCode
};
