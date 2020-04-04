const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs'); // подключаем модуль работы с файлом для отдачи

const server = new http.Server();

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);

    // если в пути к файлу есть '/' (то есть вложенные директории) - пробрасывать 400 статус
    if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('400');
        return;
    }
    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'DELETE':

            fs.unlink(filepath, err => {

                if (!err) {
                    res.statusCode = 200;
                    res.end('well del');
                    return;
                }
                if (err.code === 'ENOENT') {
                    res.statusCode = 404;
                    res.end('file doesn\'t exist');
                } else {
                    res.statusCode = 500;
                    res.end('internal server error');
                }
            });
            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;
