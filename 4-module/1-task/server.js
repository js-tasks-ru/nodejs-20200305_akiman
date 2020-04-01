const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs'); // подключаем модуль работы с файлом для отдачи

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1); // путь до файла из ссылки

  const filepath = path.join(__dirname, 'files', pathname);

  const stream = fs.createReadStream(filepath);

  switch (req.method) {
    case 'GET':
      // если в пути к файлу есть '/' (то есть вложенные директории) - пробрасывать 400 статус
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

  // при успешном чтении - выводить
  stream.on('end', () => {
    res.statusCode = 200;
    res.end();
  });

  // при ошибке чтения файла
  stream.on('error', () => {
    res.statusCode = 404;
    res.end();
  });

  // ошибки на все остальные любые случаи
  req.on('error', (err) => {
    res.statusCode = 500;
    res.end('500');
  })
});

module.exports = server;
