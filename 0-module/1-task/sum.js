function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('expected arguments of type number');
  }

  return a + b;
}

module.exports = sum;
