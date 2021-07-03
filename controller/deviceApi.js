const Project = require("../models/project").model;
const crypto = require("crypto");
const Dataset = require("../models/dataset").model;
const DeviceApi = require("../models/deviceApi").model;

async function switchActive(ctx) {
  const { authId } = ctx.state;
  const body = ctx.request.body;
  const project = await Project.findOne({
    $and: [{ _id: ctx.header.project }, { admin: authId }],
  });

  if (!project) {
    ctx.body = { error: "No access to this project" };
    ctx.status = 400;
    return ctx;
  }

  project.enableDeviceApi = body.state;
  await project.save();
  ctx.body = {
    message: "DeviceApi for project " + project._id + ": " + body.state,
  };
  ctx.status = 200;
  return ctx;
}

async function setApiKey(ctx) {
  const { authId } = ctx.state;
  const deviceApi = await DeviceApi.findOne({
    $and: [{ projectId: ctx.header.project }, { userId: authId }],
  });

  const deviceKey = crypto.randomBytes(64).toString("base64");
  if (deviceApi) {
    deviceApi.deviceApiKey = deviceKey;
  } else {
    const newDeviceApi = await DeviceApi({
      projectId: ctx.header.project,
      userId: authId,
      deviceApiKey: deviceKey,
    });
    await newDeviceApi.save();
  }

  ctx.status = 200;
  ctx.body = { deviceApiKey: deviceKey };
  return ctx;
}

async function getApiKey(ctx) {
  const { authId } = ctx.state;
  const deviceApi = await DeviceApi.findOne({
    $and: [{ projectId: ctx.header.project }, { userId: authId }],
  });
  if (deviceApi) {
    ctx.body = { deviceApiKey: deviceApi.deviceApiKey };
    ctx.status = 200;
  } else {
    ctx.body = { deviceApiKey: undefined };
    ctx.status = 200;
  }
  return ctx;
}

async function removeKey(ctx) {
  const { authId } = ctx.state;
  const deviceApi = await DeviceApi.findOne({
    $and: [{ projectId: ctx.header.project }, { userId: authId }],
  });

  if (!deviceApi) {
    ctx.body = { error: "No access to this project" };
    ctx.status = 400;
    return ctx;
  }

  deviceApi.remove();
  ctx.body = { message: "Disabled device api" };
  ctx.status = 200;
  return ctx;
}

async function initDatasetIncrement(ctx) {
  const body = ctx.request.body;
  const deviceApi = await DeviceApi.findOne({
    deviceApiKey: body.deviceApiKey,
  });

  if (!body.name) {
    ctx.body = { error: "Wrong input parameters" };
    ctx.status = 400;
    return ctx;
  }

  if (!deviceApi) {
    ctx.body = { error: "Invalid key" };
    ctx.status = 403;
    return ctx;
  }
  const project = await Project.findOne(deviceApi.projectId);
  if (!project.enableDeviceApi) {
    ctx.body = { error: "This feature is disabled" };
    ctx.status = 403;
    return ctx;
  }

  const dataset = Dataset({
    name: body.name,
    userId: deviceApi.userId,
    start: 9999999999999,
    end: 0,
  });

  dataset.save();
  await Project.findByIdAndUpdate(deviceApi.projectId, {
    $push: { datasets: dataset._id },
  });

  const datasetKey = crypto.randomBytes(64).toString("base64");
  deviceApi.datasets.push({ dataset: dataset._id, datasetKey: datasetKey });
  await deviceApi.save();

  ctx.body = { datasetKey: datasetKey };
  ctx.status = 200;
  return ctx;
}

