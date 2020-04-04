const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs'); // ���������� ������ ������ � ������ ��� ������

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1); // ���� �� ����� �� ������

  const filepath = path.join(__dirname, 'files', pathname);

  const stream = fs.createReadStream(filepath);

  switch (req.method) {
    case 'GET':
      // ���� � ���� � ����� ���� '/' (�� ���� ��������� ����������) - ������������ 400 ������
      if (~pathname.search('/')) {
        res.statusCode = 400;
        res.end('400');
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  stream.on('data', (chunk) => {
    res.write(chunk);
  });

  // ��� �������� ������ - ��������
  stream.on('end', () => {
    res.statusCode = 200;
    res.end();
  });

  // ��� ������ ������ �����
  stream.on('error', () => {
    res.statusCode = 404;
    res.end();
  });

  // ������ �� ��� ��������� ����� ������
  req.on('error', (err) => {
    res.statusCode = 500;
    res.end('500');
  })
});

module.exports = server;
