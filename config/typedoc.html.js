let baseOptions = require('./typedoc.base');

module.exports = {
  ...baseOptions,
  plugin: 'none',
  out: ['../docs']
}