async function addDatasetIncrement(ctx) {
  try {
    const body = ctx.request.body;

    if (
      !"datasetKey" in body ||
      !"time" in body ||
      !"datapoint" in body ||
      !"sensorname" in body
    ) {
      ctx.status = 400;
      ctx.body = { error: "Wrong input parameters" };
      return ctx;
    }

    const { datasetKey, time, datapoint, sensorname } = body;
    const deviceApi = await DeviceApi.findOne({
      "datasets.datasetKey": datasetKey,
    });
    if (!deviceApi) {
      ctx.body = { error: "Invalid key" };
      ctx.status = 403;
      return ctx;
    }

    const datasetId = deviceApi.datasets.filter((elm) => {
      return elm.datasetKey === datasetKey;
    })[0].dataset;

    ctx.time = time || Math.floor(new Date().getTime());
    await Dataset.findOneAndUpdate(
      {
        _id: datasetId,
        timeSeries: { $not: { $elemMatch: { name: sensorname } } },
      },
      {
        $push: {
          timeSeries: { name: sensorname, start: ctx.time, end: ctx.time },
        },
      }
    );

    // Add datapoint
    await Dataset.findOneAndUpdate(
      { _id: datasetId, "timeSeries.name": sensorname },
      {
        $push: {
          "timeSeries.$.data": {
            timestamp: ctx.time,
            datapoint: datapoint,
          },
        },
      }
    );

    // Updating all 4 values in one query does not work
    await Dataset.findOneAndUpdate(
      { _id: datasetId, "timeSeries.name": sensorname },
      {
        $max: { end: ctx.time },
        $min: { start: ctx.time },
      }
    );

    await Dataset.findOneAndUpdate(
      { _id: datasetId, "timeSeries.name": sensorname },
      {
        $min: { "timeSeries.$.start": ctx.time },
        $max: { "timeSeries.$.end": ctx.time },
      }
    );

    ctx.status = 200;
    ctx.body = { message: "Added data" };
    return ctx;
  } catch (e) {
    console.log(e);
    ctx.status = 400;
    ctx.body = { error: "Error adding increment" };
  }
}

async function addDatasetIncrementBatch(ctx) {
  try {
    const body = ctx.request.body;
    const { datasetKey, data } = body;
    const deviceApi = await DeviceApi.findOne({
      "datasets.datasetKey": datasetKey,
    });
    if (!deviceApi) {
      ctx.body = { error: "Invalid key" };
      ctx.status = 403;
      return ctx;
    }

    const datasetId = deviceApi.datasets.filter((elm) => {
      return elm.datasetKey === datasetKey;
    })[0].dataset;

    for (var i = 0; i < data.length; i++) {
      const sensorname = data[i].sensorname;
      const timeSeriesData = data[i].timeSeriesData;
      const startTime = data[i].start;
      const endTime = data[i].end;

      await Dataset.findOneAndUpdate(
        {
          _id: datasetId,
          timeSeries: { $not: { $elemMatch: { name: sensorname } } },
        },
        {
          $push: {
            timeSeries: {
              name: sensorname,
              start: 9999999999999,
              end: 0,
            },
          },
        }
      );

      await Dataset.findOneAndUpdate(
        { _id: datasetId, "timeSeries.name": sensorname },
        {
          $push: { "timeSeries.$.data": { $each: timeSeriesData , $sort: {"timestamp": 1}} },
        }
      );
      await Dataset.findOneAndUpdate(
        { _id: datasetId, "timeSeries.name": sensorname },
        {
          $min: { "timeSeries.$.start": startTime },
          $max: { "timeSeries.$.end": endTime },
        }
      );
    }

    ctx.globalStart = Math.min(data.map((elm) => elm.start));
    ctx.globalEnd = Math.max(data.map((elm) => elm.end));
    await Dataset.findOneAndUpdate(
      { _id: datasetId},
      {
        $max: { end: ctx.globalEnd },
        $min: { start: ctx.globalStart },
      }
    );

    ctx.status = 200;
    ctx.body = { message: "Added data" };
    return ctx;
  } catch (e) {
    console.log(e);
    ctx.status = 400;
    ctx.body = { error: "Error adding increment" };
  }
}

async function uploadDataset(ctx) {
  try {
    const body = ctx.request.body.payload;
    const key = ctx.request.body.key;

    const deviceApi = await DeviceApi.findOne({
      deviceApiKey: key,
    });
    if (!deviceApi) {
      ctx.body = { error: "Invalid key" };
      ctx.status = 403;
      return ctx;
    }
    const project = await Project.findOne(deviceApi.projectId);
    if (!project || !project.enableDeviceApi) {
      ctx.body = { error: "This feature is disabled" };
      ctx.status = 403;
      return ctx;
    }

    body.userId = deviceApi.userId;
    const document = new Dataset(body);
    await document.save();
    await Project.findByIdAndUpdate(
      { _id: project._id },
      {
        $push: { datasets: document._id },
      }
    );

    ctx.body = { message: "Generated dataset" };
    ctx.status = 200;
    return ctx;
  } catch (e) {
    console.log(e);
    ctx.status = 400;
    ctx.body = { error: "Error creating the dataset" };
    return ctx;
  }
}

module.exports = {
  setApiKey,
  removeKey,
  uploadDataset,
  switchActive,
  getApiKey,
  initDatasetIncrement,
  addDatasetIncrement,
  addDatasetIncrementBatch,
};
