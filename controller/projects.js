const Project = require("../models/project").model;
const crypto = require("crypto");

function filterProjectNonAdmin(ctx, project) {
  const { authId } = ctx.state;
  return authId === String(project.admin)
    ? project
    : { name: project.name, _id: project._id, admin: project.admin };
}

/**
 * get all projects where the user has access to
 */
async function getProjects(ctx, next) {
  const { authId } = ctx.state;
  const body = await Project.find({
    $or: [{ admin: authId }, { users: authId }],
  });
  ctx.body = body.map((elm) => filterProjectNonAdmin(ctx, elm));
  ctx.status = 200;
  return ctx;
}
/*
 * Creates a new project
 */
async function createProject(ctx) {
  try {
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
    if (e.code === 11000 && e.keyPattern.admin && e.keyPattern.name) {
      ctx.body = { error: "A project with this name already exists" };
      ctx.status = 400;
    } else {
      ctx.status = 400;
      ctx.body = { error: e.errors.name.properties.message };
    }
    return ctx;
  }
}

/*
 * Deletes a project when a user has the access rights
 */
async function deleteProjectById(ctx) {
  const { authId } = ctx.state;
  const project = await Project.findOne({
    $and: [
      { _id: ctx.params.id },
      { $or: [{ admin: authId }, { users: authId }] },
    ],
  });
  if (project === undefined) {
    ctx.body = { message: "Cannot delete this project" };
    ctx.status = 400;
    return ctx;
  }
  project.remove();
  ctx.body = { message: `deleted project with id: ${ctx.params.id}` };
  ctx.status = 200;
  return ctx;
}

async function updateProjectById(ctx) {
  try {
    const { authId } = ctx.state;
    const project = ctx.request.body;
    project.users = ctx.request.body.users.map((elm) =>
      typeof elm === "object" ? elm._id : elm
    );
    await Project.findOneAndUpdate(
      { $and: [{ _id: ctx.params.id }, { admin: authId }] },
      { $set: project },
      { runValidators: true }
    );
    ctx.body = { message: `updated project with id: ${ctx.params.id}` };
    ctx.status = 200;
  } catch (e) {
    if (e.code === 11000 && e.keyPattern.admin && e.keyPattern.name) {
      ctx.body = { error: "A project with this name already exists" };
      ctx.status = 400;
    } else {
      ctx.status = 400;
      ctx.body = { error: e.errors.name.properties.message };
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

async function setApiKey(ctx) {
  const { authId } = ctx.state;
  const project = await Project.findOne({
    $and: [{ _id: ctx.params.id }, {admin: authId }],
  });

  if (!project) {
    ctx.body = {error: "No access to this project"};
    ctx.status = 400;
    return ctx;
  }

  //Generate new id with hat
  const deviceApi = crypto.randomBytes(64).toString("base64");
  project.deviceApiKey = deviceApi;
  await project.save();
  ctx.body = { message: "Generate new key" };
  ctx.status = 200;
  return ctx;
}

async function disableApiKey(ctx) {
  const { authId } = ctx.state;
  const project = await Project.findOne({
    $and: [{ _id: ctx.params.id }, {admin: authId }],
  });

  if (!project) {
    ctx.body = {error: "No access to this project"};
    ctx.status = 400;
    return ctx;
  }

  //Generate new id with hat
  project.deviceApiKey = undefined;
  await project.save();
  ctx.body = { message: "Disabled device api" };
  ctx.status = 200;
  return ctx;
}

module.exports = {
  getProjects,
  deleteProjectById,
  createProject,
  updateProjectById,
  getProjectById,
  setApiKey,
  disableApiKey
};
