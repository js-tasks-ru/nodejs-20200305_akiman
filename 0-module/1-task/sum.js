function sum(a, b) {
  /* ваш код */
    if(parseInt(a)>=0 && parseInt(b)>=0) {
        return a + b;
    } else {
        throw new TypeError();
    }
}

module.exports = sum;
