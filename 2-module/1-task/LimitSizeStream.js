const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  _limit;
  _transferredDataSize = 0;

  constructor(options) {
    if (options === undefined) {
      throw new TypeError('object with options should be specified');
    }
    if (options.limit === undefined) {
      throw new TypeError('limit size should be specified');
    }
    super(options);
    this._limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    const potentialSize = this._transferredDataSize + chunk.length;
    if (potentialSize > this._limit) {
      callback(new LimitExceededError());
      return;
    }

    this.push(chunk);
    this._transferredDataSize = potentialSize;
    callback();
  }
}

module.exports = LimitSizeStream;
