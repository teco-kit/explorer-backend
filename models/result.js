const mongoose = require('mongoose');

const Result = new mongoose.Schema({
	sleep_score: Number,
	detected_issues: [
		{
			from: Date,
			to: Date,
			type: {
				type: String,
				enum: ['apnea', 'hypopnea'],
			},
			confidence: Number,
		}
	],
	sleep_phases: [
		{
			from: Date,
			to: Date,
			stage: {
				type: Number,
				min: 0,
				max: 4,
			},
			is_rem: Boolean,
			confidence: Number,
		}
	],
});

module.exports = {
	model: mongoose.model('Result', Result),
	schema: Result,
};
