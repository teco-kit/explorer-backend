// Check if the user has access to the project he requests
const Project = require("../models/project").model;


module.exports = async (ctx, next) => {
    try {
    if (ctx.url.split("/")[2] === "projects"){
        return next();
    }
    console.log(ctx)
    var authId = ctx.state.authId;
    const projectId = ctx.header.project;
    if (!projectId) {
        ctx.status = 500;
        ctx.body = {
            error: '"Project" header not provided'
        }
        return ctx;
    }
    const project = await Project.findById({_id: projectId});
    if (!project.users.includes(authId)) {
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