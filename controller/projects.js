const project = require("../models/project");
const Project = require("../models/project").model;
const UserModel = require("../models/user").model;

/**
 * get all projects where the user has access to
 */
async function getProjects(ctx, next) {
  const { authId } = ctx.state;
  const body = await Project.find({
    $or: [{ admin: authId }, { users: authId }],
  });
  ctx.body = body;
  ctx.status = 200;
  return ctx;
}
/*
 * Creates a new project
 */
async function createProject(ctx) {
  const project = ctx.request.body;
  // The admin is the one creating the project
  project.admin = authId;
  const document = new Project(project);
  await document.save();

  ctx.body = document;
  ctx.status = 201;
  return ctx;
}

/*
 * Deletes a project when a user has the access rights
 */
async function deleteProjectById() {
  var authId = ctx.state.authId;
  await Project.findOneAndDelete({
    $and: [
      { _id: ctx.params.id },
      { $or: [{ admin: authId }, { users: authId }] },
    ],
  });
  ctx.body = { message: `deleted dataset with id: ${ctx.params.id}` };
  ctx.status = 200;
  return ctx;
}

async function updateProjectById(ctx) {
  await Project.findOneAndUpdate(
    {
      $and: [
        { _id: ctx.params.id },
        { $or: [{ admin: authId }, { users: authId }] },
      ],
    },
    { $set: ctx.request.body }
  );
  ctx.body = { message: `updated project with id: ${ctx.params.id}` };
  ctx.status = 200;
  return ctx;
}

async function getProjectById(ctx) {
  ctx.body = await Project.findOne({
    $and: [
      { _id: ctx.params.id },
      { $or: [{ admin: authId }, { users: authId }] },
    ],
  });
  ctx.status = 200;
}

module.exports = {
  getProjects,
  deleteProjectById,
  createProject,
  updateProjectById,
  getProjectById,
};
