// Check if the user has access to the project he requests
const Project = require("../models/project").model;


module.exports = async (ctx, next) => {
    try {
    if (["projects", "users"].includes(ctx.url.split("/")[2] )){
        console.log("Project page")
        return next();
    }
    var authId = ctx.state.authId;
    const projectId = ctx.header.project;
    if (!projectId) {
        ctx.status = 500;
        ctx.body = {
            error: '"Project" header not provided'
        }
        return ctx;
    }
    const project = await Project.findOne({_id: projectId});
    if (project === null) {
        ctx.body = {error: 'Project not found'};
        ctx.status = 400;
        return ctx;
    }
    if (!(project.users.includes(authId) || String(project.admin) === authId)) {
        // User does not have access to this project
        ctx.status = 401;
        ctx.body = {
          error: 'Unauthorized'
        };
        return ctx;
    }
    }
    catch (err) {
        ctx.status = 401;
        ctx.body = {
            error: 'Unauthorized'
        }
        return ctx;
    }
    return next();
}