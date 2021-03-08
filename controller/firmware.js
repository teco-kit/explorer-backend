const Model = require("../models/firmware").model;
const Project = require("../models/project").model;
const Device = require("../models/device").model;

/**
 * get all firmware
 */
async function getFirmware(ctx) {
  const project = Project.findOne({ _id: ctx.header.project });
  ctx.body = await Model.find({ _id: project.firmware });
  ctx.status = 200;
  return ctx;
}

/**
 * get firmware by id
 */
async function getFirmwareById(ctx) {
  const project = await Project.findOne({ _id: ctx.header.project });
  const data = await Model.findOne({
    $and: [
      { _id: ctx.params.id },
      {
        _id: project.firmware,
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
 * create a new firmware
 */
async function createFirmware(ctx) {
  const document = new Model(ctx.request.body);
  await document.save();
  await Project.findByIdAndUpdate(ctx.header.project, {
    $push: { firmware: document._id },
  });
  ctx.body = document;
  ctx.status = 201;
  return ctx;
}

/**
 * update a firmware specified by id
 */
async function updateFirmwareById(ctx) {
  const project = await Project.findById({ _id: ctx.header.project });
  if (project.firmware.includes(ctx.params.id)) {
    await Model.findByIdAndUpdate(ctx.params.id, { $set: ctx.request.body });
    ctx.body = { message: `updated firmware with id: ${ctx.params.id}` };
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }
  return ctx;
}

/**
 * delete all firmware
 */
async function deleteFirmware(ctx) {
  const project = await Project.findById(ctx.header.project);
  const devices = await Device.find({ firmware: project.firmware });
  if (devices.length !== 0) {
    ctx.body = { error: "Cannot delete firmware which is still in use" };
    ctx.status = 400;
  } else {
    await Model.deleteMany({ _id: project.firmware });
    await Project.updateOne(
      { _id: ctx.header.project },
      {
        $set: { firmware: [] },
      }
    );
    ctx.body = { message: "deleted all firmware" };
    ctx.status = 200;
  }
  return ctx;
}

/**
 * delete a firmware specified by id
 */
async function deleteFirmwareById(ctx) {
  const devices = await Device.find({ firmware: ctx.params.id });
  if (devices.length !== 0) {
    ctx.body = { error: "Cannot delete firmware which is still in use" };
    ctx.status = 400;
  } else {
    await Model.findOneAndDelete({ _id: ctx.params.id });
    await Project.updateOne(
      { _id: ctx.header.project },
      { $pull: { firmware: ctx.params.id } }
    );
    ctx.body = { message: `deleted firmware with id: ${ctx.params.id}` };
    ctx.status = 200;
  }
  return ctx;
}

module.exports = {
  getFirmware,
  getFirmwareById,
  createFirmware,
  updateFirmwareById,
  deleteFirmware,
  deleteFirmwareById,
};
