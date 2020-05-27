const {resolve} = require('path');

const projectDir = resolve(__dirname, '../', '../');
const configDir = resolve(projectDir, 'config/');
const cacheDir = resolve(projectDir, 'cache/');

const srcDir = resolve(__dirname, '../');

module.exports = {projectDir, configDir, cacheDir, srcDir};
