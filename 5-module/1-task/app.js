const path = require('path');
const Koa = require('koa');
const app = new Koa();
const router = require('./router/router');

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());
app.use(router.routes());

module.exports = app;
