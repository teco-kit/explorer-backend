const mongoose = require("mongoose");

const DeviceApi = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Project needs to be set"],
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User needs to be set"],
  },

  deviceApiKey: {
    type: String,
  },

  datasets: {
      type: [{dataset: mongoose.Schema.Types.ObjectId, datasetKey: String}],
      default: []
  }
  
});

module.exports = {
  model: mongoose.model("DeviceApi", DeviceApi),
  schema: DeviceApi,
};
