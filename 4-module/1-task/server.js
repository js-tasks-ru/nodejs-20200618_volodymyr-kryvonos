const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const server = new http.Server();

server.on('request', (req, res) => {
  const parsedUrl = url.parse(req.url);

  switch (req.method) {
    case 'GET':
      serveFile(parsedUrl.pathname, res);
      break;
    default:
      res.statusCode = 501;
      res.end('Method not implemented');
  }
});

function serveFile(pathname, res) {
  let decodedPathname;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch(error) {
    res.statusCode = 400;
    return res.end('Bad request');
  }

  const filePath = path.join(__dirname, 'files', decodedPathname);
  const isContainsNestedDirs = pathname.indexOf('/', 1) !== -1;

  if (isContainsNestedDirs) {
    res.statusCode = 400;
    return res.end('Bad request: nested directories are not allowed');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      return res.end('File not found');
    }

    sendFile(filePath, res);
  });
}

function sendFile(filePath, res) {
  const readFileStream = fs.createReadStream(filePath);
  readFileStream.pipe(res);
  
  const contentType = mime.lookup(filePath);
  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }
}

module.exports = server;
