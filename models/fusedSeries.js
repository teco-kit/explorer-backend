const mongoose = require('mongoose');

const FusedSeries = new mongoose.Schema({
	timeSeries: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'TimeSeries'
	}]
});

module.exports = {
	model: mongoose.model('FusedSeries', FusedSeries),
	schema: FusedSeries
};
