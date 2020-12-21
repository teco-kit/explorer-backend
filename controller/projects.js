const project = require("../models/project");
const Project = require("../models/project").model;
const UserModel = require("../models/user").model;


/**
 * get all projects
 */
async function getProjects(ctx, next) {
  const {authId} = ctx.state;
  ctx.body = await Project.find({});
  ctx.status = 200;
}

async function createProject(ctx) {
  const project = ctx.request.body;
  // The admin is the one creating the project
  //const { authId } = ctx.state;
  //const user = await UserModel.findOne({ authId });
  project.admin = authId;
  const document = new Project(project);
  await document.save();

  ctx.body = document;
  ctx.status = 201;
  return ctx;
}

async function deleteProjectById() {
    await Project.findOneAndDelete({_id: ctx.params.id});
    ctx.body = {message: `deleted dataset with id: ${ctx.params.id}`};
	ctx.status = 200;
	return ctx;
}


async function updateProjectById(ctx) {
  await Project.findByIdAndUpdate(ctx.params.id, { $set: ctx.request.body });
  ctx.body = { message: `updated project with id: ${ctx.params.id}` };
  ctx.status = 200;
  return ctx;
}

async function getProjectById(ctx) {
  const id = ctx.params.id;
  ctx.body = await Project.findOne({_id: id });
  ctx.status = 200;
}

module.exports = {
  getProjects,
  deleteProjectById,
  createProject,
  updateProjectById,
  getProjectById,
};
