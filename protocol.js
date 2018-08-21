const protobuf = require('protobufjs');

const path = require('path');

const Root = protobuf.loadSync(path.join(__dirname, 'protocol', 'Dataset.proto'));

module.exports = Root.Aura.Model.Analysis.Generated;
