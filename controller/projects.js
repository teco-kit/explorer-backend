const Project = require('../models/project').model;
const UserModel = require('../models/user').model;

function filterProjectNonAdmin(ctx, project) {
  const { authId } = ctx.state;
  return authId === String(project.admin)
    ? project
    : { name: project.name, _id: project._id };
}

/**
 * get all projects where the user has access to
 */
async function getProjects(ctx, next) {
  const { authId } = ctx.state;
  const body = await Project.find({
    $or: [{ admin: authId }, { users: authId }],
  });
  ctx.body = body.map(elm => filterProjectNonAdmin(ctx, elm));
  ctx.status = 200;
  return ctx;
}
/*
 * Creates a new project
 */
async function createProject(ctx) {
  try {
    console.log("Creating project")
    const project = ctx.request.body;
    // The admin is the one creating the project
    const { authId } = ctx.state;
    project.admin = authId;
    const document = new Project(project);
    await document.save();

    ctx.body = document;
    ctx.status = 201;
    return ctx;
  } catch (e) {
    console.log(e);
    console.log("Error")
    if (e.code === 11000 && e.keyPattern.admin && e.keyPattern.name) {
      ctx.body = { error: 'A project with this name already exists' };
      ctx.status = 400;
    }
    return ctx;
  }
}

/*
 * Deletes a project when a user has the access rights
 */
async function deleteProjectById(ctx) {
  const { authId } = ctx.state;
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
  try {
    const { authId } = ctx.state;
    const project = ctx.request.body;
    project.users = ctx.request.body.users.map(elm => (typeof elm === 'object' ? elm._id : elm));
    await Project.findOneAndUpdate(
      { $and: [{ _id: ctx.params.id }, { admin: authId }] },
      { $set: project }
    );
    ctx.body = { message: `updated project with id: ${ctx.params.id}` };
    ctx.status = 200;
  } catch (e) {
    if (e.code === 11000 && e.keyPattern.admin && e.keyPattern.name) {
      ctx.body = { error: 'A project with this name already exists' };
      ctx.status = 400;
      return ctx;
    }
  }
  return ctx;
}

async function getProjectById(ctx) {
  const { authId } = ctx.state;
  const project = await Project.findOne({
    $and: [
      { _id: ctx.params.id },
      { $or: [{ admin: authId }, { users: authId }] },
    ],
  });
  ctx.body = filterProjectNonAdmin(ctx, project);
  ctx.status = 200;
}

module.exports = {
  getProjects,
  deleteProjectById,
  createProject,
  updateProjectById,
  getProjectById,
};
