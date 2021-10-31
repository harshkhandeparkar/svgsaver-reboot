const { readdirSync } = require('fs');
const { join } = require('path');

const getListOfFiles = (dirPath) => readdirSync(dirPath).map((name) => join(dirPath, name));

module.exports = {
  excludeProtected: true,
  excludePrivate: true,
  excludeInternal: true,
  includeVersion: true,
  name: 'SVG Real Renderer',
  entryPoints: [join(__dirname, '..', 'src', 'svgsaver.ts'), join(__dirname, '..', 'src', 'index.ts')],
  tsconfig: join(__dirname, 'tsconfig.json')
}
