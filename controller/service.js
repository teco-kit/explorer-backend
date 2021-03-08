const Project = require("../models/project").model;
const Model = require("../models/service").model;
const DatasetLabeling = require("../models/datasetLabeling").model;

/**
 * get all services
 */
async function getServices(ctx) {
  const project = Project.findOne({ _id: ctx.header.project });
  ctx.body = await Model.find({ _id: project.services });
  ctx.status = 200;
  return ctx;
}

/**
 * get service by id
 */
async function getServiceById(ctx) {
  const project = await  Project.findOne({ _id: ctx.header.project });
  const data = await Model.findOne({
    $and: [
      { _id: ctx.params.id },
      {
        _id: project.services,
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
 * create a new service
 */
async function createService(ctx) {
  const document = new Model(ctx.request.body);
  await document.save();
  await Project.findByIdAndUpdate(ctx.header.project, {
    $push: { services: document._id },
  });
  ctx.body = document;
  ctx.status = 201;
  return ctx;
}

/**
 * update a service specified by id
 */
async function updateServiceById(ctx) {
  const project = await Project.findById({ _id: ctx.header.project });
  if (project.services.includes(ctx.params.id)) {
    await Model.findByIdAndUpdate(ctx.params.id, { $set: ctx.request.body });
    ctx.body = { message: `updated service with id: ${ctx.params.id}` };
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }
  return ctx;
}

/**
 * delete all services
 */
async function deleteServices(ctx) {
  const project = await Project.findById(ctx.header.project);
  await DatasetLabeling.updateMany(
    {
      creator: project.services,
    },
    { $pull: { services: project.services } }
  );
  await Model.deleteMany({ _id: ctx.header.project });
  await Project.updateOne(
    {
      _id: ctx.header.project,
    },
    { $set: { services: [] } }
  );
  ctx.body = { message: "deleted all services" };
  ctx.status = 200;
  return ctx;
}

/**
 * delete a service specified by id
 */
async function deleteServiceById(ctx) {
  const project = await Project.findById({ _id: ctx.header.project });
  await DatasetLabeling.updateMany(
    {
      creator: project.services,
    },
    { $pull: { creator: ctx.params.id } }
  );
  await Project.updateOne(
    {
      _id: ctx.header.project,
    },
    { $pull: { services: ctx.params.id } }
  );
  await Model.findOneAndDelete({ _id: ctx.params.id });
  ctx.body = { message: `deleted service with id: ${ctx.params.id}` };
  ctx.status = 200;
  return ctx;
}

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateServiceById,
  deleteServices,
  deleteServiceById,
};
