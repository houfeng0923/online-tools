const path = require('path');
const { exec } = require("child_process");
const { createServer } = require('vite')
const _ = require('koa-route');

const myPlugin = ({
  root, // project root directory, absolute path
  app, // Koa app instance
  server, // raw http server instance
  watcher // chokidar file watcher instance
}) => {
  function reload() {
    let output = path.resolve(__dirname, '../src/assets/snapshoot.png');
    shell(`adb shell screencap -p > ${output}`, () => {
      watcher.send({
        type: 'full-reload',
        path: '/index.html'
      });
    });
  }
  watcher.on('change', (file) => {
    if (file.indexOf('.png') > 0) {
      watcher.send({
        type: 'full-reload',
        path: '/index.html'
      });
    }
  });

  app.use(_.get('/shell/reboot', (ctx) => {
    ctx.body = '';
    shell(`adb shell reboot -p`, (result) => {
      reload();
    });
  }));

  app.use(_.get('/shell/tap', (ctx) => {
    let query = ctx.request.query;
    ctx.body = '';
    shell(`adb shell input tap ${query.x} ${query.y}`, (result) => {
      reload();
    });
  }));

  app.use(_.get('/shell/keyevent', (ctx) => {
    let query = ctx.request.query;
    ctx.body = '';
    shell(`adb shell input keyevent ${query.code}`, (result) => {
      reload();
    });
  }));

  app.use(_.get('/shell/swipe', (ctx) => {
    let query = ctx.request.query;
    ctx.body = '';
    shell(`adb shell input swipe ${query.x1} ${query.y1} ${query.x2} ${query.y2}`, (result) => {
      reload();
    });
  }));

}

createServer({
  configureServer: [myPlugin]
}).listen(3000)






function shell(cmd, cb) {
  exec(cmd, (err, stdout, stderr) => {
    console.log(cmd);
    if (err) {
      console.error('err', err);
      return;
    }
    cb(stdout);

  });
}
