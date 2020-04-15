const mongoose = require('mongoose');

// import subdocumets
const Event = require('./datasetEvent').schema;
const TimeSeries = require('./timeSeries').schema;
const FusedSeries = require('./fusedSeries').schema;
const LabelingObject = require('./datasetLabeling').schema;
const Video = require('./video').schema;
const Result = require('./result').schema;

const Dataset = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'object needs to be associated with user']
	},
	start: {
		type: Number,
		required: [true, 'please enter a start time']
	},
	end: {
		type: Number,
		required: [true, 'please enter an end time']
	},
	events: {
		type: [Event],
		default: []
	},
	isPublished: {
		type: Boolean,
		default: false
	},
	timeSeries: {
		type: [TimeSeries],
		default: []
	},
	fusedSeries: {
		type: [FusedSeries],
		default: []
	},
	labelings: {
		type: [LabelingObject],
		default: []
	},
	video: Video,
	device: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Device',
		default: null
	},
	results: {
		type: [Result],
		default: []
	},
	experiments: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Experiment',
		default: null
	}
});

module.exports = {
	model: mongoose.model('Dataset', Dataset),
	schema: Dataset
};
