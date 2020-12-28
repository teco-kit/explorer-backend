const Model = require("../models/experiment").model;
const ProjectModel = require("../models/project").model;

/**
 * get all experiments for a project
 */
async function getExperiments(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });
  const experiments = await Model.find({ _id: project.experiments });
  ctx.body = experiments
  ctx.status = 200;
  return ctx;
}

/**
 * get experiment by id
 */
async function getExperimentById(ctx) {
  const project = ProjectModel.findOne({ _id: ctx.header.project });
  const experiment = await Model.find({
    $and: [{ _id: ctx.params.id }, { _id: project.experiments }],
  });
  if (experiment.length !== 1) {
    ctx.body = { error: "Experiment not in dataset" };
    ctx.status = 400;
  } else {
    ctx.body = dataset;
    ctx.status = 200;
  }
  return ctx;
}

/**
 * get experiment by id
 * experiment is populated by LabelDefinition and LabelTypes
 */
async function getExperimentByIdPopulated(ctx) {
  const project = ProjectModel.findOne({ _id: ctx.header.project });
  const experiment = await Model.find({
    $and: [{ _id: ctx.params.id }, { _id: project.experiments }],
  });
  if (experiment.length !== 1) {
    ctx.body = { error: "Experiment not in dataset" };
    ctx.status = 400;
  } else {
    await experiment.populate("instructions.labelingId").execPopulate();
    await experiment.populate("instructions.labelType").execPopulate();
    ctx.body = experiment;
    ctx.status = 200;
  }
  return ctx;
}

/**
 * create a new experiment
 */
async function createExperiment(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });
  const document = new Model(ctx.request.body);
  await document.save();
  project.experiments.push(document._id);
  await ProjectModel.findByIdAndUpdate(ctx.header.project, {
    $set: { experiments: project.experiments },
  });
  ctx.body = document;
  ctx.status = 201;
  return ctx;
}

/**
 * update a experiment specified by id
 */
async function updateExperimentById(ctx) {
  const project = ProjectModel.findOne({ _id: ctx.header.project });
  if (project.experiments.includes(ctx.params.id)) {
    await Model.findByIdAndUpdate(ctx.params.id, { $set: ctx.request.body });
    ctx.body = { message: `updated experiment with id: ${ctx.params.id}` };
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }
  return ctx;
}

/**
 * delete all experiments
 */
async function deleteExperiments(ctx) {
  await Model.deleteMany({});
  ctx.body = { message: "deleted all experiments" };
  ctx.status = 200;
  return ctx;
}

/**
 * delete a experiment specified by id
 */
async function deleteExperimentById(ctx) {
  const project = ProjectModel.findOne({ _id: ctx.header.project });
  if (project.experiments.includes(ctx.params.id)) {
    await Model.findOneAndDelete({ _id: ctx.params.id });
    ctx.body = { message: `deleted experiment with id: ${ctx.params.id}` };
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }
  return ctx;
}

module.exports = {
  getExperiments,
  getExperimentById,
  getExperimentByIdPopulated,
  createExperiment,
  updateExperimentById,
  deleteExperiments,
  deleteExperimentById,
};
