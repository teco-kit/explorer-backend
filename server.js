const Koa = require("koa");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("koa-cors");
const koaSwagger = require('koa2-swagger-ui').koaSwagger;
const yamljs = require("yamljs");
const path = require('path');
const fs = require('fs');
const koaIcon = require("koa-favicon");
const router = require("./routing/router.js");
const authenticate = require("./authentication/authenticate");
const authorize = require("./authorization/authorization");
const authorizeProjects = require("./authorization/authorization_project");

// create server
const server = new Koa();

// connect to Mongo
mongoose.connect(config.db, { useNewUrlParser: true });

// suppress deprecation warnings
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// setup koa middlewares
server.use(cors());

// Serve documentation
const spec = yamljs.load('./docs/docs.yaml');
server.use(koaSwagger({routePrefix: '/docs', swaggerOptions: {spec}, favicon: "/docs/favicon.ico", hideTopbar: true}));
server.use((ctx, next) => {
  console.log(ctx.path);
  console.log(ctx.method)
  if (ctx.path == "/docs/favicon.ico" && ctx.method == 'GET' && ctx.method != 'Head') {
    ctx.body = fs.readFileSync(path.join(__dirname, "/docs/favicon.ico"))
    ctx.status = 200;
    return ctx;
  }
});


// check authentication
server.use(async (ctx, next) => {
  await authenticate(ctx, next);
});

// check authorization
server.use(async (ctx, next) => {
  await authorize(ctx, next);
});

server.use(async (ctx, next) => {
  await authorizeProjects(ctx, next);
});

// catch errors
server.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.body = { error: error.message };
    ctx.status = error.status || 500;
  }
});

// routing
server.use(router.routes());

// catch all middleware, only land here
// if no other routing rules match
// make sure it is added after everything else
server.use((ctx) => {
  ctx.body = { error: "Not Found" };
  ctx.status = 404;
});

module.exports = server.listen(3000);
