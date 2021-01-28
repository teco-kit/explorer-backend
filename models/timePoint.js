const mongoose = require('mongoose');

const TimePoint = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: [true, 'invalid timestamp'],
    },
    datapoint: {
        type: Number,
        required: [true, 'invalid datapoint'],
    },
});

module.exports = {
    model: mongoose.model('TimePoint', TimePoint),
    schema: TimePoint,
};
