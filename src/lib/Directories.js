const path = require("path");

const projectDir = path.resolve(__dirname, "../", "../");
const configDir = path.resolve(projectDir, "config/");
const cacheDir = path.resolve(projectDir, "cache/");

module.exports = { projectDir, configDir, cacheDir };
