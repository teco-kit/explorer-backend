const { model } = require("mongoose");

const Model = require("../models/labelType").model;
const ProjectModel = require("../models/project").model;

/**
 * get all labelTypes
 */
async function getlabelTypes(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });
  const labelTypes = await Model.find({ _id: project.labelTypes });
  ctx.body = labelTypes;
  ctx.status = 200;
  return ctx;
}

/**
 * get labelType by id
 */
async function getLabelTypeById(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });

  const labelTypes = await Model.find({
    $and: [{ _id: ctx.params.id }, { _id: project.labelTypes }],
  });
  if (labelTypes.length === 1) {
    ctx.body = labelTypes[0];
    ctx.status = 200;
  } else {
    ctx.body = { error: "labelType not in project" };
    ctx.status = 400;
  }
  return ctx;
}

/**
 * create a new labelType
 */
async function createLabelType(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });
  const document = new Model(ctx.request.body);
  await document.save();
  project.labelTypes.push(document._id);
  await ProjectModel.findByIdAndUpdate(ctx.header.project, {
    $set: { labelTypes: project.labelTypes },
  });
  ctx.body = document;
  ctx.status = 201;
  return ctx;
}

/**
 * update a labelType specified by id
 */
async function updateLabelTypeById(ctx) {
  const project = await ProjectModel.findOne({ _id: ctx.header.project });
  if (project.labelTypes.includes(ctx.params.id)) {
    await Model.findByIdAndUpdate(ctx.params.id, { $set: ctx.request.body });
    ctx.body = { message: `updated labelType with id: ${ctx.params.id}` };
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }

  return ctx;
}

/**
 * delete all labelTypes
 */
async function deletelabelTypes(ctx) {
  await Model.deleteMany({});
  ctx.body = { message: "deleted all labelTypes" };
  ctx.status = 200;
  return ctx;
}

/**
 * delete a labelType specified by id
 */
async function deleteLabelTypeById(ctx) {
  const project = await  ProjectModel.findOne({ _id: ctx.header.project });
  if (project.labelTypes.includes(ctx.params.id)) {
    await Model.findOneAndDelete({ _id: ctx.params.id });
    const newLalbeTypes = project.labelTypes.filter(
      (item) => item !== ctx.params.id
    );
    await ProjectModel.findByIdAndUpdate(ctx.header.project, {
      $set: { labelTypes: newLalbeTypes },
    });
    ctx.body = { message: `deleted labelType with id: ${ctx.params.id}` };
    ctx.status = 200;
  } else {
    ctx.body = { error: "Forbidden" };
    ctx.status = 403;
  }
  return ctx;
}

module.exports = {
  getlabelTypes,
  getLabelTypeById,
  createLabelType,
  updateLabelTypeById,
  deletelabelTypes,
  deleteLabelTypeById,
};
