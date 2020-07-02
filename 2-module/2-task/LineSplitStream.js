const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  _strWithoutEOL = '';

  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let lastIndexOf = 0;
    let currIndexOf = -1;

    /*
     * if there is match of EOL in chunk
     *   then
     *    slice from lastMath to indexOf + 1
     *   else
     *    slice part of chunk from lastMatch to the end of line
     *    and save it into variable
     */
    while(true) {
      currIndexOf = chunk.indexOf(os.EOL, lastIndexOf);

      if (currIndexOf === -1) {
        this._strWithoutEOL += chunk.slice(lastIndexOf);

        break;
      }

      this.push(this._strWithoutEOL + chunk.slice(lastIndexOf, currIndexOf));

      lastIndexOf = currIndexOf + 1;
      this._strWithoutEOL = '';
    }

    callback();
  }

  _flush(callback) {
    if (this._strWithoutEOL) {
      this.push(this._strWithoutEOL);
      this._strWithoutEOL = '';
    }
    callback();
  }
}

module.exports = LineSplitStream;
