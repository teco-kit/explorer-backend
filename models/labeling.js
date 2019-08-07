const mongoose = require('mongoose');

const labelType = require('./labelType').schema;

const Labeling = new mongoose.Schema({
	labels: [labelType]
});

module.exports = {
	model: mongoose.model('Labeling', Labeling),
	schema: Labeling
};
