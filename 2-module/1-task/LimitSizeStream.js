const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit; // из переданного объекта параметров вытаскиваем параметр 'limit' и сохраняем в переменную класса
    this.count = 0;
  }

  getBinarySize(chunk, encoding) {
    if (encoding !== 'buffer') {
      return Buffer.byteLength(chunk, 'utf8');
    }
    return chunk.length;
  }

  _transform(chunk, encoding, callback) {
    this.count += this.getBinarySize(chunk, encoding); // накапливаем количество переданных данных в БАЙТАХ. Для этого - перекодируем в байты
    if ( this.count > this.limit) {
      return callback(new LimitExceededError());
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
