const fs = require("fs").promises;
const path = require("path");

const Logger = require("./Logger");

// Fixed directories
const projectDir = path.resolve(__dirname, "../", "../");
const configDir = path.resolve(projectDir, "config/");

// Runtime-generated directories
const cacheDir = path.resolve(projectDir, "cache/"); // technically the "shared" cache dir
/** @type String */
let runtimeCacheDir;

/**
 *
 * @param {Boolean} useShared Flag to return the shared cache folder.
 */
async function getCacheDir(useShared = false) {
    await fs.mkdir(cacheDir).catch((err) => {
        // Silently fail when directory already exists
        if (err.code !== "EEXIST") {
            // Otherwise fail-fast
            Logger.fatal("Failed to create shared cache directory");
            Logger.fatal("This is critical and we would now hard-crash :p");
            console.error(err);
            process.exit(-1);
        }
    });

    if (useShared) return cacheDir;

    if (!runtimeCacheDir) {
        runtimeCacheDir = path.resolve(
            cacheDir,
            `${Math.round(Math.random() * 10000)}/`
        );
        fs.mkdir(runtimeCacheDir).catch((err) => {
            // EEXIST should not happen in theory
            // But who am I to assume?
            Logger.fatal("Failed to create instance cache directory");
            Logger.fatal("This is critical and we would now hard-crash :p");
            console.error(err);
            process.exit(-1);
        });
    }

    return runtimeCacheDir;
}

module.exports = { projectDir, configDir, getCacheDir };
