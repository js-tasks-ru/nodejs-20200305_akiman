const url = require('url');
const http = require('http');
const path = require('path');

const fs = require('fs'); // ���������� ������ ������ � ������ ��� ������
const LimitSizeStream = require('./LimitSizeStream'); // ���������� ����� `LimitSizeStream` ��� �������� �� �����

const server = new http.Server();

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);

    // ���� � ���� � ����� ���� '/' (�� ���� ��������� ����������) - ������������ 400 ������
    if (pathname.includes('/')) {
        // if (~pathname.search('/')) {
        res.statusCode = 400;
        res.end('400');
        return;
    }

    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'POST':

            if (req.headers['content-length'] && req.headers['content-length'] > 1e6) {
                req.statusCode = 413;
                res.end('file is too big');
                return;
            }

            const file = fs.createWriteStream(filepath, {flags: 'wx'}); // �������� ����� ��� ������ � ������
            const limitStream = new LimitSizeStream({limit: 1e6}); // 1 �� �����

            file.on('error', err => {
                if (err.code === 'EEXIST') {
                    res.statusCode = 409;
                    res.end('file already exists');
                    return;
                }

                console.log(err);
                res.statusCode = 500;
                res.end('internal server error');
            });

            limitStream.on('error', err => {
                if (err.code === 'LIMIT_EXCEEDED') {
                    res.statusCode = 413;
                    res.end('file is too big');

                    fs.unlink(filepath, () => {});
                    return;
                }

                console.log(err);
                res.statusCode = 500;
                res.end('internal server error');
            });

            req.pipe(limitStream).pipe(file); // ����� �� ������� ���������� � ����

            file.on('close', () => {
                res.statusCode = 201;
                res.end('saved');
            });
            // req.on('end') ������, ��� ��� ��� ��������� ��������� �����
            // file.on('finish') ���� ������ ,������ ��� ��� ������ ���� POST-������� ������� finish ����� ��������� ���� ������ ���������, � ���������� �� ����

            req.on('aborted', () => {
                fs.unlink(filepath, () => {});
            });

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }

});

module.exports = server;
