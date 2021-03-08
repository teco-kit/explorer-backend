const mongoose = require('mongoose');

const Project = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'a project needs an admin'],
    },
    name: {
        type: String,
        required: [true, 'a project needs a name'],
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    datasets: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Dataset',
        default: [],
    },
    experiments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Experiment',
        default: [],
    },
    labelDefinitions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'LabelDefinition',
        default: [],
    },
    labelTypes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'LabelType',
        default: [],
    },
    devices: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Device',
        default: []
    },
    services: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Service',
        default: []
    },
    sensors: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Sensor',
        default: []
    }, 
    firmware: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Firmware',
        default: []
    }
});

Project.index({ name: 1, admin: 1 }, { unique: true });

const regex = new RegExp('/W');
Project.path('name').validate(
    value => /^[\w, -]+$/.test(value),
    'Invalid project name'
);

module.exports = {
    model: mongoose.model('Project', Project),
    schema: Project,
};
