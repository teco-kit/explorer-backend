const mongoose = require("mongoose");

const TimeSeries = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "timeSeries name cannot be empty"],
  },
  unit: {
    type: String,
    default: "",
  },
  data: {
    type: [
      {
        timestamp: {
          type: Number,
          required: [true, "invalid timestamp"],
        },
        datapoint: {
          type: Number,
          required: [true, "invalid datapoint"],
        },
      },
    ],
  },
  offset: {
    type: Number,
    default: 0,
  },
  start: { type: Number, default: 0 },
  end: { type: Number, default: 0 },
  samplingRate: Number,
});

module.exports = {
  model: mongoose.model("TimeSeries", TimeSeries),
  schema: TimeSeries,
};
