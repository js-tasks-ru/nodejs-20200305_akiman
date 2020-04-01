const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.line = ""; // задаём строку
  }

  _transform(chunk, encoding, callback) {
    this.line += chunk.toString();
    this._sendData();
    callback();
  }

  _sendData() {
    const listElems = this.line.split(`${os.EOL}`); // разбиваем файл на строки по разделителю 'конец строки/линии'
    listElems.forEach((item, itemNo) => { // для каждой строки
      if (itemNo === listElems.length - 1) { // пока существует строка
        return this.line = item;
      }
      this.push(item);
    })
  }

  _flush(callback) {
    this.push(this.line);
    callback();
  }
}

module.exports = LineSplitStream;
