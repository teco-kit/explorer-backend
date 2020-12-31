const project = require("../models/project");

const Model = require("../models/labelDefinition").model;
const LabelModel = require("../models/labelType").model;
const ProjectModel = require("../models/project").model;

/**
 * get all labelDefinitions
 */
async function getLabelDefinitions(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });
  const labelDefinitions = await Model.find({ _id: project.labelDefinitions });
  ctx.body = labelDefinitions;
  ctx.status = 200;
  return ctx;
}

/**
 * get labelDefinition by id
 */
async function getLabelDefinitionById(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });
  const labelDefinitions = await Model.find({
    $and: [{ _id: ctx.params.id }, { _id: project.labelDefinitions }],
  });
  if (labelDefinitions.length === 1) {
    ctx.body = labelDefinitions[0];
    ctx.status = 200;
  } else {
    ctx.body = { error: "Labeldefinition not in project" };
    ctx.body = 400;
  }
  ctx.status = 200;
  return ctx;
}

/**
 * create a new labelDefinition
 */
async function createLabelDefinition(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });
  const document = new Model(ctx.request.body);
  await document.save();
  project.labelDefinitions.push(document._id);
  await ProjectModel.findByIdAndUpdate(ctx.header.project, {
    $set: { labelDefinitions: project.labelDefinitions },
  });

  ctx.body = document;
  ctx.status = 201;
  return ctx;
}

/**
 * update a labelDefinition specified by id
 */
async function updateLabelDefinitionById(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });
  if (project.labelDefinitions.includes(ctx.params.id)) {
    await Model.findByIdAndUpdate(ctx.params.id, { $set: ctx.request.body });
    ctx.body = { message: `updated labelDefinition with id: ${ctx.params.id}` };
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }
  return ctx;
}

/**
 * delete all labelDefinitions
 */
async function deleteLabelDefinitions(ctx) {
  await Model.deleteMany({});
  ctx.body = { message: "deleted all labelDefinitions" };
  ctx.status = 200;
  return ctx;
}

/**
 * delete a labelDefinition specified by id
 */
async function deleteLabelDefinitionById(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });
  if (project.labelDefinitions.includes(ctx.params.id)) {
    const labelDefinition = await Model.findOne({ _id: ctx.params.id });
    // delete labelTypes first
    labelDefinition.labels.forEach(async (label) => {
      await LabelModel.findOneAndDelete({ _id: label._id });
    });
    const newProjectLabelTypes = project.labelTypes.filter(
      (item) => !labelDefinition.labels.includes(item)
	);
    const labelDefinitions = project.labelDefinitions.filter(
      (item) => String(item) !== String(ctx.params.id)
	);
    // delete labelDefinition
    await Model.findOneAndDelete({ _id: ctx.params.id });
    await ProjectModel.findByIdAndUpdate(ctx.header.project, {
      $set: {
        labelTypes: newProjectLabelTypes,
        labelDefinitions: labelDefinitions,
      },
    });
    ctx.body = { message: `deleted labelDefinition with id: ${ctx.params.id}` };
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;

    return ctx;
  }
}

module.exports = {
  getLabelDefinitions,
  getLabelDefinitionById,
  createLabelDefinition,
  updateLabelDefinitionById,
  deleteLabelDefinitions,
  deleteLabelDefinitionById,
};
