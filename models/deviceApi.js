const mongoose = require("mongoose");

const DeviceApi = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Project needs to be set"],
    ref: "Project"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User needs to be set"],
    ref: "User"
  },

  deviceApiKey: {
    type: String,
  },

  datasets: {
      type: [{dataset: mongoose.Schema.Types.ObjectId, datasetKey: String}],
      default: [],
      ref: "Dataset"
  }
  
});

module.exports = {
  model: mongoose.model("DeviceApi", DeviceApi),
  schema: DeviceApi,
};
