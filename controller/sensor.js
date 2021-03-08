const Model = require("../models/sensor").model;
const Project = require("../models/project").model;
const Device = require("../models/device").model;

/**
 * get all sensors
 */
async function getSensors(ctx) {
  const project = await Project.findOne({ _id: ctx.header.project });
  ctx.body = await Model.find({ _id: project.sensors });
  ctx.status = 200;
  return ctx;
}

/**
 * get sensor by id
 */
async function getSensorById(ctx) {
  const project = await Project.findOne({ _id: ctx.header.project });
  const data = await Model.findOne({
    $and: [{ _id: ctx.params.id }, { _id: project.sensors }],
  });
  if (data != null) {
    ctx.body = data;
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }
  return ctx;
}

/**
 * create a new sensor
 */
async function createSensor(ctx) {
  const document = new Model(ctx.request.body);
  await document.save();
  await Project.findByIdAndUpdate(ctx.header.project, {
    $push: { sensors: document._id },
  });
  ctx.body = document;
  ctx.status = 201;
  return ctx;
}

/**
 * update a sensor specified by id
 */
async function updateSensorById(ctx) {
  const project = await Project.findById({ _id: ctx.header.project });
  if (project.sensors.includes(ctx.params.id)) {
    await Model.findByIdAndUpdate(ctx.params.id, { $set: ctx.request.body });
    ctx.body = { message: `updated sensor with id: ${ctx.params.id}` };
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }
  return ctx;
}

/**
 * delete all sensors
 */
async function deleteSensors(ctx) {
  const project = await Project.findById(ctx.header.project);
  await Device.updateMany(
    {
      sensors: project.sensors,
    },
    { $pull: { sensors: project.sensors } }
  );
  await Model.deleteMany({ _id: ctx.header.project });
  await Project.updateOne(
    {
      _id: ctx.header.project,
    },
    { $set: { sensors: [] } }
  );
  ctx.body = { message: "deleted all sensors" };
  ctx.status = 200;
  return ctx;
}

/**
 * delete a sensor specified by id
 */
async function deleteSensorById(ctx) {
  const project = await Project.findById({ _id: ctx.header.project });
  await Device.updateMany(
    {
      sensors: project.sensors,
    },
    { $pull: { sensors: ctx.params.id } }
  );
  await Project.updateOne(
    { _id: ctx.header.project },
    { $pull: { sensors: ctx.params.id } }
  );
  await Model.findOneAndDelete({ _id: ctx.params.id });
  ctx.body = { message: `deleted sensor with id: ${ctx.params.id}` };
  ctx.status = 200;
  return ctx;
}

module.exports = {
  getSensors,
  getSensorById,
  createSensor,
  updateSensorById,
  deleteSensors,
  deleteSensorById,
};
