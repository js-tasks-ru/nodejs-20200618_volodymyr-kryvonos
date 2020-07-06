const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      uploadFileSafe({ pathname, filepath, req, res });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function uploadFileSafe({ pathname, filepath, req, res }) {
  if (pathname.includes('/')) {
    res.statusCode = 400;
    return res.end('Nested paths are not allowed');
  }

  fs.stat(filepath, (err, stats) => {
    if (err && err.code !== 'ENOENT') {
      res.statusCode = 500;
      return res.end();
    }
    if (stats) {
      res.statusCode = 409;
      return res.end(`File with name ${filepath} already exist`);
    }

    uploadFile(filepath, req, res);
  });
}

function uploadFile(filepath, req, res) {
  const fileWriteStream = fs.createWriteStream(filepath);
  const streamLimiter = new LimitSizeStream({ limit: 1024 * 1024 });

  req
    .on('close', cleanUpResourcesForTerminatedConnection)
    .pipe(streamLimiter)
    .on('error', handleLargeFileError)
    .pipe(fileWriteStream)
    .on('finish', handleSuccess)

  function cleanUpResourcesForTerminatedConnection() {
    if (!res.finished) {
      streamLimiter.destroy();
      fileWriteStream.destroy();
      removeNotFullyUploadedFile(filepath);
    }
  }

  function handleLargeFileError() {
    removeNotFullyUploadedFile(filepath);

    res.statusCode = 413;
    res.end('File is too large');
  }

  function handleSuccess() {
    res.statusCode = 201;
    res.end();
  }
}

function removeNotFullyUploadedFile(filepath) {
  fs.unlink(filepath, (err) => {
    if (err) throw err;
  });
}

module.exports = server;
