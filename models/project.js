const mongoose = require('mongoose');

// import subdocumets
const User = require('./user').schema

const Project = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'a project needs an admin']
    },
    name: {
        type: String,
        required: [true, 'a project needs a name']
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    datasets: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Dataset',
        default: []
    },
    experiments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Experiment',
        default: []
    },
    labelDefinitions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'LabelDefinition',
        default: []
    },
    labelTypes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'LabelType',
        default: []
    }
});

module.exports = {
    model: mongoose.model('Project', Project),
    schema: Project
};
