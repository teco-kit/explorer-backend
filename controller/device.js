const Model = require("../models/device").model;
const Project = require("../models/project").model;
const Datasets = require("../models/dataset").model;

/**
 * get all devices
 */
async function getDevices(ctx) {
  const project = await Project.findById({ _id: ctx.header.project });
  const devices = await Model.find({ _id: project.devices });
  ctx.body = devices;
  ctx.status = 200;
  return ctx;
}

/**
 * get device by id
 */
async function getDeviceById(ctx) {
  const project = await Project.findById({ _id: ctx.header.project });
  const data = await Model.findOne({
    $and: [
      { _id: ctx.params.id },
      {
        _id: project.devices,
      },
    ],
  });
  if (data !== null) {
    ctx.body = data;
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }
  return ctx;
}

/**
 * create a new device
 */
async function createDevice(ctx) {
  const document = new Model(ctx.request.body);
  await document.save();
  await Project.findByIdAndUpdate(ctx.header.project, {
    $push: { devices: document._id },
  });

  ctx.body = document;
  ctx.status = 201;
  return ctx;
}

/**
 * update a device specified by id
 */
async function updateDeviceById(ctx) {
  const project = await Project.findById({ _id: ctx.header.project });
  if (project.devices.includes(ctx.params.id)) {
    await Model.findByIdAndUpdate(ctx.params.id, { $set: ctx.request.body });
    ctx.body = { message: `updated device with id: ${ctx.params.id}` };
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }
  return ctx;
}

/**
 * delete all devices
 */
async function deleteDevices(ctx) {
  const project = await Project.findById({ _id: ctx.header.project });
  await Datasets.updateMany(
    { device: project.datasets },
    { $pull: { devices: project.devices } }
  );
  await Model.deleteMany({ _id: ctx.header.project });
  await Project.updateOne(
    { _id: ctx.header.project },
    { $set: { devices: [] } }
  );
  ctx.body = { message: "deleted all devices" };
  ctx.status = 200;
  return ctx;
}

/**
 * delete a device specified by id
 */
async function deleteDeviceById(ctx) {
  const project = await Project.findById({ _id: ctx.header.project });
  await Datasets.updateMany(
    { device: project.datasets },
    { $pull: { devices: ctx.params.id } }
  );
  await Project.updateOne(
    { _id: ctx.header.project },
    { $pull: { devices: ctx.params.id } }
  );
  await Model.findOneAndDelete({ _id: ctx.params.id });
  ctx.body = { message: `deleted device with id: ${ctx.params.id}` };
  ctx.status = 200;
  return ctx;
}

module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  updateDeviceById,
  deleteDevices,
  deleteDeviceById,
};
